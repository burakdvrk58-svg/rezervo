package com.reservation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academician_id", nullable = false)
    private String academicianId; // e.g. "acad-1"

    @Column(nullable = false)
    private Double rating; // 1.0 to 5.0

    @Column(name = "review_text", length = 2000)
    private String reviewText;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "booking_id", nullable = false)
    private String bookingId; // e.g. "res-1"

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAcademicianId() {
        return academicianId;
    }

    public void setAcademicianId(String academicianId) {
        this.academicianId = academicianId;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
