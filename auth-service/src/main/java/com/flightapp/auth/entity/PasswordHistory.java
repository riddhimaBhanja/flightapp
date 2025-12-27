package com.flightapp.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("password_history")
public class PasswordHistory {

    @Id
    private Long id;

    private Long userId;

    private String passwordHash;

    private LocalDateTime changedAt;
}
