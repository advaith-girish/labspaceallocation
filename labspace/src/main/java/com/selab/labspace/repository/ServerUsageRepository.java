package com.selab.labspace.repository;

import com.selab.labspace.model.ServerUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerUsageRepository extends JpaRepository<ServerUsage, Long> {
}
