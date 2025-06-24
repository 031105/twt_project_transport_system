import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useApp } from '../context/AppContext';

const AdminLayout = ({ children }) => {
  const { currentUser, isAuthenticated } = useApp();
  const navigate = useNavigate();

  // 检查用户是否是管理员
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (currentUser?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* 可选: 如果需要侧边栏 */}
        {/* <Sidebar /> */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 