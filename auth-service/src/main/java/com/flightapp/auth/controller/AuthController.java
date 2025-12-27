package com.flightapp.auth.controller;

import com.flightapp.auth.dto.AuthRequest;
import com.flightapp.auth.dto.AuthResponse;
import com.flightapp.auth.dto.ChangePasswordRequest;
import com.flightapp.auth.dto.ChangePasswordResponse;
import com.flightapp.auth.dto.PasswordExpiryStatusResponse;
import com.flightapp.auth.dto.RegisterRequest;
import com.flightapp.auth.dto.ValidateTokenRequest;
import com.flightapp.auth.dto.ValidateTokenResponse;
import com.flightapp.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        log.info("POST /api/auth/login - Login request for username: {}", request.getUsername());

        return authService.login(request)
                .map(response -> {
                    if (response.getToken() != null) {
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Registration request for username: {}", request.getUsername());

        return authService.register(request)
                .map(response -> {
                    if (response.getToken() != null) {
                        return ResponseEntity.status(HttpStatus.CREATED).body(response);
                    }
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                });
    }

    @PostMapping("/validate")
    public Mono<ResponseEntity<ValidateTokenResponse>> validateToken(@RequestBody ValidateTokenRequest request) {
        log.info("POST /api/auth/validate - Token validation request");

        return authService.validateToken(request.getToken())
                .map(response -> {
                    if (Boolean.TRUE.equals(response.getValid())) {
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }

    @GetMapping("/validate")
    public Mono<ResponseEntity<ValidateTokenResponse>> validateTokenHeader(@RequestHeader("Authorization") String authHeader) {
        log.info("GET /api/auth/validate - Token validation request from header");

        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        return authService.validateToken(token)
                .map(response -> {
                    if (Boolean.TRUE.equals(response.getValid())) {
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }

    @PostMapping("/change-password")
    public Mono<ResponseEntity<ChangePasswordResponse>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        log.info("POST /api/auth/change-password - Password change request for username: {}", request.getUsername());

        return authService.changePassword(request)
                .map(response -> {
                    if (response.isSuccess()) {
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                });
    }

    @GetMapping("/password-expiry-status")
    public Mono<ResponseEntity<PasswordExpiryStatusResponse>> checkPasswordExpiry(@RequestParam String username) {
        log.info("GET /api/auth/password-expiry-status - Password expiry check for username: {}", username);

        return authService.checkPasswordExpiry(username)
                .map(ResponseEntity::ok);
    }
}
