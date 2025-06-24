// Mock data for Transport Booking System - Student Project

import { addDays, format } from 'date-fns';

// Helper function to generate UUIDs for mock data
const generateId = () => Math.random().toString(36).substr(2, 9);

// Enhanced locations with coordinates for better mapping
export const mockLocations = [
  {
    id: 'loc-1',
    name: 'KL Sentral Terminal',
    city: 'Kuala Lumpur',
    state: 'Federal Territory',
    country: 'Malaysia',
    coordinates: [3.1390, 101.6869],
    address: 'KL Sentral, 50470 Kuala Lumpur'
  },
  {
    id: 'loc-2',
    name: 'Terminal Bersepadu Selatan',
    city: 'Johor Bahru',
    state: 'Johor',
    country: 'Malaysia',
    coordinates: [1.4854, 103.7618],
    address: 'Jalan Tun Abdul Razak, 80000 Johor Bahru'
  },
  {
    id: 'loc-3',
    name: 'Komtar Bus Terminal',
    city: 'George Town',
    state: 'Penang',
    country: 'Malaysia',
    coordinates: [5.4164, 100.3327],
    address: 'Jalan Dr Lim Chwee Leong, 10000 George Town'
  },
  {
    id: 'loc-4',
    name: 'Melaka Sentral',
    city: 'Malacca City',
    state: 'Malacca',
    country: 'Malaysia',
    coordinates: [2.1896, 102.2501],
    address: 'Jalan Tun Razak, 75400 Melaka'
  },
  {
    id: 'loc-5',
    name: 'Terminal Amanjaya',
    city: 'Ipoh',
    state: 'Perak',
    country: 'Malaysia',
    coordinates: [4.5975, 101.0901],
    address: 'Jalan Ampang, 30200 Ipoh'
  },
  {
    id: 'loc-6',
    name: 'Seremban Terminal',
    city: 'Seremban',
    state: 'Negeri Sembilan',
    country: 'Malaysia',
    coordinates: [2.7297, 101.9381],
    address: 'Jalan Sungai Ujong, 70200 Seremban'
  },
  {
    id: 'loc-7',
    name: 'Genting Skyway Terminal',
    city: 'Genting Highlands',
    state: 'Pahang',
    country: 'Malaysia',
    coordinates: [3.4213, 101.7936],
    address: 'Genting Highlands Resort, 69000 Genting Highlands'
  },
  {
    id: 'loc-8',
    name: 'Kuantan Terminal',
    city: 'Kuantan',
    state: 'Pahang',
    country: 'Malaysia',
    coordinates: [3.8077, 103.3260],
    address: 'Jalan Stadium, 25000 Kuantan'
  }
];

// Mock vehicle types
export const mockVehicleTypes = [
  {
    id: 'vt-1',
    name: 'Standard Bus',
    capacity: 45,
    description: 'Regular bus with standard seating'
  },
  {
    id: 'vt-2',
    name: 'Luxury Coach',
    capacity: 30,
    description: 'Premium bus with comfortable seating and amenities'
  },
  {
    id: 'vt-3',
    name: 'Mini Van',
    capacity: 12,
    description: 'Small vehicle for shorter routes'
  }
];

// Mock vehicles
export const mockVehicles = [
  {
    id: 'v-1',
    plateNumber: 'TBS-001',
    vehicleNumber: 'TBS-001',
    vehicleTypeId: 'vt-1',
    model: 'Mercedes OH1830',
    year: 2022,
    status: 'active',
    capacity: 45,
    mileage: 125000,
    lastService: '2024-11-15'
  },
  {
    id: 'v-2',
    plateNumber: 'TBS-002',
    vehicleNumber: 'TBS-002',
    vehicleTypeId: 'vt-2',
    model: 'Scania K410IB',
    year: 2023,
    status: 'active',
    capacity: 30,
    mileage: 85000,
    lastService: '2024-11-20'
  },
  {
    id: 'v-3',
    plateNumber: 'TBS-003',
    vehicleNumber: 'TBS-003',
    vehicleTypeId: 'vt-3',
    model: 'Toyota Hiace',
    year: 2021,
    status: 'active',
    capacity: 12,
    mileage: 95000,
    lastService: '2024-11-10'
  },
  {
    id: 'v-4',
    plateNumber: 'TBS-004',
    vehicleNumber: 'TBS-004',
    vehicleTypeId: 'vt-1',
    model: 'Volvo B8R',
    year: 2022,
    status: 'active',
    capacity: 45,
    mileage: 110000,
    lastService: '2024-11-25'
  }
];

