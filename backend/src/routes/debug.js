const express = require('express');
const { executeQuery, dbConfig } = require('../config/database');

const router = express.Router();

// 检查配置信息
router.get('/config', async (req, res, next) => {
  try {
    res.json({
      success: true,
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        // 不显示密码
        password: dbConfig.password ? '***' : 'not set'
      },
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'not set'
      }
    });
  } catch (error) {
    next(error);
  }
});

// 检查所有数据库
router.get('/databases', async (req, res, next) => {
  try {
    const databases = await executeQuery('SHOW DATABASES');
    res.json({
      success: true,
      databases: databases
    });
  } catch (error) {
    next(error);
  }
});

// 检查数据库连接和表结构
router.get('/database-info', async (req, res, next) => {
  try {
    // 检查当前数据库名称
    const dbName = await executeQuery('SELECT DATABASE() as current_db');
    
    // 检查所有表
    const tables = await executeQuery('SHOW TABLES');
    
    // 检查 routes 表结构
    let routesStructure = [];
    try {
      routesStructure = await executeQuery('DESCRIBE routes');
    } catch (error) {
      routesStructure = { error: error.message };
    }
    
    // 检查 trips 表结构
    let tripsStructure = [];
    try {
      tripsStructure = await executeQuery('DESCRIBE trips');
    } catch (error) {
      tripsStructure = { error: error.message };
    }
    
    // 检查 locations 表结构
    let locationsStructure = [];
    try {
      locationsStructure = await executeQuery('DESCRIBE locations');
    } catch (error) {
      locationsStructure = { error: error.message };
    }
    
    // 统计数据
    const routeCount = await executeQuery('SELECT COUNT(*) as count FROM routes');
    const tripCount = await executeQuery('SELECT COUNT(*) as count FROM trips');
    const locationCount = await executeQuery('SELECT COUNT(*) as count FROM locations');
    
    res.json({
      success: true,
      database: dbName[0],
      tables: tables,
      tableStructures: {
        routes: routesStructure,
        trips: tripsStructure,
        locations: locationsStructure
      },
      counts: {
        routes: routeCount[0],
        trips: tripCount[0],
        locations: locationCount[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// 检查具体的 routes 数据
router.get('/routes-data', async (req, res, next) => {
  try {
    const routes = await executeQuery('SELECT * FROM routes LIMIT 10');
    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

// 检查具体的 trips 数据
router.get('/trips-data', async (req, res, next) => {
  try {
    const trips = await executeQuery('SELECT * FROM trips LIMIT 10');
    res.json({
      success: true,
      data: trips
    });
  } catch (error) {
    next(error);
  }
});

// 检查具体的 users 数据
router.get('/users-data', async (req, res, next) => {
  try {
    const users = await executeQuery('SELECT id, email, first_name, last_name, role, created_at FROM users LIMIT 10');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// 检查 users 表结构
router.get('/users-structure', async (req, res, next) => {
  try {
    const structure = await executeQuery('DESCRIBE users');
    res.json({
      success: true,
      structure: structure
    });
  } catch (error) {
    next(error);
  }
});

// 检查 bookings 表结构
router.get('/bookings-structure', async (req, res, next) => {
  try {
    const structure = await executeQuery('DESCRIBE bookings');
    res.json({
      success: true,
      structure: structure
    });
  } catch (error) {
    next(error);
  }
});

// 检查具体的 bookings 数据
router.get('/bookings-data', async (req, res, next) => {
  try {
    const bookings = await executeQuery('SELECT * FROM bookings LIMIT 10');
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// 检查 trip_seats 表结构
router.get('/trip-seats-structure', async (req, res, next) => {
  try {
    const structure = await executeQuery('DESCRIBE trip_seats');
    res.json({
      success: true,
      structure: structure
    });
  } catch (error) {
    next(error);
  }
});

// 检查具体的 trip_seats 数据
router.get('/trip-seats-data', async (req, res, next) => {
  try {
    const tripSeats = await executeQuery('SELECT * FROM trip_seats LIMIT 20');
    res.json({
      success: true,
      data: tripSeats
    });
  } catch (error) {
    next(error);
  }
});

// 检查 seat_types 表结构
router.get('/seat-types-structure', async (req, res, next) => {
  try {
    const structure = await executeQuery('DESCRIBE seat_types');
    res.json({
      success: true,
      structure: structure
    });
  } catch (error) {
    next(error);
  }
});

// 检查具体的 seat_types 数据
router.get('/seat-types-data', async (req, res, next) => {
  try {
    const seatTypes = await executeQuery('SELECT * FROM seat_types LIMIT 10');
    res.json({
      success: true,
      data: seatTypes
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 