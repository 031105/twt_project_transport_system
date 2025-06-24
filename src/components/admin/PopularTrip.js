import React from 'react';
import { Star, ChevronRight, MapPin, Clock } from 'lucide-react';

const PopularTrip = ({ trip, onSelect }) => {
  // 如果没有传入trip，显示默认行程
  const defaultTrip = {
    id: '1',
    route: { name: 'KL - Johor Bahru Express' },
    origin: 'Kuala Lumpur',
    destination: 'Johor Bahru',
    departureTime: '08:00 AM',
    price: 'RM 45.00'
  };

  const displayTrip = trip || defaultTrip;

  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect && onSelect(displayTrip)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{displayTrip.route.name}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{displayTrip.origin} → {displayTrip.destination}</span>
          </div>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <Star className="w-3 h-3 mr-1" />
          Popular
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-sm">
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {displayTrip.departureTime}
        </div>
        <div className="font-medium">{displayTrip.price}</div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
          Select Trip
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PopularTrip; 