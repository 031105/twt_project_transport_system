import { 
  calculateOccupancyRate, 
  calculateTravelTime, 
  calculateCO2Emissions, 
  calculateDynamicPrice 
} from './routeAnalysisApi';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to make API calls with authentication
const apiCall = async (endpoint, options = {}) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
  };
  
  try {
    console.log(`API Call: ${fetchOptions.method} ${url}`);
    const response = await fetch(url, fetchOptions);
    
    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API call failed:', errorText);
      
      // 尝试解析错误信息
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message || errorJson.error) {
          errorMessage = errorJson.message || errorJson.error;
        }
      } catch (e) {
        // 如果不是JSON格式，使用原始错误文本
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ==================== DASHBOARD STATISTICS ====================

export const getDashboardStats = async () => {
  return await apiCall('/admin/stats/overview');
};

export const getAnalyticsData = async () => {
  return await apiCall('/admin/stats/analytics');
};

// ==================== VEHICLE MANAGEMENT ====================

export const getVehicles = async () => {
  return await apiCall('/admin/vehicles');
};

export const addVehicle = async (vehicleData) => {
  return await apiCall('/admin/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicleData),
  });
};

export const updateVehicle = async (vehicleId, updateData) => {
  return await apiCall(`/admin/vehicles/${vehicleId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteVehicle = async (vehicleId) => {
  return await apiCall(`/admin/vehicles/${vehicleId}`, {
    method: 'DELETE',
  });
};

// ==================== ROUTE MANAGEMENT ====================

export const getRoutes = async () => {
  return await apiCall('/admin/routes');
};

export const getLocationsForRoutes = async () => {
  return await apiCall('/admin/locations');
};

export const createRoute = async (routeData) => {
  return await apiCall('/admin/routes', {
    method: 'POST',
    body: JSON.stringify(routeData),
  });
};

export const getRouteStops = async (routeId) => {
  return await apiCall(`/admin/routes/${routeId}/stops`);
};

export const getRoutePerformance = async () => {
  return await apiCall('/admin/analytics/routes');
};

// ==================== SCHEDULE MANAGEMENT ====================

export const getTodaysSchedule = async () => {
  return await apiCall('/admin/schedules/today');
};

export const getSchedules = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  return await apiCall(`/admin/schedules?${params.toString()}`);
};

export const getTripDetails = async (tripId) => {
  try {
    console.log('Getting trip details for ID:', tripId);
    const response = await apiCall(`/admin/trips/${tripId}`);
    return response;
  } catch (error) {
    console.error('Error getting trip details:', error);
    return {
      success: false,
      message: error.message || 'Failed to get trip details',
      // 返回一个空的数据结构，避免前端出现undefined错误
      data: {
        id: tripId,
        route_name: 'Unknown Route',
        trip_number: 'Unknown',
        status: 'unknown',
        origin_name: 'Unknown',
        destination_name: 'Unknown',
        origin_city: '',
        destination_city: '',
        base_price: 0,
        total_seats: 0,
        available_seats: 0,
        occupied_seats: 0,
        occupancy_percentage: 0,
        departure_datetime: new Date().toISOString(),
        estimated_arrival_datetime: new Date().toISOString(),
        vehicle_model: 'Unknown',
        vehicle_number: 'Unknown',
        license_plate: 'Unknown',
        vehicle_type: 'Unknown',
        stops: [],
        seat_pricing: [],
        pricing_rules: []
      }
    };
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    console.log('Creating schedule with data:', scheduleData);
    const response = await apiCall('/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
    return response;
  } catch (error) {
    console.error('Error creating schedule:', error);
    return {
      success: false,
      message: error.message || 'Failed to create schedule'
    };
  }
};

export const updateTrip = async (tripId, updateData) => {
  try {
    console.log('Updating trip with ID:', tripId, 'Data:', updateData);
    const response = await apiCall(`/admin/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response;
  } catch (error) {
    console.error('Error updating trip:', error);
    return {
      success: false,
      message: error.message || 'Failed to update trip'
    };
  }
};

