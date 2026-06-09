package com.reservation.repository;

import com.reservation.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByAcademicianId(String academicianId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.academicianId = :academicianId")
    Double getAverageRating(@Param("academicianId") String academicianId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.academicianId = :academicianId")
    Long getReviewCount(@Param("academicianId") String academicianId);

    boolean existsByBookingId(String bookingId);
}
