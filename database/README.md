# TWT Transport Booking System - Database Setup Guide

This directory contains the complete database setup for the TWT Transport Booking System, exported from phpMyAdmin with actual production data.

## Database Overview

The **TWT_Transport_System** database is designed to support a comprehensive transportation booking platform with 12 interconnected tables managing users, routes, trips, bookings, and payments.

### Database Information
- **Database Name**: `TWT_Transport_System`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Engine**: InnoDB (for ACID compliance and foreign key support)
- **Server**: MariaDB 10.4.28+ / MySQL 8.0+

## Database Schema

### Core Tables Structure

1. **users** - User accounts and authentication system
   - UUID primary keys for security
   - Role-based access control (customer/admin)
   - Email verification and OTP support
   - Profile management and notification preferences

2. **email_verifications** - OTP verification system
   - Email verification codes with expiry
   - Attempt tracking and security limits
   - Support for signup and password reset verification

3. **locations** - Transportation terminals and stops
   - Geographic coordinates and address data
   - Operating hours and facility information
   - Contact details and terminal types

4. **routes** - Transportation routes between locations
   - Origin and destination mapping
   - Distance, duration, and pricing information
   - Route status and operational details

5. **route_stops** - Intermediate stops on routes
   - Stop ordering and timing information
   - Distance and pricing from origin
   - Flexible route configuration

6. **vehicle_types** - Vehicle categories and configurations
   - Capacity and seating layout definitions
   - Amenities and feature specifications
   - JSON-based configuration storage

7. **vehicles** - Individual fleet vehicles
   - Vehicle registration and identification
   - Maintenance status and operational data
   - Type association and tracking

8. **seat_types** - Seat categories and pricing
   - Different seat classes (Economy, Business, Premium)
   - Pricing multipliers and feature definitions
   - JSON-based feature storage

9. **schedules** - Regular trip schedules
   - Recurring trip patterns and frequencies
   - Effective date ranges and operational schedules
   - Route and timing configuration

10. **trips** - Individual journey instances
    - Specific departure and arrival times
    - Vehicle assignment and capacity tracking
    - Dynamic pricing and status management

11. **trip_seats** - Seat inventory for trips
    - Individual seat tracking and availability
    - Pricing and reservation status
    - Booking association and timing

12. **bookings** - Customer reservations
    - Comprehensive booking information
    - Payment status and passenger details
    - Cancellation and refund tracking

13. **payments** - Financial transactions
    - Payment gateway integration records
    - Transaction status and security information
    - Refund and dispute management

## Setup Instructions

### Prerequisites

- **MySQL 8.0+** or **MariaDB 10.4+**
- **phpMyAdmin** (optional, for GUI management)
- **Command line access** with mysql client
- **Proper user permissions** for database creation and management

### Method 1: Using the Complete SQL Export (Recommended)

The `TWT_Transport_System.sql` file contains the complete database with schema and sample data.

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS TWT_Transport_System CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import the complete database
mysql -u root -p TWT_Transport_System < TWT_Transport_System.sql

# 3. Verify the import
mysql -u root -p TWT_Transport_System -e "SHOW TABLES;"
```

### Method 2: Using the Setup Script

The automated setup script provides interactive installation with options.

```bash
# 1. Make the script executable
chmod +x db_setup.sh

# 2. Run the setup script
./db_setup.sh

# 3. Follow the interactive prompts for database credentials
```

### Method 3: Manual Setup Steps

If you prefer manual setup or need to customize the process:

```bash
# 1. Connect to MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE TWT_Transport_System CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE TWT_Transport_System;

# 3. Create user (optional)
CREATE USER 'twt_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON TWT_Transport_System.* TO 'twt_user'@'localhost';
FLUSH PRIVILEGES;

# 4. Import the SQL file
SOURCE /path/to/TWT_Transport_System.sql;

