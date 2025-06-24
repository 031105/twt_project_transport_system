import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useApp();
  
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };
  
  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'info':
      default:
        return 'bg-primary-50 border-primary-200 text-primary-800';
    }
  };
  
  const getIconStyles = (type) => {
    switch (type) {
      case 'success':
        return 'text-success-600';
      case 'error':
        return 'text-danger-600';
      case 'warning':
        return 'text-warning-600';
      case 'info':
      default:
        return 'text-primary-600';
    }
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getStyles(notification.type)}
            border rounded-lg p-4 shadow-lg backdrop-blur-sm
            animate-slide-up
            transition-all duration-300
          `}
        >
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${getIconStyles(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              {notification.title && (
                <h4 className="text-sm font-medium mb-1">
                  {notification.title}
                </h4>
              )}
              <p className="text-sm">
                {notification.message}
              </p>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar for auto-dismiss */}
          <div className="mt-3 w-full bg-current opacity-20 rounded-full h-1">
            <div 
              className="bg-current h-1 rounded-full"
              style={{
                animation: 'width 5s linear forwards',
                width: '0%'
              }}
            />
          </div>
        </div>
      ))}
      

    </div>
  );
};

export default NotificationCenter; 