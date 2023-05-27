class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  console.log('에러핸들러드러옴', statusCode, message);
  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: message || '서버 에러 입니다.',
  });
};

module.exports = {
  AppError,
  errorHandler,
};
