package com.resumeiq.backend.repository;

import com.resumeiq.backend.model.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, String> {
    List<Analysis> findByUserIdOrderByCreatedAtDesc(String userId);
}
