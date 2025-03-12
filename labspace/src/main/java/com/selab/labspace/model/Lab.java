// package com.selab.labspace.model;

// import jakarta.persistence.*;
// import java.util.Set;

// @Entity
// @Table(name = "labs")
// public class Lab {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private String location;

//     @OneToMany(mappedBy = "lab", cascade = CascadeType.ALL)
//     private Set<Seat> seats;

//     @ManyToOne
//     @JoinColumn(name = "admin_id")
//     private User admin; // Lab Admin managing the lab

//     public Lab() {}

//     public Lab(String name, String location, User admin) {
//         this.name = name;
//         this.location = location;
//         this.admin = admin;
//     }

//     // Getters and Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getName() { return name; }
//     public void setName(String name) { this.name = name; }

//     public String getLocation() { return location; }
//     public void setLocation(String location) { this.location = location; }

//     public Set<Seat> getSeats() { return seats; }
//     public void setSeats(Set<Seat> seats) { this.seats = seats; }

//     public User getAdmin() { return admin; }
//     public void setAdmin(User admin) { this.admin = admin; }
// }

package com.selab.labspace.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "labs")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;

    // One Lab has many Seats
    @OneToMany(mappedBy = "lab", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("lab-seats") // Matches @JsonBackReference in Seat
    private Set<Seat> seats = new HashSet<>();

    // Many Labs can be managed by one User (Admin)
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false) // Ensures Admin is always assigned
    @JsonBackReference("user-labs") 
    private User admin; 

    public Lab() {}

    public Lab(String name, String location, User admin) {
        this.name = name;
        this.location = location;
        this.admin = admin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Set<Seat> getSeats() { return seats; }
    public void setSeats(Set<Seat> seats) { this.seats = seats; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }
}

