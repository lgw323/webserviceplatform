import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

export function errorHandler(err, req, res, next) {
  const traceId = req.traceId || 'unknown';
  logger.error({
    message: err.message,
    traceId,
    stack: err.stack,
    method: req.method,
    url: req.url
  });

  res.status(500).json({
    status: 'error',
    traceId,
    message: err.message || '서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  });
}