// Mock routes with multiple intermediate stops
export const mockRoutes = [
  {
    id: 'r-1',
    name: 'KL - Johor Express',
    originId: 'loc-1',
    destinationId: 'loc-2',
    basePrice: 45.00,
    durationHours: 5,
    distanceKm: 350,
    isActive: true,
    intermediateStops: [
      {
        locationId: 'loc-6', // Seremban
        stopNumber: 1,
        arrivalOffset: 60, // 1 hour from start
        departureOffset: 70, // 10 minute stop
        additionalPrice: 15.00,
        distanceFromOrigin: 65
      },
      {
        locationId: 'loc-4', // Malacca
        stopNumber: 2,
        arrivalOffset: 120, // 2 hours from start
        departureOffset: 135, // 15 minute stop
        additionalPrice: 25.00,
        distanceFromOrigin: 147
      }
    ],
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    frequency: 'daily',
    estimatedFuelCost: 45.0,
    tollCharges: 18.0,
    averageSpeed: 70,
    routeWaypoints: [
      [3.1390, 101.6869], // KL Sentral
      [3.0319, 101.7094], // Cheras area
      [2.9167, 101.7500], // Nilai
      [2.7297, 101.9381], // Seremban
      [2.3167, 102.0500], // Rembau area
      [2.1896, 102.2501]  // Malacca
    ]
  },
  {
    id: 'r-2',
    name: 'KL - Penang Highway',
    originId: 'loc-1',
    destinationId: 'loc-3',
    basePrice: 55.00,
    durationHours: 4,
    distanceKm: 365,
    isActive: true,
    intermediateStops: [
      {
        locationId: 'loc-7', // Genting (optional tourist stop)
        stopNumber: 1,
        arrivalOffset: 45,
        departureOffset: 50, // 5 minute stop
        additionalPrice: 20.00,
        distanceFromOrigin: 55
      },
      {
        locationId: 'loc-5', // Ipoh
        stopNumber: 2,
        arrivalOffset: 150,
        departureOffset: 165, // 15 minute stop
        additionalPrice: 30.00,
        distanceFromOrigin: 205
      }
    ],
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    frequency: 'daily',
    estimatedFuelCost: 52.0,
    tollCharges: 22.0,
    averageSpeed: 75,
    routeWaypoints: [
      [3.1390, 101.6869], // KL Sentral
      [3.2167, 101.7167], // Gombak area
      [3.4213, 101.7936], // Genting (via Karak Highway)
      [3.8000, 101.5333], // Bentong area
      [4.1167, 101.1500], // Tapah area
      [4.5975, 101.0901], // Ipoh
      [4.8500, 100.9333], // Kuala Kangsar
      [5.1167, 100.7500], // Taiping area
      [5.4164, 100.3327]  // Penang
    ]
  },
  {
    id: 'r-3',
    name: 'KL - Malacca Direct',
    originId: 'loc-1',
    destinationId: 'loc-4',
    basePrice: 25.00,
    durationHours: 2,
    distanceKm: 147,
    isActive: true,
    intermediateStops: [
      {
        locationId: 'loc-6', // Seremban
        stopNumber: 1,
        arrivalOffset: 60,
        departureOffset: 65, // 5 minute stop
        additionalPrice: 15.00,
        distanceFromOrigin: 65
      }
    ],
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    frequency: 'weekdays',
    estimatedFuelCost: 20.0,
    tollCharges: 8.0,
    averageSpeed: 70,
    routeWaypoints: [
      [3.1390, 101.6869], // KL
      [2.7297, 101.9381], // Seremban
      [2.1896, 102.2501]  // Malacca
    ]
  },
  {
    id: 'r-4',
    name: 'Ipoh - Penang Express',
    originId: 'loc-5',
    destinationId: 'loc-3',
    basePrice: 30.00,
    durationHours: 2,
    distanceKm: 125,
    isActive: true,
    intermediateStops: [],
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    frequency: 'daily',
    estimatedFuelCost: 18.0,
    tollCharges: 12.0,
    averageSpeed: 65,
    routeWaypoints: [
      [4.5975, 101.0901], // Ipoh
      [4.8500, 100.9333], // Kuala Kangsar
      [5.1167, 100.7500], // Taiping area
      [5.4164, 100.3327]  // Penang
    ]
  },
  {
    id: 'r-5',
    name: 'KL - East Coast Express',
    originId: 'loc-1',
    destinationId: 'loc-8',
    basePrice: 65.00,
    durationHours: 4.5,
    distanceKm: 280,
    isActive: true,
    intermediateStops: [
      {
        locationId: 'loc-7', // Genting
        stopNumber: 1,
        arrivalOffset: 50,
        departureOffset: 60, // 10 minute stop
        additionalPrice: 20.00,
        distanceFromOrigin: 55
      }
    ],
    operatingDays: ['friday', 'saturday', 'sunday'],
    frequency: 'weekend',
    estimatedFuelCost: 38.0,
    tollCharges: 15.0,
    averageSpeed: 62,
    routeWaypoints: [
      [3.1390, 101.6869], // KL Sentral
      [3.2167, 101.7167], // Gombak area
      [3.4213, 101.7936], // Genting
      [3.6500, 102.2500], // Bentong
      [3.7833, 102.9167], // Temerloh area
      [3.8077, 103.3260]  // Kuantan
    ]
  }
];

