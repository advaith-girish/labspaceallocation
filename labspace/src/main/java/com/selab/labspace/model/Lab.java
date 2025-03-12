package com.selab.labspace.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "labs")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Lab name

    @ManyToOne
    @JoinColumn(name = "lab_admin_id", nullable = false)
    private User labAdmin; // Each lab has one Lab Admin

    @OneToMany(mappedBy = "lab", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Seat> seats; // Seats in the lab

    // Constructors
    public Lab() {}

    public Lab(String name, User labAdmin) {
        this.name = name;
        this.labAdmin = labAdmin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public User getLabAdmin() { return labAdmin; }
    public void setLabAdmin(User labAdmin) { this.labAdmin = labAdmin; }

    public Set<Seat> getSeats() { return seats; }
    public void setSeats(Set<Seat> seats) { this.seats = seats; }
}
