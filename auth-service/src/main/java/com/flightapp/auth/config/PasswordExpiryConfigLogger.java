package com.flightapp.auth.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PasswordExpiryConfigLogger implements CommandLineRunner {

    private final PasswordExpiryProperties passwordExpiryProperties;

    @Override
    public void run(String... args) {
        log.info("========================================");
        log.info("PASSWORD EXPIRY CONFIGURATION");
        log.info("========================================");
        log.info("Demo Mode: {}", passwordExpiryProperties.isDemoMode());
        log.info("Demo Seconds: {}", passwordExpiryProperties.getDemoSeconds());
        log.info("Production Days: {}", passwordExpiryProperties.getProductionDays());
        log.info("Current Expiry Duration: {} {}",
                passwordExpiryProperties.isDemoMode() ? 
                        passwordExpiryProperties.getDemoSeconds() : 
                        passwordExpiryProperties.getProductionDays(),
                passwordExpiryProperties.isDemoMode() ? "seconds" : "days");
        log.info("========================================");
    }
}
