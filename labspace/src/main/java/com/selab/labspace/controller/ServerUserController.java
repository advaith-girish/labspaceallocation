package com.selab.labspace.controller;

import com.selab.labspace.model.ServerUser;
import com.selab.labspace.service.ServerUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/server-users")
public class ServerUserController {
    private final ServerUserService serverUserService;

    public ServerUserController(ServerUserService serverUserService) {
        this.serverUserService = serverUserService;
    }

    @GetMapping("/lab/{labId}")
    public ResponseEntity<List<ServerUser>> getServerUsersByLab(@PathVariable int labId) {
        return ResponseEntity.ok(serverUserService.getUsersByLabId(labId));
    }
}
