package com.flightapp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordExpiryStatusResponse {

    private boolean passwordExpired;
    private boolean forcePasswordChange;
    private LocalDateTime lastPasswordChanged;
    private int passwordExpiryDays;
    private int daysUntilExpiry;
    private String message;
}
