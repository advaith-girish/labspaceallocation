package com.selab.labspace.controller;

import com.jcraft.jsch.*;
import com.selab.labspace.model.ServerUser;
import com.selab.labspace.model.User;
import com.selab.labspace.service.ServerUserService;
import com.selab.labspace.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/server")
public class ServerMonitoringController {

    private final ServerUserService serverUserService;
    private final UserService userService;
    private static final double CPU_THRESHOLD = 80.0;

    public ServerMonitoringController(ServerUserService serverUserService, UserService userService) {
        this.serverUserService = serverUserService;
        this.userService = userService;
    }

    @GetMapping("/stats")
public Map<String, Map<String, String>> getServerStatsForUser(@RequestParam(required = false) Long userId) {
    Map<String, Map<String, String>> allStats = new HashMap<>();

    if (userId == null) {
        return allStats;
    }

    Optional<User> userOpt = userService.getUserById(userId);
    if (userOpt.isEmpty()) {
        return allStats;
    }

    User user = userOpt.get();
    List<ServerUser> serverUsers;

    if (user.getRole().name().equals("ADMIN")) {
        serverUsers = serverUserService.getAllServerUsers();
    } else if (user.getRole().name().equals("LAB_ADMIN")) {
        serverUsers = serverUserService.getUsersByLabAdmin(user.getId());
    } else {
        return allStats;
    }

    for (ServerUser serverUser : serverUsers) {
        Map<String, String> stats = getServerStats(serverUser);
        stats.put("ip", serverUser.getIpAddress());
        stats.put("username", serverUser.getUsername());
        stats.put("lab", serverUser.getLab().getName());

        // ✅ Add CPU threshold warning
        try {
            double cpuUsage = Double.parseDouble(stats.get("cpu"));
            if (cpuUsage > CPU_THRESHOLD) {
                stats.put("warning", "⚠️ High CPU usage detected! (" + cpuUsage + "%)");
            }
        } catch (NumberFormatException e) {
            stats.put("cpu", "N/A"); // Fallback if parsing fails
        }

        allStats.put(serverUser.getIpAddress(), stats);
    }

    return allStats;
}



    private Map<String, String> getServerStats(ServerUser user) {
        Map<String, String> stats = new HashMap<>();
        try {
            stats.put("cpu", executeCommand(user, "sar -u 3 2 | awk '/Average:/ {print 100 - $(NF)}'"));
            stats.put("memory", executeCommand(user, "free -m | awk '/Mem:/ {printf \"%.2f\", $3/$2 * 100}'"));
            stats.put("disk", executeCommand(user, "df -h / | awk 'NR==2 {print $5}'"));
        } catch (Exception e) {
            stats.put("error", "Failed to fetch data: " + e.getMessage());
        }
        return stats;
    }

    private String executeCommand(ServerUser user, String command) {
        StringBuilder output = new StringBuilder();
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(user.getUsername(), user.getIpAddress(), 22);
            session.setPassword(user.getPassword());
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();

            ChannelExec channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand(command);
            channel.setInputStream(null);
            channel.setErrStream(System.err);

            java.io.InputStream in = channel.getInputStream();
            channel.connect();

            int nextByte;
            while ((nextByte = in.read()) != -1) {
                output.append((char) nextByte);
            }

            channel.disconnect();
            session.disconnect();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
        return output.toString().trim();
    }
}