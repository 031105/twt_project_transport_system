import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { useApp } from '../../context/AppContext';
import AdminCustomerServicePortal from './AdminCustomerServicePortal';
import { format, addDays } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bus, 
  Users, 
  Package, 
  TrendingUp,
  DollarSign,
  BarChart2,
  BarChart3,
  Search,
  Plus,
  Edit,
  Trash,
  Trash2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  Info,
  User,
  Phone,
  Mail,
  CreditCard,
  Printer,
  Save,
  Download,
  ArrowRight,
  FileText,
  MessageSquare,
  Send,
  Activity,
  Route,
  Settings,
  Map
} from 'lucide-react';
import { 
  getDashboardStats, 
  getAnalyticsData, 
  getVehicles,
  addVehicle,
  updateVehicle,
  getRoutes,
  getLocationsForRoutes,
  getTodaysSchedule,
  getRouteStops,
  createSchedule,
  getTripDetails,
  getPopularTrips,
  searchTrips,
  createBooking,
  formatCurrency,
  formatDate,
  formatTime,
  calculateOccupancy,
  getOccupancyColorClass,
  handleApiError,
  getRouteAnalytics,
  getSchedules,
  createRoute,
  updateTrip,
  deleteTrip
} from '../../services/adminApi';
import RouteMap from '../../components/admin/RouteMap';
import PopularTrips from '../../components/admin/PopularTrips';
import PopularTrip from '../../components/admin/PopularTrip';
import RouteDetails from '../../components/admin/RouteDetails';
import RouteSelector from '../../components/admin/RouteSelector';
import LocationSelector from '../../components/admin/LocationSelector';

