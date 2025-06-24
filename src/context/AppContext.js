import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { mockUsers, mockApi } from '../data/mockData';

// Initial state
const initialState = {
  // System Settings
  systemDate: '2025-06-24', // Fixed project date instead of real-time
  
  // User & Auth
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  
  // Search & Booking
  searchParams: {
    origin: '',
    destination: '',
    date: '2025-06-24'
  },
  searchResults: [],
  selectedTrip: null,
  selectedSeat: null,
  
  // Locations
  locations: [],
  locationsLoading: false,
  
  // Booking Process
  bookingInProgress: null,
  bookingHistory: [],
  
  // UI State
  sidebarOpen: false,
  notifications: [],
  
  // Error handling
  error: null
};

// Action types
export const ACTIONS = {
  // System actions
  SET_SYSTEM_DATE: 'SET_SYSTEM_DATE',
  
  // Auth actions
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  
  // Search actions
  SET_SEARCH_PARAMS: 'SET_SEARCH_PARAMS',
  SEARCH_TRIPS_START: 'SEARCH_TRIPS_START',
  SEARCH_TRIPS_SUCCESS: 'SEARCH_TRIPS_SUCCESS',
  SEARCH_TRIPS_FAILURE: 'SEARCH_TRIPS_FAILURE',
  
  // Location actions
  LOAD_LOCATIONS_START: 'LOAD_LOCATIONS_START',
  LOAD_LOCATIONS_SUCCESS: 'LOAD_LOCATIONS_SUCCESS',
  LOAD_LOCATIONS_FAILURE: 'LOAD_LOCATIONS_FAILURE',
  
  // Booking actions
  SELECT_TRIP: 'SELECT_TRIP',
  SELECT_SEAT: 'SELECT_SEAT',
  CREATE_BOOKING_START: 'CREATE_BOOKING_START',
  CREATE_BOOKING_SUCCESS: 'CREATE_BOOKING_SUCCESS',
  CREATE_BOOKING_FAILURE: 'CREATE_BOOKING_FAILURE',
  LOAD_BOOKING_HISTORY: 'LOAD_BOOKING_HISTORY',
  
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SYSTEM_DATE:
      return {
        ...state,
        systemDate: action.payload
      };
      
    case ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case ACTIONS.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        bookingHistory: [],
        bookingInProgress: null,
        selectedTrip: null,
        selectedSeat: null
      };
      
    case ACTIONS.SET_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: { ...state.searchParams, ...action.payload }
      };
      
    case ACTIONS.SEARCH_TRIPS_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case ACTIONS.SEARCH_TRIPS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        isLoading: false,
        error: null
      };
      
    case ACTIONS.SEARCH_TRIPS_FAILURE:
      return {
        ...state,
        searchResults: [],
        isLoading: false,
        error: action.payload
      };
      
    case ACTIONS.LOAD_LOCATIONS_START:
      return {
        ...state,
        locationsLoading: true,
        error: null
      };
      
    case ACTIONS.LOAD_LOCATIONS_SUCCESS:
      return {
        ...state,
        locations: action.payload,
        locationsLoading: false,
        error: null
      };
      
    case ACTIONS.LOAD_LOCATIONS_FAILURE:
      return {
        ...state,
        locations: [],
        locationsLoading: false,
        error: action.payload
      };
      
    case ACTIONS.SELECT_TRIP:
      return {
        ...state,
        selectedTrip: action.payload,
        selectedSeat: null // Reset seat selection when trip changes
      };
      
    case ACTIONS.SELECT_SEAT:
      return {
        ...state,
        selectedSeat: action.payload
      };
      
    case ACTIONS.CREATE_BOOKING_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case ACTIONS.CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        bookingInProgress: action.payload,
        isLoading: false,
        error: null
      };
      
    case ACTIONS.CREATE_BOOKING_FAILURE:
      return {
        ...state,
        bookingInProgress: null,
        isLoading: false,
        error: action.payload
      };
      
    case ACTIONS.LOAD_BOOKING_HISTORY:
      return {
        ...state,
        bookingHistory: action.payload
      };
      
    case ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
      };
      
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Auto-login from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: user });
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  
  // Load locations on app start
  useEffect(() => {
    const loadInitialLocations = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/locations');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: ACTIONS.LOAD_LOCATIONS_SUCCESS, payload: data.data || [] });
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
      }
    };
    
    loadInitialLocations();
  }, []);
  
  // Load user bookings when user logs in
  useEffect(() => {
    if (state.isAuthenticated && state.currentUser) {
      loadBookingHistory();
    }
  }, [state.isAuthenticated, state.currentUser]);
  
  // Action creators
  const login = async (email, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Login failed');
      }
      
      const data = await response.json();
      const user = data.data.user;
      const token = data.data.tokens.accessToken;
      
      // Save user and token to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: user });
      addNotification({ type: 'success', message: `Welcome back, ${user.firstName || user.email}!` });
      return user;
    } catch (error) {
      dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: error.message });
      addNotification({ type: 'error', message: error.message });
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: ACTIONS.LOGOUT });
    addNotification({
      type: 'success',
      message: 'You have been logged out successfully'
    });
  };

  const setSystemDate = (date) => {
    dispatch({ type: ACTIONS.SET_SYSTEM_DATE, payload: date });
  };
  
  const searchTrips = async (searchParams) => {
    dispatch({ type: ACTIONS.SEARCH_TRIPS_START });
    try {
      const token = localStorage.getItem('accessToken');
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`http://localhost:5001/api/trips?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to search trips');
      }
      
      const data = await response.json();
      const results = data.data || [];
      dispatch({ type: ACTIONS.SEARCH_TRIPS_SUCCESS, payload: results });
      dispatch({ type: ACTIONS.SET_SEARCH_PARAMS, payload: searchParams });
      return results;
    } catch (error) {
      dispatch({ type: ACTIONS.SEARCH_TRIPS_FAILURE, payload: error.message });
      throw error;
    }
  };
  
  const loadAllTrips = async () => {
    dispatch({ type: ACTIONS.SEARCH_TRIPS_START });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load trips');
      }
      
      const data = await response.json();
      const results = data.data || [];
      
      // Process the trips to ensure next_departure is available
      const processedResults = results.map(trip => {
        return {
          ...trip,
          next_departure: trip.departureDatetime,
          route: {
            ...trip.route,
            next_departure: trip.departureDatetime
          }
        };
      });
      
      dispatch({ type: ACTIONS.SEARCH_TRIPS_SUCCESS, payload: processedResults });
      dispatch({ type: ACTIONS.SET_SEARCH_PARAMS, payload: { origin: '', destination: '', date: '' } });
      return processedResults;
    } catch (error) {
      dispatch({ type: ACTIONS.SEARCH_TRIPS_FAILURE, payload: error.message });
      throw error;
    }
  };
  
  const loadLocations = async () => {
    dispatch({ type: ACTIONS.LOAD_LOCATIONS_START });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load locations');
      }
      
      const data = await response.json();
      const locations = data.data || [];
      dispatch({ type: ACTIONS.LOAD_LOCATIONS_SUCCESS, payload: locations });
      return locations;
    } catch (error) {
      dispatch({ type: ACTIONS.LOAD_LOCATIONS_FAILURE, payload: error.message });
      throw error;
    }
  };
  
  const selectTrip = async (trip) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/trips/${trip.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load trip details');
      }
      
      const data = await response.json();
      const tripDetails = data.data;
      dispatch({ type: ACTIONS.SELECT_TRIP, payload: tripDetails });
      return tripDetails;
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to load trip details' });
      throw error;
    }
  };
  
  const selectSeat = (seat) => {
    dispatch({ type: ACTIONS.SELECT_SEAT, payload: seat });
  };
  
  const createBooking = async (bookingData) => {
    dispatch({ type: ACTIONS.CREATE_BOOKING_START });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create booking');
      }
      
      const data = await response.json();
      const booking = data.data;
      dispatch({ type: ACTIONS.CREATE_BOOKING_SUCCESS, payload: booking });
      addNotification({ type: 'success', message: `Booking created successfully! Reference: ${booking.booking_reference || booking.id}` });
      return booking;
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_BOOKING_FAILURE, payload: error.message });
      addNotification({ type: 'error', message: 'Failed to create booking. Please try again.' });
      throw error;
    }
  };
  
  const processPayment = async (paymentData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Payment failed');
      }
      
      const data = await response.json();
      const payment = data.data;
      if (payment.status === 'completed') {
        addNotification({ type: 'success', message: 'Payment completed successfully!' });
        loadBookingHistory();
      } else {
        addNotification({ type: 'error', message: payment.failureReason || 'Payment failed. Please try again.' });
      }
      return payment;
    } catch (error) {
      addNotification({ type: 'error', message: 'Payment processing failed. Please try again.' });
      throw error;
    }
  };
  
  const loadBookingHistory = async () => {
    if (!state.currentUser) {
      console.log('No current user, skipping booking history load');
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Loading booking history for user:', state.currentUser.id);
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No access token found');
        return;
      }
      
      const response = await fetch(`http://localhost:5001/api/bookings/user/${state.currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log('Booking history request failed:', response.status, response.statusText);
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load booking history');
      }
      
      const data = await response.json();
      const bookings = data.data || [];
      console.log('Loaded bookings:', bookings.length);
      dispatch({ type: ACTIONS.LOAD_BOOKING_HISTORY, payload: bookings });
    } catch (error) {
      console.error('Failed to load booking history:', error);
    }
  };
  
  const addNotification = (notification) => {
    const notificationWithId = { id: Date.now(), ...notification };
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notificationWithId });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notificationWithId.id });
    }, 5000);
  };
  
  const removeNotification = (id) => {
    dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };
  
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };
  
  const toggleSidebar = () => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  };
  
  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    setSystemDate,
    searchTrips,
    loadAllTrips,
    loadLocations,
    selectTrip,
    selectSeat,
    createBooking,
    processPayment,
    loadBookingHistory,
    addNotification,
    removeNotification,
    clearError,
    toggleSidebar
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 