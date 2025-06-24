# 🚀 Transport Booking System - Complete Setup Guide

## 📋 Overview
This guide will help you set up the complete transport booking system with a fully functional admin interface connected to the MySQL database.

## 🔧 Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## 📂 Project Structure
```
TWT-Transport-Booking/
├── backend/           # Express.js API server
├── src/              # React frontend
├── database/         # SQL schema and sample data
├── public/           # Static assets
└── docs/            # Documentation
```

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE TWT_Transport_System;
USE TWT_Transport_System;
```

### 2. Import Schema and Data (in order)
```bash
# 1. Import the database schema
mysql -u your_username -p TWT_Transport_System < database/transport_booking_mysql_schema.sql

# 2. Import sample data
mysql -u your_username -p TWT_Transport_System < database/transport_booking_sample_data.sql

# 3. Import additional comprehensive data
mysql -u your_username -p TWT_Transport_System < database/transport_booking_complete_data.sql

# 4. (Optional) Add more trips for testing
mysql -u your_username -p TWT_Transport_System < database/add_more_trips.sql
```

### 3. Verify Database Setup
Run this query to check if data was imported correctly:
```sql
SELECT 
    'routes' as table_name, COUNT(*) as count FROM routes
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'trips', COUNT(*) FROM trips
UNION ALL
SELECT 'locations', COUNT(*) FROM locations
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings;
```

Expected results:
- routes: 5-10 records
- vehicles: 4-6 records
- trips: 20+ records
- locations: 8+ records
- bookings: 5+ records

## ⚙️ Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `backend/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=TWT_Transport_System

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start Backend Server
```bash
cd backend
npm start
```

You should see:
```
✅ Database connected successfully
📊 Connected to database: TWT_Transport_System
🏠 Host: 127.0.0.1:3306
🚀 Server running on port 5000
```

## 🖥️ Frontend Setup

### 1. Install Dependencies
```bash
# From project root
npm install
```

### 2. Environment Configuration
Create `.env` file in project root:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=TransportBook Admin
REACT_APP_VERSION=1.0.0
```

### 3. Start Frontend Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🔐 Admin Access

### 1. Create Admin User
Run this SQL query to create an admin user:
```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified) 
VALUES (
    UUID(), 
    'admin@transportbook.com', 
    '$2b$10$rXJz5HqMQPjQhJ8N4fH4QeLgOJGcQJ8wPzr5qKcQYPHMqDYWHHQYu', -- password: admin123
    'Admin', 
    'User', 
    'admin', 
    1, 
    1
);
```

### 2. Login Credentials
- **Email**: admin@transportbook.com
- **Password**: admin123

## 🎯 Testing the Admin Interface

### 1. Access Admin Dashboard
1. Navigate to `http://localhost:3000/admin`
2. Login with admin credentials
3. You should see the dashboard with real data from the database

### 2. Test Each Section

#### 📊 **Overview Tab**
- **Expected**: Live statistics from database
- **Data**: Active Routes: 5, Active Trips: 48, Fleet Size: 4, Scheduled Trips: 48
- **Functionality**: All cards should show real numbers from the database

#### 🚌 **Vehicles Tab**
- **Expected**: List of vehicles from database
- **Features**: 
  - View vehicle details (TBS-001, TBS-002, etc.)
  - Edit vehicle information
  - Service records
  - Add new vehicles

#### 🛣️ **Routes Tab**
- **Expected**: Route visualization on map
- **Features**:
  - Route performance analytics
  - Occupancy rates
  - Revenue data

#### 📅 **Schedule Tab**
- **Expected**: Today's schedule from database
- **Features**:
  - Real-time occupancy percentages
  - Trip details
  - Create new schedules

#### 📈 **Analytics Tab**
- **Expected**: Revenue and performance metrics
- **Data**: 
  - Total Revenue: RM 46,280
  - Average Occupancy: 50.0%
  - Total Passengers: 1080

#### 🎧 **Customer Service Tab**
- **Expected**: Functional trip search
- **Features**:
  - Search by origin/destination
  - Date filtering
  - Passenger count
  - Booking creation workflow

## 🔧 API Endpoints Testing

### Test with curl or Postman:

#### 1. Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/stats/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Get Vehicles
```bash
curl -X GET http://localhost:5000/api/admin/vehicles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Search Trips
```bash
curl -X POST http://localhost:5000/api/admin/search-trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "origin": "Kuala Lumpur",
    "destination": "Penang",
    "departureDate": "2024-12-15",
    "passengers": 1
  }'
```

## 🎨 UI Features Verification

### ✅ **Working Features**
- [x] Dashboard statistics with real data
- [x] Vehicle management with database integration
- [x] Route visualization with occupancy data
- [x] Schedule management with today's trips
- [x] Analytics with revenue calculations
- [x] Customer service search functionality
- [x] Real-time occupancy percentages
- [x] Clickable navigation between sections
- [x] Loading states and error handling
- [x] Responsive design for all screen sizes

### 🎯 **Key Functionality**
1. **Search Trips**: Enter origin, destination, date → Returns real trips from database
2. **View Schedules**: Shows today's actual schedule with live occupancy
3. **Vehicle Management**: Real vehicle data with maintenance records
4. **Analytics**: Calculated metrics from actual booking data
5. **Route Performance**: Live revenue and occupancy statistics

## 🚨 Troubleshooting

### Backend Issues
1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `.env` file
   - Ensure database exists and has correct permissions

2. **Port Already in Use**
   - Change PORT in `backend/.env` to 5001 or different port
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

3. **JWT Token Issues**
   - Generate new JWT_SECRET in `.env`
   - Clear browser localStorage
   - Re-login to get fresh token

### Frontend Issues
1. **API Connection Failed**
   - Verify REACT_APP_API_URL in `.env`
   - Check backend server is running
   - Verify CORS configuration

2. **Admin Login Failed**
   - Ensure admin user exists in database
   - Check password hash matches
   - Verify JWT_SECRET is same in frontend and backend

## 📊 Expected Results

After complete setup, you should see:

### Dashboard Overview
- **Active Routes**: 5
- **Active Trips**: 48  
- **Fleet Size**: 4
- **Scheduled Trips**: 48

### Vehicle List
- TBS-001 (Mercedes OH1830) - 45 seats
- TBS-002 (Scania K410IB) - 30 seats  
- TBS-003 (Toyota Hiace) - 12 seats
- TBS-004 (Volvo B8R) - 45 seats

### Analytics
- **Total Revenue**: RM 46,280
- **Average Occupancy**: 50.0%
- **Total Passengers**: 1,080

### Route Performance
- KL - Johor Express: RM 13,815 (49% occupancy)
- KL - Penang Highway: RM 18,865 (54% occupancy)
- KL - Malacca Direct: RM 6,475 (58% occupancy)

## 🎉 Success Criteria

✅ **Your system is working perfectly if:**
1. Dashboard shows live statistics from database
2. All admin sections are clickable and functional
3. Search returns real trip results
4. Vehicle management shows actual fleet data
5. Analytics display calculated revenue metrics
6. Schedule shows today's trips with occupancy
7. No errors in browser console
8. All API endpoints respond with correct data

## 🔄 Additional Data

To add more test data, run:
```bash
curl -X POST http://localhost:5000/api/admin/add-more-trips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

This will add 17 more trips for comprehensive testing.

## 📞 Support

If you encounter any issues:
1. Check browser console for JavaScript errors
2. Check backend logs for API errors
3. Verify database connection and data integrity
4. Ensure all environment variables are set correctly

Your transport booking admin interface is now fully functional with real database integration! 🚀 