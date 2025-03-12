package com.selab.labspace.model;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, LAB_ADMIN, STUDENT

    // If LAB_ADMIN, manages multiple labs
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    @JsonManagedReference("user-labs") // ✅ Matches @JsonBackReference("user-labs") in Lab
    private Set<Lab> managedLabs;

    // If STUDENT, assigned to a seat
    @OneToOne(mappedBy = "assignedUser", cascade = CascadeType.ALL)
    @JsonManagedReference("user-seat") // ✅ Matches @JsonBackReference("user-seat") in Seat
    private Seat assignedSeat;

    public User() {}

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Set<Lab> getManagedLabs() { return managedLabs; }
    public void setManagedLabs(Set<Lab> managedLabs) { this.managedLabs = managedLabs; }

    public Seat getAssignedSeat() { return assignedSeat; }
    public void setAssignedSeat(Seat assignedSeat) { this.assignedSeat = assignedSeat; }
}
