package com.resumeiq.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    // Storing user association as String for simplicity matching the previous Mongo implementation
    private String userId; 
    
    private String originalFileName;
    private String filePath;

    @Embedded
    private ExtractedData extractedData;

    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public ExtractedData getExtractedData() { return extractedData; }
    public void setExtractedData(ExtractedData extractedData) { this.extractedData = extractedData; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Data
    @NoArgsConstructor
    @Embeddable
    public static class ExtractedData {
        private String name;
        private String extractedEmail;
        private String phone;
        
        @ElementCollection
        @CollectionTable(name = "resume_skills", joinColumns = @JoinColumn(name = "resume_id"))
        @Column(name = "skill")
        private List<String> skills;
        
        @ElementCollection
        @CollectionTable(name = "resume_education", joinColumns = @JoinColumn(name = "resume_id"))
        @Column(name = "edu")
        private List<String> education;
        
        @ElementCollection
        @CollectionTable(name = "resume_experience", joinColumns = @JoinColumn(name = "resume_id"))
        @Column(name = "exp")
        private List<String> experience;

        @Lob
        @Column(columnDefinition="TEXT")
        private String rawText;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getExtractedEmail() { return extractedEmail; }
        public void setExtractedEmail(String extractedEmail) { this.extractedEmail = extractedEmail; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
        public List<String> getEducation() { return education; }
        public void setEducation(List<String> education) { this.education = education; }
        public List<String> getExperience() { return experience; }
        public void setExperience(List<String> experience) { this.experience = experience; }
        public String getRawText() { return rawText; }
        public void setRawText(String rawText) { this.rawText = rawText; }
    }
}
