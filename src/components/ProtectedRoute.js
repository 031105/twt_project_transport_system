import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, currentUser } = useApp();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <a href="/" className="btn-primary">
          Go Back Home
        </a>
      </div>
    );
  }
  
  return children;
};

export default ProtectedRoute; 