package com.selab.labspace.controller;

import com.selab.labspace.model.ServerUser;
import com.selab.labspace.service.ServerUserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ServerMonitoringController.class)
class ServerMonitoringControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServerMonitoringService serverMonitoringService;

    @Test
    void testCreateServerMonitoring() throws Exception {
        ServerMonitoring monitoring = new ServerMonitoring(1L, "Server1", "Running", 70.5, 45.0);
        Mockito.when(serverMonitoringService.createServerMonitoring(Mockito.any())).thenReturn(monitoring);

        String requestBody = """
                {
                    "serverName": "Server1",
                    "status": "Running",
                    "cpuUsage": 70.5,
                    "memoryUsage": 45.0
                }
                """;

        mockMvc.perform(post("/api/server-monitoring")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName", is("Server1")));
    }

    @Test
    void testGetAllServerMonitorings() throws Exception {
        List<ServerMonitoring> list = List.of(
                new ServerMonitoring(1L, "Server1", "Running", 70.5, 45.0),
                new ServerMonitoring(2L, "Server2", "Stopped", 10.0, 5.0)
        );
        Mockito.when(serverMonitoringService.getAllServerMonitorings()).thenReturn(list);

        mockMvc.perform(get("/api/server-monitoring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetServerMonitoringById() throws Exception {
        ServerMonitoring monitoring = new ServerMonitoring(1L, "Server1", "Running", 70.5, 45.0);
        Mockito.when(serverMonitoringService.getServerMonitoringById(1L)).thenReturn(monitoring);

        mockMvc.perform(get("/api/server-monitoring/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Running")));
    }

    @Test
    void testUpdateServerMonitoring() throws Exception {
        ServerMonitoring updated = new ServerMonitoring(1L, "Server1", "Idle", 50.0, 30.0);
        Mockito.when(serverMonitoringService.updateServerMonitoring(Mockito.eq(1L), Mockito.any())).thenReturn(updated);

        String requestBody = """
                {
                    "serverName": "Server1",
                    "status": "Idle",
                    "cpuUsage": 50.0,
                    "memoryUsage": 30.0
                }
                """;

        mockMvc.perform(put("/api/server-monitoring/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Idle")));
    }

    @Test
    void testDeleteServerMonitoring() throws Exception {
        Mockito.doNothing().when(serverMonitoringService).deleteServerMonitoring(1L);

        mockMvc.perform(delete("/api/server-monitoring/1"))
                .andExpect(status().isOk());
    }
}
