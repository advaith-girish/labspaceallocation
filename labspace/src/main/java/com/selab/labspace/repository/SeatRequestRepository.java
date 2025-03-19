package com.selab.labspace.repository;

import com.selab.labspace.model.SeatRequest;
import com.selab.labspace.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRequestRepository extends JpaRepository<SeatRequest, Long> {
    List<SeatRequest> findByStatus(String status);
    List<SeatRequest> findByLab(Lab lab);
}
