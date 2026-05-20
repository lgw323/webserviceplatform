-- SYNCRIG Database Schema Definition
-- PostgreSQL Syntax

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,           -- e.g., 'steam', 'riot'
    provider_id VARCHAR(255) NOT NULL,      -- platform specific user identification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(provider, provider_id)
);

-- 2. hardware_profiles table
CREATE TABLE IF NOT EXISTS hardware_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false NOT NULL,
    cpu_model VARCHAR(250) NOT NULL,         -- e.g., 'AMD Ryzen 7 7800X3D'
    gpu_model VARCHAR(250) NOT NULL,         -- e.g., 'NVIDIA GeForce RTX 4070 SUPER'
    ram_gb INT NOT NULL,                     -- e.g., 16, 32
    resolution VARCHAR(50) NOT NULL,         -- e.g., 'FHD', 'QHD', '4K'
    refresh_rate INT NOT NULL,               -- e.g., 144, 240
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_app_id VARCHAR(255) NOT NULL UNIQUE,  -- Steam AppID or Riot Match ID
    title VARCHAR(255) NOT NULL,             -- e.g., 'Cyberpunk 2077'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. optimization_profiles table
CREATE TABLE IF NOT EXISTS optimization_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    hardware_id UUID NOT NULL REFERENCES hardware_profiles(id) ON DELETE CASCADE,
    settings_json JSONB NOT NULL,            -- detailed graphical settings
    avg_fps FLOAT NOT NULL,                  -- average fps measured
    one_percent_low_fps FLOAT,               -- 1% low fps (optional)
    game_version VARCHAR(50) NOT NULL,       -- e.g., 'v2.12'
    likes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index optimization for similarity matching
CREATE INDEX IF NOT EXISTS idx_hardware_gpu ON hardware_profiles(gpu_model);
CREATE INDEX IF NOT EXISTS idx_optimization_game ON optimization_profiles(game_id);
