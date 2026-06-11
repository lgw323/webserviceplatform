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
import { MOCK_DB } from './mockDb.js';

// ─── DATABASE AUTO-MIGRATION (POSTGRESQL) ───
export async function initDb() {
  if (!isPgAvailable) {
    console.warn('⚠️ [SYNCRIG DB] DATABASE_URL이 설정되지 않았습니다.');
    console.warn('⚠️ 인메모리 DB로 동작합니다 — 서버 재시작 시 모든 데이터가 삭제됩니다!');
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 프로덕션 환경에서 인메모리 DB 사용은 위험합니다. Vercel Postgres를 연결하세요.');
    }
    return;
  }

  try {
    const client = await pool.connect();
    console.log('[SYNCRIG DB] PostgreSQL 연결 성공. 테이블 생성을 확인합니다...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE,
        nickname VARCHAR(100),
        provider VARCHAR(50) NOT NULL DEFAULT 'local',
        provider_id VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        email_verified BOOLEAN DEFAULT false,
        role VARCHAR(20) DEFAULT 'user',
        linked_providers JSONB DEFAULT '[]'::jsonb NOT NULL,
        subscription_status VARCHAR(50) DEFAULT 'free' NOT NULL,
        toss_payment_key VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(provider, provider_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS email_verification_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
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

      // 1. SELECT FROM users WHERE email = $1
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from users') && normalizedQuery.includes('email =')) {
        const email = params[0];
        const found = MOCK_DB.users.find(u => u.email === email);
        return { rows: found ? [found] : [] };
      }

      // 1.5 SELECT FROM users WHERE provider = $1 AND provider_id = $2
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from users') && normalizedQuery.includes('provider =') && normalizedQuery.includes('provider_id =')) {
        const provider = params[0];
        const providerId = params[1];
        const found = MOCK_DB.users.find(u => u.provider === provider && u.provider_id === providerId);
        return { rows: found ? [found] : [] };
      }

      // 1.8 SELECT FROM users WHERE id = $1
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from users') && normalizedQuery.includes('id =')) {
        const id = params[0];
        const found = MOCK_DB.users.find(u => u.id === id);
        return { rows: found ? [found] : [] };
      }

      // 2. INSERT INTO users
      if (normalizedQuery.includes('insert into users')) {
        const id = crypto.randomUUID();
        // Check params length to decide format
        // For oauth: INSERT INTO users (provider, provider_id, linked_providers) VALUES ($1, $2, $3)
        // For local: INSERT INTO users (email, nickname, provider, provider_id, password_hash) VALUES ($1, $2, $3, $4, $5)
        if (params.length === 3) {
          const [provider, providerId, linkedProviders] = params;
          const newUser = { 
            id, 
            email: null,
            nickname: 'User_' + providerId.substring(0, 5),
            provider, 
            provider_id: providerId, 
            password_hash: null, 
            email_verified: false,
            role: 'user',
            linked_providers: linkedProviders === '[]' ? [] : JSON.parse(linkedProviders), 
            subscription_status: 'free',
            toss_payment_key: null,
            created_at: new Date() 
          };
          MOCK_DB.users.push(newUser);
          return { rows: [newUser] };
        } else {
          const [email, nickname, provider, providerId, passwordHash] = params;
          const newUser = { 
            id, 
            email,
            nickname,
            provider, 
            provider_id: providerId, 
            password_hash: passwordHash, 
            email_verified: false,
            role: email === 'admin@syncrig.com' ? 'admin' : 'user',
            linked_providers: [], 
            subscription_status: 'free',
            toss_payment_key: null,
            created_at: new Date() 
          };
          MOCK_DB.users.push(newUser);
          return { rows: [newUser] };
        }
      }

      // 2.2 UPDATE users (email_verified)
      if (normalizedQuery.includes('update users') && normalizedQuery.includes('email_verified = true')) {
        const email = params[0];
        const user = MOCK_DB.users.find(u => u.email === email);
        if (user) user.email_verified = true;
        return { rowCount: user ? 1 : 0 };
      }

      // 2.5. UPDATE users (linked_providers)
      if (normalizedQuery.includes('update users') && normalizedQuery.includes('linked_providers =')) {
         const linkedProvidersStr = params[0];
         const userId = params[1];
         const userIndex = MOCK_DB.users.findIndex(u => u.id === userId);
         if (userIndex !== -1) {
             try {
                 MOCK_DB.users[userIndex].linked_providers = JSON.parse(linkedProvidersStr);
             } catch (e) {
                 MOCK_DB.users[userIndex].linked_providers = linkedProvidersStr;
             }
             return { rows: [MOCK_DB.users[userIndex]] };
         }
         return { rows: [] };
      }

      // 2.6 UPDATE users (subscription_status)
      if (normalizedQuery.includes('update users') && normalizedQuery.includes("subscription_status = 'premium'")) {
        // Extract userId from query string if it was hardcoded for mock
        const match = text.match(/id = '([^']+)'/);
        const userId = match ? match[1] : params[1];
        const userIndex = MOCK_DB.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            MOCK_DB.users[userIndex].subscription_status = 'premium';
            MOCK_DB.users[userIndex].toss_payment_key = params[0];
            return { rowCount: 1 };
        }
        return { rowCount: 0 };
      }

      // 3. SELECT FROM hardware_profiles WHERE user_id = $1
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from hardware_profiles')) {
        const userId = params[0];
        const rows = MOCK_DB.hardware_profiles.filter(hp => hp.user_id === userId);
        return { rows };
      }

      // 3.5. email_verification_codes
      if (normalizedQuery.includes('insert into email_verification_codes')) {
        const [email, code, expires_at] = params;
        MOCK_DB.email_verification_codes.push({ id: crypto.randomUUID(), email, code, expires_at, used: false });
        return { rowCount: 1 };
      }
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from email_verification_codes')) {
        const email = params[0];
        const found = MOCK_DB.email_verification_codes
          .filter(c => c.email === email && !c.used)
          .sort((a, b) => new Date(b.expires_at) - new Date(a.expires_at))[0];
        return { rows: found ? [found] : [] };
      }
      if (normalizedQuery.includes('update email_verification_codes') && normalizedQuery.includes('used = true')) {
        const id = params[0];
        const code = MOCK_DB.email_verification_codes.find(c => c.id === id);
        if (code) code.used = true;
        return { rowCount: code ? 1 : 0 };
      }

      // 4. INSERT INTO hardware_profiles
      if (normalizedQuery.includes('insert into hardware_profiles')) {
        const id = crypto.randomUUID();
        const [user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate] = params;
        const newProfile = { id, user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate, created_at: new Date() };
        MOCK_DB.hardware_profiles.push(newProfile);
        return { rows: [newProfile] };
      }

      // 5. POSTS
      if (normalizedQuery.includes('insert into posts')) {
        const [user_id, title, content] = params;
        const newPost = { id: crypto.randomUUID(), user_id, title, content, views: 0, likes: 0, created_at: new Date() };
        if (!MOCK_DB.posts) MOCK_DB.posts = [];
        MOCK_DB.posts.push(newPost);
        return { rows: [newPost] };
      }
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from posts')) {
        if (!MOCK_DB.posts) MOCK_DB.posts = [];
        if (normalizedQuery.includes('where p.id = $1') || (normalizedQuery.includes('where id = $1') && !normalizedQuery.includes('users'))) {
          const p = MOCK_DB.posts.find(x => x.id === params[0]);
          if (p) {
            const user = MOCK_DB.users.find(u => u.id === p.user_id) || {};
            return { rows: [{ ...p, nickname: user.nickname, email: user.email }] };
          }
          return { rows: [] };
        }
        // List all
        const rows = MOCK_DB.posts.map(p => {
           const user = MOCK_DB.users.find(u => u.id === p.user_id) || {};
           return { ...p, nickname: user.nickname, email: user.email };
        }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        return { rows };
      }
      if (normalizedQuery.includes('update posts') && normalizedQuery.includes('views = views + 1')) {
        if (!MOCK_DB.posts) MOCK_DB.posts = [];
        const p = MOCK_DB.posts.find(x => x.id === params[0]);
        if (p) p.views += 1;
        return { rowCount: p ? 1 : 0 };
      }

      // 6. COMMENTS
      if (normalizedQuery.includes('insert into comments')) {
        const [post_id, user_id, content] = params;
        const newComment = { id: crypto.randomUUID(), post_id, user_id, content, created_at: new Date() };
        if (!MOCK_DB.comments) MOCK_DB.comments = [];
        MOCK_DB.comments.push(newComment);
        return { rows: [newComment] };
      }
      if (normalizedQuery.includes('select') && normalizedQuery.includes('from comments') && normalizedQuery.includes('post_id = $1')) {
        if (!MOCK_DB.comments) MOCK_DB.comments = [];
        const rows = MOCK_DB.comments.filter(c => c.post_id === params[0]).map(c => {
           const user = MOCK_DB.users.find(u => u.id === c.user_id) || {};
           return { ...c, nickname: user.nickname, email: user.email };
        }).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        return { rows };
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
