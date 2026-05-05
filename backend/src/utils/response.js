const sendSuccess = (res, statusCode, message, data = {}, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(Object.keys(meta).length ? { meta } : {}),
    data,
  });
};

module.exports = {
  sendSuccess,
};
