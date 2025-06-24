const { executeQuery } = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  // Create new user
  static async create(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'user',
      dateOfBirth,
      gender,
      preferredLanguage = 'en'
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    const query = `
      INSERT INTO users (
        id, email, password_hash, first_name, last_name, role
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(query, [
      userId, email, hashedPassword, firstName, lastName, role
    ]);

    return userId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, phone, 
             role, is_active, email_verified, temp_password_hash, 
             temp_password_expires_at, created_at, updated_at
      FROM users 
      WHERE email = ?
    `;
    
    const results = await executeQuery(query, [email]);
    return results[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, phone, 
             role, is_active, email_verified, phone_verified, date_of_birth,
             gender, profile_image_url, preferred_language, timezone,
             marketing_consent, email_notifications, sms_notifications,
             created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    
    const results = await executeQuery(query, [id]);
    return results[0] || null;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(userId) {
    const query = `
      UPDATE users 
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(query, [userId]);
  }

  // Increment failed login attempts
  static async incrementFailedLogin(email) {
    // Simplified for now - just log the failed attempt
    console.log(`Failed login attempt for email: ${email}`);
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    const allowedFields = [
      'first_name', 'last_name', 'phone', 'date_of_birth', 
      'gender', 'profile_image_url', 'preferred_language', 
      'timezone', 'marketing_consent', 'email_notifications', 'sms_notifications'
    ];

    const fieldsToUpdate = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId);

    const query = `
      UPDATE users 
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(query, values);
  }

  // Email verification methods
  static async verifyEmail(userId) {
    const query = `
      UPDATE users 
      SET email_verified = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(query, [userId]);
  }

  // Create OTP for email verification or password reset
  static async createOTP(email, purpose, userId = null) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    
    if (purpose === 'signup_verification') {
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes for signup
    } else {
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes for password reset
    }

    // Delete any existing OTPs for this email and purpose
    await executeQuery(
      'DELETE FROM email_verifications WHERE email = ? AND purpose = ?',
      [email, purpose]
    );

    // Insert new OTP
    const query = `
      INSERT INTO email_verifications (id, user_id, email, otp_code, purpose, expires_at)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;

    await executeQuery(query, [userId, email, otpCode, purpose, expiresAt]);
    return otpCode;
  }

  // Verify OTP
  static async verifyOTP(email, otpCode, purpose) {
    const query = `
      SELECT id, user_id, attempts, max_attempts, expires_at
      FROM email_verifications 
      WHERE email = ? AND otp_code = ? AND purpose = ? AND verified_at IS NULL
    `;
    
    const results = await executeQuery(query, [email, otpCode, purpose]);
    const verification = results[0];
    
    if (!verification) {
      return { success: false, error: 'Invalid or expired OTP code' };
    }

    // Check if expired
    if (new Date() > new Date(verification.expires_at)) {
      return { success: false, error: 'OTP code has expired' };
    }

    // Check attempts
    if (verification.attempts >= verification.max_attempts) {
      return { success: false, error: 'Maximum verification attempts exceeded' };
    }

    // Mark as verified
    await executeQuery(
      'UPDATE email_verifications SET verified_at = NOW() WHERE id = ?',
      [verification.id]
    );

    // If it's email verification, mark user as verified
    if (purpose === 'signup_verification' && verification.user_id) {
      await this.verifyEmail(verification.user_id);
    }

    return { success: true, userId: verification.user_id };
  }

  // Increment OTP attempts
  static async incrementOTPAttempts(email, otpCode, purpose) {
    await executeQuery(
      'UPDATE email_verifications SET attempts = attempts + 1 WHERE email = ? AND otp_code = ? AND purpose = ?',
      [email, otpCode, purpose]
    );
  }

  // Set temporary password
  static async setTempPassword(email, tempPassword) {
    const hashedTempPassword = await bcrypt.hash(tempPassword, 12);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    const query = `
      UPDATE users 
      SET temp_password_hash = ?, temp_password_expires_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `;

    await executeQuery(query, [hashedTempPassword, expiresAt, email]);
  }

  // Verify temporary password
  static async verifyTempPassword(email, tempPassword) {
    const query = `
      SELECT id, temp_password_hash, temp_password_expires_at
      FROM users 
      WHERE email = ? AND temp_password_hash IS NOT NULL
    `;
    
    const results = await executeQuery(query, [email]);
    const user = results[0];
    
    if (!user || !user.temp_password_hash) {
      return { success: false, error: 'No temporary password found' };
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(user.temp_password_expires_at);
    
    if (now > expiresAt) {
      // Clear expired temp password
      await executeQuery(
        'UPDATE users SET temp_password_hash = NULL, temp_password_expires_at = NULL WHERE id = ?',
        [user.id]
      );
      return { success: false, error: 'Temporary password has expired' };
    }

    // Verify password
    const isValid = await bcrypt.compare(tempPassword, user.temp_password_hash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid temporary password' };
    }

    return { success: true, userId: user.id };
  }

  // Clear temporary password after successful login
  static async clearTempPassword(userId) {
    const query = `
      UPDATE users 
      SET temp_password_hash = NULL, temp_password_expires_at = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(query, [userId]);
  }

  // Change password
  static async changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const query = `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(query, [hashedPassword, userId]);
  }

  // Get user statistics
  static async getUserStats() {
    const query = `
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_30d
      FROM users
    `;
    
    const results = await executeQuery(query);
    return results[0];
  }

  // Search users (admin only)
  static async searchUsers(searchTerm, limit = 50, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, 
             is_active, email_verified, last_login_at, created_at
      FROM users 
      WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await executeQuery(query, [searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  // Delete user account and all related data
  static async deleteAccount(userId) {
    // Delete related data first (due to foreign key constraints)
    await executeQuery('DELETE FROM email_verifications WHERE user_id = ?', [userId]);
    await executeQuery('DELETE FROM bookings WHERE user_id = ?', [userId]);
    
    // Delete the user account
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);
  }
}

module.exports = User; 