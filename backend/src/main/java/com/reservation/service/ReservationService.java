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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomRepository roomRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
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

        return mapToResponseDto(approved);
    }

    @Transactional
    public ReservationResponseDto rejectReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rezervasyon talebi bulunamadı!"));

        reservation.setStatus(ReservationStatus.REJECTED);
        Reservation rejected = reservationRepository.save(reservation);
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
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }
}
