const errorHandler = (err, req, res, next) => {
  console.error('Error caught by global handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  };

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    error.statusCode = 409;
    error.message = 'Duplicate entry. This record already exists.';
    error.code = 'DUPLICATE_ENTRY';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error.statusCode = 400;
    error.message = 'Referenced record does not exist.';
    error.code = 'INVALID_REFERENCE';
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    error.statusCode = 400;
    error.message = 'Cannot delete record. It is referenced by other records.';
    error.code = 'REFERENCE_CONSTRAINT';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token.';
    error.code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired.';
    error.code = 'TOKEN_EXPIRED';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = err.details ? err.details[0].message : 'Validation failed.';
    error.code = 'VALIDATION_ERROR';
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.statusCode = 400;
    error.message = 'File too large.';
    error.code = 'FILE_TOO_LARGE';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.statusCode = 400;
    error.message = 'Unexpected file field.';
    error.code = 'UNEXPECTED_FILE';
  }

  // Custom application errors
  if (err.name === 'BookingError') {
    error.statusCode = 400;
    error.code = 'BOOKING_ERROR';
  }

  if (err.name === 'PaymentError') {
    error.statusCode = 402;
    error.code = 'PAYMENT_ERROR';
  }

  if (err.name === 'AuthorizationError') {
    error.statusCode = 403;
    error.message = 'Insufficient permissions.';
    error.code = 'INSUFFICIENT_PERMISSIONS';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
    error.message = 'Something went wrong. Please try again later.';
  }

  res.status(error.statusCode).json({
    error: error.message,
    code: error.code,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
};

module.exports = errorHandler; 