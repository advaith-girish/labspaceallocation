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
    public ResponseEntity<SeatUnassignmentRequest> requestUnassignSeat(@RequestParam Long userId,
            @RequestParam Long seatId) {
        Optional<User> student = userService.getUserById(userId);
        Optional<Seat> seat = seatService.getSeatById(seatId);

        if (student.isPresent() && seat.isPresent()) {
            SeatUnassignmentRequest request = new SeatUnassignmentRequest(student.get(), seat.get());
            return ResponseEntity.ok(requestService.createRequest(request));
        }
        return ResponseEntity.notFound().build();
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
