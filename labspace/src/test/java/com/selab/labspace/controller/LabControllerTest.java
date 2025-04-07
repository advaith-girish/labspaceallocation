package com.selab.labspace.controller;

import com.selab.labspace.model.Lab;
import com.selab.labspace.service.LabService;
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

@WebMvcTest(LabController.class)
class LabControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LabService labService;

    @Test
    void testCreateLab() throws Exception {
        Lab lab = new Lab(1L, "Lab A", "Computer Lab", 50, "First Floor");
        Mockito.when(labService.createLab(Mockito.any())).thenReturn(lab);

        String requestBody = """
                {
                    "name": "Lab A",
                    "description": "Computer Lab",
                    "capacity": 50,
                    "location": "First Floor"
                }
                """;

        mockMvc.perform(post("/api/labs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Lab A")));
    }

    @Test
    void testGetAllLabs() throws Exception {
        List<Lab> labs = List.of(
                new Lab(1L, "Lab A", "Computer Lab", 50, "First Floor"),
                new Lab(2L, "Lab B", "Electronics Lab", 30, "Second Floor")
        );
        Mockito.when(labService.getAllLabs()).thenReturn(labs);

        mockMvc.perform(get("/api/labs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetLabById() throws Exception {
        Lab lab = new Lab(1L, "Lab A", "Computer Lab", 50, "First Floor");
        Mockito.when(labService.getLabById(1L)).thenReturn(lab);

        mockMvc.perform(get("/api/labs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location", is("First Floor")));
    }

    @Test
    void testUpdateLab() throws Exception {
        Lab updatedLab = new Lab(1L, "Updated Lab", "New Desc", 60, "Third Floor");
        Mockito.when(labService.updateLab(Mockito.eq(1L), Mockito.any())).thenReturn(updatedLab);

        String requestBody = """
                {
                    "name": "Updated Lab",
                    "description": "New Desc",
                    "capacity": 60,
                    "location": "Third Floor"
                }
                """;

        mockMvc.perform(put("/api/labs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacity", is(60)));
    }

    @Test
    void testDeleteLab() throws Exception {
        Mockito.doNothing().when(labService).deleteLab(1L);

        mockMvc.perform(delete("/api/labs/1"))
                .andExpect(status().isOk());
    }
}
