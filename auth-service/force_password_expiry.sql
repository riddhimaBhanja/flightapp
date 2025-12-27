-- Force admin password to be expired (set last_password_changed to 10 seconds ago)
UPDATE users 
SET last_password_changed = DATE_SUB(NOW(), INTERVAL 10 SECOND)
WHERE username = 'admin';

-- Verify the change
SELECT 
    username,
    last_password_changed,
    TIMESTAMPDIFF(SECOND, last_password_changed, NOW()) as seconds_since_change,
    'Password should be expired (>5 seconds)' as status
FROM users 
WHERE username = 'admin';
