package com.selab.labspace.repository;

import com.selab.labspace.model.ServerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface ServerUserRepository extends JpaRepository<ServerUser, Long> {
    List<ServerUser> findByLabId(int labId);
    
    // Add this method to fetch all server users
    List<ServerUser> findAll();

    @Query("SELECT su FROM ServerUser su WHERE su.lab.admin.id = :adminId")
    List<ServerUser> findByLabAdmin(@Param("adminId") Long adminId);

    Optional<ServerUser> findByIpAddress(String ipAddress);
}