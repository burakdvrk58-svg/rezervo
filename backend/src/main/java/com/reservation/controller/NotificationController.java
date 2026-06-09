package com.reservation.controller;

import com.reservation.model.Notification;
import com.reservation.model.User;
import com.reservation.repository.NotificationRepository;
import com.reservation.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private String mapUsername(String rawUsername) {
        if (rawUsername == null) return "customer";
        if (rawUsername.equals("u-student") || rawUsername.equals("student")) {
            return "customer";
        }
        if (rawUsername.equals("u-academician") || rawUsername.equals("academician") || rawUsername.startsWith("acad-")) {
            return "business";
        }
        return rawUsername;
    }

    private String mapUsernameToFrontend(String dbUsername) {
        if ("customer".equals(dbUsername)) {
            return "u-student";
        }
        if ("business".equals(dbUsername)) {
            return "u-academician";
        }
        return dbUsername;
    }

    private String getFriendlyRelativeTime(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(dateTime, now);
        long seconds = duration.getSeconds();
        if (seconds < 10) {
            return "Şimdi";
        }
        if (seconds < 60) {
            return seconds + "sn önce";
        }
        long minutes = seconds / 60;
        if (minutes < 60) {
            return minutes + "d önce";
        }
        long hours = minutes / 60;
        if (hours < 24) {
            return hours + "saat önce";
        }
        long days = hours / 24;
        return days + " gün önce";
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(@RequestParam String userId) {
        String dbUser = mapUsername(userId);
        User user = userRepository.findByUsername(dbUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: " + userId));

        List<Notification> notifications = notificationRepository.findAllByUser(user);
        
        List<Map<String, Object>> response = notifications.stream()
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", "notif-" + n.getId());
                    map.put("userId", mapUsernameToFrontend(n.getUser().getUsername()));
                    map.put("role", n.getRole());
                    map.put("title", n.getTitle());
                    map.put("desc", n.getDescription());
                    map.put("time", getFriendlyRelativeTime(n.getCreatedAt()));
                    map.put("unread", n.isUnread());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String role = body.get("role");
        String title = body.get("title");
        String desc = body.get("desc");

        if (userId == null || role == null || title == null || desc == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Eksik bildirim parametreleri.");
        }

        String dbUser = mapUsername(userId);
        User user = userRepository.findByUsername(dbUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setRole(role);
        notification.setTitle(title);
        notification.setDescription(desc);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUnread(true);

        Notification saved = notificationRepository.save(notification);

        Map<String, Object> map = new HashMap<>();
        map.put("id", "notif-" + saved.getId());
        map.put("userId", mapUsernameToFrontend(saved.getUser().getUsername()));
        map.put("role", saved.getRole());
        map.put("title", saved.getTitle());
        map.put("desc", saved.getDescription());
        map.put("time", "Şimdi");
        map.put("unread", saved.isUnread());

        return ResponseEntity.ok(map);
    }

    @Transactional
    @PatchMapping
    public ResponseEntity<Map<String, Object>> updateNotifications(@RequestBody Map<String, Object> body) {
        String idStr = (String) body.get("id");
        String userIdStr = (String) body.get("userId");
        String role = (String) body.get("role");

        if (idStr != null) {
            String rawId = idStr.replace("notif-", "");
            Long id = Long.parseLong(rawId);
            notificationRepository.markAsRead(id);
        } else if (userIdStr != null && role != null) {
            String dbUser = mapUsername(userIdStr);
            User user = userRepository.findByUsername(dbUser)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: " + userIdStr));
            notificationRepository.markAllAsRead(user, role);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kimlik veya kullanıcı/rol bilgisi gereklidir.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
