import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import LocationManagement from '../../components/admin/LocationManagement';
import RouteManagement from '../../components/admin/RouteManagement';
import { MapPin, Route as RouteIcon } from 'lucide-react';

const AdminRoutes = () => {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Route Management</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm mr-4 border-b-2 ${
              activeTab === 'routes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('routes')}
          >
            <div className="flex items-center">
              <RouteIcon className="w-4 h-4 mr-2" />
              Routes
            </div>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'locations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('locations')}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </div>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'routes' ? (
            <RouteManagement />
          ) : (
            <LocationManagement />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRoutes; 