package com.selab.labspace.repository;

import com.selab.labspace.model.Lab;
import com.selab.labspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {

    // Find all labs managed by a specific Lab Admin
    List<Lab> findByLabAdmin(User labAdmin);

    // Find a lab by its name
    Lab findByName(String name);
}
