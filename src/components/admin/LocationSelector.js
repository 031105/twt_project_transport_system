import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  X, 
  Save,
  Globe,
  Building
} from 'lucide-react';
import { 
  getAllLocations, 
  createLocation
} from '../../services/adminApi';
import { useApp } from '../../context/AppContext';

const LocationSelector = ({ value, onChange, className }) => {
  const { addNotification } = useApp();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      } else {
        console.error('Failed to load locations:', response.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadLocations();
  }, []);

  // 表单处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        addNotification({
          type: 'success',
          message: 'Location created successfully'
        });
        setShowCreateModal(false);
        await loadLocations();
        
        // 选择新创建的站点
        if (response.data && response.data.id) {
          onChange(response.data.id);
        }
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

  return (
    <div className={className}>
      <div className="flex items-center">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.city}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="ml-2 p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 focus:outline-none"
          title="Create new location"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Create Location Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Location</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
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
                  <option value="airport">Airport</option>
                  <option value="ferry_terminal">Ferry Terminal</option>
                  <option value="bus_stop">Bus Stop</option>
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

              <div className="grid grid-cols-2 gap-2">
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
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
                    Create Location
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 