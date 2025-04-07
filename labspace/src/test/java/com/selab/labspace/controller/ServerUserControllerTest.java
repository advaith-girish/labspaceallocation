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

@WebMvcTest(ServerUserController.class)
class ServerUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServerUserService serverUserService;

    @Test
    void testCreateServerUser() throws Exception {
        ServerUser user = new ServerUser(1L, "john_doe", "John", "Doe", "john@example.com");
        Mockito.when(serverUserService.createServerUser(Mockito.any())).thenReturn(user);

        String requestBody = """
                {
                    "username": "john_doe",
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "john@example.com"
                }
                """;

        mockMvc.perform(post("/api/server-users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("john_doe")));
    }

    @Test
    void testGetAllServerUsers() throws Exception {
        List<ServerUser> users = List.of(
                new ServerUser(1L, "john_doe", "John", "Doe", "john@example.com"),
                new ServerUser(2L, "jane_doe", "Jane", "Doe", "jane@example.com")
        );
        Mockito.when(serverUserService.getAllServerUsers()).thenReturn(users);

        mockMvc.perform(get("/api/server-users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetServerUserById() throws Exception {
        ServerUser user = new ServerUser(1L, "john_doe", "John", "Doe", "john@example.com");
        Mockito.when(serverUserService.getServerUserById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/server-users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("john@example.com")));
    }

    @Test
    void testUpdateServerUser() throws Exception {
        ServerUser updatedUser = new ServerUser(1L, "john_doe", "Johnny", "Doe", "johnny@example.com");
        Mockito.when(serverUserService.updateServerUser(Mockito.eq(1L), Mockito.any())).thenReturn(updatedUser);

        String requestBody = """
                {
                    "username": "john_doe",
                    "firstName": "Johnny",
                    "lastName": "Doe",
                    "email": "johnny@example.com"
                }
                """;

        mockMvc.perform(put("/api/server-users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Johnny")));
    }

    @Test
    void testDeleteServerUser() throws Exception {
        Mockito.doNothing().when(serverUserService).deleteServerUser(1L);

        mockMvc.perform(delete("/api/server-users/1"))
                .andExpect(status().isOk());
    }
}
