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
    private static final String[] VM_IPS = { "192.168.72.235","192.168.72.172" };
    private static final double CPU_THRESHOLD = 80.0;  // CPU usage threshold for warning

    @GetMapping("/stats")
    public Map<String, Map<String, String>> getAllServerStats() {
        Map<String, Map<String, String>> allStats = new HashMap<>();

        for (String ip : VM_IPS) {
            Map<String, String> stats = getServerStats(ip);
            stats.put("ip", ip);  // Include the IP address in the response
            
            // Check CPU usage and add a warning message if it exceeds the threshold
            double cpuUsage = Double.parseDouble(stats.get("cpu"));
            if (cpuUsage > CPU_THRESHOLD) {
                stats.put("warning", "High CPU usage detected!");  // Add a warning message
            }

            allStats.put(ip, stats);
        }

        return allStats;
    }

    private Map<String, String> getServerStats(String host) {
        Map<String, String> stats = new HashMap<>();
        try {
            // Using 'top' instead of 'sar' for accurate real-time CPU usage
            stats.put("cpu", executeCommand(host, "top -bn1 | grep 'Cpu(s)' | awk '{print 100 - $8}'"));
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
            if (in == null) {
                throw new RuntimeException("Failed to execute command on " + host + ": Input stream is null");
            }
    
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
