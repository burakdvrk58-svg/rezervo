package com.reservation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageRequestDto {
    private String senderId;
    private String receiverId;
    private String content;

    @JsonProperty("isAI")
    private boolean isAI = false;

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

    @JsonProperty("isAI")
    public boolean isAI() {
        return isAI;
    }

    @JsonProperty("isAI")
    public void setAI(boolean AI) {
        this.isAI = AI;
    }
}