export const deleteTrip = async (tripId) => {
  try {
    console.log('Deleting trip with ID:', tripId);
    const response = await apiCall(`/admin/trips/${tripId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete trip'
    };
  }
};

// ==================== CUSTOMER SERVICE ====================

export const searchTrips = async (searchParams) => {
  return await apiCall('/admin/search-trips', {
    method: 'POST',
    body: JSON.stringify(searchParams),
  });
};

// ==================== BOOKING MANAGEMENT ====================

export const createBooking = async (bookingData) => {
  return await apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const getBookingDetails = async (bookingId) => {
  return await apiCall(`/bookings/${bookingId}`);
};

export const updateBooking = async (bookingId, updateData) => {
  return await apiCall(`/bookings/${bookingId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

// ==================== LOCATIONS ====================

export const getLocations = async () => {
  return await apiCall('/locations');
};

// ==================== ANALYTICS ====================

export const getRouteAnalytics = async () => {
  return await apiCall('/admin/analytics/routes');
};

export const getRevenueAnalytics = async (period = '30') => {
  return await apiCall(`/admin/analytics/revenue?period=${period}`);
};

export const getOccupancyAnalytics = async (period = '30') => {
  return await apiCall(`/admin/analytics/occupancy?period=${period}`);
};

// ==================== UTILITY FUNCTIONS ====================

export const addMoreTrips = async () => {
  return await apiCall('/admin/add-more-trips', {
    method: 'POST',
  });
};

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time for display
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate occupancy percentage
export const calculateOccupancy = (occupiedSeats, totalSeats) => {
  if (totalSeats === 0) return 0;
  return Math.round((occupiedSeats / totalSeats) * 100);
};

// Get occupancy color class based on percentage
export const getOccupancyColorClass = (percentage) => {
  if (percentage >= 80) return 'text-red-600 bg-red-100';
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
  if (percentage >= 40) return 'text-blue-600 bg-blue-100';
  return 'text-green-600 bg-green-100';
};

// Error handler for API calls
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return 'Authentication failed. Please log in again.';
  }
  
  if (error.message.includes('403')) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'Resource not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// 站点管理API
export const getAllLocations = async () => {
  return await apiCall('/admin/locations');
};

export const getLocationById = async (locationId) => {
  return await apiCall(`/admin/locations/${locationId}`);
};

export const createLocation = async (locationData) => {
  return await apiCall('/admin/locations', {
    method: 'POST',
    body: JSON.stringify(locationData),
  });
};

export const updateLocation = async (locationId, locationData) => {
  return await apiCall(`/admin/locations/${locationId}`, {
    method: 'PUT',
    body: JSON.stringify(locationData),
  });
};

export const deleteLocation = async (locationId) => {
  return await apiCall(`/admin/locations/${locationId}`, {
    method: 'DELETE',
  });
};

// 路线管理API
export const getAllRoutes = async () => {
  return await apiCall('/admin/routes');
};

export const getRouteById = async (routeId) => {
  return await apiCall(`/admin/routes/${routeId}`);
};

export const updateRoute = async (routeId, routeData) => {
  return await apiCall(`/admin/routes/${routeId}`, {
    method: 'PUT',
    body: JSON.stringify(routeData),
  });
};

export const deleteRoute = async (routeId) => {
  return await apiCall(`/admin/routes/${routeId}`, {
    method: 'DELETE',
  });
};

// 获取热门行程
export const getPopularTrips = async () => {
  return await apiCall('/admin/popular-trips');
};

// 重新导出这些函数，以便现有代码能够正常工作
export { 
  calculateOccupancyRate, 
  calculateTravelTime, 
  calculateCO2Emissions, 
  calculateDynamicPrice 
};

export default {
  getDashboardStats,
  getAnalyticsData,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getRoutes,
  getLocationsForRoutes,
  createRoute,
  getRouteStops,
  getRoutePerformance,
  getTodaysSchedule,
  getSchedules,
  getTripDetails,
  createSchedule,
  searchTrips,
  createBooking,
  getBookingDetails,
  updateBooking,
  getLocations,
  getRouteAnalytics,
  getRevenueAnalytics,
  getOccupancyAnalytics,
  addMoreTrips,
  formatCurrency,
  formatDate,
  formatTime,
  calculateOccupancy,
  getOccupancyColorClass,
  handleApiError,
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getPopularTrips,
  updateTrip,
  deleteTrip,
}; 