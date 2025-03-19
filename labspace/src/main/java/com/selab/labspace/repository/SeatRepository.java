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
    List<Seat> findByLabId(Long labId);

    @Query("SELECT s FROM Seat s LEFT JOIN FETCH s.assignedUser WHERE s.lab.id = :labId")
    List<Seat> findSeatsWithUsersByLabId(@Param("labId") Long labId);
    @Query("SELECT s FROM Seat s JOIN FETCH s.lab WHERE s.assignedUser.id = :userId")
    Optional<Seat> findByAssignedUser_Id(@Param("userId") Long userId);


}