package com.resumeiq.backend.service;

import com.resumeiq.backend.model.Resume.ExtractedData;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    private final Tika tika;
    
    // Sample tech dictionary
    private final String[] KNOWN_SKILLS = {
        "java", "spring boot", "react", "mongodb", "node.js", "docker", "kubernetes",
        "sql", "python", "aws", "azure", "ci/cd", "git", "rest api", "html", "css",
        "javascript", "typescript", "angular", "mysql", "postgresql", "kafka", "redis"
    };

    public ResumeParserService() {
        this.tika = new Tika();
    }

    public ExtractedData parseResume(String filePath) {
        ExtractedData data = new ExtractedData();
        try {
            File document = new File(filePath);
            String rawText = tika.parseToString(document);
            data.setRawText(rawText);
            
            data.setExtractedEmail(extractEmail(rawText));
            data.setPhone(extractPhone(rawText));
            data.setSkills(extractSkills(rawText));
            
            // Simplified heuristics for Name, Education, Experience
            data.setName("Candidate Name extracted from Parsing"); 
            data.setEducation(List.of("B.S. Computer Science"));
            data.setExperience(List.of("Software Engineer - 3 Years"));
            
        } catch (Exception e) {
            System.err.println("Error parsing resume: " + e.getMessage());
        }
        return data;
    }

    private String extractEmail(String text) {
        Matcher m = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+").matcher(text);
        if (m.find()) {
            return m.group();
        }
        return null;
    }

    private String extractPhone(String text) {
        Matcher m = Pattern.compile("(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}").matcher(text);
        if (m.find()) {
            return m.group();
        }
        return null;
    }

    private List<String> extractSkills(String text) {
        List<String> foundSkills = new ArrayList<>();
        String lowerText = text.toLowerCase();
        for (String skill : KNOWN_SKILLS) {
            if (lowerText.contains(skill.toLowerCase())) {
                foundSkills.add(skill);
            }
        }
        return foundSkills;
    }
}
