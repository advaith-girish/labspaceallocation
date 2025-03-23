package com.selab.labspace.controller;

import com.selab.labspace.model.Lab;
import com.selab.labspace.model.Seat;
import com.selab.labspace.model.User;
import com.selab.labspace.service.LabService;
import com.selab.labspace.service.UserService;
import com.selab.labspace.repository.SeatRepository; 

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/labs")
public class LabController {

    private final LabService labService;
    private final UserService userService;
    private final SeatRepository seatRepository;

    public LabController(LabService labService, UserService userService, SeatRepository seatRepository) {
        this.labService = labService;
        this.userService = userService;
        this.seatRepository = seatRepository; // Assign it in the constructor
    }

    // ✅ Get all labs (Super Admin access)
    @GetMapping
    public ResponseEntity<List<Lab>> getAllLabs() {
        List<Lab> labs = labService.getAllLabs();
        return ResponseEntity.ok(labs);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Lab>> getLabsByAdmin(@PathVariable Long adminId) {
        List<Lab> labs = labService.getLabsByAdmin(adminId);
        return ResponseEntity.ok(labs);
    }
    @GetMapping("/{labId}/seats")
public ResponseEntity<List<Seat>> getSeatsByLab(@PathVariable Long labId) {
    List<Seat> seats = seatRepository.findSeatsWithLabByLabId(labId);
    return ResponseEntity.ok(seats);
}


    @PutMapping("/test")
    public ResponseEntity<String> testEndpoint(@RequestBody String requestBody) {
        System.out.println("Received request body: " + requestBody);
        return ResponseEntity.ok("Request received: " + requestBody);

    }

    // ✅ Get lab by ID
    @GetMapping("/{labId}")
    public ResponseEntity<Lab> getLabById(@PathVariable Long labId) {
        Optional<Lab> lab = labService.getLabById(labId);
        return lab.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    

    // ✅ Create a new lab (Super Admin only)
    @PostMapping
    public ResponseEntity<Lab> createLab(@RequestBody Lab lab) {
        Lab newLab = labService.createLab(lab);
        return ResponseEntity.ok(newLab);
    }

    // ✅ Assign Lab Admin to a Lab
    @PutMapping("/{labId}/assignAdmin/{adminId}")
    public ResponseEntity<Lab> assignLabAdmin(@PathVariable Long labId, @PathVariable Long adminId) {
        Optional<User> userOpt = userService.getUserById(adminId);
        Optional<Lab> labOpt = labService.getLabById(labId);

        if (userOpt.isPresent() && labOpt.isPresent()) {
            Lab updatedLab = labService.assignLabAdmin(labOpt.get(), userOpt.get());
            return ResponseEntity.ok(updatedLab);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Update lab details (Super Admin & Lab Admin)
    @PutMapping(value = "/{labId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Lab> updateLab(@PathVariable Long labId, @RequestBody Lab labDetails) {
        Optional<Lab> labOpt = labService.getLabById(labId);
        if (labOpt.isPresent()) {
            Lab updatedLab = labService.updateLab(labOpt.get(), labDetails);
            return ResponseEntity.ok(updatedLab);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete a lab (Super Admin only)
    @DeleteMapping("/{labId}")
    public ResponseEntity<Void> deleteLab(@PathVariable Long labId) {
        labService.deleteLab(labId);
        return ResponseEntity.noContent().build();
    }
}
