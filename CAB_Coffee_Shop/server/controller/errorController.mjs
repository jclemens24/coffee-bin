import AppError from '../utils/appError.mjs';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = err => {
  const value = err.errmsg.match(/\{(\s*?.*?)*?\}/);
  const message = `Duplicate field value: ${value} already exists`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors)
    .map(msg => msg.message)
    .join('. ');
  const messages = `Invalid input data. ${errors
    .charAt(0)
    .toUpperCase()}${errors.substring(1)}`;
  return new AppError(messages, 400);
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFields(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
