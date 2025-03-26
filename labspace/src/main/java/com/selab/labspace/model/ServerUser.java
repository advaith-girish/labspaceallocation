package com.selab.labspace.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "server_users")
public class ServerUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "lab_id", nullable = false) // Foreign key linking to Lab
    @JsonBackReference("lab-server-users") // Prevents recursion in serialization
    private Lab lab;

    // Constructors
    public ServerUser() {}

    public ServerUser(String ipAddress, String username, String password, Lab lab) {
        this.ipAddress = ipAddress;
        this.username = username;
        this.password = password;
        this.lab = lab;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Lab getLab() { return lab; }
    public void setLab(Lab lab) { this.lab = lab; }
}
