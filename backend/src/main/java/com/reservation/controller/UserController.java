package com.reservation.controller;

import com.reservation.model.Role;
import com.reservation.model.User;
import com.reservation.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // TÜM KULLANICILARI LİSTELEME — Sadece SUPER_ADMIN yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<java.util.List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // KULLANICI SİLME — Sadece SUPER_ADMIN yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Kullanıcı silindi");
    }

    // ROL DEĞİŞTİRME — Sadece SUPER_ADMIN yapabilir
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}/assign-role")
    public ResponseEntity<?> assignRole(@PathVariable Long id,
                                        @RequestParam Role newRole) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok("Rol güncellendi: " + newRole);
    }
}