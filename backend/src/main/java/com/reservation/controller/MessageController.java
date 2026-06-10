package com.reservation.controller;

import com.reservation.config.ChatWebSocketHandler;
import com.reservation.dto.ContactResponseDto;
import com.reservation.dto.MessageRequestDto;
import com.reservation.dto.MessageResponseDto;
import com.reservation.model.Message;
import com.reservation.model.User;
import com.reservation.repository.MessageRepository;
import com.reservation.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Turkish locale date time formatter: e.g. "09 Haziran Salı, 22:15"
    private final DateTimeFormatter trDateTimeFormatter = 
            DateTimeFormatter.ofPattern("d MMMM EEEE, HH:mm", new Locale("tr", "TR"));

    public MessageController(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
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

    @GetMapping
    public ResponseEntity<?> getMessages(
            @RequestParam String userId,
            @RequestParam(required = false) String chatWith) {
        
        String dbUser = mapUsername(userId);
        User user = userRepository.findByUsername(dbUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: " + userId));

        if (chatWith != null) {
            String dbChatWith = mapUsername(chatWith);
            User otherUser = userRepository.findByUsername(dbChatWith)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sohbet edilecek kullanıcı bulunamadı: " + chatWith));

            List<Message> conversation = messageRepository.findConversation(user, otherUser);
            List<MessageResponseDto> response = conversation.stream()
                    .map(this::mapToMessageResponseDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        }

        // Return all messages of this user, and their contact list
        List<Message> allMessages = messageRepository.findAllBySenderOrReceiver(user);
        List<MessageResponseDto> mappedMessages = allMessages.stream()
                .map(this::mapToMessageResponseDto)
                .collect(Collectors.toList());

        // Compile contacts
        Set<String> contactUsernames = new LinkedHashSet<>();
        
        // 1. Gather contacts from message history
        for (Message m : allMessages) {
            if (!m.getSender().getUsername().equals(user.getUsername())) {
                contactUsernames.add(m.getSender().getUsername());
            }
            if (!m.getReceiver().getUsername().equals(user.getUsername())) {
                contactUsernames.add(m.getReceiver().getUsername());
            }
        }

        // 2. Add defaults to ensure student/academician can always start a chat
        if (user.getRole().name().equals("ROLE_USER")) {
            contactUsernames.add("business");
        } else if (user.getRole().name().equals("ROLE_ROOM_LEADER")) {
            contactUsernames.add("customer");
        }

        List<ContactResponseDto> contacts = contactUsernames.stream()
                .map(uname -> userRepository.findByUsername(uname).orElse(null))
                .filter(Objects::nonNull)
                .map(u -> {
                    // Find last message in history
                    Message lastMsg = null;
                    for (int i = allMessages.size() - 1; i >= 0; i--) {
                        Message m = allMessages.get(i);
                        if (m.getSender().getUsername().equals(u.getUsername()) || 
                            m.getReceiver().getUsername().equals(u.getUsername())) {
                            lastMsg = m;
                            break;
                        }
                    }

                    ContactResponseDto dto = new ContactResponseDto();
                    dto.setId(mapUsernameToFrontend(u.getUsername()));
                    dto.setName(u.getFullName() != null ? u.getFullName() : u.getUsername());
                    dto.setEmail(u.getEmail());
                    dto.setRole(u.getRole().name().equals("ROLE_ROOM_LEADER") ? "business" : "customer");
                    dto.setAvatar(u.getRole().name().equals("ROLE_ROOM_LEADER") 
                            ? "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces"
                            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces");
                    dto.setLastMessage(lastMsg != null ? lastMsg.getContent() : "Henüz mesajlaşma yok.");
                    dto.setLastMessageTime(lastMsg != null ? lastMsg.getTimestamp().format(trDateTimeFormatter) : "");
                    return dto;
                })
                .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("messages", mappedMessages);
        body.put("contacts", contacts);

        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<MessageResponseDto> sendMessage(@RequestBody MessageRequestDto request) {
        String senderUname = mapUsername(request.getSenderId());
        String receiverUname = mapUsername(request.getReceiverId());

        User sender = userRepository.findByUsername(senderUname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gönderici bulunamadı: " + request.getSenderId()));
        User receiver = userRepository.findByUsername(receiverUname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alıcı bulunamadı: " + request.getReceiverId()));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setAi(request.isAI());

        Message saved = messageRepository.save(message);
        MessageResponseDto responseDto = mapToMessageResponseDto(saved);

        // Send via WebSocket to receiver
        try {
            String jsonPayload = objectMapper.writeValueAsString(responseDto);
            ChatWebSocketHandler.sendToUser(receiver.getUsername(), "{\"type\":\"CHAT\",\"data\":" + jsonPayload + "}");
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket message: " + e.getMessage());
        }

        return ResponseEntity.ok(responseDto);
    }

    private MessageResponseDto mapToMessageResponseDto(Message m) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId("msg-" + m.getId());
        dto.setSenderId(mapUsernameToFrontend(m.getSender().getUsername()));
        dto.setReceiverId(mapUsernameToFrontend(m.getReceiver().getUsername()));
        dto.setContent(m.getContent());
        dto.setTimestamp(m.getTimestamp().format(trDateTimeFormatter));
        dto.setAI(m.isAi());
        return dto;
    }
}
