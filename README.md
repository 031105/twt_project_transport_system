# 🚌 TWT Transport Booking System

A comprehensive full-stack transport booking system for Malaysian bus services featuring real-time OTP verification, advanced admin dashboard, and professional booking management. Built with modern web technologies and a robust MySQL database.

## 🌟 Project Overview

TWT Transport Booking System is a production-ready web application that demonstrates advanced full-stack development skills. The system provides complete bus booking functionality with sophisticated admin management, real-time analytics, and secure user authentication with email OTP verification.

## ✨ Core Features

### 🔐 Advanced Authentication System
- **Email OTP Verification**: Secure 6-digit OTP system for account verification and password reset
- **JWT Authentication**: Token-based authentication with automatic expiration handling
- **Role-Based Access Control**: Separate user and admin interfaces with protected routes
- **Password Security**: Bcrypt hashing with secure password reset functionality
- **Session Management**: Persistent login with secure token storage

### 🎯 Complete Booking System
- **Trip Search**: Advanced search functionality across Malaysian bus routes
- **Real-time Availability**: Live seat availability with dynamic pricing
- **Seat Management**: Comprehensive seat selection and booking confirmation
- **Digital Receipts**: Professional booking confirmations with detailed trip information
- **Booking History**: Complete user dashboard with booking tracking and management
- **Payment Integration**: Ready for payment gateway integration with mock payment flow

### 🏢 Comprehensive Admin Dashboard
- **System Overview**: Real-time dashboard with key performance metrics
- **Vehicle Management**: Complete CRUD operations for bus fleet management
- **Route Management**: Advanced route creation with multiple stops and scheduling
- **Schedule Management**: Day/week/month view trip scheduling with drag-drop interface
- **Analytics Dashboard**: Detailed revenue, occupancy, and performance analytics
- **Customer Service Portal**: Integrated booking search and customer management
- **Location Management**: Full terminal and stop management system

### 📱 Modern User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive UI**: Real-time notifications and seamless user flows
- **Professional Interface**: Clean, modern design with intuitive navigation
- **Email Integration**: Automated email notifications using EmailJS
- **Print-Ready Receipts**: Professional receipt formatting with print CSS

## 🛠️ Technology Stack

### Frontend Architecture
- **React.js 18** - Modern functional components with hooks
- **Tailwind CSS 3** - Utility-first CSS framework for responsive design
- **React Router v6** - Advanced client-side routing with protected routes
- **Context API** - Centralized state management with useReducer
- **Axios** - HTTP client for seamless API communication
- **EmailJS** - Client-side email service integration
- **Lucide React** - Modern icon library with 1000+ icons
- **Recharts** - Advanced data visualization for admin analytics
- **Date-fns** - Comprehensive date manipulation library

### Backend Architecture
- **Node.js** - JavaScript runtime with ES6+ features
- **Express.js** - Robust web application framework with middleware
- **MySQL** - Relational database with complex relationships
- **JSON Web Tokens** - Secure authentication with role-based access
- **Bcrypt.js** - Industry-standard password hashing
- **Nodemailer** - Professional email service for OTP delivery
- **Express Validator** - Comprehensive input validation and sanitization
- **Helmet.js** - Security middleware for production environments
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - API protection against abuse

