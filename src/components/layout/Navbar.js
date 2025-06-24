import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bus, 
  Menu, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  History,
  Shield,
  X,
  BarChart3,
  Calendar,
  Truck,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar = ({ adminActiveTab, setAdminActiveTab }) => {
  const { 
    isAuthenticated, 
    currentUser, 
    logout, 
    toggleSidebar 
  } = useApp();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };
  
  const isAdmin = currentUser?.role === 'admin';
  
  const handleNavigation = (path) => {
    navigate(path);
    if (setAdminActiveTab) {
      // 匹配路径对应的tab
      if (path === '/admin') setAdminActiveTab('customer-service');
      else if (path === '/admin/dashboard') setAdminActiveTab('overview');
      else if (path === '/admin/vehicles') setAdminActiveTab('vehicles');
      else if (path === '/admin/schedule') setAdminActiveTab('schedule');
      else if (path === '/admin/analytics') setAdminActiveTab('analytics');
    }
  };
  
  // Admin navigation items
  const adminNavItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Routes', path: '/admin/routes' },
    { label: 'Trips', path: '/admin/trips' },
    { label: 'Vehicles', path: '/admin/vehicles' },
  ];
  
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Logo */}
            <Link 
              to="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Bus className="w-8 h-8" />
              <span className="font-bold text-xl hidden sm:block">
                Transport<span className="text-primary-500">Book</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAdmin ? (
              // Admin Navigation
              <>
                <button 
                  onClick={() => handleNavigation('/admin')}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    adminActiveTab === 'customer-service' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🎫</span>
                  <span>Customer Service</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/admin/dashboard')}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    adminActiveTab === 'overview' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/admin/vehicles')}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    adminActiveTab === 'vehicles' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Vehicles</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/admin/schedule')}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    adminActiveTab === 'schedule' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/admin/analytics')}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    adminActiveTab === 'analytics' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </>
            ) : (
              // Customer Navigation
              <>
                <Link 
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>
                
                <Link 
                  to="/search"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/search' 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Search Trips
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to="/bookings"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/bookings' 
                        ? 'text-primary-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {currentUser?.firstName?.[0]}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser?.firstName}
                  </span>
                </button>
                
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      {!isAdmin && (
                        <Link
                          to="/bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <History className="w-4 h-4" />
                          <span>Booking History</span>
                        </Link>
                      )}
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Authentication Buttons
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3 animate-slide-up">
            {isAdmin ? (
              // Admin Mobile Navigation
              <>
                <button 
                  onClick={() => {
                    handleNavigation('/admin');
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === 'customer-service' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>🎫</span>
                  <span>Customer Service</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleNavigation('/admin/dashboard');
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === 'overview' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleNavigation('/admin/vehicles');
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === 'vehicles' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Vehicles</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleNavigation('/admin/schedule');
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === 'schedule' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleNavigation('/admin/analytics');
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === 'analytics' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </>
            ) : (
              // Customer Mobile Navigation
              <>
                <Link 
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                
                <Link 
                  to="/search"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/search' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Search Trips
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to="/bookings"
                    onClick={() => setShowMobileMenu(false)}
                    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === '/bookings' 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
              </>
            )}
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/profile' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex flex-col space-y-3 px-4 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="btn-secondary text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="btn-primary text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 