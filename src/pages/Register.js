import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ValidationRules, validateField, validatePasswordMatch, formatPhoneNumber } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { isAuthenticated, addNotification } = useApp();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleInputChange = (field, value) => {
    // Format phone number automatically
    if (field === 'phone' && value) {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      validateSingleField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    validateSingleField(field, formData[field]);
  };

  const validateSingleField = (field, value) => {
    let error = null;
    
    // Use validation rules
    if (field === 'firstName' || field === 'lastName') {
      const fieldErrors = validateField(value, ValidationRules.name);
      error = fieldErrors.length > 0 ? fieldErrors[0] : null;
    } else if (field === 'email') {
      const fieldErrors = validateField(value, ValidationRules.email);
      error = fieldErrors.length > 0 ? fieldErrors[0] : null;
    } else if (field === 'phone') {
      if (value && value.trim()) {
        const fieldErrors = validateField(value, ValidationRules.phone);
        error = fieldErrors.length > 0 ? fieldErrors[0] : null;
      }
    } else if (field === 'password') {
      const fieldErrors = validateField(value, ValidationRules.password);
      error = fieldErrors.length > 0 ? fieldErrors[0] : null;
    } else if (field === 'confirmPassword') {
      error = validatePasswordMatch(formData.password, value);
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error;
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateSingleField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Check terms agreement
    if (!agreeTerms) {
      addNotification({
        type: 'error',
        message: 'Please agree to the Terms and Conditions'
      });
      return false;
    }
    
    // Mark all fields as touched
    setTouched(Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
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
      // Register user
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      if (data.data.requiresEmailVerification) {
        // Send verification email via EmailJS
        const emailService = (await import('../services/emailService')).default;
        const otpCode = data.data.otpCode; // Available in development
        
        if (otpCode) {
          console.log('Sending email verification with OTP:', otpCode);
          await emailService.sendEmailVerification(
            formData.email,
            formData.firstName,
            otpCode
          );
        } else {
          console.warn('No OTP code received from backend');
        }
        
        addNotification({
          type: 'success',
          message: 'Account created! Please check your email for verification code.'
        });
        
        // Navigate to email verification page
        navigate('/verify-email', {
          state: {
            email: formData.email,
            firstName: formData.firstName
          }
        });
      } else {
        addNotification({
          type: 'success',
          message: 'Account created successfully! You can now sign in.'
        });
        navigate('/login');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        
        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    className={`input pl-10 ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 
                      touched.firstName && !errors.firstName ? 'border-green-500 focus:ring-green-500' : ''
                    }`}
                    placeholder="First name"
                  />
                  {touched.firstName && !errors.firstName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.firstName && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="label">
                  Last name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    className={`input ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 
                      touched.lastName && !errors.lastName ? 'border-green-500 focus:ring-green-500' : ''
                    }`}
                    placeholder="Last name"
                  />
                  {touched.lastName && !errors.lastName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.lastName && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
            
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
                  onBlur={() => handleBlur('email')}
                  className={`input pl-10 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 
                    touched.email && !errors.email ? 'border-green-500 focus:ring-green-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {touched.email && !errors.email && (
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
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="label">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`input pl-10 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 
                    touched.phone && !errors.phone && formData.phone ? 'border-green-500 focus:ring-green-500' : ''
                  }`}
                  placeholder="+60123456789"
                />
                {touched.phone && !errors.phone && formData.phone && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional. Malaysian phone number format (e.g., +60123456789)
              </p>
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`input pl-10 pr-20 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 
                    touched.password && !errors.password ? 'border-green-500 focus:ring-green-500' : ''
                  }`}
                  placeholder="Create a password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {touched.password && !errors.password && (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  )}
                  <button
                    type="button"
                    className="pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                Password must contain at least 8 characters with uppercase, lowercase, number, and special character
              </div>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`input pl-10 pr-20 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 
                    touched.confirmPassword && !errors.confirmPassword ? 'border-green-500 focus:ring-green-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {touched.confirmPassword && !errors.confirmPassword && (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  )}
                  <button
                    type="button"
                    className="pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary py-3 text-base ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="spinner mr-2" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
        
        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 