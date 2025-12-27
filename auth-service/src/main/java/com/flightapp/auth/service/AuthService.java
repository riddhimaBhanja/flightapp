package com.flightapp.auth.service;

import com.flightapp.auth.dto.AuthRequest;
import com.flightapp.auth.dto.AuthResponse;
import com.flightapp.auth.dto.ChangePasswordRequest;
import com.flightapp.auth.dto.ChangePasswordResponse;
import com.flightapp.auth.dto.PasswordExpiryStatusResponse;
import com.flightapp.auth.dto.RegisterRequest;
import com.flightapp.auth.dto.ValidateTokenResponse;
import reactor.core.publisher.Mono;

public interface AuthService {

    Mono<AuthResponse> login(AuthRequest request);

    Mono<AuthResponse> register(RegisterRequest request);

    Mono<ValidateTokenResponse> validateToken(String token);

    Mono<ChangePasswordResponse> changePassword(ChangePasswordRequest request);

    Mono<PasswordExpiryStatusResponse> checkPasswordExpiry(String username);
}
