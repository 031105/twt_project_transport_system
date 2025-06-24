import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import './styles/print.css';
import Navbar from './components/layout/Navbar';
import NotificationCenter from './components/NotificationCenter';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import TripDetails from './pages/TripDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPopularTrips from './pages/admin/AdminPopularTrips';
import AdminTrips from './pages/admin/AdminTrips';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRoutes from './pages/admin/AdminRoutes';

// Admin wrapper component to manage admin state
const AdminWrapper = ({ defaultActiveTab = 'customer-service' }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar adminActiveTab={activeTab} setAdminActiveTab={setActiveTab} />
      <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Regular layout wrapper for non-admin pages
const RegularLayout = ({ children, isHomePage = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isHomePage ? (
        <main>
          {children}
        </main>
      ) : (
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      )}
    </div>
  );
};

// Home route wrapper that redirects admin users
const HomeWrapper = () => {
  const { currentUser, isAuthenticated } = useApp();
  
  // Only redirect if user is authenticated and is admin
  if (isAuthenticated && currentUser?.role === 'admin') {
    console.log('Redirecting admin user to /admin');
    return <Navigate to="/admin" replace />;
  }
  
  console.log('Showing homepage for normal user or guest');
  return <HomePage />;
};

function AppContent() {
  return (
    <Router>
      <NotificationCenter />
      
      <Routes>
        {/* Home route with admin redirect */}
        <Route path="/" element={
          <RegularLayout isHomePage={true}>
            <HomeWrapper />
          </RegularLayout>
        } />
        
        {/* Regular customer pages */}
        <Route path="/search" element={
          <RegularLayout>
            <SearchResults />
          </RegularLayout>
        } />
        <Route path="/trip/:tripId" element={
          <RegularLayout>
            <TripDetails />
          </RegularLayout>
        } />
        <Route path="/login" element={
          <RegularLayout>
            <Login />
          </RegularLayout>
        } />
        <Route path="/register" element={
          <RegularLayout>
            <Register />
          </RegularLayout>
        } />
        <Route path="/verify-email" element={
          <RegularLayout>
            <EmailVerification />
          </RegularLayout>
        } />
        <Route path="/forgot-password" element={
          <RegularLayout>
            <ForgotPassword />
          </RegularLayout>
        } />
        
        {/* Protected customer routes */}
        <Route path="/dashboard" element={
          <RegularLayout>
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          </RegularLayout>
        } />
        
        <Route path="/booking" element={
          <RegularLayout>
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          </RegularLayout>
        } />
        
        <Route path="/booking-confirmation" element={
          <RegularLayout>
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          </RegularLayout>
        } />
        
        <Route path="/bookings" element={
          <RegularLayout>
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          </RegularLayout>
        } />
        
        <Route path="/profile" element={
          <RegularLayout>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </RegularLayout>
        } />
        
        {/* Admin routes with special layout */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminWrapper defaultActiveTab="customer-service" />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminWrapper defaultActiveTab="overview" />
          </ProtectedRoute>
        } />

        <Route path="/admin/vehicles" element={
          <ProtectedRoute requireAdmin>
            <AdminWrapper defaultActiveTab="vehicles" />
          </ProtectedRoute>
        } />

        <Route path="/admin/schedule" element={
          <ProtectedRoute requireAdmin>
            <AdminWrapper defaultActiveTab="schedule" />
          </ProtectedRoute>
        } />

        <Route path="/admin/analytics" element={
          <ProtectedRoute requireAdmin>
            <AdminWrapper defaultActiveTab="analytics" />
          </ProtectedRoute>
        } />

        <Route path="/admin/routes" element={
          <ProtectedRoute requireAdmin>
            <AdminRoutes />
          </ProtectedRoute>
        } />

        <Route path="/admin/bookings" element={
          <ProtectedRoute requireAdmin>
            <AdminBookings />
          </ProtectedRoute>
        } />

        <Route path="/admin/trips" element={
          <ProtectedRoute requireAdmin>
            <AdminTrips />
          </ProtectedRoute>
        } />

        <Route path="/admin/popular-trips" element={
          <ProtectedRoute requireAdmin>
            <AdminPopularTrips />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <RegularLayout>
            <div className="max-w-4xl mx-auto text-center py-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">
                Go Back Home
              </a>
            </div>
          </RegularLayout>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; 