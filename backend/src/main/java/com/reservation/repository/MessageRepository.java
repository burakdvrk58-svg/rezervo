package com.reservation.repository;

import com.reservation.model.Message;
import com.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :userA AND m.receiver = :userB) OR (m.sender = :userB AND m.receiver = :userA) ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("userA") User userA, @Param("userB") User userB);

    @Query("SELECT m FROM Message m WHERE m.sender = :user OR m.receiver = :user ORDER BY m.timestamp ASC")
    List<Message> findAllBySenderOrReceiver(@Param("user") User user);
}
