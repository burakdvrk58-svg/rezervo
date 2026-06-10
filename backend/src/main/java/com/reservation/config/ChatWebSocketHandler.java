package com.reservation.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Keep track of active connections mapped to usernames
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private String getUsernameFromSession(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null || uri.getQuery() == null) {
            return null;
        }
        
        String query = uri.getQuery();
        String[] params = query.split("&");
        for (String param : params) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && "username".equals(keyValue[0])) {
                return keyValue[1];
            }
        }
        return null;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            sessions.put(username, session);
            System.out.println("🔌 WebSocket Bağlantısı Kuruldu: " + username);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            sessions.remove(username);
            System.out.println("❌ WebSocket Bağlantısı Kapandı: " + username);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Active handling of incoming WS messages from the client if needed (e.g. heartbeat)
        String payload = message.getPayload();
        if ("PING".equalsIgnoreCase(payload)) {
            session.sendMessage(new TextMessage("PONG"));
        }
    }

    /**
     * Pushes a real-time message or notification payload to a specific active user.
     */
    public static boolean sendToUser(String username, String payload) {
        WebSocketSession session = sessions.get(username);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(payload));
                return true;
            } catch (IOException e) {
                System.err.println("WebSocket push failed for " + username + ": " + e.getMessage());
            }
        }
        return false;
    }

    /**
     * Checks if a user is currently online/connected via WebSocket.
     */
    public static boolean isUserOnline(String username) {
        WebSocketSession session = sessions.get(username);
        return session != null && session.isOpen();
    }
}
