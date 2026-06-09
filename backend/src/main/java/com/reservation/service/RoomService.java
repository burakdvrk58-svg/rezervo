package com.reservation.service;

import com.reservation.dto.RoomRequest;
import com.reservation.model.Reservation;
import com.reservation.model.Room;
import com.reservation.repository.ReservationRepository;
import com.reservation.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public RoomService(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public Room createRoom(RoomRequest request) {
        if (roomRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu isimde bir oda zaten mevcut!");
        }

        Room room = new Room();
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setCapacity(request.getCapacity());

        // Varsayılan çalışma saatleri: 08:00 - 18:00
        LocalTime start = request.getStartHour() != null ? request.getStartHour() : LocalTime.of(8, 0);
        LocalTime end = request.getEndHour() != null ? request.getEndHour() : LocalTime.of(18, 0);

        if (start.isAfter(end) || start.equals(end)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Başlangıç saati bitiş saatinden önce olmalıdır!");
        }

        room.setStartHour(start);
        room.setEndHour(end);

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oda bulunamadı!"));

        // Odaya ait tüm rezervasyonları temizle (Foreign Key hatasını önlemek için)
        List<Reservation> reservations = reservationRepository.findByRoomId(id);
        reservationRepository.deleteAll(reservations);

        roomRepository.delete(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oda bulunamadı!"));
    }
}