// Enhanced trip generation with occupation tracking
export const generateMockTrips = () => {
  const trips = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const tripDate = addDays(today, i);
    
    // Generate multiple trips per day for each route
    mockRoutes.forEach((route, routeIndex) => {
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][tripDate.getDay()];
      
      if (route.operatingDays.includes(dayName)) {
        // Morning trip
        const morningTrip = {
          id: `trip-${route.id}-${i}-morning`,
          routeId: route.id,
          vehicleId: `v-${routeIndex + 1}`,
          departureDatetime: new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate(), 7 + routeIndex, 0),
          arrivalDatetime: new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate(), 7 + routeIndex + route.durationHours, 0),
          totalSeats: 45,
          availableSeats: Math.floor(Math.random() * 25) + 15, // 15-40 available
          status: 'scheduled'
        };
        trips.push(morningTrip);
        
        // Afternoon trip (if it's a popular route)
        if (routeIndex < 3) {
          const afternoonTrip = {
            id: `trip-${route.id}-${i}-afternoon`,
            routeId: route.id,
            vehicleId: `v-${routeIndex + 2}`,
            departureDatetime: new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate(), 14 + routeIndex, 0),
            arrivalDatetime: new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate(), 14 + routeIndex + route.durationHours, 0),
            totalSeats: 45,
            availableSeats: Math.floor(Math.random() * 30) + 10, // 10-40 available
            status: 'scheduled'
          };
          trips.push(afternoonTrip);
        }
      }
    });
  }
  
  return trips;
};

// Mock seats generation
export const generateMockSeats = (tripId, capacity, basePrice) => {
  const seats = [];
  const seatsPerRow = 4;
  const rows = Math.ceil(capacity / seatsPerRow);
  
  for (let row = 1; row <= rows; row++) {
    for (const col of ['A', 'B', 'C', 'D']) {
      if (seats.length >= capacity) break;
      
      seats.push({
        id: `seat-${tripId}-${row}${col}`,
        tripId: tripId,
        seatNumber: `${row}${col}`,
        price: basePrice,
        isAvailable: Math.random() > 0.1 // 90% available
      });
    }
  }
  
  return seats;
};

// Mock users
export const mockUsers = [
  {
    id: 'user-admin',
    email: 'admin@transportbooking.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+60123456789',
    role: 'admin',
    isActive: true
  },
  {
    id: 'user-1',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+60187654321',
    role: 'user',
    isActive: true
  },
  {
    id: 'user-2',
    email: 'jane.smith@email.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+60198765432',
    role: 'user',
    isActive: true
  }
];

