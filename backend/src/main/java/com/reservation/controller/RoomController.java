package com.reservation.controller;

import com.reservation.dto.RoomRequest;
import com.reservation.model.Room;
import com.reservation.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // ODA EKLEME - Sadece SUPER_ADMIN veya ROOM_LEADER yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROOM_LEADER')")
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody RoomRequest request) {
        Room room = roomService.createRoom(request);
        return ResponseEntity.ok(room);
    }

    // ODA SİLME - Sadece SUPER_ADMIN veya ROOM_LEADER yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROOM_LEADER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Oda ve odaya ait tüm rezervasyonlar başarıyla silindi.");
    }

    // ODALARI LİSTELEME - Tüm giriş yapmış kullanıcılar görebilir
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // ODA DETAYI GETİRME - Tüm giriş yapmış kullanıcılar görebilir
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }
}
