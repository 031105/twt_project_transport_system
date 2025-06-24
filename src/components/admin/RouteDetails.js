import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Fuel, 
  Leaf, 
  Calendar,
  Users,
  TrendingUp,
  X
} from 'lucide-react';
import { calculateTravelTime, calculateCO2Emissions, calculateDynamicPrice } from '../../services/routeAnalysisApi';
import RouteMap from './RouteMap';

const RouteDetails = ({ route, locations, onClose }) => {
  // Move all hooks to the top, before any early returns
  const [priceData, setPriceData] = useState({
    normalDayPrice: 0,
    highDemandPrice: 0,
    lowDemandPrice: 0
  });

  const [travelTimeData, setTravelTimeData] = useState({
    normalTravel: 0,
    rushhourTravel: 0,
    badWeatherTravel: 0
  });

  const [co2Data, setCO2Data] = useState(0);

  useEffect(() => {
    if (!route) return;
    
    // Initialize default values based on route
    setPriceData({
      normalDayPrice: route.basePrice,
      highDemandPrice: route.basePrice * 1.2,
      lowDemandPrice: route.basePrice * 0.9
    });

    setTravelTimeData({
      normalTravel: route.durationHours,
      rushhourTravel: route.durationHours * 1.4,
      badWeatherTravel: route.durationHours * 1.35
    });

    setCO2Data(route.distanceKm * 0.68);

    const loadRouteAnalytics = async () => {
      try {
        // 计算价格场景
        const normalDayPrice = await calculateDynamicPrice(route, new Date(), 20, 40);
        const highDemandPrice = await calculateDynamicPrice(route, new Date(), 5, 40);
        const lowDemandPrice = await calculateDynamicPrice(route, new Date(), 35, 40);
        
        setPriceData({
          normalDayPrice,
          highDemandPrice,
          lowDemandPrice
        });
        
        // 计算旅行时间场景
        const normalTravel = await calculateTravelTime(route, 1.0, 'clear');
        const rushhourTravel = await calculateTravelTime(route, 1.4, 'clear');
        const badWeatherTravel = await calculateTravelTime(route, 1.0, 'heavy_rain');
        
        setTravelTimeData({
          normalTravel,
          rushhourTravel,
          badWeatherTravel
        });
        
        // 计算环境影响
        const emissions = await calculateCO2Emissions(route, 'vt-1');
        setCO2Data(emissions);
      } catch (err) {
        console.error('Error loading route analytics:', err);
      }
    };
    
    loadRouteAnalytics();
  }, [route]);

  // Early return after all hooks have been called
  if (!route) return null;

  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.city : 'Unknown';
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatOffset = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // 使用状态中的数据
  const { normalDayPrice, highDemandPrice, lowDemandPrice } = priceData;
  const { normalTravel, rushhourTravel, badWeatherTravel } = travelTimeData;
  const co2Emissions = co2Data;

  const originLocation = locations.find(loc => loc.id === route.originId);
  const destinationLocation = locations.find(loc => loc.id === route.destinationId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] m-4 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{route.name}</h2>
            <p className="text-gray-600 mt-1">
              {originLocation?.city} → {destinationLocation?.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Route Information */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
            {/* Route Map */}
            <div className="bg-gray-50 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">
                Route Visualization
              </h3>
              <div className="h-64">
                <RouteMap 
                  routes={[]} 
                  locations={locations} 
                  selectedTrips={[]}
                  startLocation={route.originId}
                  endLocation={route.destinationId}
                />
              </div>
            </div>

            {/* Route Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-xl font-bold">{route.distanceKm} km</p>
                  </div>
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Base Duration</p>
                    <p className="text-xl font-bold">{formatTime(route.durationHours)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-success-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-xl font-bold">RM {route.basePrice}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-warning-600" />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Stops</p>
                    <p className="text-xl font-bold">{route.intermediateStops?.length || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Enhanced Route Path */}
            <div className="card mb-8">
              <h3 className="text-lg font-semibold mb-4">Route Path & Stops</h3>
              <div className="space-y-4">
                {/* Origin */}
                <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{getLocationName(route.originId)}</div>
                    <div className="text-sm text-gray-600">Starting Point • 0:00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">RM {route.basePrice}</div>
                    <div className="text-xs text-gray-500">Base fare</div>
                  </div>
                </div>

                {/* Intermediate stops */}
                {route.intermediateStops?.map((stop, index) => (
                  <React.Fragment key={index}>
                    {/* Travel segment */}
                    <div className="flex items-center ml-2">
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="ml-4 text-sm text-gray-500">
                        {Math.floor((stop.arrivalOffset - (index > 0 ? route.intermediateStops[index-1].departureOffset : 0))/60)}h {(stop.arrivalOffset - (index > 0 ? route.intermediateStops[index-1].departureOffset : 0))%60}m travel
                      </div>
                    </div>
                    
                    {/* Stop */}
                    <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{getLocationName(stop.locationId)}</div>
                        <div className="text-sm text-gray-600">
                          Stop {stop.stopNumber} • {formatOffset(stop.arrivalOffset)} - {formatOffset(stop.departureOffset)}
                          <span className="text-blue-600 ml-2">({stop.departureOffset - stop.arrivalOffset} min stop)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">RM {stop.additionalPrice}</div>
                        <div className="text-xs text-gray-500">From origin</div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {/* Final segment to destination */}
                <div className="flex items-center ml-2">
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="ml-4 text-sm text-gray-500">
                    {Math.floor((route.durationHours * 60 - (route.intermediateStops?.length > 0 ? route.intermediateStops[route.intermediateStops.length - 1].departureOffset : 0))/60)}h {Math.round((route.durationHours * 60 - (route.intermediateStops?.length > 0 ? route.intermediateStops[route.intermediateStops.length - 1].departureOffset : 0))%60)}m travel
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="w-4 h-4 bg-red-500 rounded-sm transform rotate-45 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{getLocationName(route.destinationId)}</div>
                    <div className="text-sm text-gray-600">Final Destination • {formatTime(route.durationHours)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">RM {route.basePrice}</div>
                    <div className="text-xs text-gray-500">Full journey</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pricing Algorithm */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Dynamic Pricing Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Normal Demand</span>
                    <span className="font-semibold">RM {normalDayPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Demand (80%+ occupied)</span>
                    <span className="font-semibold text-red-600">RM {highDemandPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Low Demand (30%- occupied)</span>
                    <span className="font-semibold text-green-600">RM {lowDemandPrice.toFixed(2)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="text-xs text-gray-500">
                    Prices include weekend surcharges, advance booking discounts, and operational costs
                  </div>
                </div>
              </div>

              {/* Travel Time Analysis */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Travel Time Scenarios
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Normal Conditions</span>
                    <span className="font-semibold">{formatTime(normalTravel)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rush Hour Traffic</span>
                    <span className="font-semibold text-orange-600">{formatTime(rushhourTravel)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Heavy Rain</span>
                    <span className="font-semibold text-blue-600">{formatTime(badWeatherTravel)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="text-xs text-gray-500">
                    Times include intermediate stop durations and weather adjustments
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Costs & Environmental Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Operational Costs */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Fuel className="w-5 h-5 mr-2" />
                  Operational Costs
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Fuel Cost</span>
                    <span className="font-semibold">RM {route.estimatedFuelCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Toll Charges</span>
                    <span className="font-semibold">RM {route.tollCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Operating Cost</span>
                    <span className="font-semibold">RM {(route.estimatedFuelCost + route.tollCharges).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Break-even Price (25% margin)</span>
                    <span className="font-semibold text-green-600">
                      RM {((route.estimatedFuelCost + route.tollCharges) * 1.25).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Environmental Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CO2 Emissions (Standard Bus)</span>
                    <span className="font-semibold">{co2Emissions.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Per Passenger (40 capacity)</span>
                    <span className="font-semibold text-green-600">{(co2Emissions / 40).toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">vs. Private Car</span>
                    <span className="font-semibold text-green-600">
                      {((route.distanceKm * 0.2) / (co2Emissions / 40)).toFixed(1)}x less
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="text-xs text-gray-500">
                    Environmental calculations based on vehicle type and occupancy
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Schedule */}
            <div className="card mt-8">
              <h3 className="text-lg font-semibold mb-4">Operating Schedule</h3>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <span 
                    key={day}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      route.operatingDays.includes(day)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Additional Information */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {/* Route Performance Metrics */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Route Performance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-xs text-gray-600">Average Occupancy</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">96%</div>
                  <div className="text-xs text-gray-600">On-Time Performance</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">4.6</div>
                  <div className="text-xs text-gray-600">Customer Rating</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-gray-600">Daily Trips</div>
                </div>
              </div>
            </div>

            {/* Revenue Analysis */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue Analysis (Monthly)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Revenue per Trip</span>
                  <span className="font-semibold">RM {(route.basePrice * 0.85 * 40).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Trips (est.)</span>
                  <span className="font-semibold">360</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gross Monthly Revenue</span>
                  <span className="font-semibold text-green-600">
                    RM {((route.basePrice * 0.85 * 40) * 360).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Operating Costs</span>
                  <span className="font-semibold text-red-600">
                    RM {(((route.estimatedFuelCost + route.tollCharges) * 360) + 15000).toLocaleString()}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Net Profit (est.)</span>
                  <span className="font-bold text-green-600">
                    RM {(((route.basePrice * 0.85 * 40) * 360) - ((route.estimatedFuelCost + route.tollCharges) * 360) - 15000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Traffic Congestion Risk</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Medium</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weather Impact</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Low</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fuel Price Volatility</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">High</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Competition</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Medium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <h4 className="font-medium text-green-800">Price Adjustment</h4>
                  <p className="text-sm text-green-700">
                    Consider increasing weekend prices by 10-15% during peak demand periods.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h4 className="font-medium text-blue-800">Schedule Optimization</h4>
                  <p className="text-sm text-blue-700">
                    Add 1-2 more trips during Friday evenings and Sunday afternoons.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <h4 className="font-medium text-yellow-800">Operational Efficiency</h4>
                  <p className="text-sm text-yellow-700">
                    Route optimization could reduce travel time by 8-12 minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Route History & Trends */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Performance Trends</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last 30 Days</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-600 mr-2">↗ 8.5%</span>
                    <span className="text-xs text-gray-500">Revenue growth</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Occupancy Rate</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-600 mr-2">↗ 3.2%</span>
                    <span className="text-xs text-gray-500">vs. previous month</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-yellow-600 mr-2">→ 0.1%</span>
                    <span className="text-xs text-gray-500">Stable</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Operational Costs</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-red-600 mr-2">↗ 2.8%</span>
                    <span className="text-xs text-gray-500">Fuel price impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails; 