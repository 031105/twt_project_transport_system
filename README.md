# 🚌 TWT Transport Booking System

A modern, full-stack transport booking system designed for Malaysian bus services. This project demonstrates a complete web application with user authentication, booking management, and administrative features using contemporary web technologies.

## 🌟 Project Overview

TWT Transport Booking System is a comprehensive web application that enables users to search, book, and manage bus transportation across Malaysia. The system features a responsive React.js frontend, robust Node.js/Express backend, and MySQL database with real-time OTP verification and secure authentication.

## ✨ Key Features

### 🔐 User Authentication & Security
- **OTP Verification**: Secure email-based OTP system for account verification
- **JWT Authentication**: Token-based authentication with role-based access control
- **Password Security**: Bcrypt password hashing and secure password reset
- **Rate Limiting**: API protection against brute force attacks

### 🎯 Core Booking System
- **Trip Search**: Search bus trips between Malaysian cities with real-time availability
- **Booking Management**: Complete booking flow with seat reservation
- **Digital Receipts**: Professional PDF-style booking confirmations
- **Booking History**: User dashboard with booking tracking and management

### 🏢 Administrative Features
- **Location Management**: Add and manage bus terminals and stops
- **Route Management**: Create and configure bus routes with pricing
- **Analytics Dashboard**: Basic system metrics and booking insights
- **User Management**: Administrative oversight of user accounts

### 📱 Modern User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive UI**: Real-time notifications and seamless user flows
- **Professional Interface**: Clean, modern design with intuitive navigation
- **Email Integration**: Automated email notifications using EmailJS

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern component-based UI framework
- **Tailwind CSS 3** - Utility-first CSS framework for responsive design
- **React Router v6** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **EmailJS** - Client-side email service integration
- **Lucide React** - Modern icon library
- **Recharts** - Data visualization for analytics

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management
- **JSON Web Tokens** - Secure authentication tokens
- **Bcrypt.js** - Password hashing and security
- **Nodemailer** - Email service for OTP delivery
- **Express Validator** - Input validation and sanitization
- **Helmet.js** - Security middleware

### Development Tools
- **Create React App** - React development environment
- **Nodemon** - Development server auto-restart
- **Jest** - Testing framework
- **ESLint** - Code linting and formatting

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Node.js       │    │     MySQL       │
│   Frontend      │◄──►│   Express API   │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • User Interface│    │ • Authentication│    │ • Users         │
│ • State Mgmt    │    │ • Business Logic│    │ • Bookings      │
│ • API Calls     │    │ • Data Validation│   │ • Routes        │
│ • Routing       │    │ • Email Service │    │ • Locations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
TWT-Transport-Booking/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages/views
│   ├── context/           # React Context for state management
│   ├── services/          # API service functions
│   └── utils/             # Utility functions
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers and business logic
│   │   ├── models/        # Database models and schemas
│   │   ├── routes/        # API endpoint definitions
│   │   ├── middleware/    # Authentication and validation
│   │   └── config/        # Database and app configuration
│   └── scripts/           # Database setup and utility scripts
├── database/              # Database schema and setup
│   ├── TWT_Transport_System.sql
│   └── README.md
└── docs/                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TWT-Transport-Booking.git
   cd TWT-Transport-Booking
   ```

2. **Database Setup**
   ```bash
   # Create database and import schema
   mysql -u root -p < database/TWT_Transport_System.sql
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp env.example .env
   # Edit .env with your database credentials
   
   # Start backend server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   # In project root
   npm install
   npm start
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎯 Demo Accounts

### Regular User
- **Email**: john.doe@email.com
- **Password**: password123
- **Access**: Booking, search, profile management

### Administrator
- **Email**: admin@transportbooking.com
- **Password**: password123  
- **Access**: Full system administration

## 🗺️ Featured Routes

The system includes authentic Malaysian bus routes:
- **Kuala Lumpur ↔ Johor Bahru** (RM 45, 5 hours)
- **Kuala Lumpur ↔ George Town, Penang** (RM 55, 4 hours)
- **Kuala Lumpur ↔ Malacca City** (RM 25, 2 hours)
- **Ipoh ↔ George Town** (RM 30, 2 hours)

## 📊 Database Schema

The system uses a normalized MySQL database with the following key entities:
- **Users** - User accounts and authentication
- **Locations** - Bus terminals and stops
- **Routes** - Available travel routes
- **Trips** - Scheduled departures
- **Bookings** - User reservations
- **Seats** - Seat availability tracking

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password reset

### Booking Endpoints
- `GET /api/trips/search` - Search available trips
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - User booking history

### Admin Endpoints
- `GET /api/admin/locations` - Manage locations
- `POST /api/admin/routes` - Create routes
- `GET /api/admin/analytics` - System analytics

## 🎓 Educational Value

This project demonstrates:
- **Full-Stack Development** - Complete web application architecture
- **Modern React Patterns** - Hooks, Context API, component composition
- **RESTful API Design** - Well-structured backend endpoints
- **Database Design** - Normalized relational database schema
- **Authentication Systems** - Secure user management with OTP
- **Responsive Design** - Mobile-first UI/UX principles
- **Code Organization** - Professional project structure and separation of concerns

## 🚀 Deployment

### Frontend Deployment
- **Netlify/Vercel**: Deploy the built React application
- **GitHub Pages**: Static hosting for the frontend

### Backend Deployment
- **Heroku/Railway**: Node.js application hosting
- **AWS/DigitalOcean**: VPS deployment with PM2

### Database Deployment
- **PlanetScale**: MySQL-compatible serverless database
- **AWS RDS**: Managed MySQL database service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Status

### ✅ Implemented Features
- User authentication with OTP verification
- Trip search and booking system
- Location and route management
- Basic admin dashboard
- Responsive UI design
- Email notifications

### 🚧 Planned Enhancements
- Advanced seat selection interface
- Payment gateway integration
- Real-time trip tracking
- Mobile application
- Advanced analytics dashboard
- Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Malaysian Bus Industry** - Route and terminal data inspiration
- **React Community** - Component libraries and best practices
- **Express.js** - Robust backend framework
- **Tailwind CSS** - Modern utility-first styling

---

**⭐ If you found this project helpful, please consider giving it a star!**

*This project is actively maintained and open for contributions. Feel free to report issues or suggest improvements.* 