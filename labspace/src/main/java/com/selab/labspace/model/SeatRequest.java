package com.selab.labspace.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_requests")
public class SeatRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @ManyToOne
    @JoinColumn(name = "lab_id", nullable = false)
    private Lab lab;

    @Column(name = "status", nullable = false)
    private String status; // Possible values: "Pending", "Approved", "Rejected"

    @Column(name = "request_time", nullable = false)
    private LocalDateTime requestTime;

    public SeatRequest() {
        this.status = "Pending";
        this.requestTime = LocalDateTime.now();
    }

    public SeatRequest(String studentName, String studentEmail, Lab lab) {
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.lab = lab;
        this.status = "Pending";
        this.requestTime = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public Lab getLab() { return lab; }
    public void setLab(Lab lab) { this.lab = lab; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestTime() { return requestTime; }
    public void setRequestTime(LocalDateTime requestTime) { this.requestTime = requestTime; }
}
