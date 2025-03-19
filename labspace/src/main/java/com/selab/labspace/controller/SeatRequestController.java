package com.selab.labspace.controller;

import com.selab.labspace.model.SeatRequest;
import com.selab.labspace.model.Lab;
import com.selab.labspace.repository.SeatRequestRepository;
import com.selab.labspace.repository.LabRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seat-requests")
public class SeatRequestController {
    private final SeatRequestRepository seatRequestRepository;
    private final LabRepository labRepository;

    public SeatRequestController(SeatRequestRepository seatRequestRepository, LabRepository labRepository) {
        this.seatRequestRepository = seatRequestRepository;
        this.labRepository = labRepository;
    }

    @PostMapping("/request")
    public String requestSeat(@RequestParam String studentName, @RequestParam String studentEmail, @RequestParam Long labId) {
        Optional<Lab> labOpt = labRepository.findById(labId);

        if (labOpt.isPresent()) {
            SeatRequest request = new SeatRequest(studentName, studentEmail, labOpt.get());
            seatRequestRepository.save(request);
            return "Seat request submitted successfully.";
        }
        return "Error: Lab not found.";
    }

    @GetMapping("/pending")
    public List<SeatRequest> getPendingRequests() {
        return seatRequestRepository.findByStatus("Pending");
    }

    @GetMapping("/pending/{labId}")
    public List<SeatRequest> getLabPendingRequests(@PathVariable Long labId) {
        Optional<Lab> labOpt = labRepository.findById(labId);
        return labOpt.map(seatRequestRepository::findByLab).orElse(null);
    }

    @PutMapping("/update/{requestId}/{status}")
    public String updateRequest(@PathVariable Long requestId, @PathVariable String status) {
        Optional<SeatRequest> requestOpt = seatRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            SeatRequest request = requestOpt.get();
            request.setStatus(status);
            seatRequestRepository.save(request);
            return "Seat request " + status.toLowerCase() + " successfully.";
        }
        return "Error: Request not found.";
    }
}
