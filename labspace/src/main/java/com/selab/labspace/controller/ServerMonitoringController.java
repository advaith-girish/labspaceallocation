package com.selab.labspace.controller;

import com.jcraft.jsch.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/server")
public class ServerMonitoringController {

    private static final String USERNAME = "adi";
    private static final String PASSWORD = "1234";
    private static final String[] VM_IPS = { "172.20.85.122", "172.20.85.45", "172.20.85.47" }; //change the ip addresses here
    private static final double CPU_THRESHOLD = 80.0;

    @GetMapping("/stats")
    public Map<String, Map<String, String>> getAllServerStats() {
        Map<String, Map<String, String>> allStats = new HashMap<>();

        for (String ip : VM_IPS) {
            Map<String, String> stats = getServerStats(ip);
            stats.put("ip", ip);

            // Check CPU usage and add a warning if needed
            try {
                double cpuUsage = Double.parseDouble(stats.get("cpu"));
                if (cpuUsage > CPU_THRESHOLD) {
                    stats.put("warning", "High CPU usage detected!");
                }
            } catch (NumberFormatException e) {
                stats.put("cpu", "N/A"); // Fallback in case of parsing issues
            }

            allStats.put(ip, stats);
        }

        return allStats;
    }

    private Map<String, String> getServerStats(String host) {
        Map<String, String> stats = new HashMap<>();
        try {
            // Use improved sar command with multiple samples
            stats.put("cpu", executeCommand(host, "sar -u 3 2 | awk '/Average:/ {print 100 - $(NF)}'"));
            stats.put("memory", executeCommand(host, "free -m | awk '/Mem:/ {printf \"%.2f\", $3/$2 * 100}'"));
            stats.put("disk", executeCommand(host, "df -h / | awk 'NR==2 {print $5}'"));
            stats.put("username", executeCommand(host, "whoami").trim());
        } catch (Exception e) {
            stats.put("error", "Failed to fetch data: " + e.getMessage());
        }
        return stats;
    }
    

    private String executeCommand(String host, String command) {
        StringBuilder output = new StringBuilder();
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(USERNAME, host, 22);
            session.setPassword(PASSWORD);
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
