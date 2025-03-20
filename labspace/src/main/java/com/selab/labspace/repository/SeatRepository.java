package com.selab.labspace.repository;

import com.selab.labspace.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // ✅ Get all seats for a specific lab
    List<Seat> findByLabId(Long labId);

    // ✅ Get seats in a lab along with assigned users (if any)
    @Query("SELECT s FROM Seat s LEFT JOIN FETCH s.assignedUser WHERE s.lab.id = :labId")
    List<Seat> findSeatsWithUsersByLabId(@Param("labId") Long labId);

    // ✅ Get seat assigned to a specific user (Handles case where user may not have
    // a seat)
    @Query("SELECT s FROM Seat s LEFT JOIN FETCH s.lab WHERE s.assignedUser.id = :userId")
    Optional<Seat> findByAssignedUser_Id(@Param("userId") Long userId);

    // ✅ Get all seats along with labs and assigned users (Handles NULL users)
    @Query("SELECT s FROM Seat s LEFT JOIN FETCH s.lab LEFT JOIN FETCH s.assignedUser")
    List<Seat> findAllWithLabs();
}
