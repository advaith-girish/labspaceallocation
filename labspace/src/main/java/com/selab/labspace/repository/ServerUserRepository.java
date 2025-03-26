package com.selab.labspace.repository;

import com.selab.labspace.model.ServerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServerUserRepository extends JpaRepository<ServerUser, Long> {
    List<ServerUser> findByLabId(int labId);
    
    // Add this method to fetch all server users
    List<ServerUser> findAll();
}