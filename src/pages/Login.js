import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, isAuthenticated, isLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in the login function
    }
  };
  
  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    // Auto-submit after a short delay
    setTimeout(() => {
      login(email, password).then(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }).catch(() => {
        // Error handling is done in the login function
      });
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="text-left">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Demo Accounts */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 text-center">
            Demo Accounts (Click to login)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Regular User Demo */}
            <button
              onClick={() => handleDemoLogin('john.doe@email.com', 'password123')}
              className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Regular User</div>
              </div>
            </button>
            
            {/* Admin Demo */}
            <button
              onClick={() => handleDemoLogin('admin@transportbooking.com', 'password123')}
              className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-primary-50 text-gray-500">Or sign in manually</span>
          </div>
        </div>
        
        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          
          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary py-3 text-base ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="spinner mr-2" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 