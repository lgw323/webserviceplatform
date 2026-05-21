export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || '서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  });
}
