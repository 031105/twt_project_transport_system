const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  authenticateToken
} = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
  preferredLanguage: Joi.string().valid('en', 'ms', 'zh').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// POST /api/auth/register - User Registration
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, gender, preferredLanguage } = value;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email',
        code: 'USER_EXISTS'
      });
    }

    // Create new user
    const userId = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      preferredLanguage
    });

    // Generate tokens
    const tokenPayload = { userId, email };
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'user'
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken
      }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/signup - User Signup (alias for register)
router.post('/signup', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, gender, preferredLanguage } = value;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email',
        code: 'USER_EXISTS'
      });
    }

    // Create new user (not verified initially)
    const userId = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      preferredLanguage
    });

    // Generate OTP for email verification
    const otpCode = await User.createOTP(email, 'signup_verification', userId);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role: 'user',
          emailVerified: false
        },
        requiresEmailVerification: true,
        otpCode: otpCode // In production, remove this - OTP should only be sent via email
      }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - User Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const { email, password } = value;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Account locking temporarily disabled for development

    // Check for temporary password first
    let isValidPassword = false;
    let isTempPassword = false;
    
    if (user.temp_password_hash) {
      const tempResult = await User.verifyTempPassword(email, password);
      if (tempResult.success) {
        isValidPassword = true;
        isTempPassword = true;
        // Clear temp password after successful login
        await User.clearTempPassword(user.id);
      }
    }
    
    // If not temp password, verify regular password
    if (!isValidPassword) {
      isValidPassword = await User.verifyPassword(password, user.password_hash);
    }
    
    if (!isValidPassword) {
      // Increment failed login attempts
      await User.incrementFailedLogin(email);
      
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role || 'user',
          emailVerified: user.email_verified
        },
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken
        },
        // Flag if user logged in with temporary password
        isTempPassword: isTempPassword,
        ...(isTempPassword && { 
          requiresPasswordChange: true,
          message: 'You have logged in with a temporary password. Please change your password immediately.'
        })
      }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh - Refresh Access Token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new access token
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateToken(tokenPayload);

    res.json({
      message: 'Token refreshed successfully',
      tokens: {
        access: accessToken,
        refresh: refreshToken // Keep the same refresh token
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    next(error);
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    message: 'Logged out successfully'
  });
});

// POST /api/auth/forgot-password - Request Password Reset
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const { email } = value;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        message: 'If the email exists, a temporary password has been sent'
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8); // 8 character temp password
    await User.setTempPassword(email, tempPassword);

    res.json({
      message: 'If the email exists, a temporary password has been sent',
      // In development, include temp password for testing
      ...(process.env.NODE_ENV === 'development' && { tempPassword })
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/change-password - Change Password (Authenticated)
router.post('/change-password', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const { currentPassword, newPassword } = value;

    // Get current user with password hash
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    await User.changePassword(user.id, newPassword);

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify-email - Verify Email with OTP
router.post('/verify-email', async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        error: 'Email and OTP code are required',
        code: 'MISSING_FIELDS'
      });
    }

    const result = await User.verifyOTP(email, otpCode, 'signup_verification');
    
    if (!result.success) {
      // Increment attempt counter
      await User.incrementOTPAttempts(email, otpCode, 'signup_verification');
      
      return res.status(400).json({
        error: result.error,
        code: 'VERIFICATION_FAILED'
      });
    }

    // Get user details and generate tokens
    const user = await User.findById(result.userId);
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      message: 'Email verified successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          emailVerified: true
        },
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/resend-verification - Resend verification OTP
router.post('/resend-verification', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        code: 'MISSING_EMAIL'
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED'
      });
    }

    // Generate new OTP
    const otpCode = await User.createOTP(email, 'signup_verification', user.id);

    res.json({
      message: 'Verification code resent successfully',
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otpCode })
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Get Current User Profile
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        profileImageUrl: user.profile_image_url,
        preferredLanguage: user.preferred_language,
        timezone: user.timezone,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile - Update User Profile (Authenticated)
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const updateData = req.body;
    const userId = req.user.id; // Changed from req.user.userId to req.user.id

    console.log('Profile update request:', { userId, updateData });

    if (!userId) {
      return res.status(400).json({
        error: 'User ID not found in token',
        code: 'INVALID_TOKEN'
      });
    }

    // Update user profile
    await User.updateProfile(userId, updateData);

    // Get updated user data
    const updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found after update',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log('Profile updated successfully for user:', userId);

    res.json({
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          emailVerified: updatedUser.email_verified,
          phoneVerified: updatedUser.phone_verified,
          dateOfBirth: updatedUser.date_of_birth,
          gender: updatedUser.gender,
          profileImageUrl: updatedUser.profile_image_url,
          preferredLanguage: updatedUser.preferred_language,
          timezone: updatedUser.timezone,
          marketingConsent: updatedUser.marketing_consent,
          emailNotifications: updatedUser.email_notifications,
          smsNotifications: updatedUser.sms_notifications
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    next(error);
  }
});

// DELETE /api/auth/profile - Delete User Account (Authenticated)
router.delete('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId to req.user.id
    const userEmail = req.user.email;

    // Delete user account and all related data
    await User.deleteAccount(userId);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 