# 5. Verify tables
SHOW TABLES;
```

## Sample Data Overview

The database includes comprehensive sample data for testing and development:

### User Accounts
- **Admin Users**: Complete administrative accounts with full system access
- **Customer Users**: Regular user accounts for booking and profile management
- **Test Accounts**: Pre-configured accounts for development testing

### Location Data
- **Malaysian Terminals**: 8 major bus terminals across Malaysia
  - KL Sentral Terminal (KLST)
  - Terminal Bersepadu Selatan JB (TBSJ)
  - Komtar Bus Terminal (KBTP)
  - Melaka Sentral (MLKS)
  - Terminal Amanjaya Ipoh (TAIP)
  - Seremban Terminal (SRMB)
  - Genting Highlands Terminal (GHTS)
  - Kuantan Central Terminal (KCTN)

### Route Network
- **Inter-city Routes**: Connections between major Malaysian cities
- **Pricing Structure**: Realistic pricing based on distance and route popularity
- **Route Stops**: Intermediate stops for complex journeys

### Fleet Information
- **Vehicle Types**: Different bus categories (Economy, Business, VIP)
- **Capacity Management**: Seating configurations from 28 to 45 seats
- **Vehicle Fleet**: Sample vehicles with registration and status data

### Booking Records
- **Historical Bookings**: Sample bookings showing different statuses
- **Payment Records**: Transaction history with various payment methods
- **Passenger Data**: Realistic passenger and contact information

## Database Configuration

### Environment Variables

For application connection, use these environment variables:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=TWT_Transport_System
DB_USER=your_username
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
```

### Connection String Examples

**Node.js (MySQL2)**:
```javascript
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'your_username',
  password: 'your_password',
  database: 'TWT_Transport_System',
  charset: 'utf8mb4'
});
```

**PHP (PDO)**:
```php
$dsn = "mysql:host=localhost;port=3306;dbname=TWT_Transport_System;charset=utf8mb4";
$pdo = new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
```

## Security Considerations

### Database Security
- **UUID Primary Keys**: All tables use UUID for enhanced security
- **Password Hashing**: User passwords are bcrypt hashed
- **Role-Based Access**: Proper user role management implemented
- **Input Validation**: SQL injection prevention through parameterized queries

### Production Recommendations
1. **Change Default Passwords**: Update all default user passwords
2. **Create Limited Users**: Use application-specific database users with minimal privileges
3. **Enable SSL**: Configure SSL connections for production
4. **Regular Backups**: Implement automated backup procedures
5. **Monitor Access**: Log and monitor database access patterns

## Maintenance and Backup

### Backup Commands
```bash
# Full database backup
mysqldump -u root -p TWT_Transport_System > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only backup
mysqldump -u root -p --no-data TWT_Transport_System > schema_backup.sql

# Data only backup
mysqldump -u root -p --no-create-info TWT_Transport_System > data_backup.sql
```

### Restore Commands
```bash
# Restore from backup
mysql -u root -p TWT_Transport_System < backup_file.sql
```

## Troubleshooting

### Common Issues

1. **Character Set Problems**:
   ```sql
   ALTER DATABASE TWT_Transport_System CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Foreign Key Constraint Errors**:
   ```sql
   SET FOREIGN_KEY_CHECKS = 0;
   -- Import your data
   SET FOREIGN_KEY_CHECKS = 1;
   ```

3. **Permission Issues**:
   ```sql
   GRANT ALL PRIVILEGES ON TWT_Transport_System.* TO 'username'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Verification Queries

Check database setup:
```sql
-- Verify all tables exist
SHOW TABLES;

-- Check table structure
DESCRIBE users;
DESCRIBE bookings;

-- Verify sample data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM locations;
SELECT COUNT(*) FROM routes;
SELECT COUNT(*) FROM bookings;

-- Check foreign key relationships
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'TWT_Transport_System';
```

## Development Notes

### Key Features Implemented
- **UUID-based identification** for all entities
- **JSON field support** for flexible configuration storage
- **Comprehensive indexing** for query optimization
- **Foreign key constraints** for data integrity
- **Timestamp tracking** for audit trails
- **Enum fields** for controlled value sets

### Database Design Principles
- **Normalized structure** to minimize redundancy
- **Scalable architecture** supporting future growth
- **Performance optimization** through strategic indexing
- **Data integrity** through constraints and validation
- **Audit capabilities** with creation and update timestamps

This database setup provides a robust foundation for the TWT Transport Booking System with realistic sample data for development and testing purposes. 