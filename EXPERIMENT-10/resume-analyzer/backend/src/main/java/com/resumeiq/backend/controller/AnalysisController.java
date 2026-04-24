package com.resumeiq.backend.controller;

import com.resumeiq.backend.model.Analysis;
import com.resumeiq.backend.model.Resume;
import com.resumeiq.backend.repository.AnalysisRepository;
import com.resumeiq.backend.repository.ResumeRepository;
import com.resumeiq.backend.security.UserDetailsImpl;
import com.resumeiq.backend.service.ATSScoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analyze")
public class AnalysisController {

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ATSScoringService atsScoringService;

    @PostMapping
    public ResponseEntity<?> analyzeResume(@RequestBody Map<String, String> payload) {
        String resumeId = payload.get("resumeId");
        String jobDescription = payload.get("jobDescription");

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Analysis analysis = atsScoringService.generateAnalysis(resume.getExtractedData(), jobDescription);
        analysis.setUserId(userDetails.getId());
        analysis.setResumeId(resumeId);

        analysisRepository.save(analysis);

        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Analysis> history = analysisRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnalysis(@PathVariable String id) {
        return analysisRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
