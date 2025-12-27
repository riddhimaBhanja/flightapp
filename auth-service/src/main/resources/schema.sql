CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_password_changed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password_expiry_days INT NOT NULL DEFAULT 90,
    force_password_change BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Password history table for tracking previous passwords (prevent reuse)
CREATE TABLE IF NOT EXISTS password_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_changed_at (changed_at)
);

-- Insert a default admin user (password: admin123)
INSERT INTO users (username, password, email, first_name, last_name, role, enabled)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@flightapp.com', 'Admin', 'User', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE username=username;
