import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    service: 'SYNCRIG API Server'
  });
});

// User API Routes Placeholder
app.post('/api/v1/users/hardware-profiles', (req, res) => {
  const { cpu_model, gpu_model, ram_gb, resolution, refresh_rate } = req.body;
  if (!cpu_model || !gpu_model || !ram_gb || !resolution || !refresh_rate) {
    return res.status(400).json({
      status: 'error',
      message: '필수 하드웨어 정보(CPU, GPU, RAM, 해상도, 주사율)가 누락되었습니다.'
    });
  }
  
  // mock database save logic
  res.status(201).json({
    status: 'success',
    message: '하드웨어 프로필이 성공적으로 저장되었습니다.',
    data: {
      profile_id: '550e8400-e29b-41d4-a716-446655440000',
      hardware: { cpu_model, gpu_model, ram_gb, resolution, refresh_rate }
    }
  });
});

// Express Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: '서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  });
});

app.listen(PORT, () => {
  console.log(`[SYNCRIG] Server is running on port ${PORT}`);
});

export default app;
