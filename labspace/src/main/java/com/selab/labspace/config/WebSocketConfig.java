package com.selab.labspace.config;
import com.selab.labspace.websocket.ServerStatsWebSocketHandler;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ServerStatsWebSocketHandler(), "/ws/server-stats")
                .setAllowedOrigins("*"); // Allow all origins (for testing)
    }
}
