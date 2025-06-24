/**
 * 路线管理API测试脚本
 * 
 * 使用方法：
 * 1. 确保后端服务已启动
 * 2. 运行: node test-routes-api.js
 */

// 检查是否有内置的fetch
const hasFetch = typeof fetch === 'function';

// 如果没有内置fetch，尝试导入node-fetch
let fetchFunc;
if (hasFetch) {
  fetchFunc = fetch;
  console.log('使用内置fetch API');
} else {
  try {
    const nodeFetch = require('node-fetch');
    fetchFunc = nodeFetch;
    console.log('使用node-fetch包');
  } catch (error) {
    console.error('Error: This script requires Node.js 18+ or the node-fetch package.');
    console.error('Please upgrade Node.js or install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

const API_BASE_URL = 'http://localhost:3000/api';

// 测试数据
const testLocation = {
  name: "Test Bus Terminal",
  code: "TEST-TRM",
  city: "Test City",
  state: "Test State",
  country: "Malaysia",
  address: "123 Test Street",
  postalCode: "12345",
  latitude: 3.1390,
  longitude: 101.6869,
  isActive: true,
  terminalType: "bus_terminal"
};

const testRoute = {
  name: "Test Express Route",
  basePrice: 35.50,
  routeType: "express",
  stops: [
    {
      locationId: "", // 将在测试中填充
      isOrigin: true,
      arrivalOffsetMinutes: 0,
      departureOffsetMinutes: 10,
      priceFromOrigin: 0
    },
    {
      locationId: "", // 将在测试中填充
      arrivalOffsetMinutes: 120,
      departureOffsetMinutes: 130,
      priceFromOrigin: 20
    }
  ]
};

// 认证信息
let authToken = null;

// 登录获取认证令牌
async function login() {
  const loginData = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  
  console.log('尝试登录获取认证令牌...');
  console.log(`使用账号: ${loginData.email}`);
  
  try {
    const response = await fetchFunc(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    if (!response.ok) {
      throw new Error(`登录失败: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text) {
      throw new Error('服务器返回空响应');
    }
    
    const data = JSON.parse(text);
    if (!data.success || !data.token) {
      throw new Error(`登录失败: ${data.error || '未知错误'}`);
    }
    
    authToken = data.token;
    console.log('登录成功，获取到认证令牌');
    return true;
  } catch (error) {
    console.error('登录失败:', error.message);
    return false;
  }
}

// 辅助函数
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`请求: ${method} ${url}`);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // 添加认证令牌
  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
    console.log('请求体:', JSON.stringify(body, null, 2));
  }

  try {
    const response = await fetchFunc(url, options);
    console.log(`响应状态: ${response.status} ${response.statusText}`);
    
    // 检查服务器是否正常响应
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    // 检查响应是否为空
    const text = await response.text();
    if (!text) {
      console.log('警告: 服务器返回空响应');
      return { success: false, error: 'Empty response from server' };
    }
    
    // 尝试解析JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('JSON解析错误:', error);
      console.log('原始响应:', text);
      throw new Error('无法解析服务器响应为JSON');
    }
  } catch (error) {
    console.error(`请求失败: ${error.message}`);
    throw error;
  }
}

// 测试服务器连接
async function testServerConnection() {
  try {
    console.log('测试服务器连接...');
    await fetchFunc(`${API_BASE_URL}/health-check`);
    console.log('服务器连接正常');
    return true;
  } catch (error) {
    console.error('无法连接到服务器:', error.message);
    console.error(`请确保后端服务器已在 ${API_BASE_URL} 启动`);
    return false;
  }
}

// 测试函数
async function runTests() {
  console.log('开始测试路线管理API...\n');
  
  // 首先测试服务器连接
  const isServerConnected = await testServerConnection();
  if (!isServerConnected) {
    console.error('由于无法连接到服务器，测试中止');
    return;
  }
  
  // 登录获取认证令牌
  const isLoggedIn = await login();
  if (!isLoggedIn) {
    console.error('由于无法登录，测试中止');
    return;
  }
  
  try {
    // 1. 创建测试站点1
    console.log('\n1. 创建测试站点1...');
    const location1 = await apiRequest('/admin/locations', 'POST', {
      ...testLocation,
      name: "Origin Terminal"
    });
    
    if (!location1.success) {
      throw new Error(`创建站点1失败: ${location1.error || 'Unknown error'}`);
    }
    
    console.log(`   站点1创建成功: ${location1.data.name} (ID: ${location1.data.id})`);
    
    // 2. 创建测试站点2
    console.log('\n2. 创建测试站点2...');
    const location2 = await apiRequest('/admin/locations', 'POST', {
      ...testLocation,
      name: "Destination Terminal",
      code: "TEST-DST"
    });
    
    if (!location2.success) {
      throw new Error(`创建站点2失败: ${location2.error || 'Unknown error'}`);
    }
    
    console.log(`   站点2创建成功: ${location2.data.name} (ID: ${location2.data.id})`);
    
    // 3. 获取所有站点
    console.log('\n3. 获取所有站点...');
    const locations = await apiRequest('/admin/locations');
    
    if (!locations.success) {
      throw new Error(`获取站点列表失败: ${locations.error || 'Unknown error'}`);
    }
    
    console.log(`   获取到 ${locations.data.length} 个站点`);
    
    // 4. 创建测试路线
    console.log('\n4. 创建测试路线...');
    testRoute.stops[0].locationId = location1.data.id;
    testRoute.stops[1].locationId = location2.data.id;
    
    const route = await apiRequest('/admin/routes', 'POST', testRoute);
    
    if (!route.success) {
      throw new Error(`创建路线失败: ${route.error || 'Unknown error'}`);
    }
    
    console.log(`   路线创建成功: ${route.data.name} (ID: ${route.data.id})`);
    
    // 5. 获取路线详情
    console.log('\n5. 获取路线详情...');
    const routeDetails = await apiRequest(`/admin/routes/${route.data.id}`);
    
    if (!routeDetails.success) {
      throw new Error(`获取路线详情失败: ${routeDetails.error || 'Unknown error'}`);
    }
    
    console.log(`   路线详情获取成功: ${routeDetails.data.name}`);
    console.log(`   起点: ${routeDetails.data.originLocation.name}`);
    console.log(`   终点: ${routeDetails.data.destinationLocation.name}`);
    console.log(`   中间站点数量: ${routeDetails.data.intermediateStops ? routeDetails.data.intermediateStops.length : 0}`);
    
    // 6. 更新路线
    console.log('\n6. 更新路线信息...');
    const updatedRoute = await apiRequest(`/admin/routes/${route.data.id}`, 'PUT', {
      name: "Updated Test Route",
      basePrice: 40.00
    });
    
    if (!updatedRoute.success) {
      throw new Error(`更新路线失败: ${updatedRoute.error || 'Unknown error'}`);
    }
    
    console.log(`   路线更新成功: ${updatedRoute.data.name} (价格: ${updatedRoute.data.basePrice})`);
    
    // 7. 删除测试数据
    console.log('\n7. 删除测试路线...');
    const deleteRouteResult = await apiRequest(`/admin/routes/${route.data.id}`, 'DELETE');
    console.log(`   路线删除${deleteRouteResult.success ? '成功' : '失败'}: ${deleteRouteResult.message || ''}`);
    
    console.log('\n8. 删除测试站点...');
    const deleteLocation1Result = await apiRequest(`/admin/locations/${location1.data.id}`, 'DELETE');
    console.log(`   站点1删除${deleteLocation1Result.success ? '成功' : '失败'}: ${deleteLocation1Result.message || ''}`);
    
    const deleteLocation2Result = await apiRequest(`/admin/locations/${location2.data.id}`, 'DELETE');
    console.log(`   站点2删除${deleteLocation2Result.success ? '成功' : '失败'}: ${deleteLocation2Result.message || ''}`);
    
    console.log('\n测试完成!');
    
  } catch (error) {
    console.error('\n测试过程中出现错误:', error.message);
  }
}

// 运行测试
runTests(); 