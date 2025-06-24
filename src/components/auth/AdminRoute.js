import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, currentUser, isLoading } = useApp();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (currentUser?.role !== 'admin') {
    // Redirect non-admin users to home page
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute; 