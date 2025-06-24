import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  X, 
  Check, 
  Globe,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { 
  getAllLocations, 
  createLocation,
  updateLocation,
  deleteLocation
} from '../../services/adminApi';
import { useApp } from '../../context/AppContext';

const LocationManagement = () => {
  const { addNotification } = useApp();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    country: 'Malaysia',
    address: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    terminalType: 'bus_terminal'
  });

  // 加载所有站点
  const loadLocations = async () => {
    setLoading(true);
    try {
      const response = await getAllLocations();
      if (response.success) {
        setLocations(response.data);
        setFilteredLocations(response.data);
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to load locations: ' + (response.error || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      addNotification({
        type: 'error',
        message: 'An error occurred while loading locations'
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadLocations();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = locations.filter(
        location => 
          location.name.toLowerCase().includes(term) || 
          location.city.toLowerCase().includes(term) || 
          location.state.toLowerCase().includes(term) ||
          location.code?.toLowerCase().includes(term)
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  // 表单处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 打开创建模态框
  const openCreateModal = () => {
    setFormData({
      name: '',
      code: '',
      city: '',
      state: '',
      country: 'Malaysia',
      address: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      terminalType: 'bus_terminal'
    });
    setShowCreateModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (location) => {
    setCurrentLocation(location);
    setFormData({
      name: location.name || '',
      code: location.code || '',
      city: location.city || '',
      state: location.state || '',
      country: location.country || 'Malaysia',
      address: location.address || '',
      postalCode: location.postalCode || '',
      latitude: location.latitude || '',
      longitude: location.longitude || '',
      terminalType: location.terminalType || 'bus_terminal'
    });
    setShowEditModal(true);
  };

  // 创建站点
  const handleCreateLocation = async () => {
    // 基本验证
    if (!formData.name || !formData.city) {
      addNotification({
        type: 'warning',
        message: 'Name and city are required fields'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createLocation(formData);
      if (response.success) {
        setShowCreateModal(false);
        loadLocations();
        addNotification({
          type: 'success',
          message: 'Location created successfully'
        });
      } else {
        addNotification({
          type: 'error',
          message: 'Failed to create location: ' + (response.error || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error creating location:', error);
      addNotification({
        type: 'error',
        message: 'An error occurred while creating the location'
      });
    } finally {
      setLoading(false);
    }
  };

  // 更新站点
  const handleUpdateLocation = async () => {
    if (!currentLocation || !currentLocation.id) {
      addNotification({
        type: 'warning',
        message: 'No location selected for update'
      });
      return;
    }

    // 基本验证
    if (!formData.name || !formData.city) {
      alert('Name and city are required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await updateLocation(currentLocation.id, formData);
      if (response.success) {
        setShowEditModal(false);
        loadLocations();
        alert('Location updated successfully');
      } else {
        alert('Failed to update location: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('An error occurred while updating the location');
    } finally {
      setLoading(false);
    }
  };

  // 删除站点
  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteLocation(locationId);
      if (response.success) {
        loadLocations();
        alert('Location deleted successfully');
      } else {
        alert('Failed to delete location: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('An error occurred while deleting the location');
    } finally {
      setLoading(false);
    }
  };

  // 表单模态框
  const LocationFormModal = ({ isCreate, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isCreate ? 'Create New Location' : 'Edit Location'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. KUL, JHB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terminal Type
            </label>
            <select
              name="terminalType"
              value={formData.terminalType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bus_terminal">Bus Terminal</option>
              <option value="train_station">Train Station</option>
              <option value="ferry_terminal">Ferry Terminal</option>
              <option value="airport">Airport</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 3.1390"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 101.6869"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            className="btn-primary flex-1 flex items-center justify-center"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isCreate ? 'Create Location' : 'Update Location')}
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
        <h2 className="text-2xl font-bold text-gray-900">Location Management</h2>
        <button 
          className="btn-primary flex items-center"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Location
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search locations by name, city, or state..."
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

      {/* Locations Grid */}
      {loading && !filteredLocations.length ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading locations...</p>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? 'Try a different search term' : 'Add your first location to get started'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(location => (
            <div key={location.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.code}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(location)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="Edit location"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLocation(location.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete location"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{location.city}, {location.state || location.country}</span>
                </div>
                {location.address && (
                  <div className="text-sm text-gray-500">
                    {location.address}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{location.terminalType?.replace('_', ' ')}</span>
                  {location.isActive ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <LocationFormModal
          isCreate={true}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLocation}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <LocationFormModal
          isCreate={false}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateLocation}
        />
      )}
    </div>
  );
};

export default LocationManagement; 