package com.reservation.service;

import com.reservation.dto.ReservationRequestDto;
import com.reservation.dto.ReservationResponseDto;
import com.reservation.model.Reservation;
import com.reservation.model.ReservationStatus;
import com.reservation.model.Room;
import com.reservation.model.User;
import com.reservation.repository.ReservationRepository;
import com.reservation.repository.RoomRepository;
import com.reservation.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reservation.model.Notification;
import com.reservation.repository.NotificationRepository;
import com.reservation.repository.ReviewRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ReviewRepository reviewRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomRepository roomRepository,
                              UserRepository userRepository,
                              NotificationRepository notificationRepository,
                              ReviewRepository reviewRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public ReservationResponseDto createReservationRequest(ReservationRequestDto request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı!"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oda bulunamadı!"));

        // 1. Tarih Kontrolü: Geçmiş tarihe rezervasyon yapılamaz
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçmiş tarihlere rezervasyon yapılamaz!");
        }

        // 2. Saat sırası kontrolü
        LocalTime startTime = request.getStartTime();
        LocalTime endTime = request.getEndTime();
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Başlangıç saati bitiş saatinden önce olmalıdır!");
        }

        // 3. Çalışma Saatleri Kontrolü
        if (startTime.isBefore(room.getStartHour()) || endTime.isAfter(room.getEndHour())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                String.format("Rezervasyon saatleri odanın çalışma saatleri (%s - %s) dışında!", 
                    room.getStartHour(), room.getEndHour()));
        }

        // 4. Çakışma Kontrolü: Onaylanmış rezervasyonlarla çakışma var mı?
        List<Reservation> overlappingApproved = reservationRepository.findOverlappingReservations(
                room.getId(), request.getDate(), startTime, endTime, ReservationStatus.APPROVED
        );

        if (!overlappingApproved.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seçilen saatler arasında zaten onaylanmış bir rezervasyon bulunmaktadır!");
        }

        // Rezervasyonu kaydet
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setDate(request.getDate());
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setDescription(request.getDescription());
        reservation.setStatus(ReservationStatus.PENDING);

        Reservation saved = reservationRepository.save(reservation);
        
        // Trigger notification for academician (business)
        User academician = userRepository.findByUsername("business").orElse(null);
        if (academician != null) {
            Notification notification = new Notification();
            notification.setUser(academician);
            notification.setRole("business");
            notification.setTitle("Yeni İstek");
            notification.setDescription(user.getFullName() + " " + room.getName() + " için randevu talebi gönderdi.");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setUnread(true);
            notificationRepository.save(notification);
        }

        return mapToResponseDto(saved);
    }

    @Transactional
    public ReservationResponseDto approveReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rezervasyon talebi bulunamadı!"));

        if (reservation.getStatus() == ReservationStatus.APPROVED) {
            return mapToResponseDto(reservation);
        }

        // Onaylama anında tekrar çakışma kontrolü yap (başka bir talep az önce onaylanmış olabilir)
        List<Reservation> overlappingApproved = reservationRepository.findOverlappingReservations(
                reservation.getRoom().getId(), reservation.getDate(), 
                reservation.getStartTime(), reservation.getEndTime(), ReservationStatus.APPROVED
        );

        if (!overlappingApproved.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu rezervasyon onaylanamaz çünkü çakışan ve onaylanmış başka bir rezervasyon var!");
        }

        // Rezervasyonu onayla
        reservation.setStatus(ReservationStatus.APPROVED);
        reservation.setMeetingUrl("/meeting/res-" + reservation.getId());
        Reservation approved = reservationRepository.save(reservation);

        // Çakışan diğer "PENDING" (Bekleyen) talepleri otomatik olarak REDDET
        List<Reservation> overlappingPending = reservationRepository.findOverlappingReservations(
                reservation.getRoom().getId(), reservation.getDate(), 
                reservation.getStartTime(), reservation.getEndTime(), ReservationStatus.PENDING
        );

        for (Reservation pending : overlappingPending) {
            if (!pending.getId().equals(reservation.getId())) {
                pending.setStatus(ReservationStatus.REJECTED);
                pending.setDescription(pending.getDescription() != null 
                        ? pending.getDescription() + " (Çakışan başka bir rezervasyon onaylandığı için sistem tarafından otomatik reddedildi.)"
                        : "Çakışan başka bir rezervasyon onaylandığı için sistem tarafından otomatik reddedildi.");
                reservationRepository.save(pending);
            }
        }

        // Trigger notification for student (customer)
        Notification notification = new Notification();
        notification.setUser(approved.getUser());
        notification.setRole("customer");
        notification.setTitle("Randevu Onaylandı");
        notification.setDescription(approved.getRoom().getName() + " randevunuz onaylandı.");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUnread(true);
        notificationRepository.save(notification);

        return mapToResponseDto(approved);
    }

    @Transactional
    public ReservationResponseDto rejectReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rezervasyon talebi bulunamadı!"));

        reservation.setStatus(ReservationStatus.REJECTED);
        Reservation rejected = reservationRepository.save(reservation);

        // Trigger notification for student (customer)
        Notification notification = new Notification();
        notification.setUser(rejected.getUser());
        notification.setRole("customer");
        notification.setTitle("Randevu Reddedildi");
        notification.setDescription(rejected.getRoom().getName() + " randevu talebiniz reddedildi.");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUnread(true);
        notificationRepository.save(notification);

        return mapToResponseDto(rejected);
    }

    public List<ReservationResponseDto> getReservations(String username, String roleName) {
        List<Reservation> list;
        if ("ROLE_SUPER_ADMIN".equals(roleName) || "ROLE_ROOM_LEADER".equals(roleName)) {
            list = reservationRepository.findAll();
        } else {
            list = reservationRepository.findByUserUsername(username);
        }

        return list.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAnalytics() {
        List<Reservation> allReservations = reservationRepository.findAll();
        List<Room> allRooms = roomRepository.findAll();

        // Initialize monthly data maps
        String[] months = {"Oca", "Şub", "Mar", "Nis", "May", "Haz"};
        int[] monthNumbers = {1, 2, 3, 4, 5, 6};
        
        List<Map<String, Object>> monthlyData = new java.util.ArrayList<>();
        long totalBookingsInDb = allReservations.size();

        for (int i = 0; i < months.length; i++) {
            final int mNum = monthNumbers[i];
            long count = allReservations.stream()
                    .filter(r -> r.getDate().getYear() == 2026 && r.getDate().getMonthValue() == mNum)
                    .count();
            
            long bookingsCount = count;
            if (totalBookingsInDb == 0) {
                // Seed some bootstrap values so charts are not empty on first run
                bookingsCount = 10 + mNum * 5; 
            }

            double revenue = bookingsCount * 900.0;
            int occupancy = Math.min(95, (int)(bookingsCount * 5.5 + 40));

            Map<String, Object> mData = new HashMap<>();
            mData.put("month", months[i]);
            mData.put("revenue", revenue);
            mData.put("bookings", bookingsCount);
            mData.put("occupancy", occupancy);
            monthlyData.add(mData);
        }

        // Room Performance
        List<Map<String, Object>> roomPerformance = new java.util.ArrayList<>();
        for (Room room : allRooms) {
            long count = allReservations.stream()
                    .filter(r -> r.getRoom().getId().equals(room.getId()))
                    .count();
            
            long bookingsCount = count;
            if (totalBookingsInDb == 0) {
                // bootstrap values
                bookingsCount = room.getId() == 1 ? 45 : (room.getId() == 2 ? 14 : (room.getId() == 3 ? 25 : 30));
            }

            double revenueVal = bookingsCount * 950.0;
            int occupancyVal = Math.min(95, (int)(bookingsCount * 8 + 30));

            Map<String, Object> rData = new HashMap<>();
            rData.put("name", room.getName());
            rData.put("bookings", bookingsCount);
            rData.put("revenue", String.format("%,.0f TL", revenueVal));
            rData.put("occupancy", "%" + occupancyVal);
            roomPerformance.add(rData);
        }

        // Calculate totals
        double totalRevenue = monthlyData.stream().mapToDouble(m -> (double) m.get("revenue")).sum();
        int avgOccupancy = (int) monthlyData.stream().mapToInt(m -> (int) m.get("occupancy")).average().orElse(0.0);
        long computedTotalBookings = monthlyData.stream().mapToLong(m -> (long) m.get("bookings")).sum();
        double avgDailyRate = computedTotalBookings == 0 ? 0.0 : totalRevenue / computedTotalBookings;

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyData", monthlyData);
        result.put("roomPerformance", roomPerformance);
        result.put("totalRevenue", totalRevenue);
        result.put("avgOccupancy", avgOccupancy);
        result.put("totalBookings", computedTotalBookings);
        result.put("avgDailyRate", Math.round(avgDailyRate));
        return result;
    }

    private ReservationResponseDto mapToResponseDto(Reservation reservation) {
        ReservationResponseDto dto = new ReservationResponseDto();
        dto.setId(reservation.getId());
        dto.setUserId(reservation.getUser().getId());
        dto.setUsername(reservation.getUser().getUsername());
        dto.setUserFullName(reservation.getUser().getFullName());
        dto.setRoomId(reservation.getRoom().getId());
        dto.setRoomName(reservation.getRoom().getName());
        dto.setDate(reservation.getDate());
        dto.setStartTime(reservation.getStartTime());
        dto.setEndTime(reservation.getEndTime());
        dto.setStatus(reservation.getStatus());
        dto.setDescription(reservation.getDescription());
        dto.setMeetingUrl(reservation.getMeetingUrl());
        dto.setReviewed(reviewRepository.existsByBookingId("res-" + reservation.getId()));
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }
}
