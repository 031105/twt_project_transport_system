const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'TWT_Transport_System',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to database: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Execute transaction commands (non-prepared statements)
const executeTransaction = async (query) => {
  try {
    const [results] = await pool.query(query);
    return results;
  } catch (error) {
    console.error('Transaction command error:', error.message);
    throw error;
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const tables = await executeQuery(`
      SELECT 
        TABLE_NAME as tableName,
        TABLE_ROWS as estimatedRows,
        ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as sizeMB
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      ORDER BY TABLE_NAME
    `, [dbConfig.database]);
    
    return tables;
  } catch (error) {
    console.error('Error getting database stats:', error.message);
    return [];
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  getDatabaseStats,
  dbConfig
}; 