import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import emailService from '../services/emailService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (value) => {
    setEmail(value);
    
    // Clear errors when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Request temporary password from backend
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // If we have temp password (development mode), send email
        if (data.tempPassword) {
          // Get user's first name from email (basic approach)
          const firstName = email.split('@')[0].split('.')[0];
          const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
          
          await emailService.sendTempPassword(email, capitalizedName, data.tempPassword);
        }
        
        setIsSuccess(true);
        addNotification({
          type: 'success',
          message: 'If your email exists in our system, you will receive a temporary password shortly.'
        });
      } else {
        throw new Error(data.error || 'Failed to process password reset request');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to process password reset request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendRequest = () => {
    setIsSuccess(false);
    setEmail('');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success State */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-2">
              If an account with the email <strong>{email}</strong> exists, 
              you will receive a temporary password shortly.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Please check your inbox and spam folder.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleBackToLogin}
                className="w-full btn-primary"
              >
                Back to Login
              </button>
              
              <button
                onClick={handleResendRequest}
                className="w-full btn-outline"
              >
                Try Different Email
              </button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Next Steps:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Check your email for the temporary password</li>
                  <li>• Use the temporary password to log in</li>
                  <li>• Change your password immediately after logging in</li>
                  <li>• The temporary password expires in 30 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="text-left">
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email address and we'll send you a temporary password.
          </p>
        </div>
        
        {/* Forgot Password Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="label">
              Email Address
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
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`input pl-10 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 
                  email && validateEmail(email) ? 'border-green-500 focus:ring-green-500' : ''
                }`}
                placeholder="Enter your email address"
              />
              {email && validateEmail(email) && !errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.email && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email || !validateEmail(email)}
            className={`w-full btn-primary py-3 text-base ${
              isSubmitting || !email || !validateEmail(email) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="spinner mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Temporary Password
              </>
            )}
          </button>
        </form>
        
        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
        
        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Security Notice:</p>
              <ul className="space-y-1 text-xs">
                <li>• Temporary passwords expire in 30 minutes</li>
                <li>• You must change your password after logging in</li>
                <li>• If you don't receive an email, check your spam folder</li>
                <li>• Only recent account activity will receive temporary passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 