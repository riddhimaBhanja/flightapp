-- Migration script to update existing users table and create password_history table
-- Run this script if you have an existing database

-- Step 1: Add new columns to existing users table (if they don't exist)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_password_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_expiry_days INT DEFAULT 90,
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT FALSE;

-- Step 2: Update existing users with default values for new columns
UPDATE users
SET last_password_changed = COALESCE(last_password_changed, created_at),
    password_expiry_days = COALESCE(password_expiry_days, 90),
    force_password_change = COALESCE(force_password_change, FALSE)
WHERE last_password_changed IS NULL
   OR password_expiry_days IS NULL
   OR force_password_change IS NULL;

-- Step 3: Make columns NOT NULL after setting defaults
ALTER TABLE users
MODIFY COLUMN last_password_changed TIMESTAMP NOT NULL,
MODIFY COLUMN password_expiry_days INT NOT NULL,
MODIFY COLUMN force_password_change BOOLEAN NOT NULL;

-- Step 4: Create password_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_changed_at (changed_at)
);

-- Verification queries (optional - comment out if not needed)
-- SELECT COUNT(*) as user_count,
--        COUNT(last_password_changed) as has_last_changed,
--        COUNT(password_expiry_days) as has_expiry_days,
--        COUNT(force_password_change) as has_force_change
-- FROM users;

-- SELECT * FROM password_history LIMIT 10;