// Mock bookings
export const mockBookings = [
  {
    id: 'booking-1',
    bookingReference: 'TBS20240115001',
    userId: 'user-1',
    tripId: 'trip-r-1-1-morning',
    seatId: 'seat-trip-r-1-1-morning-1A',
    passengerName: 'John Doe',
    passengerPhone: '+60187654321',
    passengerEmail: 'john.doe@email.com',
    totalAmount: 45.00,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: new Date(),
    travelDate: addDays(new Date(), 1)
  },
  {
    id: 'booking-2',
    bookingReference: 'TBS20240115002',
    userId: 'user-2',
    tripId: 'trip-r-2-2-afternoon',
    seatId: 'seat-trip-r-2-2-afternoon-2A',
    passengerName: 'Jane Smith',
    passengerPhone: '+60198765432',
    passengerEmail: 'jane.smith@email.com',
    totalAmount: 55.00,
    bookingStatus: 'pending',
    paymentStatus: 'pending',
    bookingDate: new Date(),
    travelDate: addDays(new Date(), 2)
  }
];

// Mock payments
export const mockPayments = [
  {
    id: 'payment-1',
    bookingId: 'booking-1',
    amount: 45.00,
    paymentMethod: 'credit_card',
    mockTransactionId: 'MOCK_TXN_20240115_123456',
    cardLastFour: '1111',
    status: 'completed',
    processedAt: new Date()
  }
];

// Helper functions for mock API
export const mockApi = {
  // Search trips
  searchTrips: async ({ origin, destination, date }) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const trips = generateMockTrips();
    const searchDate = new Date(date);
    
    return trips.filter(trip => {
      const route = mockRoutes.find(r => r.id === trip.routeId);
      const tripDate = trip.departureDatetime;
      
      return route && 
             route.originId === origin && 
             route.destinationId === destination &&
             tripDate.toDateString() === searchDate.toDateString();
    }).map(trip => {
      const route = mockRoutes.find(r => r.id === trip.routeId);
      const vehicle = mockVehicles.find(v => v.id === trip.vehicleId);
      const vehicleType = vehicle ? mockVehicleTypes.find(vt => vt.id === vehicle.vehicleTypeId) : null;
      const originLocation = mockLocations.find(l => l.id === route?.originId);
      const destinationLocation = mockLocations.find(l => l.id === route?.destinationId);
      
      return {
        ...trip,
        route,
        vehicle,
        vehicleType,
        originLocation,
        destinationLocation
      };
    });
  },
  
  // Get all trips
  getAllTrips: async () => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
    
    const trips = generateMockTrips();
    
    return trips.map(trip => {
      const route = mockRoutes.find(r => r.id === trip.routeId);
      const vehicle = mockVehicles.find(v => v.id === trip.vehicleId);
      const vehicleType = vehicle ? mockVehicleTypes.find(vt => vt.id === vehicle.vehicleTypeId) : null;
      const originLocation = mockLocations.find(l => l.id === route?.originId);
      const destinationLocation = mockLocations.find(l => l.id === route?.destinationId);
      
      return {
        ...trip,
        route,
        vehicle,
        vehicleType,
        originLocation,
        destinationLocation
      };
    }).sort((a, b) => a.departureDatetime - b.departureDatetime); // Sort by departure time
  },
  
  // Get trip details with seats
  getTripDetails: async (tripId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const trips = generateMockTrips();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) throw new Error('Trip not found');
    
    const route = mockRoutes.find(r => r.id === trip.routeId);
    const seats = generateMockSeats(tripId, trip.totalSeats, route.basePrice);
    
    return {
      ...trip,
      route,
      seats
    };
  },
  
  // Create booking
  createBooking: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBooking = {
      id: generateId(),
      bookingReference: `TBS${format(new Date(), 'yyyyMMdd')}${Math.floor(Math.random() * 900) + 100}`,
      ...bookingData,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      bookingDate: new Date()
    };
    
    return newBooking;
  },
  
  // Process payment
  processPayment: async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment success/failure
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    const payment = {
      id: generateId(),
      mockTransactionId: `MOCK_TXN_${format(new Date(), 'yyyyMMdd')}_${Math.floor(Math.random() * 1000000)}`,
      status: isSuccess ? 'completed' : 'failed',
      failureReason: isSuccess ? null : 'Insufficient funds',
      processedAt: new Date(),
      ...paymentData
    };
    
    return payment;
  },
  
  // Get user bookings
  getUserBookings: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return mockBookings.filter(booking => booking.userId === userId).map(booking => {
      const trips = generateMockTrips();
      const trip = trips.find(t => t.id === booking.tripId);
      const route = mockRoutes.find(r => r.id === trip?.routeId);
      const originLocation = mockLocations.find(l => l.id === route?.originId);
      const destinationLocation = mockLocations.find(l => l.id === route?.destinationId);
      
      return {
        ...booking,
        trip: {
          ...trip,
          route,
          originLocation,
          destinationLocation
        }
      };
    });
  }
};

