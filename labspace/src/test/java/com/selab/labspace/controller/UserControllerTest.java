package com.selab.labspace.controller;

import com.selab.labspace.model.User;
import com.selab.labspace.model.Role;
import com.selab.labspace.service.UserService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testRegisterUser() throws Exception {
        User user = new User(1L, "Alice", "alice@example.com", "securepassword", Role.STUDENT);
        Mockito.when(userService.registerUser(Mockito.any())).thenReturn(user);

        String requestBody = """
                {
                    "name": "Alice",
                    "email": "alice@example.com",
                    "password": "securepassword",
                    "role": "STUDENT"
                }
                """;

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Alice")));
    }

    @Test
    void testGetAllUsers() throws Exception {
        List<User> users = List.of(
                new User(1L, "Alice", "alice@example.com", "pass", Role.STUDENT),
                new User(2L, "Bob", "bob@example.com", "pass", Role.LAB_ADMIN)
        );
        Mockito.when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)));
    }

    @Test
    void testGetUserById() throws Exception {
        User user = new User(1L, "Alice", "alice@example.com", "pass", Role.STUDENT);
        Mockito.when(userService.getUserById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("alice@example.com")));
    }

    @Test
    void testGetUserByEmail() throws Exception {
        User user = new User(1L, "Alice", "alice@example.com", "pass", Role.STUDENT);
        Mockito.when(userService.getUserByEmail("alice@example.com")).thenReturn(user);

        mockMvc.perform(get("/api/users/email/alice@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Alice")));
    }

    @Test
    void testUpdateUser() throws Exception {
        User updatedUser = new User(1L, "Alice Johnson", "alice.johnson@example.com", "pass", Role.LAB_ADMIN);
        Mockito.when(userService.updateUser(Mockito.eq(1L), Mockito.any())).thenReturn(updatedUser);

        String requestBody = """
                {
                    "name": "Alice Johnson",
                    "email": "alice.johnson@example.com",
                    "role": "LAB_ADMIN"
                }
                """;

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Alice Johnson")));
    }

    @Test
    void testDeleteUser() throws Exception {
        Mockito.doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());
    }
}
