package com.resumeiq.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "analyses")
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String userId;
    private String resumeId;

    @Lob
    @Column(columnDefinition="TEXT")
    private String jobDescription;
    
    private int atsScore;

    @ElementCollection
    @CollectionTable(name = "analysis_matching_skills", joinColumns = @JoinColumn(name = "analysis_id"))
    private List<String> matchingSkills;

    @ElementCollection
    @CollectionTable(name = "analysis_missing_skills", joinColumns = @JoinColumn(name = "analysis_id"))
    private List<String> missingSkills;

    @ElementCollection
    @CollectionTable(name = "analysis_suggestions", joinColumns = @JoinColumn(name = "analysis_id"))
    private List<String> suggestions;
    
    @Embedded
    private SectionScores sectionScores;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getResumeId() { return resumeId; }
    public void setResumeId(String resumeId) { this.resumeId = resumeId; }
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    public int getAtsScore() { return atsScore; }
    public void setAtsScore(int atsScore) { this.atsScore = atsScore; }
    public List<String> getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public SectionScores getSectionScores() { return sectionScores; }
    public void setSectionScores(SectionScores sectionScores) { this.sectionScores = sectionScores; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Data
    @NoArgsConstructor
    @Embeddable
    public static class SectionScores {
        private int skillsScore;
        private int experienceScore;
        private int educationScore;
        private int keywordsScore;
        private int formattingScore;

        public int getSkillsScore() { return skillsScore; }
        public void setSkillsScore(int skillsScore) { this.skillsScore = skillsScore; }
        public int getExperienceScore() { return experienceScore; }
        public void setExperienceScore(int experienceScore) { this.experienceScore = experienceScore; }
        public int getEducationScore() { return educationScore; }
        public void setEducationScore(int educationScore) { this.educationScore = educationScore; }
        public int getKeywordsScore() { return keywordsScore; }
        public void setKeywordsScore(int keywordsScore) { this.keywordsScore = keywordsScore; }
        public int getFormattingScore() { return formattingScore; }
        public void setFormattingScore(int formattingScore) { this.formattingScore = formattingScore; }
    }
}
