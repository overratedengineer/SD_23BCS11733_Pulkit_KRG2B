package com.resumeiq.backend.dto;

import lombok.Data;
import com.resumeiq.backend.model.Role;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String name;
    private String email;
    private Role role;

    public JwtResponse(String accessToken, String id, String name, String email, Role role) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
