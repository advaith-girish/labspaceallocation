package com.selab.labspace.controller;

import com.selab.labspace.repository.SeatRepository;
import com.selab.labspace.model.Seat;
import com.selab.labspace.model.User;
import com.selab.labspace.service.SeatService;
import com.selab.labspace.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;
    private final UserService userService;
    private final SeatRepository seatRepository;

    public SeatController(SeatService seatService, UserService userService,SeatRepository seatRepository) {
        this.seatService = seatService;
        this.userService = userService;
        this.seatRepository = seatRepository;
    }

    @PostMapping
    public ResponseEntity<List<Seat>> createSeats(@RequestBody List<Seat> seats) {
        List<Seat> createdSeats = seatService.createSeats(seats);
        return ResponseEntity.ok(createdSeats);
    }

    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/with-labs")
    public ResponseEntity<List<Seat>> getAllSeatsWithLabs() {
        List<Seat> seats = seatService.getAllSeatsWithLabs();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/lab/{labId}")
public ResponseEntity<List<Seat>> getSeatsByLab(@PathVariable Long labId) {
    List<Seat> seats = seatRepository.findSeatsWithLabByLabId(labId);
    return ResponseEntity.ok(seats);
}


    @GetMapping("/{seatId}")
    public ResponseEntity<Seat> getSeatById(@PathVariable Long seatId) {
        Optional<Seat> seat = seatService.getSeatById(seatId);
        return seat.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{seatId}/assign/{userId}")
    public ResponseEntity<Seat> assignSeat(@PathVariable Long seatId, @PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        Optional<Seat> seatOpt = seatService.getSeatById(seatId);

        if (userOpt.isPresent() && seatOpt.isPresent()) {
            Seat updatedSeat = seatService.assignSeatToUser(seatOpt.get(), userOpt.get());
            return ResponseEntity.ok(updatedSeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{seatId}/unassign")
    public ResponseEntity<Seat> unassignSeat(@PathVariable Long seatId) {
        Optional<Seat> seatOpt = seatService.getSeatById(seatId);

        if (seatOpt.isPresent()) {
            Seat updatedSeat = seatService.unassignSeat(seatOpt.get());
            return ResponseEntity.ok(updatedSeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Seat> getSeatByUserId(@PathVariable Long userId) {
        Optional<Seat> seat = seatService.getSeatByUserId(userId);
        
        if (seat.isPresent()) {
            return ResponseEntity.ok(seat.get()); // Returns seat with lab
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
