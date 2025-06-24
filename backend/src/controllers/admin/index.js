const Trip = require('../../models/Trip');
const Route = require('../../models/Route');
const Booking = require('../../models/Booking');

// 获取路线占用率
const getRouteOccupancyRate = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    // 查询该路线的所有行程
    const trips = await Trip.findAll({ route_id: routeId });
    
    if (!trips || trips.length === 0) {
      return res.json({
        success: true,
        data: {
          occupancyRate: 0,
          totalTrips: 0
        }
      });
    }
    
    // 计算平均占用率
    const totalOccupancy = trips.reduce((sum, trip) => {
      const occupiedSeats = trip.totalSeats - trip.availableSeats;
      const tripOccupancyRate = (occupiedSeats / trip.totalSeats) * 100;
      return sum + tripOccupancyRate;
    }, 0);
    
    const averageOccupancyRate = parseFloat((totalOccupancy / trips.length).toFixed(1));
    
    return res.json({
      success: true,
      data: {
        occupancyRate: averageOccupancyRate,
        totalTrips: trips.length
      }
    });
  } catch (error) {
    console.error('Error getting route occupancy rate:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get route occupancy rate'
    });
  }
};

// 计算旅行时间
const calculateTravelTime = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { trafficFactor = 1.0, weatherConditions = 'clear' } = req.query;
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // 基础旅行时间（小时）
    let baseTravelTime = route.distanceKm / (route.averageSpeedKmh || 60);
    
    // 交通因素调整
    baseTravelTime *= parseFloat(trafficFactor);
    
    // 天气调整
    const weatherMultipliers = {
      'clear': 1.0,
      'light_rain': 1.15,
      'heavy_rain': 1.35,
      'fog': 1.25,
      'storm': 1.50
    };
    
    baseTravelTime *= weatherMultipliers[weatherConditions] || 1.0;
    
    // 添加停靠时间
    let stopTime = 0;
    if (route.intermediateStops && route.intermediateStops.length > 0) {
      stopTime = route.intermediateStops.reduce((total, stop) => {
        return total + (stop.departureOffsetMinutes - stop.arrivalOffsetMinutes);
      }, 0) / 60; // 转换分钟为小时
    }
    
    const totalTravelTime = baseTravelTime + stopTime;
    
    return res.json({
      success: true,
      data: {
        travelTimeHours: parseFloat(totalTravelTime.toFixed(2)),
        baseTravelTimeHours: parseFloat(baseTravelTime.toFixed(2)),
        stopTimeHours: parseFloat(stopTime.toFixed(2)),
        trafficFactor: parseFloat(trafficFactor),
        weatherConditions,
        weatherMultiplier: weatherMultipliers[weatherConditions] || 1.0
      }
    });
  } catch (error) {
    console.error('Error calculating travel time:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate travel time'
    });
  }
};

// 计算CO2排放
const calculateCO2Emissions = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { vehicleType = 'standard' } = req.query;
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // 不同车型的排放系数（kg CO2 per km）
    const emissionFactors = {
      'standard': 0.68,    // 标准巴士
      'luxury': 0.85,      // 豪华巴士
      'mini': 0.45         // 小型客车
    };
    
    const factor = emissionFactors[vehicleType] || 0.68;
    const co2Emissions = route.distanceKm * factor;
    
    return res.json({
      success: true,
      data: {
        co2Emissions: parseFloat(co2Emissions.toFixed(2)),
        distanceKm: route.distanceKm,
        vehicleType,
        emissionFactor: factor
      }
    });
  } catch (error) {
    console.error('Error calculating CO2 emissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate CO2 emissions'
    });
  }
};

// 计算动态价格
const calculateDynamicPrice = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { 
      date = new Date().toISOString().split('T')[0],
      availableSeats = 20, 
      totalSeats = 40 
    } = req.query;
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    const basePrice = route.basePrice;
    let dynamicPrice = basePrice;
    
    // 日期基础定价
    const tripDate = new Date(date);
    const dayOfWeek = tripDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // 检查是否是假日（简单实现，实际应使用节假日数据库）
    const isHoliday = false; 
    
    if (isWeekend) {
      dynamicPrice *= 1.15; // 周末加价15%
    }
    
    if (isHoliday) {
      dynamicPrice *= 1.25; // 节假日加价25%
    }
    
    // 基于需求的定价
    const occupancyRate = 1 - (availableSeats / totalSeats);
    if (occupancyRate > 0.8) {
      dynamicPrice *= 1.20; // 高需求加价20%
    } else if (occupancyRate > 0.6) {
      dynamicPrice *= 1.10; // 中等需求加价10%
    } else if (occupancyRate < 0.3) {
      dynamicPrice *= 0.90; // 低需求折扣10%
    }
    
    // 提前预订折扣
    const now = new Date();
    const daysAdvance = Math.ceil((tripDate - now) / (1000 * 60 * 60 * 24));
    if (daysAdvance > 14) {
      dynamicPrice *= 0.85; // 早鸟折扣15%
    } else if (daysAdvance < 2) {
      dynamicPrice *= 1.30; // 临时购票加价30%
    }
    
    // 添加运营成本
    const operationalCost = route.fuelCostEstimate + route.tollCharges;
    const profitMargin = 0.25; // 25%利润率
    const minPrice = operationalCost * (1 + profitMargin);
    
    const finalPrice = Math.max(dynamicPrice, minPrice);
    
    return res.json({
      success: true,
      data: {
        basePrice: parseFloat(basePrice),
        dynamicPrice: parseFloat(finalPrice.toFixed(2)),
        factors: {
          isWeekend,
          isHoliday,
          occupancyRate: parseFloat((occupancyRate * 100).toFixed(1)),
          daysAdvance,
          operationalCost: parseFloat(operationalCost.toFixed(2)),
          minPrice: parseFloat(minPrice.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Error calculating dynamic price:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate dynamic price'
    });
  }
};

module.exports = {
  getRouteOccupancyRate,
  calculateTravelTime,
  calculateCO2Emissions,
  calculateDynamicPrice
}; 