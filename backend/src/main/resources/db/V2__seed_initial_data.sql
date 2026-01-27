-- Inserindo Motorista (Driver) - Senha: "password"
INSERT INTO users (username, password, user_type)
VALUES ('Seu zé do caminhão', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'DRIVER');

-- Inserindo Admin - Senha: "password"
INSERT INTO users (username, password, user_type)
VALUES ('Logistica LTDA', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- (Opcional) Inserindo um veículo para o motorista (assumindo que o ID do Zé é 1)
INSERT INTO vehicles (name, license_plate, owner_id)
VALUES ('Volvo FH 540', 'ABC-1234', 1);