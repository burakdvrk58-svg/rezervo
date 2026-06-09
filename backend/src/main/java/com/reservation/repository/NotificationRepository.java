package com.reservation.repository;

import com.reservation.model.Notification;
import com.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdAt DESC")
    List<Notification> findAllByUser(@Param("user") User user);

    @Modifying
    @Query("UPDATE Notification n SET n.unread = false WHERE n.id = :id")
    void markAsRead(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Notification n SET n.unread = false WHERE n.user = :user AND n.role = :role")
    void markAllAsRead(@Param("user") User user, @Param("role") String role);
}
