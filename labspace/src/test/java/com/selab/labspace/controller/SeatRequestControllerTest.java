package com.selab.labspace.controller;

import com.selab.labspace.model.SeatRequest;
//import com.selab.labspace.service.SeatRequestService;
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

@WebMvcTest(SeatRequestController.class)
class SeatRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeatRequestService seatRequestService;

    @Test
    void testCreateSeatRequest() throws Exception {
        SeatRequest request = new SeatRequest(1L, 1L, 2L, "PENDING");
        Mockito.when(seatRequestService.createSeatRequest(Mockito.any())).thenReturn(request);

        String requestBody = """
                {
                    "userId": 1,
                    "seatId": 2,
                    "status": "PENDING"
                }
                """;

        mockMvc.perform(post("/api/seat-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PENDING")));
    }

    @Test
    void testGetAllSeatRequests() throws Exception {
        List<SeatRequest> requests = List.of(
                new SeatRequest(1L, 1L, 2L, "PENDING"),
                new SeatRequest(2L, 3L, 4L, "APPROVED")
        );
        Mockito.when(seatRequestService.getAllSeatRequests()).thenReturn(requests);

        mockMvc.perform(get("/api/seat-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetSeatRequestById() throws Exception {
        SeatRequest request = new SeatRequest(1L, 1L, 2L, "PENDING");
        Mockito.when(seatRequestService.getSeatRequestById(1L)).thenReturn(request);

        mockMvc.perform(get("/api/seat-requests/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is(1)));
    }

    @Test
    void testGetSeatRequestsByStatus() throws Exception {
        List<SeatRequest> requests = List.of(
                new SeatRequest(1L, 1L, 2L, "PENDING")
        );
        Mockito.when(seatRequestService.getSeatRequestsByStatus("PENDING")).thenReturn(requests);

        mockMvc.perform(get("/api/seat-requests/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].status", is("PENDING")));
    }

    @Test
    void testUpdateSeatRequestStatus() throws Exception {
        SeatRequest updated = new SeatRequest(1L, 1L, 2L, "APPROVED");
        Mockito.when(seatRequestService.updateSeatRequestStatus(1L, "APPROVED")).thenReturn(updated);

        mockMvc.perform(put("/api/seat-requests/1/status")
                        .param("status", "APPROVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    void testDeleteSeatRequest() throws Exception {
        Mockito.doNothing().when(seatRequestService).deleteSeatRequest(1L);

        mockMvc.perform(delete("/api/seat-requests/1"))
                .andExpect(status().isOk());
    }
}
