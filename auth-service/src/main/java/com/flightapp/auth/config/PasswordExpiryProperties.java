package com.flightapp.auth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "password.expiry")
@Data
public class PasswordExpiryProperties {

    /**
     * Demo mode flag
     * If true, password expires after demoSeconds
     * If false, password expires after productionDays
     */
    private boolean demoMode = true;

    /**
     * Password expiry duration in seconds for demo mode
     * Default: 5 seconds
     */
    private int demoSeconds = 5;

    /**
     * Password expiry duration in days for production mode
     * Default: 90 days
     */
    private int productionDays = 90;

    /**
     * Get the expiry duration in seconds based on the current mode
     * @return expiry duration in seconds
     */
    public long getExpiryDurationInSeconds() {
        if (demoMode) {
            return demoSeconds;
        } else {
            return (long) productionDays * 24 * 60 * 60; // Convert days to seconds
        }
    }

    /**
     * Get the expiry duration in days based on the current mode
     * @return expiry duration in days
     */
    public int getExpiryDurationInDays() {
        if (demoMode) {
            return 1; // For demo mode, consider it as less than 1 day
        } else {
            return productionDays;
        }
    }
}
