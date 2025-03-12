package com.selab.labspace.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // Role: ADMIN, LAB_ADMIN, or STUDENT

    // Lab Admin: Can manage multiple labs
    @OneToMany(mappedBy = "labAdmin", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Lab> managedLabs;

    // Student: Assigned a single seat
    @OneToOne(mappedBy = "assignedUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Seat assignedSeat;

    // Constructors
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
