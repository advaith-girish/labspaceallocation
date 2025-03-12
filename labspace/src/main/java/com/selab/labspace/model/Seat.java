package com.selab.labspace.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rowNumber;

    @Column(nullable = false)
    private int columnNumber;

    @ManyToOne
    @JoinColumn(name = "lab_id", nullable = false)
    private Lab lab; // Seat belongs to a specific lab

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User assignedUser; // Student assigned to this seat

    // Constructors
    public Seat() {}

    public Seat(int rowNumber, int columnNumber, Lab lab) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.lab = lab;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRowNumber() { return rowNumber; }
    public void setRowNumber(int rowNumber) { this.rowNumber = rowNumber; }

    public int getColumnNumber() { return columnNumber; }
    public void setColumnNumber(int columnNumber) { this.columnNumber = columnNumber; }

    public Lab getLab() { return lab; }
    public void setLab(Lab lab) { this.lab = lab; }

    public User getAssignedUser() { return assignedUser; }
    public void setAssignedUser(User assignedUser) { this.assignedUser = assignedUser; }
}
