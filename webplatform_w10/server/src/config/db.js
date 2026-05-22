import pg from 'pg';
import crypto from 'crypto';

const isPgAvailable = !!process.env.DATABASE_URL;
let pool = null;

if (isPgAvailable) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for hosting providers like Neon/Supabase
  });
}

// ─── IN-MEMORY FALLBACK DATABASE ───
const MOCK_DB = {
  users: [],
  hardware_profiles: [
    {
      id: 'hw-default-1',
      user_id: 'user-mock-id',
      is_default: true,
      cpu_model: 'AMD Ryzen 5 5600X',
      gpu_model: 'NVIDIA GeForce RTX 3060',
      ram_gb: 16,
      resolution: 'FHD',
      refresh_rate: 144,
      created_at: new Date()
    }
  ],
  games: [
    { id: 'game_cyberpunk', external_app_id: '1091500', title: 'Cyberpunk 2077', created_at: new Date() },
    { id: 'game_valorant', external_app_id: 'valorant', title: 'Valorant', created_at: new Date() },
    { id: 'game_elden', external_app_id: '1245620', title: 'Elden Ring', created_at: new Date() },
    { id: 'game_witcher3', external_app_id: '292030', title: 'The Witcher 3: Wild Hunt', created_at: new Date() }
  ],
  optimization_profiles: [
    {
      id: 'opt_001',
      user_id: 'user-mock-id',
      game_id: 'game_cyberpunk',
      hardware_id: 'hw-preset-1',
      hardware: { cpu_model: 'AMD Ryzen 7 7800X3D', gpu_model: 'NVIDIA GeForce RTX 4070 SUPER', ram_gb: 32, resolution: 'QHD' },
      settings_json: { 'Texture Quality': 'High', 'Ray Tracing': 'Ultra (DLSS Quality)', 'Shadow Quality': 'Medium', 'Crowd Density': 'High' },
      avg_fps: 88.5,
      game_version: 'v2.12',
      likes: 42,
      created_at: new Date()
    },
    {
      id: 'opt_002',
      user_id: 'user-mock-id',
      game_id: 'game_cyberpunk',
      hardware_id: 'hw-preset-2',
      hardware: { cpu_model: 'Intel Core i7-13700K', gpu_model: 'NVIDIA GeForce RTX 4070', ram_gb: 16, resolution: 'QHD' },
      settings_json: { 'Texture Quality': 'High', 'Ray Tracing': 'Medium', 'Shadow Quality': 'Medium', 'Crowd Density': 'Medium' },
      avg_fps: 74.2,
      game_version: 'v2.12',
      likes: 29,
      created_at: new Date()
    },
    {
      id: 'opt_003',
      user_id: 'user-mock-id',
      game_id: 'game_cyberpunk',
      hardware_id: 'hw-preset-3',
      hardware: { cpu_model: 'Intel Core i9-14900K', gpu_model: 'NVIDIA GeForce RTX 4090', ram_gb: 64, resolution: '4K' },
      settings_json: { 'Texture Quality': 'Ultra', 'Ray Tracing': 'Overdrive (Path Tracing)', 'Shadow Quality': 'Ultra', 'Crowd Density': 'High' },
      avg_fps: 95.0,
      game_version: 'v2.12',
      likes: 124,
      created_at: new Date()
    },
    {
      id: 'opt_004',
      user_id: 'user-mock-id',
      game_id: 'game_cyberpunk',
      hardware_id: 'hw-preset-4',
      hardware: { cpu_model: 'AMD Ryzen 5 5600X', gpu_model: 'NVIDIA GeForce RTX 3060', ram_gb: 16, resolution: 'FHD' },
      settings_json: { 'Texture Quality': 'Medium', 'Ray Tracing': 'Off', 'Shadow Quality': 'Low', 'Crowd Density': 'Medium' },
      avg_fps: 62.1,
      game_version: 'v2.11',
      likes: 56,
      created_at: new Date()
    }
  ]
};

