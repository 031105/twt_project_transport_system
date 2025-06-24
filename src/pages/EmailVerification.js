import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Shield, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import emailService from '../services/emailService';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useApp();
  
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email from navigation state or redirect to register
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      navigate('/register');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (value) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(numericValue);
    
    // Clear errors when user starts typing
    if (errors.otpCode) {
      setErrors(prev => ({ ...prev, otpCode: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!otpCode) {
      newErrors.otpCode = 'Verification code is required';
    } else if (otpCode.length !== 6) {
      newErrors.otpCode = 'Verification code must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otpCode: otpCode
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store tokens and user data
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        
        addNotification({
          type: 'success',
          message: 'Email verified successfully! Welcome to TransportBook.'
        });
        
        // Add a small delay to ensure notification is shown before redirect
        setTimeout(() => {
          window.location.href = '/'; // Reload to pick up the stored tokens
        }, 1000);
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      setErrors({ otpCode: error.message || 'Verification failed. Please try again.' });
      addNotification({
        type: 'error',
        message: error.message || 'Verification failed. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Send email via EmailJS
        const firstName = location.state?.firstName || 'User';
        const newOtpCode = data.otpCode; // This is only available in development
        
        console.log('New OTP generated for resend:', newOtpCode);
        
        if (newOtpCode) {
          // In development, we can use the OTP from response
          await emailService.sendEmailVerification(email, firstName, newOtpCode);
          console.log('New verification email sent with OTP:', newOtpCode);
        }
        
        addNotification({
          type: 'success',
          message: 'New verification code sent! Please check your email for the updated code.'
        });
        
        setResendCooldown(60); // 60 second cooldown
        setOtpCode(''); // Clear current code to force user to enter new one
        setErrors({}); // Clear any existing errors
      } else {
        throw new Error(data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend failed:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to resend verification code'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="text-left">
          <button
            onClick={handleBackToRegister}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Register
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-primary-600">{email}</p>
        </div>
        
        {/* Verification Form */}
        <form className="space-y-6" onSubmit={handleVerifyEmail}>
          <div>
            <label htmlFor="otpCode" className="label">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="otpCode"
                name="otpCode"
                type="text"
                value={otpCode}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`input pl-10 text-center text-2xl font-mono tracking-widest ${
                  errors.otpCode ? 'border-red-500 focus:ring-red-500' : 
                  otpCode.length === 6 ? 'border-green-500 focus:ring-green-500' : ''
                }`}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
              {otpCode.length === 6 && !errors.otpCode && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.otpCode && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.otpCode}
              </div>
            )}
          </div>
          
          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || otpCode.length !== 6}
            className={`w-full btn-primary py-3 text-base ${
              isVerifying || otpCode.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isVerifying ? (
              <>
                <div className="spinner mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>
        
        {/* Resend Section */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          
          <button
            onClick={handleResendCode}
            disabled={isResending || resendCooldown > 0}
            className={`inline-flex items-center text-sm font-medium ${
              isResending || resendCooldown > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary-600 hover:text-primary-500'
            } transition-colors`}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend in {resendCooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </>
            )}
          </button>
        </div>
        
        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="space-y-1 text-xs">
                <li>• The verification code expires in 15 minutes</li>
                <li>• Each resend generates a completely new code</li>
                <li>• Previous codes become invalid when you request a new one</li>
                <li>• Check your spam/junk folder if you don't see the email</li>
                <li>• Make sure {email} is correct</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 