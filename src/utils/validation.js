import { useState } from 'react';

// Validation utility functions and rules
export const ValidationRules = {
  // Name validation
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 50 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },

  // Email validation
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 320,
    message: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
      maxLength: 'Email cannot exceed 320 characters'
    }
  },

  // Phone validation (Malaysian format)
  phone: {
    required: false,
    pattern: /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/,
    message: {
      pattern: 'Please enter a valid Malaysian phone number (e.g., +60123456789)'
    }
  },

  // Password validation
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    patterns: {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      special: /[!@#$%^&*(),.?":{}|<>]/
    },
    message: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      maxLength: 'Password cannot exceed 128 characters',
      lowercase: 'Password must contain at least one lowercase letter',
      uppercase: 'Password must contain at least one uppercase letter',
      number: 'Password must contain at least one number',
      special: 'Password must contain at least one special character'
    }
  },

  // Location validation
  location: {
    required: true,
    message: {
      required: 'Please select a location',
      different: 'Origin and destination must be different'
    }
  },

  // Date validation
  date: {
    required: true,
    futureOnly: true,
    message: {
      required: 'Date is required',
      futureOnly: 'Date must be in the future',
      invalid: 'Please enter a valid date'
    }
  },

  // Price validation
  price: {
    required: true,
    min: 0,
    max: 9999.99,
    decimal: 2,
    message: {
      required: 'Price is required',
      min: 'Price cannot be negative',
      max: 'Price cannot exceed RM 9,999.99',
      number: 'Price must be a valid number'
    }
  },

  // Coordinates validation
  latitude: {
    required: false,
    min: -90,
    max: 90,
    message: {
      min: 'Latitude must be between -90 and 90',
      max: 'Latitude must be between -90 and 90',
      number: 'Latitude must be a valid number'
    }
  },

  longitude: {
    required: false,
    min: -180,
    max: 180,
    message: {
      min: 'Longitude must be between -180 and 180',
      max: 'Longitude must be between -180 and 180',
      number: 'Longitude must be a valid number'
    }
  },

  // Passenger count validation
  passengers: {
    required: true,
    min: 1,
    max: 8,
    integer: true,
    message: {
      required: 'Number of passengers is required',
      min: 'At least 1 passenger is required',
      max: 'Maximum 8 passengers allowed',
      integer: 'Number of passengers must be a whole number'
    }
  },

  // Card number validation
  cardNumber: {
    required: true,
    pattern: /^[0-9]{13,19}$/,
    message: {
      required: 'Card number is required',
      pattern: 'Please enter a valid card number (13-19 digits)'
    }
  },

  // CVV validation
  cvv: {
    required: true,
    pattern: /^[0-9]{3,4}$/,
    message: {
      required: 'CVV is required',
      pattern: 'CVV must be 3 or 4 digits'
    }
  },

  // Expiry date validation
  expiryDate: {
    required: true,
    pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
    message: {
      required: 'Expiry date is required',
      pattern: 'Please enter date in MM/YY format',
      expired: 'Card has expired'
    }
  },

  // Postal code validation
  postalCode: {
    required: false,
    pattern: /^[0-9]{5}$/,
    message: {
      pattern: 'Postal code must be 5 digits'
    }
  },

  // Location code validation
  locationCode: {
    required: false,
    pattern: /^[A-Z0-9]{2,10}$/,
    maxLength: 10,
    message: {
      pattern: 'Location code must contain only uppercase letters and numbers',
      maxLength: 'Location code cannot exceed 10 characters'
    }
  }
};

// Validation functions
export const validateField = (value, rule) => {
  const errors = [];

  // Required validation
  if (rule.required && (!value || value.toString().trim() === '')) {
    errors.push(rule.message.required);
    return errors;
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors;
  }

  const stringValue = value.toString().trim();

  // Length validations
  if (rule.minLength && stringValue.length < rule.minLength) {
    errors.push(rule.message.minLength);
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    errors.push(rule.message.maxLength);
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    errors.push(rule.message.pattern);
  }

  // Multiple pattern validations (for password)
  if (rule.patterns) {
    Object.keys(rule.patterns).forEach(key => {
      if (!rule.patterns[key].test(stringValue)) {
        errors.push(rule.message[key]);
      }
    });
  }

  // Numeric validations
  if (rule.min !== undefined || rule.max !== undefined || rule.integer) {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      errors.push(rule.message.number || 'Must be a valid number');
    } else {
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push(rule.message.min);
      }
      
      if (rule.max !== undefined && numValue > rule.max) {
        errors.push(rule.message.max);
      }
      
      if (rule.integer && !Number.isInteger(numValue)) {
        errors.push(rule.message.integer);
      }
    }
  }

  // Date validations
  if (rule.futureOnly) {
    const dateValue = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateValue < today) {
      errors.push(rule.message.futureOnly);
    }
  }

  return errors;
};

// Validate multiple fields
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const fieldErrors = validateField(formData[fieldName], rules[fieldName]);
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors[0]; // Show first error only
    }
  });
  
  return errors;
};

// Custom validation functions
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateLocationsDifferent = (origin, destination) => {
  if (origin && destination && origin === destination) {
    return 'Origin and destination must be different';
  }
  return null;
};

export const validateDateRange = (startDate, endDate) => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return 'End date must be after start date';
    }
  }
  return null;
};

export const validateCardExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  
  const match = expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!match) return 'Please enter date in MM/YY format';
  
  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

// Format functions
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = cleaned.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return cleaned;
  }
};

export const formatExpiryDate = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,2})(\d{0,2})$/);
  
  if (match) {
    const month = match[1];
    const year = match[2];
    
    if (month.length === 1 && parseInt(month) > 1) {
      return '0' + month + (year ? '/' + year : '');
    }
    
    if (month.length === 2) {
      const monthNum = parseInt(month);
      if (monthNum > 12) {
        return '12' + (year ? '/' + year : '');
      }
      return month + (year ? '/' + year : '');
    }
    
    return month;
  }
  
  return cleaned;
};

export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.startsWith('60')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+6' + cleaned;
  } else if (cleaned.length >= 9) {
    return '+60' + cleaned;
  }
  
  return value;
};

// Real-time validation hook
export const useValidation = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateSingleField = (fieldName, value) => {
    if (validationRules[fieldName]) {
      const fieldErrors = validateField(value, validationRules[fieldName]);
      return fieldErrors.length > 0 ? fieldErrors[0] : null;
    }
    return null;
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error if field becomes valid
    if (touched[fieldName]) {
      const error = validateSingleField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    const error = validateSingleField(fieldName, formData[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const validateAll = () => {
    const allErrors = validateForm(formData, validationRules);
    setErrors(allErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    return Object.keys(allErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
}; 