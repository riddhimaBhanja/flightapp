SELECT 
    username,
    last_password_changed,
    TIMESTAMPDIFF(SECOND, last_password_changed, NOW()) as seconds_since_change,
    created_at
FROM users 
WHERE username = 'admin';
