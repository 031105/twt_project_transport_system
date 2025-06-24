import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, BookOpen, Map, Calendar, Truck, Star } from 'lucide-react';

const Sidebar = () => {
  const { sidebarOpen } = useApp();
  
  // For now, we'll keep the sidebar hidden since we're using navbar navigation
  if (!sidebarOpen) {
    return null;
  }
  
  // 在菜单项数组中添加Popular Trips
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, path: '/admin' },
    { id: 'bookings', label: 'Bookings', icon: <BookOpen size={18} />, path: '/admin/bookings' },
    { id: 'routes', label: 'Routes', icon: <Map size={18} />, path: '/admin/routes' },
    { id: 'trips', label: 'Trips', icon: <Calendar size={18} />, path: '/admin/trips' },
    { id: 'vehicles', label: 'Vehicles', icon: <Truck size={18} />, path: '/admin/vehicles' },
    { id: 'popular-trips', label: 'Popular Trips', icon: <Star size={18} />, path: '/admin/popular-trips' },
    // ... other menu items
  ];
  
  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={item.path} 
                className="flex items-center p-2 hover:bg-gray-100 rounded-md"
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 