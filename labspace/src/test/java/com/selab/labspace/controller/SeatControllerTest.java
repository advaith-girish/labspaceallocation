package com.selab.labspace.controller;

import com.selab.labspace.model.Seat;
import com.selab.labspace.service.SeatService;
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

@WebMvcTest(SeatController.class)
class SeatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeatService seatService;

    @Test
    void testCreateSeat() throws Exception {
        Seat seat = new Seat(1L, 101, true, 1L);
        Mockito.when(seatService.createSeat(Mockito.any())).thenReturn(seat);

        String requestBody = """
                {
                    "seatNumber": 101,
                    "available": true,
                    "labId": 1
                }
                """;

        mockMvc.perform(post("/api/seats")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seatNumber", is(101)));
    }

    @Test
    void testGetAllSeats() throws Exception {
        List<Seat> seats = List.of(
                new Seat(1L, 101, true, 1L),
                new Seat(2L, 102, false, 1L)
        );
        Mockito.when(seatService.getAllSeats()).thenReturn(seats);

        mockMvc.perform(get("/api/seats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetSeatById() throws Exception {
        Seat seat = new Seat(1L, 101, true, 1L);
        Mockito.when(seatService.getSeatById(1L)).thenReturn(seat);

        mockMvc.perform(get("/api/seats/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seatNumber", is(101)));
    }

    @Test
    void testGetSeatsByLabId() throws Exception {
        List<Seat> seats = List.of(
                new Seat(1L, 101, true, 1L),
                new Seat(2L, 102, false, 1L)
        );
        Mockito.when(seatService.getSeatsByLabId(1L)).thenReturn(seats);

        mockMvc.perform(get("/api/seats/lab/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testUpdateSeat() throws Exception {
        Seat updatedSeat = new Seat(1L, 101, false, 1L);
        Mockito.when(seatService.updateSeat(Mockito.eq(1L), Mockito.any())).thenReturn(updatedSeat);

        String requestBody = """
                {
                    "seatNumber": 101,
                    "available": false,
                    "labId": 1
                }
                """;

        mockMvc.perform(put("/api/seats/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available", is(false)));
    }

    @Test
    void testDeleteSeat() throws Exception {
        Mockito.doNothing().when(seatService).deleteSeat(1L);

        mockMvc.perform(delete("/api/seats/1"))
                .andExpect(status().isOk());
    }
}
