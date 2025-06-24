import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  X, 
  ArrowRight,
  Save,
  Edit,
  Trash
} from 'lucide-react';
import { 
  getAllLocations, 
  createRoute,
  getAllRoutes,
  createLocation
} from '../../services/adminApi';
import { useApp } from '../../context/AppContext';

const RouteSelector = ({ value, onChange, className }) => {
  const { addNotification } = useApp();
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    routeType: 'standard',
    stops: [
      {
        locationId: '',
        isOrigin: true,
        isDestination: false,
        arrivalOffsetMinutes: 0,
        departureOffsetMinutes: 10,
        priceFromOrigin: 0
      },
      {
        locationId: '',
        isOrigin: false,
        isDestination: true,
        arrivalOffsetMinutes: 120,
        departureOffsetMinutes: 0,
        priceFromOrigin: 0
      }
    ]
  });

  // Add New Location Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    country: 'Malaysia',
    address: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    timezone: 'Asia/Kuala_Lumpur',
    contactPhone: '',
    contactEmail: '',
    terminalType: 'bus_terminal',
    isActive: true
  });

  // 加载所有路线和站点
  const loadData = async () => {
    setLoading(true);
    try {
      const [routesResponse, locationsResponse] = await Promise.all([
        getAllRoutes(),
        getAllLocations()
      ]);
      
      if (routesResponse.success) {
        setRoutes(routesResponse.data);
      }
      
      if (locationsResponse.success) {
        setLocations(locationsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadData();
  }, []);

  // 处理站点变更
  const handleStopChange = (index, field, value) => {
    setFormData(prev => {
      const newStops = [...prev.stops];
      newStops[index] = { ...newStops[index], [field]: value };
      
      // 如果设置为起点，其他站点不能是起点
      if (field === 'isOrigin' && value === true) {
        newStops.forEach((stop, i) => {
          if (i !== index) {
            newStops[i] = { ...newStops[i], isOrigin: false };
          }
        });
      }
      
      // 如果设置为终点，其他站点不能是终点
      if (field === 'isDestination' && value === true) {
        newStops.forEach((stop, i) => {
          if (i !== index) {
            newStops[i] = { ...newStops[i], isDestination: false };
          }
        });
      }
      
      return { ...prev, stops: newStops };
    });
  };

  // 添加新站点
  const addStop = () => {
    setFormData(prev => {
      const newStops = [...prev.stops];
      // 在倒数第二个位置添加新站点（在终点站之前）
      const lastIndex = newStops.length - 1;
      const newStop = {
        locationId: '',
        isOrigin: false,
        isDestination: false,
        arrivalOffsetMinutes: newStops[lastIndex].arrivalOffsetMinutes - 30,
        departureOffsetMinutes: newStops[lastIndex].arrivalOffsetMinutes - 20,
        priceFromOrigin: 0
      };
      
      newStops.splice(lastIndex, 0, newStop);
      return { ...prev, stops: newStops };
    });
  };

  // 删除站点
  const removeStop = (index) => {
    setFormData(prev => {
      const newStops = [...prev.stops];
      // 不能删除起点或终点
      if (newStops[index].isOrigin || newStops[index].isDestination) {
        addNotification({
          type: 'warning',
          message: 'Cannot remove origin or destination stops'
        });
        return prev;
      }
      
      // 需要至少保留两个站点（起点和终点）
      if (newStops.length <= 2) {
        addNotification({
          type: 'warning',
          message: 'Route must have at least two stops'
        });
        return prev;
      }
      
      newStops.splice(index, 1);
      return { ...prev, stops: newStops };
    });
  };

  // 生成路线名称
  const generateRouteName = () => {
    const originStop = formData.stops.find(stop => stop.isOrigin);
    const destinationStop = formData.stops.find(stop => stop.isDestination);
    
    if (!originStop || !destinationStop || !originStop.locationId || !destinationStop.locationId) {
      return '';
    }
    
    const originLocation = locations.find(loc => loc.id === originStop.locationId);
    const destinationLocation = locations.find(loc => loc.id === destinationStop.locationId);
    
    if (!originLocation || !destinationLocation) {
      return '';
    }
    
    return `${originLocation.name} to ${destinationLocation.name}`;
  };

  // Auto-generate location code based on city name
  const generateLocationCode = (city, name) => {
    // Try to create a code from city name first
    let baseCode = city.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    
    // If city is too short, use location name
    if (baseCode.length < 3) {
      baseCode = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    }
    
    // Check if code exists, if so add numbers
    let finalCode = baseCode;
    let counter = 1;
    
    while (locations.find(loc => loc.code && loc.code.toLowerCase() === finalCode.toLowerCase())) {
      finalCode = baseCode + counter.toString().padStart(2, '0');
      counter++;
    }
    
    return finalCode;
  };

  // Auto-assign coordinates based on city (common Malaysian cities)
  const getCoordinatesForCity = (city, state) => {
    const cityCoords = {
      'Kuala Lumpur': { lat: 3.1390, lng: 101.6869 },
      'Johor Bahru': { lat: 1.4927, lng: 103.7414 },
      'George Town': { lat: 5.4164, lng: 100.3327 },
      'Penang': { lat: 5.4164, lng: 100.3327 },
      'Ipoh': { lat: 4.5975, lng: 101.0901 },
      'Shah Alam': { lat: 3.0733, lng: 101.5185 },
      'Petaling Jaya': { lat: 3.1073, lng: 101.6067 },
      'Malacca': { lat: 2.1896, lng: 102.2501 },
      'Melaka': { lat: 2.1896, lng: 102.2501 },
      'Seremban': { lat: 2.7297, lng: 101.9381 },
      'Kuantan': { lat: 3.8077, lng: 103.3260 },
      'Kota Bharu': { lat: 6.1248, lng: 102.2386 },
      'Alor Setar': { lat: 6.1248, lng: 100.3678 },
      'Kuching': { lat: 1.5533, lng: 110.3592 },
      'Kota Kinabalu': { lat: 5.9804, lng: 116.0735 },
      'Genting Highlands': { lat: 3.4213, lng: 101.7936 }
    };

    const cityKey = Object.keys(cityCoords).find(key => 
      key.toLowerCase().includes(city.toLowerCase()) || 
      city.toLowerCase().includes(key.toLowerCase())
    );

    return cityKey ? cityCoords[cityKey] : null;
  };

  // Handle opening location modal
  const handleAddNewLocation = (stopIndex) => {
    setCurrentStopIndex(stopIndex);
    setLocationForm({
      name: '',
      code: '',
      city: '',
      state: '',
      country: 'Malaysia',
      address: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      timezone: 'Asia/Kuala_Lumpur',
      contactPhone: '',
      contactEmail: '',
      terminalType: 'bus_terminal',
      isActive: true
    });
    setShowLocationModal(true);
  };

  // Handle creating new location
  const handleCreateLocation = async () => {
    // Validate required fields
    if (!locationForm.name || !locationForm.city || !locationForm.state) {
      addNotification({
        type: 'warning',
        message: 'Please fill in required fields: Name, City, and State'
      });
      return;
    }

    // Check for duplicate location code if provided
    if (locationForm.code) {
      const existingLocation = locations.find(loc => 
        loc.code && loc.code.toLowerCase() === locationForm.code.toLowerCase()
      );
      if (existingLocation) {
        addNotification({
          type: 'warning',
          message: `Location code "${locationForm.code}" already exists. Please use a different code or leave it blank for auto-generation.`
        });
        return;
      }
    }

    // Validate coordinates if provided (both must be provided together or both empty)
    if (locationForm.latitude || locationForm.longitude) {
      if (!locationForm.latitude || !locationForm.longitude) {
        alert('Please provide both latitude and longitude, or leave both empty');
        return;
      }
      
      const lat = parseFloat(locationForm.latitude);
      const lng = parseFloat(locationForm.longitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        alert('Latitude must be a valid number between -90 and 90 degrees');
        return;
      }
      
      if (isNaN(lng) || lng < -180 || lng > 180) {
        alert('Longitude must be a valid number between -180 and 180 degrees');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Auto-assign coordinates if empty but city is recognized
      let finalLatitude = locationForm.latitude;
      let finalLongitude = locationForm.longitude;
      
      if (!finalLatitude && !finalLongitude && locationForm.city) {
        const coords = getCoordinatesForCity(locationForm.city, locationForm.state);
        if (coords) {
          finalLatitude = coords.lat.toString();
          finalLongitude = coords.lng.toString();
        }
      }

      // Auto-generate location code if empty
      let finalCode = locationForm.code;
      if (!finalCode) {
        finalCode = generateLocationCode(locationForm.city, locationForm.name);
      }
      
      const response = await createLocation({
        name: locationForm.name,
        code: finalCode,
        city: locationForm.city,
        state: locationForm.state,
        country: locationForm.country || 'Malaysia',
        address: locationForm.address || null,
        postalCode: locationForm.postalCode || null,
        latitude: finalLatitude ? parseFloat(finalLatitude) : null,
        longitude: finalLongitude ? parseFloat(finalLongitude) : null,
        timezone: locationForm.timezone || 'Asia/Kuala_Lumpur',
        contactPhone: locationForm.contactPhone || null,
        contactEmail: locationForm.contactEmail || null,
        terminalType: locationForm.terminalType || 'bus_terminal',
        isActive: locationForm.isActive !== undefined ? locationForm.isActive : true
      });

      if (response.success) {
        // Reload locations
        await loadData();
        
        // Set the newly created location for the current stop
        if (currentStopIndex !== null && response.data && response.data.id) {
          handleStopChange(currentStopIndex, 'locationId', response.data.id);
        }
        
        // Close modal
        setShowLocationModal(false);
        setCurrentStopIndex(null);
        
        addNotification({
          type: 'success',
          message: 'Location created successfully!'
        });
      } else {
        // Handle specific error messages
        let errorMessage = response.message || response.error || 'Unknown error';
        
        if (errorMessage.includes('Duplicate entry')) {
          if (errorMessage.includes('code')) {
            errorMessage = `Location code "${finalCode}" already exists. Please try a different code.`;
          } else {
            errorMessage = 'A location with similar details already exists.';
          }
        }
        
                  addNotification({
            type: 'error',
            message: 'Failed to create location: ' + errorMessage
          });
      }
    } catch (error) {
      console.error('Error creating location:', error);
      
      // Handle network/server errors
      let errorMessage = 'An error occurred while creating the location';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
        
        if (errorMessage.includes('Duplicate entry')) {
          if (errorMessage.includes('code')) {
            errorMessage = `Location code already exists. Please try a different code.`;
          } else {
            errorMessage = 'A location with similar details already exists.';
          }
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 创建路线
  const handleCreateRoute = async () => {
    // 基本验证
    if (!formData.basePrice) {
      alert('Please enter a base price');
      return;
    }
    
    const originStop = formData.stops.find(stop => stop.isOrigin);
    const destinationStop = formData.stops.find(stop => stop.isDestination);
    
    if (!originStop || !destinationStop || !originStop.locationId || !destinationStop.locationId) {
      alert('Please select origin and destination locations');
      return;
    }
    
    // 自动生成路线名称
    if (!formData.name) {
      setFormData(prev => ({ ...prev, name: generateRouteName() }));
    }
    
    // 准备API数据
    const routeData = {
      name: formData.name || generateRouteName(),
      basePrice: parseFloat(formData.basePrice),
      routeType: formData.routeType,
      originId: originStop.locationId,
      destinationId: destinationStop.locationId,
      intermediateStops: formData.stops
        .filter(stop => !stop.isOrigin && !stop.isDestination)
        .map((stop, index) => ({
          locationId: stop.locationId,
          stopOrder: index + 1,
          arrivalOffsetMinutes: stop.arrivalOffsetMinutes,
          departureOffsetMinutes: stop.departureOffsetMinutes,
          priceFromOrigin: parseFloat(stop.priceFromOrigin || 0),
          boardingAllowed: true,
          alightingAllowed: true
        }))
    };
    
    setLoading(true);
    try {
      const response = await createRoute(routeData);
      if (response.success) {
        addNotification({
        type: 'success',
        message: 'Route created successfully'
      });
        setShowCreateModal(false);
        await loadData();
        
        // 选择新创建的路线
        if (response.data && response.data.id) {
          onChange(response.data.id);
        }
      } else {
        alert('Failed to create route: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating route:', error);
      alert('An error occurred while creating the route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a route</option>
          {routes.filter(route => route && route.id).map(route => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="ml-2 p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 focus:outline-none"
          title="Create new route"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Route</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Route Name and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={generateRouteName() || "Enter route name or leave blank for auto-generation"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (RM) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 45.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Route Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route Type
                </label>
                <select
                  value={formData.routeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, routeType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="shuttle">Shuttle</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* Stops */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stops
                  </label>
                  <button
                    type="button"
                    onClick={addStop}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Intermediate Stop
                  </button>
                </div>

                <div className="space-y-3 max-h-[40vh] overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {stop.isOrigin && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">Origin</span>
                          )}
                          {stop.isDestination && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md mr-2">Destination</span>
                          )}
                          <span className="font-medium">Stop {index + 1}</span>
                        </div>
                        {!stop.isOrigin && !stop.isDestination && (
                          <button
                            type="button"
                            onClick={() => removeStop(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-medium text-gray-700">
                              Location *
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddNewLocation(index)}
                              className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs flex items-center"
                              title="Add new location"
                            >
                              <Plus size={12} className="mr-1" />
                              Add New
                            </button>
                          </div>
                          <select
                            value={stop.locationId}
                            onChange={(e) => handleStopChange(index, 'locationId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                          >
                            <option value="">Select location</option>
                            {locations.map(location => (
                              <option key={location.id} value={location.id}>
                                {location.name}, {location.city}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Arrival (minutes)
                            </label>
                            <input
                              type="number"
                              value={stop.arrivalOffsetMinutes}
                              onChange={(e) => handleStopChange(index, 'arrivalOffsetMinutes', parseInt(e.target.value, 10))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              min="0"
                              disabled={stop.isOrigin}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Departure (minutes)
                            </label>
                            <input
                              type="number"
                              value={stop.departureOffsetMinutes}
                              onChange={(e) => handleStopChange(index, 'departureOffsetMinutes', parseInt(e.target.value, 10))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              min="0"
                              disabled={stop.isDestination}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price from Origin (RM)
                        </label>
                        <input
                          type="number"
                          value={stop.priceFromOrigin}
                          onChange={(e) => handleStopChange(index, 'priceFromOrigin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          step="0.01"
                          disabled={stop.isOrigin}
                        />
                      </div>

                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`origin-${index}`}
                            checked={stop.isOrigin}
                            onChange={(e) => handleStopChange(index, 'isOrigin', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`origin-${index}`} className="ml-2 text-xs text-gray-700">
                            Is Origin
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`destination-${index}`}
                            checked={stop.isDestination}
                            onChange={(e) => handleStopChange(index, 'isDestination', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`destination-${index}`} className="ml-2 text-xs text-gray-700">
                            Is Destination
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateRoute}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Create Route
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Location</h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. KL Sentral Terminal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Code (Optional)
                    <span className="text-xs text-gray-500 ml-1">- Auto-generated if empty</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={locationForm.code}
                      onChange={(e) => setLocationForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave blank for auto-generation"
                      maxLength="10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (locationForm.city || locationForm.name) {
                          const autoCode = generateLocationCode(locationForm.city || locationForm.name, locationForm.name);
                          setLocationForm(prev => ({ ...prev, code: autoCode }));
                        } else {
                          alert('Please enter location name or city first');
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-xs"
                      title="Generate code automatically"
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Kuala Lumpur"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    value={locationForm.state}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select state</option>
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Federal Territory">Federal Territory</option>
                    <option value="Labuan">Labuan</option>
                    <option value="Malacca">Malacca</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Penang">Penang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Putrajaya">Putrajaya</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Terengganu">Terengganu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={locationForm.address}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address (optional)"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={locationForm.postalCode}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 50470"
                    maxLength="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={locationForm.contactPhone}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. +603-2274-3333"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={locationForm.contactEmail}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. info@terminal.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terminal Type
                  </label>
                  <select
                    value={locationForm.terminalType}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, terminalType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bus_terminal">Bus Terminal</option>
                    <option value="bus_stop">Bus Stop</option>
                    <option value="interchange">Interchange</option>
                    <option value="station">Station</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={locationForm.country}
                    onChange={(e) => setLocationForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Malaysia"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    GPS Coordinates (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (locationForm.city) {
                        const coords = getCoordinatesForCity(locationForm.city, locationForm.state);
                        if (coords) {
                          setLocationForm(prev => ({
                            ...prev,
                            latitude: coords.lat.toString(),
                            longitude: coords.lng.toString()
                          }));
                        } else {
                          alert('No coordinates available for this city. You can leave them blank or enter manually.');
                        }
                      } else {
                        alert('Please enter the city name first');
                      }
                    }}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    Auto-assign
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={locationForm.latitude}
                      onChange={(e) => setLocationForm(prev => ({ ...prev, latitude: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Latitude (optional)"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={locationForm.longitude}
                      onChange={(e) => setLocationForm(prev => ({ ...prev, longitude: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Longitude (optional)"
                    />
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Leave blank if you don't know the coordinates. System will work without them.
                </div>
              </div>

              <div className="text-xs text-gray-500">
                * Required fields. All other fields are optional but recommended for complete location information.
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Add Location
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteSelector; 