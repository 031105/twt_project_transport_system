const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'development-jwt-secret-key-2024';
    const decoded = jwt.verify(token, secret);
    
    // Get user details
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token - user not found',
        code: 'INVALID_TOKEN'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      emailVerified: user.email_verified
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    next(error);
  }
};

// Middleware to check user role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware to check if user account is active
const requireActiveAccount = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      error: 'Account is deactivated',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }
  next();
};

// Middleware to check if email is verified (optional)
const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const secret = process.env.JWT_SECRET || 'development-jwt-secret-key-2024';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isActive: user.is_active,
          emailVerified: user.email_verified
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Generate JWT token
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'development-jwt-secret-key-2024';
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'development-refresh-jwt-secret-key-2024';
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'development-refresh-jwt-secret-key-2024';
  return jwt.verify(token, secret);
};

module.exports = {
  authenticateToken,
  requireRole,
  requireActiveAccount,
  requireEmailVerification,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
}; 