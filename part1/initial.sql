INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('david', 'david@example.com', 'hashed101', 'owner'),
('emily', 'emily@example.com', 'hashed202', 'owner');

INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'david'), 'Charlie', 'large'),
((SELECT user_id FROM Users WHERE username = 'emily'), 'Luna', 'medium'),
((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Buddy', 'small');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')),
 '2025-06-10 08:00:00', 30, 'Parklands', 'open'),

((SELECT dog_id FROM Dogs WHERE name = 'Bella' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')),
 '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),

((SELECT dog_id FROM Dogs WHERE name = 'Charlie' AND owner_id = (SELECT user_id FROM Users WHERE username = 'davidK9')),
 '2025-06-11 07:15:00', 60, 'Lakeview Trail', 'open'),

((SELECT dog_id FROM Dogs WHERE name = 'Luna' AND owner_id = (SELECT user_id FROM Users WHERE username = 'emilyo')),
 '2025-06-12 18:00:00', 30, 'Downtown Park', 'completed'),

((SELECT dog_id FROM Dogs WHERE name = 'Buddy' AND owner_id = (SELECT user_id FROM Users WHERE username = 'bobwalker')),
 '2025-06-13 16:45:00', 40, 'Riverside Path', 'cancelled');
