package com.selab.labspace.model;

import jakarta.persistence.*;

@Entity
@Table(name = "server_usage")
public class ServerUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private double computeUsage; // CPU or Memory usage in percentage

    // Getters & Setters
}
