package com.iit.trainingcenter.dto.auth;

import com.iit.trainingcenter.entity.Role;

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        Boolean enabled
) {
}
