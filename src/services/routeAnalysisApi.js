// 路由分析API服务
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 请求助手函数
const apiCall = async (endpoint, options = {}) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
  };
  
  try {
    console.log(`API Call: ${fetchOptions.method} ${url}`);
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API call failed:', errorText);
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message || errorJson.error) {
          errorMessage = errorJson.message || errorJson.error;
        }
      } catch (e) {
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    // 当API调用失败时使用模拟数据
    return generateMockData(endpoint, options);
  }
};

// 模拟数据处理函数 (API调用失败时使用)
const generateMockData = (endpoint, options) => {
  console.warn('Using mock data fallback for:', endpoint);
  
  // 从URL中提取routeId
  const routeIdMatch = endpoint.match(/\/routes\/([^\/]+)/);
  const routeId = routeIdMatch ? routeIdMatch[1] : null;
  
  if (endpoint.includes('occupancy')) {
    return {
      success: true,
      data: {
        occupancyRate: 85,
        totalTrips: 12
      }
    };
  }
  
  if (endpoint.includes('travel-time')) {
    const queryParams = new URLSearchParams(options.queryParams || {});
    const trafficFactor = parseFloat(queryParams.get('trafficFactor') || 1.0);
    const weatherConditions = queryParams.get('weatherConditions') || 'clear';
    
    let baseTravelTime = 5.0;
    
    // 交通因素调整
    baseTravelTime *= trafficFactor;
    
    // 天气调整
    const weatherMultipliers = {
      'clear': 1.0,
      'light_rain': 1.15,
      'heavy_rain': 1.35,
      'fog': 1.25,
      'storm': 1.50
    };
    
    baseTravelTime *= weatherMultipliers[weatherConditions] || 1.0;
    
    return {
      success: true,
      data: {
        travelTimeHours: parseFloat(baseTravelTime.toFixed(2)),
        baseTravelTimeHours: 5.0,
        stopTimeHours: 0.5,
        trafficFactor,
        weatherConditions,
        weatherMultiplier: weatherMultipliers[weatherConditions] || 1.0
      }
    };
  }
  
  if (endpoint.includes('emissions')) {
    const queryParams = new URLSearchParams(options.queryParams || {});
    const vehicleType = queryParams.get('vehicleType') || 'standard';
    
    // 不同车型的排放系数
    const emissionFactors = {
      'standard': 0.68,
      'luxury': 0.85,
      'mini': 0.45
    };
    
    const factor = emissionFactors[vehicleType] || 0.68;
    // 假设平均距离为350km
    const distance = 350;
    const co2Emissions = distance * factor;
    
    return {
      success: true,
      data: {
        co2Emissions: parseFloat(co2Emissions.toFixed(2)),
        distanceKm: distance,
        vehicleType,
        emissionFactor: factor
      }
    };
  }
  
  if (endpoint.includes('dynamic-price')) {
    const queryParams = new URLSearchParams(options.queryParams || {});
    const date = queryParams.get('date') || new Date().toISOString().split('T')[0];
    const availableSeats = parseInt(queryParams.get('availableSeats') || 20);
    const totalSeats = parseInt(queryParams.get('totalSeats') || 40);
    
    const basePrice = 45.0;
    let dynamicPrice = basePrice;
    
    // 日期基础定价
    const tripDate = new Date(date);
    const dayOfWeek = tripDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = false;
    
    if (isWeekend) {
      dynamicPrice *= 1.15;
    }
    
    if (isHoliday) {
      dynamicPrice *= 1.25;
    }
    
    // 基于需求的定价
    const occupancyRate = 1 - (availableSeats / totalSeats);
    if (occupancyRate > 0.8) {
      dynamicPrice *= 1.20;
    } else if (occupancyRate > 0.6) {
      dynamicPrice *= 1.10;
    } else if (occupancyRate < 0.3) {
      dynamicPrice *= 0.90;
    }
    
    // 提前预订折扣
    const now = new Date();
    const daysAdvance = Math.ceil((tripDate - now) / (1000 * 60 * 60 * 24));
    if (daysAdvance > 14) {
      dynamicPrice *= 0.85;
    } else if (daysAdvance < 2) {
      dynamicPrice *= 1.30;
    }
    
    const operationalCost = 18.0;
    const profitMargin = 0.25;
    const minPrice = operationalCost * (1 + profitMargin);
    
    const finalPrice = Math.max(dynamicPrice, minPrice);
    
    return {
      success: true,
      data: {
        basePrice: basePrice,
        dynamicPrice: parseFloat(finalPrice.toFixed(2)),
        factors: {
          isWeekend,
          isHoliday,
          occupancyRate: parseFloat((occupancyRate * 100).toFixed(1)),
          daysAdvance,
          operationalCost,
          minPrice: parseFloat(minPrice.toFixed(2))
        }
      }
    };
  }
  
  return {
    success: false,
    message: 'No mock data available for this endpoint'
  };
};