// Analytics mock data
export const mockAnalytics = {
  totalBookings: 1247,
  totalRevenue: 67890.50,
  activeTrips: 24,
  totalUsers: 892,
  monthlyData: [
    { month: 'Jan', bookings: 98, revenue: 4567.80 },
    { month: 'Feb', bookings: 112, revenue: 5234.90 },
    { month: 'Mar', bookings: 89, revenue: 4123.45 },
    { month: 'Apr', bookings: 134, revenue: 6789.12 },
    { month: 'May', bookings: 156, revenue: 7890.34 },
    { month: 'Jun', bookings: 178, revenue: 8456.78 }
  ],
  popularRoutes: [
    { route: 'KL - Johor Express', bookings: 234 },
    { route: 'KL - Penang Highway', bookings: 198 },
    { route: 'KL - Malacca Direct', bookings: 156 },
    { route: 'Ipoh - Penang Express', bookings: 89 }
  ]
};

// Enhanced trip calculation with real-time pricing algorithm
export const calculateDynamicPrice = (route, date, availableSeats, totalSeats) => {
  const basePrice = route.basePrice;
  let dynamicPrice = basePrice;
  
  // Date-based pricing
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = false; // Could be enhanced with holiday calendar
  
  if (isWeekend) {
    dynamicPrice *= 1.15; // 15% weekend surcharge
  }
  
  if (isHoliday) {
    dynamicPrice *= 1.25; // 25% holiday surcharge
  }
  
  // Demand-based pricing
  const occupancyRate = 1 - (availableSeats / totalSeats);
  if (occupancyRate > 0.8) {
    dynamicPrice *= 1.20; // 20% high demand surcharge
  } else if (occupancyRate > 0.6) {
    dynamicPrice *= 1.10; // 10% moderate demand surcharge
  } else if (occupancyRate < 0.3) {
    dynamicPrice *= 0.90; // 10% low demand discount
  }
  
  // Time-based pricing (advance booking discount)
  const now = new Date();
  const daysAdvance = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (daysAdvance > 14) {
    dynamicPrice *= 0.85; // 15% early bird discount
  } else if (daysAdvance < 2) {
    dynamicPrice *= 1.30; // 30% last minute surcharge
  }
  
  // Add operational costs
  const operationalCost = route.estimatedFuelCost + route.tollCharges;
  const profitMargin = 0.25; // 25% profit margin
  const minPrice = operationalCost * (1 + profitMargin);
  
  return Math.max(dynamicPrice, minPrice);
};

// Enhanced travel time estimation
export const calculateTravelTime = (route, trafficFactor = 1.0, weatherConditions = 'clear') => {
  let baseTravelTime = route.distanceKm / route.averageSpeed; // hours
  
  // Traffic adjustment
  baseTravelTime *= trafficFactor;
  
  // Weather adjustment
  const weatherMultipliers = {
    'clear': 1.0,
    'light_rain': 1.15,
    'heavy_rain': 1.35,
    'fog': 1.25,
    'storm': 1.50
  };
  
  baseTravelTime *= weatherMultipliers[weatherConditions] || 1.0;
  
  // Add stop times
  const stopTime = route.intermediateStops.reduce((total, stop) => {
    return total + (stop.departureOffset - stop.arrivalOffset);
  }, 0) / 60; // convert minutes to hours
  
  return baseTravelTime + stopTime;
};

// Enhanced CO2 calculation for environmental impact
export const calculateCO2Emissions = (route, vehicleType) => {
  const emissionFactors = {
    'vt-1': 0.68, // Standard Bus kg CO2 per km
    'vt-2': 0.85, // Luxury Coach (heavier, more emissions)
    'vt-3': 0.45  // Mini Van (smaller, less emissions)
  };
  
  const factor = emissionFactors[vehicleType] || 0.68;
  return route.distanceKm * factor;
};

// Utility functions for trip calculations
export const calculateCurrentOccupancy = (trip) => {
  return trip.totalSeats - trip.availableSeats;
};

export const calculateOccupancyRate = (trip) => {
  const occupancyRate = ((trip.totalSeats - trip.availableSeats) / trip.totalSeats * 100);
  return parseFloat(occupancyRate.toFixed(1));
}; 