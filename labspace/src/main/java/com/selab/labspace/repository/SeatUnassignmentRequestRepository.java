package com.selab.labspace.repository;

import com.selab.labspace.model.SeatUnassignmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatUnassignmentRequestRepository extends JpaRepository<SeatUnassignmentRequest, Long> {
    List<SeatUnassignmentRequest> findByStatus(String status);
    List<SeatUnassignmentRequest> findBySeatLabId(Long labId);
}
