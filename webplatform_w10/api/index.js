import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './db.js';
import { hashPassword, verifyPassword, generateToken, authenticateToken } from './auth.js';
import { getRecommendedProfiles } from './matchingEngine.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB schema asynchronously
initDb();

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    db_mode: db.isPgActive() ? 'PostgreSQL' : 'In-Memory Fallback',
    service: 'SYNCRIG API Server'
  });
});

// ─── Auth Routes ───
app.post('/api/v1/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: '아이디와 비밀번호를 입력해주세요.' });
    }

    // Check if user exists
    const userCheck = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['local', username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: '이미 가입된 아이디입니다.' });
    }

    const passwordHash = hashPassword(password);
    const result = await db.query(
      'INSERT INTO users (provider, provider_id, password_hash) VALUES ($1, $2, $3) RETURNING id, provider, provider_id',
      ['local', username, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      data: { access_token: token, user }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: '아이디와 비밀번호를 입력해주세요.' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['local', username]
    );

    const user = result.rows[0];
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ status: 'error', message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = generateToken(user);
    res.json({
      status: 'success',
      data: {
        access_token: token,
        user: { id: user.id, provider: user.provider, provider_id: user.provider_id }
      }
    });
  } catch (err) {
    next(err);
  }
});

// OAuth Callback simulator (Steam / Riot Games)
app.get('/api/v1/auth/:provider/callback', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ status: 'error', message: 'Authorization Code가 필요합니다.' });
    }

    // Simulate account verification and register user
    const mockId = `external_${provider}_${code}`;
    
    // Find or create external user
    let result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, mockId]
    );

    let user = result.rows[0];
    if (!user) {
      const insertResult = await db.query(
        'INSERT INTO users (provider, provider_id) VALUES ($1, $2) RETURNING id, provider, provider_id',
        [provider, mockId]
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);
    res.json({
      status: 'success',
      data: { access_token: token, user }
    });
  } catch (err) {
    next(err);
  }
});

// ─── Hardware Profile Routes ───
app.get('/api/v1/users/hardware-profiles', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM hardware_profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/users/hardware-profiles', authenticateToken, async (req, res, next) => {
  try {
    const { cpu_model, gpu_model, ram_gb, resolution, refresh_rate, is_default } = req.body;

    if (!cpu_model || !gpu_model || !ram_gb || !resolution || !refresh_rate) {
      return res.status(400).json({
        status: 'error',
        message: '하드웨어 정보(CPU, GPU, RAM, 해상도, 주사율)는 모두 필수입니다.'
      });
    }

    // If setting default, first clear defaults of this user
    if (is_default && db.isPgActive()) {
      await db.query(
        'UPDATE hardware_profiles SET is_default = false WHERE user_id = $1',
        [req.user.id]
      );
    }

    const result = await db.query(
      `INSERT INTO hardware_profiles 
       (user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.user.id,
        is_default || false,
        cpu_model,
        gpu_model,
        parseInt(ram_gb),
        resolution,
        parseInt(refresh_rate)
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Hardware profile created successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

app.patch('/api/v1/users/hardware-profiles/:id/default', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (db.isPgActive()) {
      await db.query(
        'UPDATE hardware_profiles SET is_default = false WHERE user_id = $1',
        [req.user.id]
      );
      await db.query(
        'UPDATE hardware_profiles SET is_default = true WHERE id = $1 AND user_id = $2',
        [id, req.user.id]
      );
    } else {
      await db.query('UPDATE hardware_profiles SET is_default = true WHERE id = $1', [id]);
    }

    res.json({ status: 'success', message: '기본 프로필이 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/v1/users/hardware-profiles/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM hardware_profiles WHERE id = $1',
      [id]
    );
    res.json({ status: 'success', message: '하드웨어 프로필이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// ─── Optimization Recommendation Route ───
app.get('/api/v1/profiles/recommendations', authenticateToken, async (req, res, next) => {
  try {
    const { cpu_model, gpu_model, ram_gb, resolution, game_id, threshold } = req.query;

    const userSpec = {
      cpu_model: cpu_model || '',
      gpu_model: gpu_model || '',
      ram_gb: parseInt(ram_gb) || 16,
      resolution: resolution || 'FHD'
    };

    const targetThreshold = parseFloat(threshold) || 0.8;

    // Fetch all profiles
    let profilesResult = await db.query('SELECT * FROM optimization_profiles');
    let dbProfiles = profilesResult.rows;

    // Run matching engine
    const recommendations = getRecommendedProfiles(userSpec, dbProfiles, targetThreshold);

    res.json({
      status: 'success',
      data: {
        userSpec,
        recommendations
      }
    });
  } catch (err) {
    next(err);
  }
});

// ─── External Games Sync API ───
app.get('/api/v1/games/library', authenticateToken, (req, res) => {
  // Return simulated synced library data
  res.json({
    status: 'success',
    data: {
      games: [
        { id: 1, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'Steam' },
        { id: 2, title: 'Valorant', playtime: 450, lastPlayed: 'Yesterday', platform: 'Riot Games' },
        { id: 3, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'Steam' },
        { id: 4, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'Steam' }
      ]
    }
  });
});

// ─── Global Error Handler ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || '서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  });
});

export default app;