const AdminDashboard = ({ activeTab = 'customer-service', setActiveTab }) => {
  const { locations, systemDate, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    activeRoutes: 0,
    activeTrips: 0,
    fleetSize: 0,
    scheduledTrips: 0
  });
  

  
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [detailRoute, setDetailRoute] = useState(null);

  const [popularTrips, setPopularTrips] = useState([
    {
      id: '1',
      route: { id: '1', name: 'KL - Johor Bahru Express' },
      origin: 'Kuala Lumpur',
      destination: 'Johor Bahru',
      departureTime: '08:00 AM',
      date: '2023-06-25'
    },
    {
      id: '2',
      route: { id: '2', name: 'KL - Penang Highway' },
      origin: 'Kuala Lumpur',
      destination: 'Penang',
      departureTime: '09:30 AM',
      date: '2023-06-25'
    },
    {
      id: '3',
      route: { id: '3', name: 'KL - Malacca Direct' },
      origin: 'Kuala Lumpur',
      destination: 'Malacca',
      departureTime: '10:15 AM',
      date: '2023-06-25'
    }
  ]);

  const handlePopularTripSelect = (trip) => {
    // 显示行程详情
    setDetailRoute(trip.route);
    setShowRouteDetails(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data in parallel
      const [
        statsResponse,
        routesResponse,
        vehiclesResponse,
        scheduleResponse
      ] = await Promise.all([
        getDashboardStats(),
        getRoutes(),
        getVehicles(),
        getTodaysSchedule()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (routesResponse.success) {
        setRoutes(routesResponse.data);
      }

      if (vehiclesResponse.success) {
        setVehicles(vehiclesResponse.data);
      }

      if (scheduleResponse.success) {
        setTodaysSchedule(scheduleResponse.data);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const handleViewRoute = (route) => {
    setDetailRoute(route);
    setShowRouteDetails(true);
  };

  const clearSelection = () => {
    setSelectedRoute(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button 
                  onClick={loadDashboardData}
                  className="mt-2 text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Content */}
      {activeTab === 'customer-service' && (
        <AdminCustomerServicePortal />
      )}

      {activeTab === 'overview' && (
        <>
          {/* Action Buttons */}
          <div className="flex justify-end mb-6">
            <div className="flex space-x-3">
              <button 
                onClick={() => setActiveTab('analytics')}
                className="btn-secondary flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Routes</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.activeRoutes}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Route className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Trips</p>
                  <p className="text-3xl font-bold text-success-600">{stats.activeTrips}</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <Bus className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fleet Size</p>
                  <p className="text-3xl font-bold text-warning-600">{stats.fleetSize}</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-warning-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled Trips</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.scheduledTrips}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('vehicles')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bus className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Manage Vehicles</h3>
              <p className="text-gray-600 text-sm">Add, edit, or maintain vehicles</p>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('schedule')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Route Planning</h3>
              <p className="text-gray-600 text-sm">Create and optimize routes</p>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('schedule')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Schedule Trips</h3>
              <p className="text-gray-600 text-sm">Plan daily operations</p>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('analytics')}>
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Recent Activity</h3>
                <p className="text-gray-600 text-sm">View recent system activities</p>
            </div>
          </div>

          {/* Active Routes and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Active Routes */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Routes</h3>
                <button onClick={clearSelection} className="btn-secondary text-sm">
                  Clear Selection
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {routes.map((route) => (
                  <div 
                    key={route.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoute?.id === route.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleRouteClick(route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{route.name}</h4>
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRoute(route);
                              }}
                              className="text-primary-600 hover:text-primary-700"
                              title="View Details"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-600" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {locations.find(l => l.id === route.originId)?.city} → {locations.find(l => l.id === route.destinationId)?.city}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Distance: {route.distanceKm} km</span>
                            <span>Duration: {Math.floor(route.durationHours)}h {Math.round((route.durationHours % 1) * 60)}m</span>
                            <span className="text-primary-600 font-medium">Price: RM {route.basePrice}</span>
                          </div>
                          
                          {/* Trip Occupation for this route */}
                          <div className="mt-2">
                            {(() => {
                              const routeTrips = todaysSchedule.filter(trip => trip.routeId === route.id);
                              const avgOccupation = routeTrips.length > 0 
                                ? routeTrips.reduce((sum, trip) => sum + calculateOccupancy(trip), 0) / routeTrips.length
                                : 0;
                              
                              return avgOccupation > 0 && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Avg. Occupation:</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full transition-all"
                                        style={{ 
                                          width: `${Math.min(avgOccupation, 100)}%`,
                                          backgroundColor: avgOccupation > 80 ? '#EF4444' : avgOccupation > 60 ? '#F59E0B' : '#10B981'
                                        }}
                                      ></div>
                                    </div>
                                    <span className={`font-medium ${avgOccupation > 80 ? 'text-red-600' : avgOccupation > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                                      {typeof avgOccupation === 'number' ? avgOccupation.toFixed(0) : '0'}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Visualization */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Route Visualization</h3>
                <button className="btn-secondary text-sm">
                  Clear Selection
                </button>
              </div>
              
              <div className="h-96 bg-gray-100 rounded-lg">
                <RouteMap 
                  routes={selectedRoute ? [selectedRoute] : routes}
                  locations={locations}
                  selectedTrips={todaysSchedule}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'vehicles' && (
                      <VehicleManagement vehicles={vehicles} onRefresh={loadDashboardData} addNotification={addNotification} />
      )}

      {activeTab === 'schedule' && (
        <ScheduleManagement 
          todaysSchedule={todaysSchedule} 
          routes={routes} 
          vehicles={vehicles} 
          onRefresh={loadDashboardData}
          addNotification={addNotification}
        />
      )}

      {activeTab === 'analytics' && (
        <Analytics addNotification={addNotification} />
      )}

      {activeTab === 'routes' && (
         <RouteManagement routes={routes} onRefresh={loadDashboardData} addNotification={addNotification} />
      )}

      {/* Route Details Modal */}
      {showRouteDetails && (
        <div style={{ zIndex: 9999 }}>
          <RouteDetails
            route={detailRoute}
            locations={locations}
            onClose={() => {
              setShowRouteDetails(false);
              setDetailRoute(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

// Vehicle Management Component
const VehicleManagement = ({ vehicles = [], onRefresh, addNotification }) => {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(null);

  const handleAddVehicle = () => {
    setShowAddVehicle(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle({
      ...vehicle,
      editCapacity: vehicle.vehicle_capacity || vehicle.capacity || 0,
      editMileage: vehicle.current_mileage || 0,
      editLastService: vehicle.last_service_date || ''
    });
  };

  const handleServiceVehicle = async (vehicle) => {
    try {
      // Toggle between active and maintenance status
      const newStatus = vehicle.status === 'active' ? 'maintenance' : 'active';
      
      const response = await fetch(`http://localhost:5001/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setShowServiceModal({
          ...vehicle,
          newStatus,
          message: newStatus === 'maintenance' 
            ? 'Vehicle has been marked for maintenance' 
            : 'Vehicle has been returned to active service'
        });
        // Refresh data after a short delay
        setTimeout(() => {
          onRefresh();
        }, 1500);
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to update vehicle status'
        });
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
              addNotification({
          type: 'error',
          message: 'Error updating vehicle status'
        });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        current_mileage: editingVehicle.editMileage,
        last_service_date: editingVehicle.editLastService || null
      };

      // Update capacity through vehicle_types if needed
      if (editingVehicle.editCapacity !== editingVehicle.vehicle_capacity) {
        // For now, we'll skip capacity update as it's tied to vehicle_type
        // In a real scenario, you'd either update vehicle_type or create new type
      }

      const response = await fetch(`http://localhost:5001/api/admin/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setEditingVehicle(null);
        onRefresh();
        addNotification({
          type: 'success',
          message: 'Vehicle updated successfully!'
        });
      } else {
                  addNotification({
            type: 'error',
            message: 'Failed to update vehicle'
          });
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
              addNotification({
          type: 'error',
          message: 'Error updating vehicle'
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <button 
          className="btn-primary flex items-center"
          onClick={handleAddVehicle}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.license_plate || vehicle.plateNumber || vehicle.vehicle_number}</h3>
                  <p className="text-sm text-gray-600">{vehicle.model || 'N/A'}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{vehicle.vehicle_capacity || vehicle.capacity || 'N/A'} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mileage:</span>
                <span className="font-medium">{vehicle.current_mileage ? vehicle.current_mileage.toLocaleString() : 'N/A'} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Service:</span>
                <span className="font-medium">
                  {vehicle.last_service_date 
                    ? new Date(vehicle.last_service_date).toLocaleDateString('en-GB')
                    : vehicle.lastService || 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                className="btn-secondary text-xs flex-1"
                onClick={() => handleEditVehicle(vehicle)}
              >
                Edit
              </button>
              <button 
                className="btn-secondary text-xs flex-1"
                onClick={() => handleServiceVehicle(vehicle)}
              >
                Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <p className="text-gray-600 mb-4">Add vehicle functionality coming soon...</p>
            <button 
              className="btn-secondary w-full"
              onClick={() => setShowAddVehicle(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Vehicle: {editingVehicle.license_plate}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (seats)
                </label>
                <input
                  type="number"
                  value={editingVehicle.editCapacity}
                  onChange={(e) => setEditingVehicle(prev => ({
                    ...prev,
                    editCapacity: parseInt(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Capacity is determined by vehicle type</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  value={editingVehicle.editMileage}
                  onChange={(e) => setEditingVehicle(prev => ({
                    ...prev,
                    editMileage: parseInt(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Service Date
                </label>
                <input
                  type="date"
                  value={editingVehicle.editLastService}
                  onChange={(e) => setEditingVehicle(prev => ({
                    ...prev,
                    editLastService: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                className="btn-primary flex-1"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => setEditingVehicle(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Service Status: {showServiceModal.license_plate}</h3>
            
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                showServiceModal.newStatus === 'maintenance' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                Status: {showServiceModal.newStatus === 'maintenance' ? 'Under Maintenance' : 'Active Service'}
              </div>
              
              <p className="text-gray-600 mt-4">{showServiceModal.message}</p>
              
              {showServiceModal.newStatus === 'maintenance' && (
                <p className="text-sm text-yellow-600 mt-2">
                  Vehicle is now out of service. Click Service button again to return to active status.
                </p>
              )}
            </div>

            <button 
              className="btn-secondary w-full"
              onClick={() => setShowServiceModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Schedule Management Component
const ScheduleManagement = ({ todaysSchedule = [], routes = [], vehicles = [], onRefresh, addNotification }) => {
  const { systemDate } = useApp();
  const [selectedDate, setSelectedDate] = useState(systemDate);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    route_id: '',
    vehicle_id: '',
    departure_date: systemDate,
    departure_time: '08:00',
    base_price: 0,
    seat_types: [
      { id: 'regular', name: 'Regular Seats', multiplier: 1.0, enabled: true },
      { id: 'premium', name: 'Premium Seats', multiplier: 1.5, enabled: true },
      { id: 'vip', name: 'VIP Seats', multiplier: 2.0, enabled: true }
    ],
    pricing_rules: [
      { id: 'weekend', name: 'Weekend Pricing', type: 'surcharge', value: 15, enabled: false },
      { id: 'holiday', name: 'Holiday Pricing', type: 'surcharge', value: 25, enabled: false },
      { id: 'early_booking', name: 'Early Booking Discount', type: 'discount', value: 10, enabled: false }
    ]
  });
  
  // State for route stops
  const [routeStops, setRouteStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: selectedDate,
    endDate: selectedDate
  });
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'

  // State for loading and form submission
  const [loading, setLoading] = useState(false);
  const [creatingTrip, setCreatingTrip] = useState(false);

  // Add state for trip details modal
  const [showTripDetailsModal, setShowTripDetailsModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loadingTripDetails, setLoadingTripDetails] = useState(false);

  // Add state for edit trip modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    departure_datetime: '',
    estimated_arrival_datetime: '',
    base_price: '',
    status: '',
    special_notes: ''
  });
  const [updatingTrip, setUpdatingTrip] = useState(false);

  // Filter schedule by selected date or date range
  // Load schedule data based on selected date and view mode
  useEffect(() => {
    const loadScheduleForDate = async () => {
      setLoadingSchedule(true);
      try {
        // Use date range if in week or month view mode
        const startDate = viewMode === 'day' ? selectedDate : dateRange.startDate;
        const endDate = viewMode === 'day' ? selectedDate : dateRange.endDate;
        
        const response = await fetch(`http://localhost:5001/api/admin/schedules?startDate=${startDate}&endDate=${endDate}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Sort by date then by departure time
            const sortedSchedule = data.data.sort((a, b) => {
              const dateA = new Date(a.departure_datetime);
              const dateB = new Date(b.departure_datetime);
              
              if (dateA.toDateString() === dateB.toDateString()) {
                return dateA.getTime() - dateB.getTime(); // Sort by time if same day
              }
              return dateA.getTime() - dateB.getTime(); // Sort by date
            });
            
            setFilteredSchedule(sortedSchedule);
          }
        }
      } catch (error) {
        console.error('Error loading schedule for date:', error);
        setFilteredSchedule([]);
      } finally {
        setLoadingSchedule(false);
      }
    };

    loadScheduleForDate();
  }, [selectedDate, dateRange, viewMode]);
  
  // Load route stops when a route is selected
  useEffect(() => {
    if (createForm.route_id) {
      loadRouteStops();
    }
  }, [createForm.route_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRouteStops = async () => {
    if (!createForm.route_id) {
      setRouteStops([]);
      return;
    }

    try {
      setLoadingStops(true);
      const response = await getRouteStops(createForm.route_id);
      if (response.success) {
        setRouteStops(response.data);
      } else {
        setRouteStops([]);
      }
    } catch (error) {
      console.error('Error loading route stops:', error);
      setRouteStops([]);
    } finally {
      setLoadingStops(false);
    }
  };
  const formatTime = (datetime) => {
    try {
      return new Date(datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatDate = (datetime) => {
    try {
      return new Date(datetime).toLocaleDateString('en-GB');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'boarding': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-green-100 text-green-800';
      case 'arrived': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle seat type multiplier change
  const handleSeatTypeChange = (id, value) => {
    setCreateForm(prev => {
      const updatedSeatTypes = prev.seat_types.map(type => 
        type.id === id ? { ...type, multiplier: parseFloat(value) } : type
      );
      return { ...prev, seat_types: updatedSeatTypes };
    });
  };
  
  // Handle pricing rule toggle
  const handlePricingRuleToggle = (id, enabled) => {
    setCreateForm(prev => {
      const updatedRules = prev.pricing_rules.map(rule => 
        rule.id === id ? { ...rule, enabled } : rule
      );
      return { ...prev, pricing_rules: updatedRules };
    });
  };
  
  // Handle pricing rule value change
  const handlePricingRuleValueChange = (id, value) => {
    setCreateForm(prev => {
      const updatedRules = prev.pricing_rules.map(rule => 
        rule.id === id ? { ...rule, value: parseInt(value, 10) } : rule
      );
      return { ...prev, pricing_rules: updatedRules };
    });
  };
  
  // Create trip schedule with enhanced options
  const handleCreateTrip = async () => {
    // Validate form
    if (!createForm.route_id || !createForm.vehicle_id || !createForm.departure_date || !createForm.departure_time || !createForm.base_price) {
      addNotification({
        type: 'warning',
        message: 'Please fill in all required fields'
      });
      return;
    }

    try {
      setCreatingTrip(true);

      // Get route stops to calculate estimated arrival time
      let estimatedArrivalDatetime;
      
      if (routeStops.length > 0) {
        // If we have route stops, use the last stop's arrival offset
        const lastStop = routeStops[routeStops.length - 1];
        const arrivalOffsetMinutes = lastStop.arrival_offset_minutes || 0;
        
        // Calculate estimated arrival time
        const departureDatetime = new Date(`${createForm.departure_date}T${createForm.departure_time}:00`);
        estimatedArrivalDatetime = new Date(departureDatetime.getTime() + arrivalOffsetMinutes * 60000);
      } else {
        // Fallback: Add 4 hours if no route stops data
        const departureDatetime = new Date(`${createForm.departure_date}T${createForm.departure_time}:00`);
        estimatedArrivalDatetime = new Date(departureDatetime.getTime() + 4 * 60 * 60000);
      }

      // Format dates for API with proper timezone handling
      const departureDatetime = new Date(`${createForm.departure_date}T${createForm.departure_time}:00`);
      
      // Validate datetime
      if (isNaN(departureDatetime.getTime())) {
        addNotification({
          type: 'error',
          message: 'Invalid departure date or time. Please check your inputs.'
        });
        return;
      }
      
      // Prepare seat type pricing data
      const seatTypePricing = createForm.seat_types
        .filter(type => type.enabled)
        .map(type => ({
          seat_type_id: type.id,
          name: type.name,
          price_multiplier: parseFloat(type.multiplier)
        }));

      // Prepare pricing rules data
      const pricingRules = createForm.pricing_rules
        .filter(rule => rule.enabled)
        .map(rule => ({
          rule_name: rule.name,
          rule_type: rule.type,
          rule_value: parseInt(rule.value, 10)
        }));

      // Create schedule
      const response = await createSchedule({
        route_id: createForm.route_id,
        vehicle_id: createForm.vehicle_id,
        departure_datetime: departureDatetime.toISOString(),
        estimated_arrival_datetime: estimatedArrivalDatetime.toISOString(),
        base_price: parseFloat(createForm.base_price),
        seat_type_pricing: seatTypePricing,
        pricing_rules: pricingRules
      });

      if (response.success) {
        setShowCreateModal(false);
        resetCreateForm();
        onRefresh();
        addNotification({
          type: 'success',
          message: 'Trip scheduled successfully!'
        });
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to schedule trip: ' + (response.message || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      addNotification({
        type: 'error',
        message: 'Error scheduling trip: ' + (error.message || 'Unknown error')
      });
    } finally {
      setCreatingTrip(false);
    }
  };

  // Function to group trips by date
  const getTripsByDate = () => {
    const groupedTrips = {};
    
    filteredSchedule.forEach(trip => {
      const date = new Date(trip.departure_datetime).toDateString();
      if (!groupedTrips[date]) {
        groupedTrips[date] = [];
      }
      groupedTrips[date].push(trip);
    });
    
    return groupedTrips;
  };
  
  // Set week view dates
  const setWeekView = () => {
    const currentDate = new Date(selectedDate);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    setDateRange({
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    });
    setViewMode('week');
  };
  
  // Set month view dates
  const setMonthView = () => {
    const currentDate = new Date(selectedDate);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    setDateRange({
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    });
    setViewMode('month');
  };
  
  // Switch back to day view
  const setDayView = () => {
    setViewMode('day');
  };
  
  // Get formatted date range text based on view mode
  const getDateRangeText = () => {
    if (viewMode === 'day') {
      return `Schedule for ${formatDate(selectedDate)}`;
    } 
    else if (viewMode === 'week') {
      return `Week of ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
    }
    else {
      return `Month of ${new Date(dateRange.startDate).toLocaleString('en-US', {month: 'long', year: 'numeric'})}`;
    }
  };

  // Reset create form to initial state
  const resetCreateForm = () => {
    setCreateForm({
      route_id: '',
      vehicle_id: '',
      departure_date: systemDate,
      departure_time: '08:00',
      base_price: 0,
      seat_types: [
        { id: 'regular', name: 'Regular Seats', multiplier: 1.0, enabled: true },
        { id: 'premium', name: 'Premium Seats', multiplier: 1.5, enabled: true },
        { id: 'vip', name: 'VIP Seats', multiplier: 2.0, enabled: true }
      ],
      pricing_rules: [
        { id: 'weekend', name: 'Weekend Pricing', type: 'surcharge', value: 15, enabled: false },
        { id: 'holiday', name: 'Holiday Pricing', type: 'surcharge', value: 25, enabled: false },
        { id: 'early_booking', name: 'Early Booking Discount', type: 'discount', value: 10, enabled: false }
      ]
    });
    setRouteStops([]);
  };

  // Handle trip click
  const handleTripClick = async (tripId) => {
    setLoadingTripDetails(true);
    try {
      const response = await getTripDetails(tripId);
      if (response.success) {
        setSelectedTrip(response.data);
        setShowTripDetailsModal(true);
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to load trip details'
        });
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
      addNotification({
        type: 'error',
        message: 'Error loading trip details'
      });
    } finally {
      setLoadingTripDetails(false);
    }
  };

  // Handle edit trip
  const handleEditTrip = async (trip) => {
    setEditingTrip(trip);
    
    // Format datetime for input fields
    const formatDateTimeForInput = (dateTimeString) => {
      try {
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
      } catch (error) {
        return '';
      }
    };

    setEditForm({
      departure_datetime: formatDateTimeForInput(trip.departure_datetime),
      estimated_arrival_datetime: formatDateTimeForInput(trip.estimated_arrival_datetime),
      base_price: trip.base_price.toString(),
      status: trip.status,
      special_notes: trip.special_notes || ''
    });
    
    setShowEditModal(true);
  };

  // Handle update trip
  const handleUpdateTrip = async () => {
    if (!editingTrip) return;

    try {
      setUpdatingTrip(true);

      // Prepare update data
      const updateData = {};
      
      if (editForm.departure_datetime) {
        updateData.departure_datetime = new Date(editForm.departure_datetime).toISOString();
      }
      
      if (editForm.estimated_arrival_datetime) {
        updateData.estimated_arrival_datetime = new Date(editForm.estimated_arrival_datetime).toISOString();
      }
      
      if (editForm.base_price) {
        updateData.base_price = parseFloat(editForm.base_price);
      }
      
      if (editForm.status) {
        updateData.status = editForm.status;
      }
      
      if (editForm.special_notes) {
        updateData.special_notes = editForm.special_notes;
      }

      const response = await updateTrip(editingTrip.id, updateData);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Trip updated successfully!'
        });
        setShowEditModal(false);
        setEditingTrip(null);
        onRefresh(); // Refresh the schedule data
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to update trip: ' + (response.message || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      addNotification({
        type: 'error',
        message: 'Error updating trip: ' + (error.message || 'Unknown error')
      });
    } finally {
      setUpdatingTrip(false);
    }
  };

  // Handle delete trip
  const handleDeleteTrip = async (trip) => {
    if (!window.confirm(`Are you sure you want to delete the trip "${trip.route_name}" scheduled for ${formatDate(trip.departure_datetime)} at ${formatTime(trip.departure_datetime)}?`)) {
      return;
    }

    try {
      const response = await deleteTrip(trip.id);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Trip deleted successfully!'
        });
        onRefresh(); // Refresh the schedule data
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to delete trip: ' + (response.message || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      addNotification({
        type: 'error',
        message: 'Error deleting trip: ' + (error.message || 'Unknown error')
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* View mode selector */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 rounded-l-md focus:z-10`}
              onClick={setDayView}
            >
              Day
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-r border-gray-300 focus:z-10`}
              onClick={setWeekView}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-r border-gray-300 rounded-r-md focus:z-10`}
              onClick={setMonthView}
            >
              Month
            </button>
          </div>
          
          {/* Date selector */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={systemDate}
            max="2025-07-31"
          />
          
          <button 
            className="btn-primary flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
          <Calendar className="w-4 h-4 mr-2" />
          Create Schedule
        </button>
        </div>
      </div>

      {loadingSchedule ? (
        <div className="card py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading schedule data...</p>
          </div>
        </div>
      ) : (
      <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {getDateRangeText()}
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({filteredSchedule.length} trips)
            </span>
          </h3>
          
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No trips scheduled for this period</p>
            </div>
          ) : viewMode === 'day' ? (
            // Day view - simple list
        <div className="space-y-3">
              {filteredSchedule.map((trip) => {
                const occupiedSeats = trip.occupied_seats || (trip.total_seats - trip.available_seats);
                const occupancyPercentage = trip.occupancy_percentage || 
                  Math.round((occupiedSeats / trip.total_seats) * 100);
                
            return (
                  <div 
                    key={trip.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTripClick(trip.id)}
                  >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{trip.route_name}</h4>
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTripClick(trip.id);
                              }}
                              className="text-primary-600 hover:text-primary-700"
                              title="View Details"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTrip(trip);
                              }}
                              className="text-gray-400 hover:text-gray-600" 
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTrip(trip);
                              }}
                              className="text-red-400 hover:text-red-600" 
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {trip.origin_name} → {trip.destination_name}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Departure: {formatTime(trip.departure_datetime)}</span>
                            <span>Arrival: {formatTime(trip.estimated_arrival_datetime)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Vehicle: {trip.vehicle_number || trip.license_plate}</span>
                            <span className="text-primary-600 font-medium">Price: RM {trip.base_price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Week/Month view - grouped by date
            <div className="space-y-6">
              {Object.entries(getTripsByDate()).length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No trips scheduled for this period
                </div>
              ) : (
                Object.entries(getTripsByDate()).map(([date, trips]) => (
                  <div key={date} className="py-4">
                    <div className="px-4 py-2 bg-gray-50 font-medium">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {trips.map(trip => (
                        <div 
                          key={trip.id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleTripClick(trip.id)}
                        >
                          <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                              <div className="text-lg font-medium w-20 text-gray-900">
                                {formatTime(trip.departure_datetime)}
                      </div>
                              <div>
                                <div className="font-medium text-gray-900">{trip.route_name}</div>
                      <div className="text-sm text-gray-600">
                                  {trip.origin_name} → {trip.destination_name}
                      </div>
                    </div>
                  </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="text-sm text-gray-600">
                                {trip.vehicle_number || trip.license_plate}
                      </div>
                              
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                  {trip.status.replace('_', ' ').toUpperCase()}
                                </span>
                    </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Trip Schedule</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Trip Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Basic Trip Information</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route
                  </label>
                  <RouteSelector 
                    value={createForm.route_id}
                    onChange={(value) => {
                      setCreateForm(prev => ({ ...prev, route_id: value }));
                      if (value) {
                        // When route changes, load route stops
                        getRouteStops(value).then(response => {
                          if (response.success) {
                            setRouteStops(response.data || []);
                          } else {
                            setRouteStops([]);
                          }
                        }).catch(err => {
                          console.error('Error loading route stops:', err);
                          setRouteStops([]);
                        });
                      } else {
                        setRouteStops([]);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <select
                    value={createForm.vehicle_id}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, vehicle_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicle_number} - {vehicle.license_plate} ({vehicle.vehicle_type_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={createForm.departure_date}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, departure_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={systemDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      value={createForm.departure_time}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, departure_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Pricing and Seats */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Pricing Configuration</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={createForm.base_price}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, base_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 45.00"
                  />
                </div>

                {/* Seat Type Pricing */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Seat Type Pricing</h5>
                  <div className="space-y-3 mt-3">
                    {createForm.seat_types.map(seatType => (
                      <div key={seatType.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`${seatType.id}-seats`} 
                            className="mr-2" 
                            checked={seatType.enabled} 
                            onChange={(e) => {
                              const updatedSeatTypes = createForm.seat_types.map(type => 
                                type.id === seatType.id ? { ...type, enabled: e.target.checked } : type
                              );
                              setCreateForm(prev => ({ ...prev, seat_types: updatedSeatTypes }));
                            }}
                          />
                          <label htmlFor={`${seatType.id}-seats`} className="text-sm">{seatType.name}</label>
                        </div>
                        <div className="text-sm flex items-center">
                          <span className="text-gray-500 mr-2">Multiplier:</span>
                          {seatType.id === 'regular' ? (
                            <span className="font-medium">1.0x</span>
                          ) : (
                            <input 
                              type="number" 
                              step="0.1" 
                              min="1" 
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md" 
                              value={seatType.multiplier} 
                              onChange={(e) => handleSeatTypeChange(seatType.id, e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Pricing Rules */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Dynamic Pricing Rules</h5>
                  <div className="space-y-3 mt-3">
                    {createForm.pricing_rules.map(rule => (
                      <div key={rule.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={rule.id} 
                            className="mr-2" 
                            checked={rule.enabled}
                            onChange={(e) => handlePricingRuleToggle(rule.id, e.target.checked)}
                          />
                          <label htmlFor={rule.id} className="text-sm">{rule.name}</label>
                        </div>
                        <div className="text-sm flex items-center">
                          <span className="text-gray-500 mr-2">{rule.id === 'early_booking' ? '-' : '+'}</span>
                          <input 
                            type="number" 
                            step="1" 
                            min="0" 
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md" 
                            value={rule.value} 
                            disabled={!rule.enabled}
                            onChange={(e) => handlePricingRuleValueChange(rule.id, e.target.value)}
                          />
                          <span className="text-gray-500 ml-1">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                className="btn-primary flex-1"
                onClick={handleCreateTrip}
                disabled={creatingTrip || !createForm.route_id || !createForm.vehicle_id || !createForm.departure_date || !createForm.departure_time || !createForm.base_price}
              >
                {creatingTrip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : 'Schedule Trip'}
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => setShowCreateModal(false)}
                disabled={creatingTrip}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details Modal */}
      {showTripDetailsModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedTrip.trips_scheduled ? 'Route Details' : 'Trip Details'}
              </h3>
              <button 
                onClick={() => setShowTripDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Trip Header */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{selectedTrip.route_name}</h4>
                  <p className="text-gray-600">{selectedTrip.trip_number}</p>
                </div>
                {selectedTrip.trips_scheduled ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    ROUTE OVERVIEW
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrip.status)}`}>
                    {selectedTrip.status.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Trip Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">
                  {selectedTrip.trips_scheduled ? 'Route Information' : 'Trip Information'}
                </h4>
                
                {selectedTrip.trips_scheduled ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{selectedTrip.origin_name} → {selectedTrip.destination_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Trips</p>
                      <p className="font-medium">{selectedTrip.trips_scheduled} trips</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total Passengers</p>
                      <p className="font-medium">{selectedTrip.total_passengers || 0} passengers</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium">{formatDate(selectedTrip.departure_datetime)}</p>
                        <p className="text-sm">{formatTime(selectedTrip.departure_datetime)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Arrival (Est.)</p>
                        <p className="font-medium">{formatDate(selectedTrip.estimated_arrival_datetime)}</p>
                        <p className="text-sm">{formatTime(selectedTrip.estimated_arrival_datetime)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{selectedTrip.origin_name} → {selectedTrip.destination_name}</p>
                      <p className="text-sm text-gray-600">{selectedTrip.origin_city} to {selectedTrip.destination_city}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">{selectedTrip.vehicle_model}</p>
                      <p className="text-sm text-gray-600">
                        {selectedTrip.vehicle_number} | {selectedTrip.license_plate} | {selectedTrip.vehicle_type}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Column - Occupancy & Pricing */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">Occupancy & Pricing</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {selectedTrip.trips_scheduled ? 'Average Occupancy' : 'Seats'}
                    </p>
                    <p className="font-medium">
                      {selectedTrip.trips_scheduled ? 
                        `${selectedTrip.avg_occupancy || 0}%` : 
                        `${selectedTrip.occupied_seats} / ${selectedTrip.total_seats} occupied`
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0, 100)}%`,
                          backgroundColor: (selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0) > 80 ? '#EF4444' : 
                                          (selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0) > 60 ? '#F59E0B' : '#10B981'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {selectedTrip.trips_scheduled ? 'Total Revenue' : 'Base Price'}
                  </p>
                  <p className="font-medium">
                    RM {selectedTrip.trips_scheduled ? 
                      selectedTrip.total_revenue || 0 : 
                      selectedTrip.base_price}
                  </p>
                </div>
                
                {!selectedTrip.trips_scheduled && selectedTrip.seat_pricing && selectedTrip.seat_pricing.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Seat Type Pricing</p>
                    <div className="space-y-1 mt-1">
                      {selectedTrip.seat_pricing.map((pricing, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{pricing.seat_type_id.charAt(0).toUpperCase() + pricing.seat_type_id.slice(1)}</span>
                          <span className="font-medium">{pricing.price_multiplier}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!selectedTrip.trips_scheduled && selectedTrip.pricing_rules && selectedTrip.pricing_rules.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Pricing Rules</p>
                    <div className="space-y-1 mt-1">
                      {selectedTrip.pricing_rules.map((rule, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{rule.rule_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          <span className="font-medium">
                            {rule.rule_type === 'discount' ? '-' : '+'}{rule.rule_value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Route Stops */}
            {!selectedTrip.trips_scheduled && selectedTrip.stops && selectedTrip.stops.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Route Stops</h4>
                
                <div className="space-y-4">
                  {selectedTrip.stops.map((stop, index) => {
                    const isOrigin = index === 0;
                    const isDestination = index === selectedTrip.stops.length - 1;
                    
                    return (
                      <div key={stop.id} className="flex items-center">
                        <div className="relative">
                          {!isDestination && (
                            <div className="h-full w-0.5 bg-blue-500 absolute left-2 top-3"></div>
                          )}
                          {isOrigin || isDestination ? (
                            <div className="h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-white mt-1"></div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {stop.location_name}
                                {isOrigin && ' (Origin)'}
                                {isDestination && ' (Destination)'}
                              </p>
                              <p className="text-sm text-gray-600">{stop.location_city}</p>
                            </div>
                            
                            {!isOrigin && (
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  +{Math.floor(stop.arrival_offset_minutes / 60)} hrs 
                                  {stop.arrival_offset_minutes % 60 > 0 ? ` ${stop.arrival_offset_minutes % 60} mins` : ''}
                                </p>
                                {stop.price_from_origin > 0 && (
                                  <p className="text-sm font-medium">RM {stop.price_from_origin}</p>
                                )}
                              </div>
                            )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
            )}
            
            {/* Performance Data - Only for route details */}
            {selectedTrip.trips_scheduled && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Performance Data</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Average Occupancy</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xl font-semibold">{selectedTrip.avg_occupancy || 0}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(selectedTrip.avg_occupancy || 0, 100)}%`,
                            backgroundColor: (selectedTrip.avg_occupancy || 0) > 80 ? '#10B981' : 
                                            (selectedTrip.avg_occupancy || 0) > 60 ? '#F59E0B' : '#EF4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                    <div className="text-xl font-semibold text-green-600">RM {selectedTrip.total_revenue || 0}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Passengers</div>
                    <div className="text-xl font-semibold">{selectedTrip.total_passengers || 0}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Average Price Per Trip</div>
                    <div className="text-xl font-semibold">
                      RM {selectedTrip.trips_scheduled ? 
                        (selectedTrip.total_revenue / selectedTrip.trips_scheduled).toFixed(2) : 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Trips List - Only for route details */}
            {selectedTrip.trips_scheduled && selectedTrip.trips && selectedTrip.trips.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Scheduled Trips</h4>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trip Number
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departure
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occupancy
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTrip.trips.map((trip) => {
                        const occupiedSeats = trip.occupied_seats || (trip.total_seats - trip.available_seats) || 0;
                        const occupancyPercentage = trip.occupancy_percentage || 
                          (trip.total_seats ? Math.round((occupiedSeats / trip.total_seats) * 100) : 0);
                          
                        return (
                          <tr key={trip.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {trip.trip_number}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div>{formatDate(trip.departure_datetime)}</div>
                              <div className="text-xs">{formatTime(trip.departure_datetime)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {trip.vehicle_number || trip.license_plate || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="h-2 rounded-full transition-all"
                                    style={{ 
                                      width: `${Math.min(occupancyPercentage, 100)}%`,
                                      backgroundColor: occupancyPercentage > 80 ? '#EF4444' : 
                                              occupancyPercentage > 60 ? '#F59E0B' : '#10B981'
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {occupancyPercentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                                {trip.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => handleTripClick(trip.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                className="btn-secondary"
                onClick={() => setShowTripDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {showEditModal && editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Trip</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Trip Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{editingTrip.route_name}</h4>
                <p className="text-sm text-gray-600">
                  {editingTrip.origin_name} → {editingTrip.destination_name}
                </p>
              </div>

              {/* Edit Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure DateTime
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.departure_datetime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, departure_datetime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Arrival DateTime
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.estimated_arrival_datetime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimated_arrival_datetime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.base_price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, base_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="boarding">Boarding</option>
                    <option value="in_transit">In Transit</option>
                    <option value="arrived">Arrived</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Notes
                </label>
                <textarea
                  value={editForm.special_notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, special_notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special notes or instructions for this trip..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button 
                className="btn-primary flex-1"
                onClick={handleUpdateTrip}
                disabled={updatingTrip}
              >
                {updatingTrip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : 'Update Trip'}
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => setShowEditModal(false)}
                disabled={updatingTrip}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Component
const Analytics = ({ addNotification }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [routePerformance, setRoutePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for trip details modal
  const [showTripDetailsModal, setShowTripDetailsModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loadingTripDetails, setLoadingTripDetails] = useState(false);
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'boarding':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-green-100 text-green-800';
      case 'arrived':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delayed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper functions for date formatting
  const formatTime = (datetime) => {
    if (!datetime) return '';
    try {
      return new Date(datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };
  
  const formatDate = (datetime) => {
    if (!datetime) return '';
    try {
      return new Date(datetime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        // 加载总体分析数据
        const statsResponse = await getAnalyticsData();
        if (statsResponse.success) {
          setAnalyticsData(statsResponse.data);
        } else {
          setError('Failed to load analytics data');
        }
        
        // 加载路线表现数据
        const routeResponse = await getRouteAnalytics();
        if (routeResponse.success) {
          setRoutePerformance(routeResponse.data);
        } else {
          setError('Failed to load route performance data');
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, []);
  
  // Handle route click to show details
  const handleRouteClick = async (route) => {
    console.log("Route clicked:", route);
    
    try {
      // 创建一个包含路线数据的对象，模拟行程详情结构
      const routeDetails = {
        id: route.id || Math.random().toString(36).substr(2, 9),
        route_name: route.route_name || 'Unknown Route',
        trip_number: `Route-${(route.route_name || 'Unknown').replace(/\s+/g, '-')}`,
        status: 'active',
        origin_name: route.route_name ? route.route_name.split(' - ')[0] : 'Unknown',
        destination_name: route.route_name ? (route.route_name.split(' - ')[1] || '') : '',
        origin_city: route.route_name ? route.route_name.split(' - ')[0] : 'Unknown',
        destination_city: route.route_name ? (route.route_name.split(' - ')[1] || '') : '',
        base_price: route.total_revenue && route.trips_scheduled ? route.total_revenue / route.trips_scheduled : 0,
        total_seats: 0,
        available_seats: 0,
        occupied_seats: route.total_passengers || 0,
        occupancy_percentage: route.avg_occupancy || 0,
        departure_datetime: new Date().toISOString(),
        estimated_arrival_datetime: new Date(new Date().getTime() + 3600000).toISOString(),
        vehicle_model: 'Various',
        vehicle_number: 'Multiple',
        license_plate: '-',
        vehicle_type: 'Various',
        // 添加路线特有的数据
        trips_scheduled: route.trips_scheduled || 0,
        total_passengers: route.total_passengers || 0,
        total_revenue: route.total_revenue || 0,
        avg_occupancy: route.avg_occupancy || 0,
        // 空数组，避免undefined错误
        stops: [],
        seat_pricing: [],
        pricing_rules: [],
        // 添加行程列表，初始为空
        trips: []
      };
      
      // 获取该路线下的所有行程
      try {
        setLoadingTripDetails(true);
        
        // 获取当前日期作为默认参数
        const today = new Date();
        // 获取30天前的日期作为开始日期
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        // 获取30天后的日期作为结束日期
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 30);
        
        // 格式化日期为ISO字符串
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log(`Fetching trips from ${startDateStr} to ${endDateStr}`);
        const response = await getSchedules(startDateStr, endDateStr);
        
        if (response.success) {
          // 过滤出与当前路线名称匹配的行程
          const routeTrips = response.data.filter(trip => 
            trip.route_name === route.route_name
          );
          
          // 添加行程列表到路线详情
          routeDetails.trips = routeTrips;
          console.log("Found trips for route:", routeTrips.length);
        } else {
          console.error("Failed to fetch trips:", response.message);
        }
      } catch (error) {
        console.error("Error fetching trips for route:", error);
        // 继续执行，即使获取行程失败
      } finally {
        setLoadingTripDetails(false);
      }
      
      // 设置选中的行程并显示模态框
      setSelectedTrip(routeDetails);
      setShowTripDetailsModal(true);
    } catch (error) {
      console.error("Error showing route details:", error);
              addNotification({
          type: 'error',
          message: 'Failed to show route details'
        });
    }
  };
  
  // Handle trip click
  const handleTripClick = async (tripId) => {
    setLoadingTripDetails(true);
    try {
      const response = await getTripDetails(tripId);
      if (response.success) {
        setSelectedTrip(response.data);
        setShowTripDetailsModal(true);
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to load trip details'
        });
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
      addNotification({
        type: 'error',
        message: 'Error loading trip details'
      });
    } finally {
      setLoadingTripDetails(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center text-red-600 mb-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Error loading analytics</h3>
        </div>
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                RM {analyticsData?.totalRevenue?.toLocaleString() || '0'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Occupancy</p>
              <p className="text-2xl font-bold text-blue-600">
                {typeof analyticsData?.averageOccupancy === 'number' ? analyticsData.averageOccupancy.toFixed(1) : '0'}%
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Passengers</p>
              <p className="text-2xl font-bold text-purple-600">
                {analyticsData?.totalPassengers?.toLocaleString() || '0'}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
        <div className="space-y-4">
          {routePerformance.length > 0 ? routePerformance.map((route) => (
            <div 
              key={route.route_name} 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleRouteClick(route)}
            >
                <div className="flex items-center justify-between">
                  <div>
                  <h4 className="font-medium text-gray-900">{route.route_name}</h4>
                  <p className="text-sm text-gray-600">{route.trips_scheduled} trips scheduled</p>
                  </div>
                  <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-green-600">
                    RM {parseFloat(route.total_revenue || 0).toLocaleString()}
                  </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                          width: `${Math.min(route.avg_occupancy || 0, 100)}%`,
                          backgroundColor: (route.avg_occupancy || 0) > 80 ? '#EF4444' : (route.avg_occupancy || 0) > 60 ? '#F59E0B' : '#10B981'
                          }}
                        ></div>
                      </div>
                    <span className="text-xs font-medium">
                      {typeof route.avg_occupancy === 'number' ? route.avg_occupancy.toFixed(0) : '0'}%
                    </span>
                    </div>
                  </div>
                </div>
              </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>No route performance data available</p>
        </div>
          )}
      </div>
    </div>
      
      {/* Trip Details Modal */}
      {showTripDetailsModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedTrip.trips_scheduled ? 'Route Details' : 'Trip Details'}
              </h3>
              <button 
                onClick={() => setShowTripDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Trip Header */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{selectedTrip.route_name}</h4>
                  <p className="text-gray-600">{selectedTrip.trip_number}</p>
                </div>
                {selectedTrip.trips_scheduled ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    ROUTE OVERVIEW
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrip.status)}`}>
                    {selectedTrip.status.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Trip Information */}
          <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">
                  {selectedTrip.trips_scheduled ? 'Route Information' : 'Trip Information'}
                </h4>
                
                {selectedTrip.trips_scheduled ? (
                  <>
            <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{selectedTrip.origin_name} → {selectedTrip.destination_name}</p>
            </div>
                    
            <div>
                      <p className="text-sm text-gray-500">Scheduled Trips</p>
                      <p className="font-medium">{selectedTrip.trips_scheduled} trips</p>
            </div>
                    
            <div>
                      <p className="text-sm text-gray-500">Total Passengers</p>
                      <p className="font-medium">{selectedTrip.total_passengers || 0} passengers</p>
            </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium">{formatDate(selectedTrip.departure_datetime)}</p>
                        <p className="text-sm">{formatTime(selectedTrip.departure_datetime)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Arrival (Est.)</p>
                        <p className="font-medium">{formatDate(selectedTrip.estimated_arrival_datetime)}</p>
                        <p className="text-sm">{formatTime(selectedTrip.estimated_arrival_datetime)}</p>
          </div>
        </div>

                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{selectedTrip.origin_name} → {selectedTrip.destination_name}</p>
                      <p className="text-sm text-gray-600">{selectedTrip.origin_city} to {selectedTrip.destination_city}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">{selectedTrip.vehicle_model}</p>
                      <p className="text-sm text-gray-600">
                        {selectedTrip.vehicle_number} | {selectedTrip.license_plate} | {selectedTrip.vehicle_type}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Column - Occupancy & Pricing */}
          <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">Occupancy & Pricing</h4>
                
                <div className="flex items-center justify-between">
            <div>
                    <p className="text-sm text-gray-500">
                      {selectedTrip.trips_scheduled ? 'Average Occupancy' : 'Seats'}
                    </p>
                    <p className="font-medium">
                      {selectedTrip.trips_scheduled ? 
                        `${selectedTrip.avg_occupancy || 0}%` : 
                        `${selectedTrip.occupied_seats} / ${selectedTrip.total_seats} occupied`
                      }
                    </p>
            </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0, 100)}%`,
                          backgroundColor: (selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0) > 80 ? '#EF4444' : 
                                          (selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0) > 60 ? '#F59E0B' : '#10B981'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {selectedTrip.occupancy_percentage || selectedTrip.avg_occupancy || 0}%
                    </span>
                  </div>
                </div>
                
            <div>
                  <p className="text-sm text-gray-500">
                    {selectedTrip.trips_scheduled ? 'Total Revenue' : 'Base Price'}
                  </p>
                  <p className="font-medium">
                    RM {selectedTrip.trips_scheduled ? 
                      selectedTrip.total_revenue || 0 : 
                      selectedTrip.base_price}
                  </p>
            </div>
                
                {!selectedTrip.trips_scheduled && selectedTrip.seat_pricing && selectedTrip.seat_pricing.length > 0 && (
            <div>
                    <p className="text-sm text-gray-500">Seat Type Pricing</p>
                    <div className="space-y-1 mt-1">
                      {selectedTrip.seat_pricing.map((pricing, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{pricing.seat_type_id.charAt(0).toUpperCase() + pricing.seat_type_id.slice(1)}</span>
                          <span className="font-medium">{pricing.price_multiplier}x</span>
            </div>
                      ))}
          </div>
        </div>
                )}
                
                {!selectedTrip.trips_scheduled && selectedTrip.pricing_rules && selectedTrip.pricing_rules.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Pricing Rules</p>
                    <div className="space-y-1 mt-1">
                      {selectedTrip.pricing_rules.map((rule, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{rule.rule_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          <span className="font-medium">
                            {rule.rule_type === 'discount' ? '-' : '+'}{rule.rule_value}%
                          </span>
      </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Route Stops */}
            {!selectedTrip.trips_scheduled && selectedTrip.stops && selectedTrip.stops.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Route Stops</h4>
                
                <div className="space-y-4">
                  {selectedTrip.stops.map((stop, index) => {
                    const isOrigin = index === 0;
                    const isDestination = index === selectedTrip.stops.length - 1;
                    
                    return (
                      <div key={stop.id} className="flex items-center">
                        <div className="relative">
                          {!isDestination && (
                            <div className="h-full w-0.5 bg-blue-500 absolute left-2 top-3"></div>
                          )}
                          {isOrigin || isDestination ? (
                            <div className="h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-white mt-1"></div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {stop.location_name}
                                {isOrigin && ' (Origin)'}
                                {isDestination && ' (Destination)'}
                              </p>
                              <p className="text-sm text-gray-600">{stop.location_city}</p>
                            </div>
                            
                            {!isOrigin && (
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  +{Math.floor(stop.arrival_offset_minutes / 60)} hrs 
                                  {stop.arrival_offset_minutes % 60 > 0 ? ` ${stop.arrival_offset_minutes % 60} mins` : ''}
                                </p>
                                {stop.price_from_origin > 0 && (
                                  <p className="text-sm font-medium">RM {stop.price_from_origin}</p>
                                )}
                              </div>
                            )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
            )}
            
            {/* Performance Data - Only for route details */}
            {selectedTrip.trips_scheduled && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Performance Data</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Average Occupancy</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xl font-semibold">{selectedTrip.avg_occupancy || 0}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(selectedTrip.avg_occupancy || 0, 100)}%`,
                            backgroundColor: (selectedTrip.avg_occupancy || 0) > 80 ? '#10B981' : 
                                            (selectedTrip.avg_occupancy || 0) > 60 ? '#F59E0B' : '#EF4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                    <div className="text-xl font-semibold text-green-600">RM {selectedTrip.total_revenue || 0}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Passengers</div>
                    <div className="text-xl font-semibold">{selectedTrip.total_passengers || 0}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Average Price Per Trip</div>
                    <div className="text-xl font-semibold">
                      RM {selectedTrip.trips_scheduled ? 
                        (selectedTrip.total_revenue / selectedTrip.trips_scheduled).toFixed(2) : 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Trips List - Only for route details */}
            {selectedTrip.trips_scheduled && selectedTrip.trips && selectedTrip.trips.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 border-b pb-2 mb-4">Scheduled Trips</h4>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trip Number
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departure
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occupancy
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTrip.trips.map((trip) => {
                        const occupiedSeats = trip.occupied_seats || (trip.total_seats - trip.available_seats) || 0;
                        const occupancyPercentage = trip.occupancy_percentage || 
                          (trip.total_seats ? Math.round((occupiedSeats / trip.total_seats) * 100) : 0);
                          
                        return (
                          <tr key={trip.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {trip.trip_number}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div>{formatDate(trip.departure_datetime)}</div>
                              <div className="text-xs">{formatTime(trip.departure_datetime)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {trip.vehicle_number || trip.license_plate || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="h-2 rounded-full transition-all"
                                    style={{ 
                                      width: `${Math.min(occupancyPercentage, 100)}%`,
                                      backgroundColor: occupancyPercentage > 80 ? '#EF4444' : 
                                                      occupancyPercentage > 60 ? '#F59E0B' : '#10B981'
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {occupancyPercentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                                {trip.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => handleTripClick(trip.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {selectedTrip.trips_scheduled && selectedTrip.trips && selectedTrip.trips.length === 0 && (
              <div className="mb-6 p-8 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">No trips found for this route</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                className="btn-secondary"
                onClick={() => setShowTripDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// System Settings Component has been removed

// Customer Service Component for Walk-in Ticket Sales
const CustomerService = ({ addNotification }) => {
  const { locations, systemDate } = useApp();
  const [currentStep, setCurrentStep] = useState(1); // 1: Search, 2: Select Trip, 3: Customer Info, 4: Payment
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    icNumber: '',
    passengerCount: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // 添加热门行程
  const [popularTrip, setPopularTrip] = useState({
    id: '1',
    route: { name: 'KL - Johor Bahru Express' },
    origin: 'Kuala Lumpur',
    destination: 'Johor Bahru',
    departureTime: '08:00 AM',
    price: 'RM 45.00'
  });

  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: systemDate,
    isRoundTrip: false,
    returnDate: format(addDays(new Date(systemDate), 1), 'yyyy-MM-dd')
  });

  // 添加处理热门行程选择的函数
  const handlePopularTripSelect = (trip) => {
    // 根据热门行程设置表单值
    const fromLoc = locations.find(loc => loc.city === trip.origin);
    const toLoc = locations.find(loc => loc.city === trip.destination);
    
    if (fromLoc) setSearchForm(prev => ({ ...prev, origin: fromLoc.id }));
    if (toLoc) setSearchForm(prev => ({ ...prev, destination: toLoc.id }));
    
    // 自动搜索
    handleSearch();
  };

  const handleSearch = async () => {
    setIsProcessing(true);
    
    try {
      const searchParams = {
        origin: searchForm.origin,
        destination: searchForm.destination,
        departureDate: searchForm.date,
        passengers: customerInfo.passengerCount
      };

      const response = await searchTrips(searchParams);
      
      if (response.success) {
        setSearchResults(response.data);
        setCurrentStep(2);
      } else {
        setError('Failed to search trips. Please try again.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(handleApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setCurrentStep(3);
  };

  const handleCustomerSubmit = () => {
    if (customerInfo.fullName && customerInfo.phone) {
      setCurrentStep(4);
    }
  };

  const handlePaymentComplete = () => {
    // Process booking
    const bookingRef = `TBS${format(new Date(systemDate), 'yyyyMMddHHmm')}`;
            addNotification({
          type: 'success',
          message: `Booking confirmed! Reference: ${bookingRef}`
        });
    
    // Reset form
    setCurrentStep(1);
    setSearchResults([]);
    setSelectedTrip(null);
    setCustomerInfo({ fullName: '', phone: '', email: '', icNumber: '', passengerCount: 1 });
  };

  const resetSearch = () => {
    setCurrentStep(1);
    setSearchResults([]);
    setSelectedTrip(null);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-red-800 underline hover:text-red-900 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Service Portal</h2>
          <p className="text-gray-600">Help walk-in customers purchase tickets quickly and efficiently</p>
        </div>
        {currentStep > 1 && (
          <button onClick={resetSearch} className="btn-secondary">
            New Search
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {['Search Trips', 'Select Trip', 'Customer Info', 'Payment'].map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index + 1 ? 'bg-blue-500 text-white' :
                currentStep === index + 1 ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < 3 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Search Form */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Search Available Trips</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">From</label>
                  <select
                    value={searchForm.origin}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, origin: e.target.value }))}
                    className="input w-full"
                    required
                  >
                    <option value="">Select departure location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}, {location.city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">To</label>
                  <select
                    value={searchForm.destination}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, destination: e.target.value }))}
                    className="input w-full"
                    required
                  >
                    <option value="">Select arrival location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}, {location.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={searchForm.date}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, date: e.target.value }))}
                    className="input w-full"
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                
                <div>
                  <label className="label">Passengers</label>
                  <select
                    value={customerInfo.passengerCount}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, passengerCount: parseInt(e.target.value) }))}
                    className="input w-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'passenger' : 'passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                disabled={isProcessing || !searchForm.origin || !searchForm.destination}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="spinner-sm mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Trips
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Popular Trip Card */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Trip</h3>
              <PopularTrip 
                trip={popularTrip} 
                onSelect={handlePopularTripSelect} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Trip Selection */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Available Trips ({searchResults.length} found)</h3>
          
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No trips found for the selected route and date.</p>
              <button onClick={resetSearch} className="btn-primary mt-4">Try Another Search</button>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map(trip => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                     onClick={() => handleTripSelect(trip)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold text-lg">{trip.route.name}</div>
                          <div className="text-sm text-gray-600">
                            {locations.find(l => l.id === trip.route.originId)?.city} → 
                            {locations.find(l => l.id === trip.route.destinationId)?.city}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{trip.departureDatetime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          <div className="text-sm text-gray-600">Departure</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{trip.arrivalDatetime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          <div className="text-sm text-gray-600">Arrival</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">RM {trip.route.basePrice}</div>
                      <div className="text-sm text-gray-600">{trip.availableSeats} seats available</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        calculateOccupancy(trip) > 80 ? 'bg-red-100 text-red-600' :
                        calculateOccupancy(trip) > 60 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {calculateOccupancy(trip)}% occupied
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Customer Information */}
      {currentStep === 3 && selectedTrip && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          
          {/* Selected Trip Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2">Selected Trip</h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedTrip.route.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedTrip.departureDatetime.toLocaleDateString()} at {selectedTrip.departureDatetime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">RM {selectedTrip.route.basePrice * customerInfo.passengerCount}</div>
                <div className="text-sm text-gray-600">{customerInfo.passengerCount} passenger{customerInfo.passengerCount > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
          
          {/* Customer Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                value={customerInfo.fullName}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                className="input w-full"
                placeholder="Enter customer's full name"
                required
              />
            </div>
            
            <div>
              <label className="label">Phone Number *</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="input w-full"
                placeholder="+60123456789"
                required
              />
            </div>
            
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="input w-full"
                placeholder="customer@email.com"
              />
            </div>
            
            <div>
              <label className="label">IC Number</label>
              <input
                type="text"
                value={customerInfo.icNumber}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, icNumber: e.target.value }))}
                className="input w-full"
                placeholder="123456-78-9012"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button onClick={() => setCurrentStep(2)} className="btn-secondary">
              Back to Trip Selection
            </button>
            <button 
              onClick={handleCustomerSubmit}
              disabled={!customerInfo.fullName || !customerInfo.phone}
              className="btn-primary"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {currentStep === 4 && selectedTrip && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Payment & Confirmation</h3>
          
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold mb-4">Booking Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Route:</span>
                <span className="font-medium">{selectedTrip.route.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-medium">
                  {selectedTrip.departureDatetime.toLocaleDateString()} at {selectedTrip.departureDatetime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Passenger:</span>
                <span className="font-medium">{customerInfo.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{customerInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span className="font-medium">{customerInfo.passengerCount}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">RM {selectedTrip.route.basePrice * customerInfo.passengerCount}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Payment Method</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
                💳 Card Payment
              </button>
              <button className="border-2 border-gray-200 hover:border-gray-300 rounded-lg p-4 text-center">
                💰 Cash Payment
              </button>
              <button className="border-2 border-gray-200 hover:border-gray-300 rounded-lg p-4 text-center">
                📱 E-Wallet
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button onClick={() => setCurrentStep(3)} className="btn-secondary">
              Back to Customer Info
            </button>
            <button onClick={handlePaymentComplete} className="btn-primary">
              Confirm Payment & Issue Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Route Management Component
const RouteManagement = ({ routes = [], onRefresh, addNotification }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    base_price: 0,
    stops: []
  });

  // Load locations for route creation
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await getLocationsForRoutes();
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };

    loadLocations();
  }, []);

  const handleAddStop = () => {
    setCreateForm(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          location_id: '',
          is_origin: prev.stops.length === 0, // 第一个站点默认为起点
          is_destination: false,
          arrival_offset_minutes: prev.stops.length === 0 ? 0 : 30, // 起点的到达时间偏移为0
          departure_offset_minutes: 5,
          price_from_origin: 0
        }
      ]
    }));
  };

  const handleRemoveStop = (index) => {
    setCreateForm(prev => {
      const newStops = prev.stops.filter((_, i) => i !== index);
      
      // 如果删除了起点，将第一个站点设为新的起点
      if (prev.stops[index].is_origin && newStops.length > 0) {
        newStops[0].is_origin = true;
        newStops[0].arrival_offset_minutes = 0;
      }
      
      // 如果删除了终点，将最后一个站点设为新的终点
      if (prev.stops[index].is_destination && newStops.length > 0) {
        newStops[newStops.length - 1].is_destination = true;
      }
      
      return { ...prev, stops: newStops };
    });
  };

  const handleStopChange = (index, field, value) => {
    setCreateForm(prev => {
      const newStops = [...prev.stops];
      
      // 特殊处理起点和终点的设置
      if (field === 'is_origin' && value === true) {
        // 将其他站点的is_origin设为false
        newStops.forEach((stop, i) => {
          if (i !== index) stop.is_origin = false;
        });
        // 起点的到达时间偏移设为0
        newStops[index].arrival_offset_minutes = 0;
      } else if (field === 'is_destination' && value === true) {
        // 将其他站点的is_destination设为false
        newStops.forEach((stop, i) => {
          if (i !== index) stop.is_destination = false;
        });
      }
      
      newStops[index] = {
        ...newStops[index],
        [field]: value
      };
      
      return { ...prev, stops: newStops };
    });
  };

  const handleCreateRoute = async () => {
    // 验证表单
    if (createForm.name.trim() === '') {
      addNotification({
        type: 'warning',
        message: 'Please enter route name'
      });
      return;
    }
    
    if (createForm.stops.length < 2) {
              addNotification({
          type: 'warning',
          message: 'Route must have at least two stops'
        });
      return;
    }
    
    // 确保有起点和终点
    const hasOrigin = createForm.stops.some(stop => stop.is_origin);
    const hasDestination = createForm.stops.some(stop => stop.is_destination);
    
    if (!hasOrigin) {
              addNotification({
          type: 'warning',
          message: 'Please set an origin stop'
        });
      return;
    }
    
    if (!hasDestination) {
              addNotification({
          type: 'warning',
          message: 'Please set a destination stop'
        });
      return;
    }
    
    // 确保所有站点都有选择位置
    const allLocationsSelected = createForm.stops.every(stop => stop.location_id);
    
    if (!allLocationsSelected) {
              addNotification({
          type: 'warning',
          message: 'Please select locations for all stops'
        });
      return;
    }

    // 准备提交的数据
    const routeData = {
      name: createForm.name,
      base_price: createForm.base_price,
      stops: createForm.stops.map(stop => ({
        ...stop,
        arrival_offset_minutes: parseInt(stop.arrival_offset_minutes),
        departure_offset_minutes: parseInt(stop.departure_offset_minutes),
        price_from_origin: parseFloat(stop.price_from_origin)
      }))
    };
    
    // 获取起点和终点ID，用于兼容旧的API
    const originStop = routeData.stops.find(stop => stop.is_origin);
    const destinationStop = routeData.stops.find(stop => stop.is_destination);
    
    if (originStop && destinationStop) {
      routeData.origin_id = originStop.location_id;
      routeData.destination_id = destinationStop.location_id;
    }
    
    setLoading(true);
    try {
      const response = await createRoute(routeData);
      if (response.success) {
        setShowCreateModal(false);
        setCreateForm({
          name: '',
          base_price: 0,
          stops: []
        });
        onRefresh();
        addNotification({
          type: 'success',
          message: 'Route created successfully!'
        });
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to create route: ' + (response.message || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('创建路线时出错:', error);
      addNotification({
        type: 'error',
        message: 'Error creating route'
      });
    } finally {
      setLoading(false);
    }
  };

  // 自动生成路线名称
  const generateRouteName = () => {
    const originStop = createForm.stops.find(stop => stop.is_origin);
    const destinationStop = createForm.stops.find(stop => stop.is_destination);
    
    if (!originStop || !destinationStop) return;
    
    const originLocation = locations.find(loc => loc.id === originStop.location_id);
    const destinationLocation = locations.find(loc => loc.id === destinationStop.location_id);
    
    if (originLocation && destinationLocation) {
      const routeName = `${originLocation.city} - ${destinationLocation.city} Express`;
      setCreateForm(prev => ({
        ...prev,
        name: routeName
      }));
    }
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Route Management</h2>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Route
        </button>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div key={route.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Map className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  <p className="text-sm text-gray-600">{route.route_code}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                RM {route.base_price}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{route.origin_name} → {route.destination_name}</span>
            </div>
            
            {/* Route Details */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Distance:</span>
                <span className="font-medium ml-1">{route.distance_km || 'N/A'} km</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium ml-1">{formatDuration(route.estimated_duration_minutes)}</span>
              </div>
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="font-medium ml-1">RM {route.base_price}</span>
              </div>
            </div>
            
            {route.total_trips > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-500">Trip Count:</span>
                <span className="font-medium">{route.total_trips} trips</span>
              </div>
            )}
            
            {route.avg_occupancy > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Avg. Occupation:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(route.avg_occupancy || 0, 100)}%`,
                        backgroundColor: (route.avg_occupancy || 0) > 80 ? '#EF4444' : (route.avg_occupancy || 0) > 60 ? '#F59E0B' : '#10B981'
                      }}
                    ></div>
                  </div>
                  <span className="font-medium">
                    {typeof route.avg_occupancy === 'number' ? route.avg_occupancy.toFixed(0) : '0'}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">创建新路线</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  路线名称
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：吉隆坡 - 槟城快车"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRouteName}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    title="根据起点和终点自动生成路线名称"
                  >
                    自动生成
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  基本票价 (RM)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={createForm.base_price}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, base_price: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：45.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">这是从起点到终点的全程票价</p>
              </div>

              {/* 站点管理 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    路线站点
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={handleAddStop}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加站点
                  </button>
                </div>

                {createForm.stops.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-md">
                    <div className="mb-2">还没有添加任何站点</div>
                    <button 
                      type="button"
                      className="btn-primary text-sm px-4 py-2"
                      onClick={handleAddStop}
                    >
                      添加第一个站点
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createForm.stops.map((stop, index) => (
                      <div key={index} className={`p-4 border rounded-md ${
                        stop.is_origin ? 'bg-blue-50 border-blue-200' : 
                        stop.is_destination ? 'bg-green-50 border-green-200' : 
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-700">站点 #{index + 1}</h4>
                            {stop.is_origin && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">起点</span>
                            )}
                            {stop.is_destination && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">终点</span>
                            )}
                          </div>
                          <button 
                            type="button" 
                            className="text-sm text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveStop(index)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              位置
                            </label>
                            <select
                              value={stop.location_id}
                              onChange={(e) => handleStopChange(index, 'location_id', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              required
                            >
                              <option value="">选择位置</option>
                              {locations.filter(loc => 
                                !createForm.stops.some((s, i) => i !== index && s.location_id === loc.id)
                              ).map(location => (
                                <option key={location.id} value={location.id}>
                                  {location.name}, {location.city}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              从起点的票价 (RM)
                            </label>
                            <input
                              type="number"
                              step="0.50"
                              min="0"
                              value={stop.price_from_origin}
                              onChange={(e) => handleStopChange(index, 'price_from_origin', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              到达时间偏移（分钟）
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={stop.arrival_offset_minutes}
                              onChange={(e) => handleStopChange(index, 'arrival_offset_minutes', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              disabled={stop.is_origin} // 起点的到达时间偏移固定为0
                            />
                            {stop.is_origin && (
                              <p className="text-xs text-gray-500 mt-1">起点站的到达时间偏移固定为0</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              出发时间偏移（分钟）
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={stop.departure_offset_minutes}
                              onChange={(e) => handleStopChange(index, 'departure_offset_minutes', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`is_origin_${index}`}
                              checked={stop.is_origin}
                              onChange={(e) => handleStopChange(index, 'is_origin', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`is_origin_${index}`} className="ml-2 block text-sm text-gray-700">
                              设为起点
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`is_destination_${index}`}
                              checked={stop.is_destination}
                              onChange={(e) => handleStopChange(index, 'is_destination', e.target.checked)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`is_destination_${index}`} className="ml-2 block text-sm text-gray-700">
                              设为终点
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {createForm.stops.length > 0 && (
                  <div className="mt-2 text-right">
                    <button 
                      type="button" 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center ml-auto"
                      onClick={handleAddStop}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加更多站点
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                className="btn-primary flex-1"
                onClick={handleCreateRoute}
                disabled={loading || createForm.stops.length < 2}
              >
                {loading ? '创建中...' : '创建路线'}
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 