### Database Design
- **13 Normalized Tables** - Professional database schema design
- **UUID Primary Keys** - Distributed system-ready unique identifiers
- **Foreign Key Constraints** - Data integrity with cascading operations
- **JSON Fields** - Flexible data storage for complex objects
- **Indexing Strategy** - Optimized queries for performance
- **Sample Data** - Comprehensive test data with Malaysian locations

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Node.js       │    │     MySQL       │
│   Frontend      │◄──►│   Express API   │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Authentication│    │ • JWT Middleware│    │ • 13 Tables     │
│ • Admin Dashboard│   │ • OTP System    │    │ • UUID Keys     │
│ • Booking System│    │ • Email Service │    │ • Relationships │
│ • Route Search  │    │ • Analytics API │    │ • Sample Data   │
│ • User Profile  │    │ • CRUD Operations│   │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
TWT-Transport-Booking/
├── src/                           # Frontend React application
│   ├── components/
│   │   ├── admin/                 # Advanced admin components
│   │   │   ├── LocationManagement.js
│   │   │   ├── RouteManagement.js
│   │   │   ├── RouteMap.js
│   │   │   └── PopularTrips.js
│   │   ├── auth/                  # Authentication components
│   │   ├── layout/                # Layout components
│   │   └── common/                # Reusable components
│   ├── pages/
│   │   ├── admin/                 # Admin dashboard pages
│   │   │   ├── AdminDashboard.js  # 3900+ lines comprehensive dashboard
│   │   │   ├── AdminRoutes.js
│   │   │   └── AdminBookings.js
│   │   ├── HomePage.js            # 650+ lines landing page
│   │   ├── UserDashboard.js       # User profile and bookings
│   │   ├── Booking.js             # Complete booking flow
│   │   └── EmailVerification.js   # OTP verification system
│   ├── services/
│   │   ├── adminApi.js            # 450+ lines admin API integration
│   │   ├── emailService.js        # EmailJS integration
│   │   └── routeAnalysisApi.js    # Analytics calculations
│   └── context/
│       └── AppContext.js          # Centralized state management
├── backend/                       # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/           # Business logic controllers
│   │   │   └── admin/             # Admin-specific controllers
│   │   ├── models/                # Database models
│   │   │   ├── User.js
│   │   │   ├── Booking.js
│   │   │   ├── Route.js
│   │   │   └── Location.js
│   │   ├── routes/                # API endpoint definitions
│   │   │   ├── auth.js            # Authentication routes
│   │   │   ├── admin.js           # 1100+ lines admin routes
│   │   │   ├── bookings.js
│   │   │   └── locations.js
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── errorHandler.js
│   │   └── config/
│   │       └── database.js        # MySQL connection configuration
│   └── scripts/
│       └── create-admin.js        # Admin user creation script
├── database/                      # Database schema and setup
│   ├── TWT_Transport_System.sql   # Complete database schema
│   └── README.md                  # Database documentation
└── docs/                          # Project documentation
    ├── API_DESIGN.md
    └── SYSTEM_OVERVIEW.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **MySQL** v8.0 or higher  
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/031105/twt_project_transport_system.git
   cd twt_project_transport_system
   ```

2. **Database Setup**
   ```bash
   # Create database and import schema
   mysql -u root -p
   CREATE DATABASE TWT_Transport_System;
   USE TWT_Transport_System;
   SOURCE database/TWT_Transport_System.sql;
   ```

3. **Backend Configuration**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp env.example .env
   
   # Configure your .env file:
   # DB_HOST=localhost
   # DB_USER=your_username
   # DB_PASSWORD=your_password
   # DB_NAME=TWT_Transport_System
   # JWT_SECRET=your_jwt_secret
   # EMAIL_USER=your_email@gmail.com
   # EMAIL_PASS=your_app_password
   
   # Start backend server
   npm run dev  # Development mode with nodemon
   # OR
   npm start    # Production mode
   ```

4. **Frontend Setup**
   ```bash
   # In project root directory
   npm install
   
   # Start frontend development server
   npm start
   ```

5. **Create Admin User** (Optional)
   ```bash
   cd backend
   node scripts/create-admin.js
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **API Health Check**: http://localhost:5001/api/health

## 🎯 Demo Accounts

### Regular User Account
- **Email**: john.doe@email.com
- **Password**: password123
- **Features**: Trip search, booking, profile management, booking history

### Administrator Account
- **Email**: admin@transportbooking.com
- **Password**: password123  
- **Features**: Complete admin dashboard, analytics, system management

## 🗺️ Featured Malaysian Routes

The system includes authentic Malaysian bus routes with real terminal data:

- **KL Sentral ↔ Terminal Bersepadu Selatan JB** (RM 45, 5 hours)
- **KL Sentral ↔ Komtar Bus Terminal Penang** (RM 55, 4 hours)
- **KL Sentral ↔ Melaka Sentral** (RM 25, 2 hours)
- **Terminal Amanjaya Ipoh ↔ Komtar Penang** (RM 30, 2 hours)
- **Seremban ↔ Malacca City** (RM 20, 1.5 hours)

## 📊 Database Schema

### Core Tables (13 Total)
- **users** - User accounts with role-based permissions
- **email_verifications** - OTP verification system
- **locations** - Bus terminals and stops with GPS coordinates
- **routes** - Available travel routes with pricing
- **trips** - Scheduled departures with real-time availability
- **bookings** - User reservations with payment tracking
- **payments** - Payment transaction records
- **vehicles** - Bus fleet management
- **route_stops** - Multi-stop route configurations
- **trip_seats** - Individual seat management
- **seat_types** - Different seat categories and pricing

### Key Features
- **UUID Primary Keys** for distributed system compatibility
- **JSON Fields** for flexible data storage (facilities, operating hours)
- **Foreign Key Constraints** ensuring data integrity
- **Comprehensive Sample Data** with Malaysian bus terminals

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/register          # User registration
POST /api/auth/login             # User login  
POST /api/auth/verify-otp        # Email OTP verification
POST /api/auth/forgot-password   # Password reset request
POST /api/auth/reset-password    # Password reset confirmation
```

