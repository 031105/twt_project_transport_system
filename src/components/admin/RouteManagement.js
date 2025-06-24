import React, { useState, useEffect } from 'react';
import { 
  Route as RouteIcon, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  X, 
  Check, 
  Map,
  ArrowRight,
  Clock,
  DollarSign,
  Bus
} from 'lucide-react';
import { 
  getAllRoutes, 
  getAllLocations,
  createRoute, 
  updateRoute, 
  deleteRoute 
} from '../../services/adminApi';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
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

  // 加载所有路线
  const loadRoutes = async () => {
    setLoading(true);
    try {
      const response = await getAllRoutes();
      if (response.success) {
        setRoutes(response.data);
        setFilteredRoutes(response.data);
      } else {
        alert('Failed to load routes: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      alert('An error occurred while loading routes');
    } finally {
      setLoading(false);
    }
  };

  // 加载所有站点
  const loadLocations = async () => {
    try {
      const response = await getAllLocations();
      if (response.success) {
        setLocations(response.data);
      } else {
        alert('Failed to load locations: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      alert('An error occurred while loading locations');
    }
  };

  // 初始化加载
  useEffect(() => {
    loadRoutes();
    loadLocations();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = routes.filter(
        route => 
          route.name.toLowerCase().includes(term) || 
          route.originLocation?.name?.toLowerCase().includes(term) || 
          route.destinationLocation?.name?.toLowerCase().includes(term)
      );
      setFilteredRoutes(filtered);
    }
  }, [searchTerm, routes]);

  // 表单处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        alert('Cannot remove origin or destination stops');
        return prev;
      }
      
      // 需要至少保留两个站点（起点和终点）
      if (newStops.length <= 2) {
        alert('Route must have at least two stops');
        return prev;
      }
      
      newStops.splice(index, 1);
      return { ...prev, stops: newStops };
    });
  };

  // 打开创建模态框
  const openCreateModal = () => {
    // 检查是否有足够的站点
    if (locations.length < 2) {
      alert('You need at least two locations to create a route. Please add locations first.');
      return;
    }

    setFormData({
      name: '',
      basePrice: '',
      routeType: 'standard',
      stops: [
        {
          locationId: locations[0]?.id || '',
          isOrigin: true,
          isDestination: false,
          arrivalOffsetMinutes: 0,
          departureOffsetMinutes: 10,
          priceFromOrigin: 0
        },
        {
          locationId: locations[1]?.id || '',
          isOrigin: false,
          isDestination: true,
          arrivalOffsetMinutes: 120,
          departureOffsetMinutes: 0,
          priceFromOrigin: 0
        }
      ]
    });
    setShowCreateModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (route) => {
    setCurrentRoute(route);
    
    // 准备表单数据
    const formattedStops = route.stops.map(stop => ({
      id: stop.id,
      locationId: stop.locationId,
      isOrigin: stop.isOrigin,
      isDestination: stop.isDestination,
      arrivalOffsetMinutes: stop.arrivalOffsetMinutes,
      departureOffsetMinutes: stop.departureOffsetMinutes,
      priceFromOrigin: stop.priceFromOrigin
    }));
    
    setFormData({
      name: route.name || '',
      basePrice: route.basePrice || '',
      routeType: route.routeType || 'standard',
      stops: formattedStops
    });
    
    setShowEditModal(true);
  };

  // 创建路线
  const handleCreateRoute = async () => {
    // 基本验证
    if (!formData.name || !formData.basePrice) {
      alert('Name and base price are required fields');
      return;
    }

    // 验证站点
    const hasOrigin = formData.stops.some(stop => stop.isOrigin);
    const hasDestination = formData.stops.some(stop => stop.isDestination);
    
    if (!hasOrigin || !hasDestination) {
      alert('Route must have both origin and destination stops');
      return;
    }

    // 验证所有站点都有选择位置
    const allStopsHaveLocation = formData.stops.every(stop => stop.locationId);
    if (!allStopsHaveLocation) {
      alert('All stops must have a location selected');
      return;
    }

    setLoading(true);
    try {
      const response = await createRoute(formData);
      if (response.success) {
        setShowCreateModal(false);
        loadRoutes();
        alert('Route created successfully');
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

  // 更新路线
  const handleUpdateRoute = async () => {
    if (!currentRoute || !currentRoute.id) {
      alert('No route selected for update');
      return;
    }

    // 基本验证
    if (!formData.name || !formData.basePrice) {
      alert('Name and base price are required fields');
      return;
    }

    // 验证站点
    const hasOrigin = formData.stops.some(stop => stop.isOrigin);
    const hasDestination = formData.stops.some(stop => stop.isDestination);
    
    if (!hasOrigin || !hasDestination) {
      alert('Route must have both origin and destination stops');
      return;
    }

    // 验证所有站点都有选择位置
    const allStopsHaveLocation = formData.stops.every(stop => stop.locationId);
    if (!allStopsHaveLocation) {
      alert('All stops must have a location selected');
      return;
    }

    setLoading(true);
    try {
      const response = await updateRoute(currentRoute.id, formData);
      if (response.success) {
        setShowEditModal(false);
        loadRoutes();
        alert('Route updated successfully');
      } else {
        alert('Failed to update route: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating route:', error);
      alert('An error occurred while updating the route');
    } finally {
      setLoading(false);
    }
  };

  // 删除路线
  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteRoute(routeId);
      if (response.success) {
        loadRoutes();
        alert('Route deleted successfully');
      } else {
        alert('Failed to delete route: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('An error occurred while deleting the route');
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间偏移为小时:分钟
  const formatTimeOffset = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // 获取站点名称
  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  // 表单模态框
  const RouteFormModal = ({ isCreate, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isCreate ? 'Create New Route' : 'Edit Route'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g. KL Express"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price (RM) *
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g. 35.50"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route Type
            </label>
            <select
              name="routeType"
              value={formData.routeType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="vip">VIP</option>
              <option value="night">Night Service</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">Route Stops</h4>
            <button
              type="button"
              onClick={addStop}
              className="text-sm flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Intermediate Stop
            </button>
          </div>

          <div className="space-y-4">
            {formData.stops.map((stop, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      stop.isOrigin ? 'bg-green-100 text-green-600' : 
                      stop.isDestination ? 'bg-red-100 text-red-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <h5 className="font-medium">
                      {stop.isOrigin ? 'Origin' : stop.isDestination ? 'Destination' : 'Intermediate Stop'}
                    </h5>
                  </div>
                  
                  {!stop.isOrigin && !stop.isDestination && (
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <select
                      value={stop.locationId}
                      onChange={(e) => handleStopChange(index, 'locationId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} ({location.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`origin-${index}`}
                        checked={stop.isOrigin}
                        onChange={(e) => handleStopChange(index, 'isOrigin', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`origin-${index}`} className="text-sm">Origin</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`destination-${index}`}
                        checked={stop.isDestination}
                        onChange={(e) => handleStopChange(index, 'isDestination', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`destination-${index}`} className="text-sm">Destination</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time Offset (minutes)
                    </label>
                    <input
                      type="number"
                      value={stop.arrivalOffsetMinutes}
                      onChange={(e) => handleStopChange(index, 'arrivalOffsetMinutes', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      disabled={stop.isOrigin} // 起点没有到达时间
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time Offset (minutes)
                    </label>
                    <input
                      type="number"
                      value={stop.departureOffsetMinutes}
                      onChange={(e) => handleStopChange(index, 'departureOffsetMinutes', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      disabled={stop.isDestination} // 终点没有出发时间
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price from Origin (RM)
                    </label>
                    <input
                      type="number"
                      value={stop.priceFromOrigin}
                      onChange={(e) => handleStopChange(index, 'priceFromOrigin', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      disabled={stop.isOrigin} // 起点价格始终为0
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            className="btn-primary flex-1 flex items-center justify-center"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isCreate ? 'Create Route' : 'Update Route')}
          </button>
          <button 
            className="btn-secondary flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Route Management</h2>
        <button 
          className="btn-primary flex items-center"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Route
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search routes by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Routes List */}
      {loading && !filteredRoutes.length ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading routes...</p>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <RouteIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No routes found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? 'Try a different search term' : 'Add your first route to get started'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoutes.map(route => (
            <div key={route.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{route.routeType} Route</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(route)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="Edit route"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRoute(route.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete route"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Map className="w-4 h-4 mr-2 text-gray-500" />
                  <div className="flex items-center">
                    <span className="font-medium">{route.originLocation?.name}</span>
                    <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                    <span className="font-medium">{route.destinationLocation?.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    <span>
                      {route.stops?.length > 2 ? `${route.stops.length - 2} intermediate stops` : 'Direct route'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                    <span>RM {parseFloat(route.basePrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <RouteFormModal
          isCreate={true}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRoute}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <RouteFormModal
          isCreate={false}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateRoute}
        />
      )}
    </div>
  );
};

export default RouteManagement; 