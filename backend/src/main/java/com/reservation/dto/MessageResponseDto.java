package com.reservation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageResponseDto {
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String timestamp;

    @JsonProperty("isAI")
    private boolean isAI;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @JsonProperty("isAI")
    public boolean isAI() {
        return isAI;
    }

    @JsonProperty("isAI")
    public void setAI(boolean AI) {
        isAI = AI;
    }
}
