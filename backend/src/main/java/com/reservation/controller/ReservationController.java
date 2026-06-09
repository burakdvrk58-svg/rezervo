package com.reservation.controller;

import com.reservation.dto.ReservationRequestDto;
import com.reservation.dto.ReservationResponseDto;
import com.reservation.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // REZERVASYON TALEBİ - Tüm giriş yapmış kullanıcılar talep oluşturabilir
    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(
            @RequestBody ReservationRequestDto request,
            Principal principal) {
        String username = principal.getName();
        ReservationResponseDto response = reservationService.createReservationRequest(request, username);
        return ResponseEntity.ok(response);
    }

    // REZERVASYONLARI LİSTELEME - Adminler tümünü, normal kullanıcılar sadece kendi rezervasyonlarını görür
    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getReservations(Authentication authentication) {
        String username = authentication.getName();
        String roleName = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");
        
        List<ReservationResponseDto> response = reservationService.getReservations(username, roleName);
        return ResponseEntity.ok(response);
    }

    // ONAYLAMA - Sadece SUPER_ADMIN veya ROOM_LEADER yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROOM_LEADER')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ReservationResponseDto> approveReservation(@PathVariable Long id) {
        ReservationResponseDto response = reservationService.approveReservation(id);
        return ResponseEntity.ok(response);
    }

    // REDDETME - Sadece SUPER_ADMIN veya ROOM_LEADER yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROOM_LEADER')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ReservationResponseDto> rejectReservation(@PathVariable Long id) {
        ReservationResponseDto response = reservationService.rejectReservation(id);
        return ResponseEntity.ok(response);
    }

    // ANALİTİK RAPORU — Sadece SUPER_ADMIN veya ROOM_LEADER yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROOM_LEADER')")
    @GetMapping("/analytics")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(reservationService.getAnalytics());
    }
}
