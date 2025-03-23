package com.selab.labspace.websocket;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask;

public class ServerStatsWebSocketHandler extends TextWebSocketHandler {

    private Timer timer;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        timer = new Timer(true);
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    String cpuUsage = executeCommand("sar -u 1 1 | grep 'Average' | awk '{print 100 - $8}'");
                    String memoryUsage = executeCommand("free -m | awk '/Mem:/ {printf \"%.2f\", $3/$2 * 100}'");
                    String diskUsage = executeCommand("df -h / | awk 'NR==2 {print $5}'");

                    String jsonData = "{ \"cpu\": \"" + cpuUsage + "\", \"memory\": \"" + memoryUsage + "\", \"disk\": \"" + diskUsage + "\" }";
                    session.sendMessage(new TextMessage(jsonData));

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, 0, 5000); // Send data every 5 seconds
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        if (timer != null) {
            timer.cancel();
        }
    }

    private String executeCommand(String command) {
        StringBuilder output = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c", command});
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();
        } catch (Exception e) {
            return "Error";
        }
        return output.toString();
    }
}
