/**
 * SYNCRIG Global Error handling middlewares
 * Implements robust validation and error handling for REST APIs.
 */

// 1. Request Validation Middleware
export function validateHardwareInput(req, res, next) {
  const { cpu_model, gpu_model, ram_gb, resolution, refresh_rate } = req.body;

  if (!cpu_model || typeof cpu_model !== 'string' || cpu_model.trim() === '') {
    return res.status(400).json({ status: 'error', code: 'INVALID_CPU', message: '올바른 CPU 모델명을 입력해 주세요.' });
  }
  if (!gpu_model || typeof gpu_model !== 'string' || gpu_model.trim() === '') {
    return res.status(400).json({ status: 'error', code: 'INVALID_GPU', message: '올바른 GPU 모델명을 입력해 주세요.' });
  }
  
  const ram = parseInt(ram_gb, 10);
  if (isNaN(ram) || ram <= 0 || ram > 256) {
    return res.status(400).json({ status: 'error', code: 'INVALID_RAM', message: 'RAM 용량은 1GB에서 256GB 사이여야 합니다.' });
  }

  const hz = parseInt(refresh_rate, 10);
  if (isNaN(hz) || hz < 60 || hz > 500) {
    return res.status(400).json({ status: 'error', code: 'INVALID_REFRESH_RATE', message: '주사율은 60Hz에서 500Hz 사이여야 합니다.' });
  }

  next();
}

// 2. 404 Route Not Found Middleware
export function handleNotFound(req, res, next) {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: '요청하신 API 엔드포인트가 존재하지 않습니다.'
  });
}

// 3. Centralized Exception Handler
export function handleExceptions(err, req, res, next) {
  console.error(`[SYNCRIG ERROR LOG] ${new Date().toISOString()}:`, err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || '서버 내부에서 예상치 못한 에러가 발생했습니다.'
  });
}
