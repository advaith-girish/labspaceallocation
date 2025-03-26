package com.selab.labspace.controller;

import com.selab.labspace.model.SeatUnassignmentRequest;
import com.selab.labspace.model.Seat;
import com.selab.labspace.model.User;
import com.selab.labspace.service.SeatService;
import com.selab.labspace.service.SeatUnassignmentRequestService;
import com.selab.labspace.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seat-unassign-requests")
public class SeatUnassignmentRequestController {
    private final SeatUnassignmentRequestService requestService;
    private final SeatService seatService;
    private final UserService userService;

    public SeatUnassignmentRequestController(SeatUnassignmentRequestService requestService, SeatService seatService,
            UserService userService) {
        this.requestService = requestService;
        this.seatService = seatService;
        this.userService = userService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestUnassignSeat(@RequestBody SeatUnassignmentRequest request) {
        if (request.getUser() == null || request.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User ID is missing in the request.");
        }
        if (request.getSeat() == null || request.getSeat().getId() == null) {
            return ResponseEntity.badRequest().body("Seat ID is missing in the request.");
        }

        Optional<User> student = userService.getUserById(request.getUser().getId());
        Optional<Seat> seat = seatService.getSeatById(request.getSeat().getId());

        if (student.isPresent() && seat.isPresent()) {
            request.setUser(student.get()); 
            request.setSeat(seat.get()); 
            request.setStatus("Pending");

            SeatUnassignmentRequest savedRequest = requestService.createRequest(request);
            return ResponseEntity.ok(savedRequest);
        }
        return ResponseEntity.badRequest().body("Invalid User or Seat ID.");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SeatUnassignmentRequest>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    @GetMapping("/lab/{labId}")
    public ResponseEntity<List<SeatUnassignmentRequest>> getRequestsByLab(@PathVariable Long labId) {
        return ResponseEntity.ok(requestService.getRequestsByLab(labId));
    }

    @PutMapping("/update/{requestId}/{status}")
    public ResponseEntity<SeatUnassignmentRequest> updateRequestStatus(@PathVariable Long requestId,
            @PathVariable String status) {
        Optional<SeatUnassignmentRequest> updatedRequest = requestService.updateRequestStatus(requestId, status);
        return updatedRequest.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
