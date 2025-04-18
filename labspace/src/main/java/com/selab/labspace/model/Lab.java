package com.selab.labspace.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "labs")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "lab_type", nullable = false)
    private String labType;

    private String location;

    // One Lab has many Seats
    @OneToMany(mappedBy = "lab", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({ "lab" }) // Prevents recursion issues, allows seats serialization
    private Set<Seat> seats = new HashSet<>();

    // One Lab can have multiple server users
    @OneToMany(mappedBy = "lab", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("lab-server-users") // Allows serialization
    private Set<ServerUser> serverUsers = new HashSet<>();

    // Many Labs can be managed by one User (Admin)
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false) // Ensures Admin is always assigned
    @JsonBackReference("user-labs")
    private User admin;

    public Lab() {
    }

    public Lab(String name, String location, String labType, User admin) {
        this.name = name;
        this.location = location;
        this.admin = admin;
        this.labType = labType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<Seat> getSeats() { return seats; }
    public void setSeats(Set<Seat> seats) { this.seats = seats; }

    public Set<ServerUser> getServerUsers() { return serverUsers; }
    public void setServerUsers(Set<ServerUser> serverUsers) { this.serverUsers = serverUsers; }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public String getLabType() {
        return labType;
    }

    public void setLabType(String labType) {
        this.labType = labType;
    }
}
