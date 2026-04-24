package com.resumeiq.backend.service;

import com.resumeiq.backend.model.Analysis;
import com.resumeiq.backend.model.Analysis.SectionScores;
import com.resumeiq.backend.model.Resume.ExtractedData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ATSScoringService {

    public Analysis generateAnalysis(ExtractedData resumeData, String jobDescription) {
        Analysis analysis = new Analysis();
        analysis.setJobDescription(jobDescription);
        
        List<String> resumeSkills = resumeData.getSkills() != null ? resumeData.getSkills() : new ArrayList<>();
        List<String> jdKeywords = extractKeywords(jobDescription);
        
        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        
        for (String keyword : jdKeywords) {
            if (resumeSkills.contains(keyword.toLowerCase())) {
                matchingSkills.add(keyword);
            } else {
                missingSkills.add(keyword);
            }
        }
        
        analysis.setMatchingSkills(matchingSkills);
        analysis.setMissingSkills(missingSkills);
        
        // Calculate Scores
        SectionScores scores = new SectionScores();
        int matchingPercentage = jdKeywords.isEmpty() ? 100 : (matchingSkills.size() * 100) / jdKeywords.size();
        
        scores.setSkillsScore((int) (matchingPercentage * 0.40));
        scores.setExperienceScore(18); // mocked for now based on extracted text length or keywords
        scores.setEducationScore(8);   // mocked 
        scores.setKeywordsScore((int) (matchingPercentage * 0.20));
        scores.setFormattingScore(5);  // mocked depending on parser successful extraction of sections
        
        int totalScore = scores.getSkillsScore() + scores.getExperienceScore() + scores.getEducationScore() + 
                         scores.getKeywordsScore() + scores.getFormattingScore();
                         
        analysis.setSectionScores(scores);
        analysis.setAtsScore(Math.min(totalScore, 100));
        
        // Generate Suggestions
        List<String> suggestions = new ArrayList<>();
        if (!missingSkills.isEmpty()) {
            suggestions.add("Add missing keywords from Job Description: " + String.join(", ", missingSkills));
        }
        if (scores.getFormattingScore() < 10) {
            suggestions.add("Improve formatting to ensure ATS can easily read all sections.");
        }
        if (resumeData.getExperience() == null || resumeData.getExperience().isEmpty()) {
            suggestions.add("Add quantified achievements in your experience section.");
        }
        analysis.setSuggestions(suggestions);
        
        return analysis;
    }

    private List<String> extractKeywords(String text) {
        if (text == null || text.trim().isEmpty()) return new ArrayList<>();
        // Simple mock JD keyword extraction
        String[] possibleKeywords = {"java", "spring boot", "react", "mongodb", "docker", "kubernetes", "aws", "git"};
        String lowerJD = text.toLowerCase();
        return Arrays.stream(possibleKeywords)
                .filter(lowerJD::contains)
                .collect(Collectors.toList());
    }
}