### Booking System Endpoints
```
GET  /api/trips/search           # Search available trips
POST /api/bookings               # Create new booking
GET  /api/bookings/user/:userId  # User booking history
GET  /api/bookings/:id           # Booking details
PUT  /api/bookings/:id           # Update booking
```

### Admin Management Endpoints
```
GET  /api/admin/stats/overview   # Dashboard statistics
GET  /api/admin/stats/analytics  # Revenue and occupancy analytics
GET  /api/admin/vehicles         # Vehicle management
POST /api/admin/vehicles         # Add new vehicle
GET  /api/admin/routes           # Route management
POST /api/admin/routes           # Create new route
GET  /api/admin/schedules        # Schedule management
POST /api/admin/schedules        # Create trip schedule
```

### Location & Route Endpoints
```
GET  /api/locations              # All bus terminals
GET  /api/routes                 # Available routes
GET  /api/trips/:id              # Trip details
```

## 🎓 Educational & Professional Value

### Technical Skills Demonstrated
- **Full-Stack Development** - Complete MERN-like stack implementation
- **Database Design** - Normalized schema with complex relationships
- **API Architecture** - RESTful design with proper HTTP methods
- **Authentication Systems** - JWT with OTP email verification
- **State Management** - React Context with complex state logic
- **Responsive Design** - Mobile-first UI/UX implementation
- **Code Organization** - Professional project structure and separation of concerns
- **Error Handling** - Comprehensive error management throughout the stack

### Advanced Features
- **Real-time Analytics** - Revenue tracking and occupancy analytics
- **Email Integration** - Automated OTP delivery system
- **Dynamic Pricing** - Flexible pricing rules and seat categories
- **Schedule Management** - Complex trip scheduling with multi-stop routes
- **Admin Dashboard** - Production-ready administrative interface
- **Security Implementation** - Rate limiting, input validation, SQL injection prevention

## 🚀 Deployment Options

### Frontend Deployment
- **Vercel** - Optimal for React applications with automatic deployments
- **Netlify** - Static site hosting with form handling
- **AWS S3 + CloudFront** - Scalable CDN deployment
- **Firebase Hosting** - Google's hosting solution

### Backend Deployment  
- **Railway** - Modern Node.js hosting with database integration
- **Heroku** - Platform-as-a-Service with easy scaling
- **DigitalOcean App Platform** - Container-based deployment
- **AWS EC2** - Full control with custom server configuration

### Database Deployment
- **PlanetScale** - Serverless MySQL with automatic scaling
- **AWS RDS** - Managed MySQL database service
- **Railway MySQL** - Integrated database hosting
- **Google Cloud SQL** - Enterprise-grade database hosting

## 📈 Performance & Scalability

### Current Optimizations
- **Database Indexing** - Optimized queries for fast search performance
- **API Rate Limiting** - Protection against abuse and DDoS
- **Image Optimization** - Responsive images with lazy loading
- **Code Splitting** - Efficient React bundle splitting
- **Caching Strategy** - Browser and API response caching

### Scalability Considerations
- **UUID Primary Keys** - Distributed system ready
- **Stateless API Design** - Horizontal scaling compatibility
- **Modular Architecture** - Easy to extract microservices
- **Environment Configuration** - Production/development separation

## 🔄 Development Status

### ✅ Fully Implemented Features
- Complete user authentication with OTP verification
- Advanced admin dashboard with real-time analytics
- Comprehensive booking system with seat management
- Location and route management with GPS integration
- Email notification system with professional templates
- Responsive UI design with mobile optimization
- Database schema with sample data and relationships
- API documentation with comprehensive endpoints

### 🚧 Ready for Enhancement
- Payment gateway integration (Stripe/PayPal ready)
- Real-time seat availability updates via WebSocket
- Advanced reporting and business intelligence
- Mobile application development
- Multi-language internationalization
- Advanced search filters and sorting
- Loyalty program and discount system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Malaysian Transport Industry** - Route and terminal data inspiration
- **React.js Community** - Component libraries and best practices
- **Express.js Ecosystem** - Robust middleware and plugins
- **Tailwind CSS** - Modern utility-first styling framework
- **MySQL Community** - Reliable database system

## 📞 Support & Contact

For technical questions or collaboration opportunities:

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Comprehensive guides in `/docs` directory
- **API Reference**: Interactive API documentation available

---

**⭐ If you found this project helpful for learning full-stack development, please consider giving it a star!**

*This project demonstrates production-ready code quality and professional development practices. Feel free to use it as a reference for your own full-stack applications.*

## 🚀 Getting Started Video

*Coming Soon: Step-by-step setup video tutorial*

---

**Built with ❤️ for the Malaysian transport industry and the developer community** 