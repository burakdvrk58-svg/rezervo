package com.reservation.controller;

import com.reservation.model.Review;
import com.reservation.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@RequestParam(required = false) String academicianId) {
        if (academicianId != null) {
            return ResponseEntity.ok(reviewRepository.findByAcademicianId(academicianId));
        }
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Map<String, Object> body) {
        String academicianId = (String) body.get("academicianId");
        Object ratingObj = body.get("rating");
        String reviewText = (String) body.get("reviewText");
        String studentName = (String) body.get("studentName");
        String bookingId = (String) body.get("bookingId");

        if (academicianId == null || ratingObj == null || studentName == null || bookingId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gerekli bilgiler eksik.");
        }

        Double rating = Double.valueOf(ratingObj.toString());

        Review review = new Review();
        review.setAcademicianId(academicianId);
        review.setRating(rating);
        review.setReviewText(reviewText != null ? reviewText : "");
        review.setStudentName(studentName);
        review.setBookingId(bookingId);
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Map<String, Boolean>> isReviewed(@PathVariable String bookingId) {
        boolean reviewed = reviewRepository.existsByBookingId(bookingId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("reviewed", reviewed);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam String academicianId) {
        Double avgRating = reviewRepository.getAverageRating(academicianId);
        Long count = reviewRepository.getReviewCount(academicianId);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        response.put("reviewsCount", count != null ? count : 0L);
        return ResponseEntity.ok(response);
    }
}
