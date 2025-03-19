// package com.selab.labspace.repository;

// import com.selab.labspace.model.Lab;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import java.util.List;

// @Repository
// public interface LabRepository extends JpaRepository<Lab, Long> {
//     List<Lab> findByAdminId(Long adminId);
// }

package com.selab.labspace.repository;

import com.selab.labspace.model.Lab;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    List<Lab> findByAdminId(Long adminId); // Fetch labs managed by a specific Lab Admin
}
