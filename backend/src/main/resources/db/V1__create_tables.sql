-- Tabela de Usuários
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       user_type VARCHAR(50) NOT NULL
);

-- Tabela de Veículos
CREATE TABLE vehicles (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          license_plate VARCHAR(255) NOT NULL UNIQUE,
                          owner_id BIGINT,
                          CONSTRAINT fk_vehicle_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Tabela de Localizações
CREATE TABLE localization (
                              id BIGSERIAL PRIMARY KEY,
                              latitude DOUBLE PRECISION NOT NULL,
                              longitude DOUBLE PRECISION NOT NULL,
                              timestamp TIMESTAMP WITHOUT TIME ZONE,
                              user_id BIGINT,
                              CONSTRAINT fk_user_localization FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices de Performance
CREATE INDEX idx_localization_timestamp ON localization (timestamp);