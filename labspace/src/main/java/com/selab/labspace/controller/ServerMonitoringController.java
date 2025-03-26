package com.selab.labspace.controller;

import com.jcraft.jsch.*;
import com.selab.labspace.model.ServerUser;
import com.selab.labspace.service.ServerUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/server")
public class ServerMonitoringController {

    private final ServerUserService serverUserService;
    private static final double CPU_THRESHOLD = 80.0;

    public ServerMonitoringController(ServerUserService serverUserService) {
        this.serverUserService = serverUserService;
    }

    @GetMapping("/stats")
    public Map<String, Map<String, String>> getAllServerStats() {
        Map<String, Map<String, String>> allStats = new HashMap<>();

        List<ServerUser> serverUsers = serverUserService.getAllServerUsers();
        for (ServerUser user : serverUsers) {
            Map<String, String> stats = getServerStats(user);
            stats.put("ip", user.getIpAddress());
            stats.put("username", user.getUsername());
            stats.put("lab", user.getLab().getName()); // Fetching Lab Name

            try {
                double cpuUsage = Double.parseDouble(stats.get("cpu"));
                if (cpuUsage > CPU_THRESHOLD) {
                    stats.put("warning", "High CPU usage detected!");
                }
            } catch (NumberFormatException e) {
                stats.put("cpu", "N/A");
            }

            allStats.put(user.getIpAddress(), stats);
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
