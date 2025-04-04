package com.selab.labspace.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number")
    private String seatNumber;

    @ManyToOne(fetch = FetchType.EAGER) // Force load Lab
    @JoinColumn(name = "lab_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevents proxy errors
    private Lab lab;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true)
    @JsonManagedReference("user-seat") //Allows serialization
    private User assignedUser;

    public Seat() {
    }

    public Seat(String seatNumber, Lab lab) {
        this.seatNumber = seatNumber;
        this.lab = lab;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Lab getLab() {
        return lab;
    }

    public void setLab(Lab lab) {
        this.lab = lab;
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }
}
