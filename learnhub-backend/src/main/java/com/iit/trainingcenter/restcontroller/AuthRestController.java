package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.auth.AuthResponse;
import com.iit.trainingcenter.dto.auth.LoginRequest;
import com.iit.trainingcenter.dto.auth.RegisterRequest;
import com.iit.trainingcenter.dto.auth.UserResponse;
import com.iit.trainingcenter.entity.Role;
import com.iit.trainingcenter.entity.User;
import com.iit.trainingcenter.service.UserService;
import com.iit.trainingcenter.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(request.password());
        user.setEmail(request.email());
        // Server decides these defaults; client does not provide them.
        user.setRole(Role.STUDENT);
        user.setEnabled(true);

        User saved = userService.save(user);
        return new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRole(), saved.getEnabled());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid username or password");
        }
        final UserDetails userDetails = userService.loadUserByUsername(request.username());
        return new AuthResponse(true, jwtUtil.generateToken(userDetails));
    }
}