// 导出API函数
export const calculateOccupancyRate = async (trip) => {
  try {
    if (!trip || !trip.route || !trip.route.id) {
      console.error('Invalid trip object provided to calculateOccupancyRate');
      return 0;
    }
    
    const routeId = trip.route.id;
    const response = await apiCall(`/admin/routes/${routeId}/occupancy`);
    
    if (response && response.success && response.data) {
      return response.data.occupancyRate;
    }
    
    // 如果API调用失败或没有数据，计算单个行程的占用率
    if (trip.totalSeats && trip.availableSeats) {
      const occupiedSeats = trip.totalSeats - trip.availableSeats;
      return parseFloat(((occupiedSeats / trip.totalSeats) * 100).toFixed(1));
    }
    
    return 0;
  } catch (error) {
    console.error('Error calculating occupancy rate:', error);
    // 如果出错，使用静态计算
    if (trip.totalSeats && trip.availableSeats) {
      const occupiedSeats = trip.totalSeats - trip.availableSeats;
      return parseFloat(((occupiedSeats / trip.totalSeats) * 100).toFixed(1));
    }
    return 0;
  }
};

export const calculateTravelTime = async (route, trafficFactor = 1.0, weatherConditions = 'clear') => {
  try {
    if (!route || !route.id) {
      console.error('Invalid route object provided to calculateTravelTime');
      return route.durationHours || 0;
    }
    
    const params = new URLSearchParams({
      trafficFactor: trafficFactor.toString(),
      weatherConditions
    });
    
    const response = await apiCall(`/admin/routes/${route.id}/travel-time?${params.toString()}`, {
      queryParams: params
    });
    
    if (response && response.success && response.data) {
      return response.data.travelTimeHours;
    }
    
    // 如果API调用失败，使用路由中的基础时间
    return route.durationHours || 0;
  } catch (error) {
    console.error('Error calculating travel time:', error);
    // 如果出错，使用路由中的基础时间
    return route.durationHours || 0;
  }
};

export const calculateCO2Emissions = async (route, vehicleType) => {
  try {
    if (!route || !route.id) {
      console.error('Invalid route object provided to calculateCO2Emissions');
      return route.distanceKm * 0.68; // 默认排放系数
    }
    
    const vehicleTypeMap = {
      'vt-1': 'standard',
      'vt-2': 'luxury',
      'vt-3': 'mini'
    };
    
    const mappedVehicleType = vehicleTypeMap[vehicleType] || 'standard';
    
    const params = new URLSearchParams({
      vehicleType: mappedVehicleType
    });
    
    const response = await apiCall(`/admin/routes/${route.id}/emissions?${params.toString()}`, {
      queryParams: params
    });
    
    if (response && response.success && response.data) {
      return response.data.co2Emissions;
    }
    
    // 如果API调用失败，使用静态计算
    const emissionFactors = {
      'vt-1': 0.68, // 标准巴士
      'vt-2': 0.85, // 豪华巴士
      'vt-3': 0.45  // 小型客车
    };
    
    const factor = emissionFactors[vehicleType] || 0.68;
    return route.distanceKm * factor;
  } catch (error) {
    console.error('Error calculating CO2 emissions:', error);
    // 如果出错，使用静态计算
    const emissionFactors = {
      'vt-1': 0.68,
      'vt-2': 0.85,
      'vt-3': 0.45
    };
    
    const factor = emissionFactors[vehicleType] || 0.68;
    return route.distanceKm * factor;
  }
};

export const calculateDynamicPrice = async (route, date, availableSeats, totalSeats) => {
  try {
    if (!route || !route.id) {
      console.error('Invalid route object provided to calculateDynamicPrice');
      return route.basePrice || 0;
    }
    
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      date: formattedDate,
      availableSeats: availableSeats.toString(),
      totalSeats: totalSeats.toString()
    });
    
    const response = await apiCall(`/admin/routes/${route.id}/dynamic-price?${params.toString()}`, {
      queryParams: params
    });
    
    if (response && response.success && response.data) {
      return response.data.dynamicPrice;
    }
    
    // 如果API调用失败，使用路由中的基础价格
    return route.basePrice || 0;
  } catch (error) {
    console.error('Error calculating dynamic price:', error);
    // 如果出错，使用路由中的基础价格
    return route.basePrice || 0;
  }
}; 