package com.reservation.service;

import com.reservation.dto.ReservationRequestDto;
import com.reservation.dto.ReservationResponseDto;
import com.reservation.model.Reservation;
import com.reservation.model.ReservationStatus;
import com.reservation.model.Room;
import com.reservation.model.User;
import com.reservation.repository.ReservationRepository;
import com.reservation.repository.RoomRepository;
import com.reservation.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private Room room;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        room = new Room();
        room.setId(1L);
        room.setName("Meeting Room A");
        room.setStartHour(LocalTime.of(9, 0));
        room.setEndHour(LocalTime.of(18, 0));
    }

    @Test
    void testCreateReservation_Success() {
        ReservationRequestDto request = new ReservationRequestDto();
        request.setRoomId(1L);
        request.setDate(LocalDate.now().plusDays(1));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(11, 0));
        request.setDescription("Test Meeting");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(reservationRepository.findOverlappingReservations(
                eq(1L), eq(request.getDate()), any(LocalTime.class), any(LocalTime.class), eq(ReservationStatus.APPROVED)
        )).thenReturn(new ArrayList<>());

        Reservation savedReservation = new Reservation();
        savedReservation.setId(100L);
        savedReservation.setUser(user);
        savedReservation.setRoom(room);
        savedReservation.setDate(request.getDate());
        savedReservation.setStartTime(request.getStartTime());
        savedReservation.setEndTime(request.getEndTime());
        savedReservation.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

        ReservationResponseDto response = reservationService.createReservationRequest(request, "testuser");

        assertNotNull(response);
        assertEquals(ReservationStatus.PENDING, response.getStatus());
        assertEquals("Meeting Room A", response.getRoomName());
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    void testCreateReservation_PastDate_ThrowsException() {
        ReservationRequestDto request = new ReservationRequestDto();
        request.setRoomId(1L);
        request.setDate(LocalDate.now().minusDays(1));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(11, 0));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        assertThrows(ResponseStatusException.class, () -> 
            reservationService.createReservationRequest(request, "testuser")
        );
    }

    @Test
    void testCreateReservation_OutsideWorkingHours_ThrowsException() {
        ReservationRequestDto request = new ReservationRequestDto();
        request.setRoomId(1L);
        request.setDate(LocalDate.now().plusDays(1));
        request.setStartTime(LocalTime.of(8, 0)); // Room starts at 09:00
        request.setEndTime(LocalTime.of(10, 0));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        assertThrows(ResponseStatusException.class, () -> 
            reservationService.createReservationRequest(request, "testuser")
        );
    }

    @Test
    void testCreateReservation_OverlapApproved_ThrowsException() {
        ReservationRequestDto request = new ReservationRequestDto();
        request.setRoomId(1L);
        request.setDate(LocalDate.now().plusDays(1));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(11, 0));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        List<Reservation> overlapping = List.of(new Reservation());
        when(reservationRepository.findOverlappingReservations(
                eq(1L), eq(request.getDate()), any(LocalTime.class), any(LocalTime.class), eq(ReservationStatus.APPROVED)
        )).thenReturn(overlapping);

        assertThrows(ResponseStatusException.class, () -> 
            reservationService.createReservationRequest(request, "testuser")
        );
    }

    @Test
    void testApproveReservation_Success_And_AutoRejectPending() {
        Reservation reservationToApprove = new Reservation();
        reservationToApprove.setId(100L);
        reservationToApprove.setUser(user);
        reservationToApprove.setRoom(room);
        reservationToApprove.setDate(LocalDate.now().plusDays(1));
        reservationToApprove.setStartTime(LocalTime.of(10, 0));
        reservationToApprove.setEndTime(LocalTime.of(11, 0));
        reservationToApprove.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findById(100L)).thenReturn(Optional.of(reservationToApprove));
        when(reservationRepository.findOverlappingReservations(
                eq(1L), eq(reservationToApprove.getDate()), eq(reservationToApprove.getStartTime()), eq(reservationToApprove.getEndTime()), eq(ReservationStatus.APPROVED)
        )).thenReturn(new ArrayList<>());

        Reservation pendingOverlap = new Reservation();
        pendingOverlap.setId(101L);
        pendingOverlap.setUser(user);
        pendingOverlap.setRoom(room);
        pendingOverlap.setDate(reservationToApprove.getDate());
        pendingOverlap.setStartTime(LocalTime.of(10, 30)); // Overlaps
        pendingOverlap.setEndTime(LocalTime.of(11, 30));
        pendingOverlap.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findOverlappingReservations(
                eq(1L), eq(reservationToApprove.getDate()), eq(reservationToApprove.getStartTime()), eq(reservationToApprove.getEndTime()), eq(ReservationStatus.PENDING)
        )).thenReturn(List.of(reservationToApprove, pendingOverlap));

        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReservationResponseDto response = reservationService.approveReservation(100L);

        assertNotNull(response);
        assertEquals(ReservationStatus.APPROVED, response.getStatus());
        assertEquals(ReservationStatus.REJECTED, pendingOverlap.getStatus());
        assertTrue(pendingOverlap.getDescription().contains("otomatik reddedildi"));

        verify(reservationRepository, times(2)).save(any(Reservation.class)); // 1 for approved, 1 for rejected pending
    }
}