// ─── DATABASE AUTO-MIGRATION (POSTGRESQL) ───
export async function initDb() {
  if (!isPgAvailable) {
    console.log('[SYNCRIG DB] DATABASE_URL이 감지되지 않았습니다. 인메모리 대체 데이터베이스로 동작합니다.');
    return;
  }

  try {
    const client = await pool.connect();
    console.log('[SYNCRIG DB] PostgreSQL 연결 성공. 테이블 생성을 확인합니다...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider VARCHAR(50) NOT NULL,
        provider_id VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(provider, provider_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS hardware_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_default BOOLEAN DEFAULT false NOT NULL,
        cpu_model VARCHAR(250) NOT NULL,
        gpu_model VARCHAR(250) NOT NULL,
        ram_gb INT NOT NULL,
        resolution VARCHAR(50) NOT NULL,
        refresh_rate INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        external_app_id VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS optimization_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        hardware_id UUID NOT NULL REFERENCES hardware_profiles(id) ON DELETE CASCADE,
        settings_json JSONB NOT NULL,
        avg_fps FLOAT NOT NULL,
        one_percent_low_fps FLOAT,
        game_version VARCHAR(50) NOT NULL,
        likes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_hardware_gpu ON hardware_profiles(gpu_model);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_optimization_game ON optimization_profiles(game_id);');

    // Seed Games if empty
    const gameCheck = await client.query('SELECT COUNT(*) FROM games');
    if (parseInt(gameCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO games (id, external_app_id, title) VALUES
        ('game_cyberpunk', '1091500', 'Cyberpunk 2077'),
        ('game_valorant', 'valorant', 'Valorant'),
        ('game_elden', '1245620', 'Elden Ring'),
        ('game_witcher3', '292030', 'The Witcher 3: Wild Hunt')
      `);
      console.log('[SYNCRIG DB] 기본 게임 목록 시딩 완료.');
    }

    client.release();
    console.log('[SYNCRIG DB] PostgreSQL 초기화 완료.');
  } catch (err) {
    console.error('[SYNCRIG DB] PostgreSQL 테이블 초기화 중 예외 발생:', err.message);
    console.log('[SYNCRIG DB] 인메모리 폴백 데이터베이스로 대체 기동합니다.');
  }
}

// ─── QUERY INTERFACE ───
export const db = {
  isPgActive: () => isPgAvailable,
  getClient: async () => {
    if (isPgAvailable) return await pool.connect();
    return null;
  },
  
  // Custom query implementation supporting both PG pool and In-memory simulation
  query: async (text, params = []) => {
    if (isPgAvailable) {
      try {
        return await pool.query(text, params);
      } catch (err) {
        console.error('[SYNCRIG DB Query Error]:', err.message);
        throw err;
      }
    } else {
      // Mock db basic parser for authentication & hardware profile endpoints
      const normalizedQuery = text.trim().replace(/\s+/g, ' ').toLowerCase();

      // 1. SELECT FROM users WHERE provider = $1 AND provider_id = $2
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from users')) {
        const provider = params[0];
        const providerId = params[1];
        const found = MOCK_DB.users.find(u => u.provider === provider && u.provider_id === providerId);
        return { rows: found ? [found] : [] };
      }

      // 2. INSERT INTO users
      if (normalizedQuery.includes('insert into users')) {
        const id = crypto.randomUUID();
        const provider = params[0];
        const providerId = params[1];
        const passwordHash = params[2];
        const newUser = { id, provider, provider_id: providerId, password_hash: passwordHash, created_at: new Date() };
        MOCK_DB.users.push(newUser);
        return { rows: [newUser] };
      }

      // 3. SELECT FROM hardware_profiles WHERE user_id = $1
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from hardware_profiles')) {
        const userId = params[0];
        const rows = MOCK_DB.hardware_profiles.filter(hp => hp.user_id === userId);
        return { rows };
      }

      // 4. INSERT INTO hardware_profiles
      if (normalizedQuery.includes('insert into hardware_profiles')) {
        const id = crypto.randomUUID();
        const user_id = params[0];
        const is_default = params[1] || false;
        const cpu_model = params[2];
        const gpu_model = params[3];
        const ram_gb = params[4];
        const resolution = params[5];
        const refresh_rate = params[6];

        if (is_default) {
          MOCK_DB.hardware_profiles.forEach(p => {
            if (p.user_id === user_id) p.is_default = false;
          });
        }

        const newProfile = { id, user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate, created_at: new Date() };
        MOCK_DB.hardware_profiles.push(newProfile);
        return { rows: [newProfile] };
      }

      // 5. UPDATE hardware_profiles (set default)
      if (normalizedQuery.includes('update hardware_profiles') && normalizedQuery.includes('is_default = true')) {
        const profileId = params[0];
        const profile = MOCK_DB.hardware_profiles.find(p => p.id === profileId);
        if (profile) {
          MOCK_DB.hardware_profiles.forEach(p => {
            if (p.user_id === profile.user_id) p.is_default = false;
          });
          profile.is_default = true;
        }
        return { rowCount: 1 };
      }

      // 6. DELETE FROM hardware_profiles
      if (normalizedQuery.includes('delete from hardware_profiles')) {
        const profileId = params[0];
        const index = MOCK_DB.hardware_profiles.findIndex(p => p.id === profileId);
        if (index !== -1) {
          const removed = MOCK_DB.hardware_profiles.splice(index, 1)[0];
          // Ensure at least one default remains if any left
          const siblings = MOCK_DB.hardware_profiles.filter(p => p.user_id === removed.user_id);
          if (siblings.length > 0 && !siblings.some(p => p.is_default)) {
            siblings[0].is_default = true;
          }
          return { rowCount: 1 };
        }
        return { rowCount: 0 };
      }

      // 7. SELECT FROM games
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from games')) {
        return { rows: MOCK_DB.games };
      }

      // 8. SELECT FROM optimization_profiles / recommendations
      if (normalizedQuery.includes('from optimization_profiles')) {
        const rows = MOCK_DB.optimization_profiles.map(op => {
          // Join mock hardware information
          return {
            ...op,
            hardware: op.hardware || MOCK_DB.hardware_profiles.find(hp => hp.id === op.hardware_id) || {
              cpu_model: 'AMD Ryzen 5 5600X', gpu_model: 'NVIDIA GeForce RTX 3060', ram_gb: 16, resolution: 'FHD', refresh_rate: 144
            }
          };
        });
        return { rows };
      }

      return { rows: [] };
    }
  }
};
