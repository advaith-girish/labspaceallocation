package com.selab.labspace.controller;

import com.selab.labspace.model.Lab;
import com.selab.labspace.model.ServerUser;
import com.selab.labspace.service.LabService;
import com.selab.labspace.service.ServerUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api/server-users")
public class ServerUserController {
    private final ServerUserService serverUserService;
    private final LabService labService;

    public ServerUserController(ServerUserService serverUserService, LabService labService) {
        this.serverUserService = serverUserService;
        this.labService = labService;
    }

    @GetMapping("/lab/{labId}")
    public ResponseEntity<List<ServerUser>> getServerUsersByLab(@PathVariable int labId) {
        return ResponseEntity.ok(serverUserService.getUsersByLabId(labId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addServerUser(@RequestBody ServerUser newUser) {
        if (newUser.getLab() == null || newUser.getLab().getId() == null) {
            return ResponseEntity.badRequest().body("Error: Lab ID is required.");
        }

        Optional<Lab> labOpt = labService.getLabById(newUser.getLab().getId());
        if (labOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Lab ID does not exist.");
        }

        newUser.setLab(labOpt.get());
        ServerUser savedUser = serverUserService.addServerUser(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteServerUserById(@PathVariable Long id) {
        boolean deleted = serverUserService.deleteServerUserById(id);
        if (deleted) {
            return ResponseEntity.ok("Server user with ID " + id + " deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Error: Server user with ID " + id + " not found.");
        }
    }

    //Delete a Server User by IP Address
    @DeleteMapping("/delete-by-ip/{ipAddress}")
    public ResponseEntity<String> deleteServerUserByIp(@PathVariable String ipAddress) {
        boolean deleted = serverUserService.deleteServerUserByIp(ipAddress);
        if (deleted) {
            return ResponseEntity.ok("Server user with IP " + ipAddress + " deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Error: Server user with IP " + ipAddress + " not found.");
        }
    }

    @PostMapping("/add-bulk")
    public ResponseEntity<String> addBulkServerUsers(@RequestBody List<ServerUser> serverUsers) {
        if (serverUsers.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No server users provided.");
        }

        for (ServerUser user : serverUsers) {
            if (user.getLab() == null || user.getLab().getId() == null) {
                return ResponseEntity.badRequest().body("Error: Each server user must have a valid lab ID.");
            }
        }

        serverUserService.addBulkServerUsers(serverUsers);
        return ResponseEntity.ok("All server users added successfully.");
    }

}
