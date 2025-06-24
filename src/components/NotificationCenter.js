import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useApp();
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };
  
  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transform transition-all duration-300 ease-in-out animate-slide-in-right ${getNotificationStyles(
            notification.type
          )}`}
        >
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className="text-sm font-semibold mb-1">
                {notification.title}
              </h4>
            )}
            <p className="text-sm">
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter; 