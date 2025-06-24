import React from 'react';
import PopularTrips from '../../components/admin/PopularTrips';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPopularTrips = () => {
  const navigate = useNavigate();

  const handleTripSelect = (trip) => {
    // 导航到行程详情页面
    navigate(`/admin/trips/${trip.id}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Popular Trips</h1>
        <PopularTrips onTripSelect={handleTripSelect} />
      </div>
    </AdminLayout>
  );
};

export default AdminPopularTrips; 