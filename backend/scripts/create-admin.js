/**
 * 创建管理员用户脚本
 * 
 * 使用方法：
 * node scripts/create-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'transport_booking',
};

// 管理员用户信息
const adminUser = {
  email: 'admin@example.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

async function createAdminUser() {
  let connection;
  
  try {
    console.log('连接到数据库...');
    connection = await mysql.createConnection(dbConfig);
    
    // 检查用户是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [adminUser.email]
    );
    
    if (existingUsers.length > 0) {
      console.log(`用户 ${adminUser.email} 已存在，跳过创建`);
      return;
    }
    
    // 加密密码
    console.log('加密密码...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // 插入用户
    console.log('创建管理员用户...');
    const [result] = await connection.execute(
      `INSERT INTO users (email, password, firstName, lastName, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [adminUser.email, hashedPassword, adminUser.firstName, adminUser.lastName, adminUser.role]
    );
    
    console.log(`管理员用户创建成功! ID: ${result.insertId}`);
    console.log(`用户名: ${adminUser.email}`);
    console.log(`密码: ${adminUser.password}`);
    
  } catch (error) {
    console.error('创建管理员用户失败:', error);
  } finally {
    if (connection) {
      console.log('关闭数据库连接');
      await connection.end();
    }
  }
}

// 执行创建管理员用户
createAdminUser(); 