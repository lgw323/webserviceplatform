import app from './api/index.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SYNCRIG Local Server] Running on http://localhost:${PORT}`);
  console.log(`[SYNCRIG Local Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SYNCRIG Local Server] DB mode: ${process.env.DATABASE_URL ? 'PostgreSQL (Active)' : 'In-Memory Mock Fallback (Active)'}`);
});
