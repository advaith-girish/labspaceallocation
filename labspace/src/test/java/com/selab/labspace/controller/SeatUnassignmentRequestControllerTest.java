package com.selab.labspace.controller;

import com.selab.labspace.model.SeatUnassignmentRequest;
import com.selab.labspace.service.SeatUnassignmentRequestService;
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

@WebMvcTest(SeatUnassignmentRequestController.class)
class SeatUnassignmentRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeatUnassignmentRequestService unassignmentRequestService;

    @Test
    void testCreateUnassignmentRequest() throws Exception {
        SeatUnassignmentRequest request = new SeatUnassignmentRequest(1L, 1L, "PENDING");
        Mockito.when(unassignmentRequestService.createUnassignmentRequest(Mockito.any())).thenReturn(request);

        String requestBody = """
                {
                    "userId": 1,
                    "status": "PENDING"
                }
                """;

        mockMvc.perform(post("/api/unassignment-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PENDING")));
    }

    @Test
    void testGetAllUnassignmentRequests() throws Exception {
        List<SeatUnassignmentRequest> requests = List.of(
                new SeatUnassignmentRequest(1L, 1L, "PENDING"),
                new SeatUnassignmentRequest(2L, 2L, "APPROVED")
        );
        Mockito.when(unassignmentRequestService.getAllUnassignmentRequests()).thenReturn(requests);

        mockMvc.perform(get("/api/unassignment-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetUnassignmentRequestById() throws Exception {
        SeatUnassignmentRequest request = new SeatUnassignmentRequest(1L, 1L, "PENDING");
        Mockito.when(unassignmentRequestService.getUnassignmentRequestById(1L)).thenReturn(request);

        mockMvc.perform(get("/api/unassignment-requests/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is(1)));
    }

    @Test
    void testGetUnassignmentRequestsByStatus() throws Exception {
        List<SeatUnassignmentRequest> requests = List.of(
                new SeatUnassignmentRequest(1L, 1L, "PENDING")
        );
        Mockito.when(unassignmentRequestService.getUnassignmentRequestsByStatus("PENDING")).thenReturn(requests);

        mockMvc.perform(get("/api/unassignment-requests/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("PENDING")));
    }

    @Test
    void testUpdateUnassignmentRequestStatus() throws Exception {
        SeatUnassignmentRequest updated = new SeatUnassignmentRequest(1L, 1L, "APPROVED");
        Mockito.when(unassignmentRequestService.updateUnassignmentRequestStatus(1L, "APPROVED")).thenReturn(updated);

        mockMvc.perform(put("/api/unassignment-requests/1/status")
                        .param("status", "APPROVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    void testDeleteUnassignmentRequest() throws Exception {
        Mockito.doNothing().when(unassignmentRequestService).deleteUnassignmentRequest(1L);

        mockMvc.perform(delete("/api/unassignment-requests/1"))
                .andExpect(status().isOk());
    }
}
