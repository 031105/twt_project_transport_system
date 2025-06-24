# 🚌 Transport Booking System - 学生项目版本

## 📋 项目概览 (学生版)

**项目名称**: Transport Booking System (Student Edition)  
**项目类型**: Web-based Application (学生项目)  
**目标用户**: 管理员 + 普通用户 (简化版双角色)  
**数据库**: PostgreSQL  
**预计开发周期**: 6-8周 (学生项目时间范围)  
**团队规模**: 1-3人  

---

## 🎯 简化后的核心功能

### 👑 管理员功能 (精简版)

#### 🚗 基础管理功能
- **车辆管理**: 添加/编辑/查看车辆信息
- **路线管理**: 简单的起点→终点路线管理
- **班次管理**: 创建和管理班次时刻表
- **预订查看**: 查看所有用户预订

#### 📊 简单报表
- **基础统计**: 总预订数、总收入、热门路线
- **简单图表**: 月度预订趋势图

### 👤 普通用户功能 (精简版)

#### 🔍 搜索与预订
- **班次搜索**: 按出发地、目的地、日期搜索
- **座位选择**: 简单的座位选择界面
- **预订创建**: 基本乘客信息填写
- **模拟支付**: 假的支付流程 (无真实支付网关)

#### 📱 个人管理
- **预订历史**: 查看个人预订记录
- **预订详情**: 查看预订详细信息
- **简单个人信息**: 基本联系信息管理

---

## 🗄️ 简化数据库设计 (10个核心表)

### 核心表结构
```sql
-- 1. 用户表 (简化版)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 位置表 (简化版)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 车辆类型表 (简化版)
CREATE TABLE vehicle_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 车辆表 (简化版)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type_id UUID REFERENCES vehicle_types(id),
    model VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 路线表 (简化版)
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    origin_id UUID REFERENCES locations(id),
    destination_id UUID REFERENCES locations(id),
    base_price DECIMAL(10, 2) NOT NULL,
    duration_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. 班次表 (简化版)
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id),
    vehicle_id UUID REFERENCES vehicles(id),
    departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INTEGER,
    total_seats INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. 座位表 (简化版)
CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    UNIQUE(trip_id, seat_number)
);

-- 8. 预订表 (简化版)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    trip_id UUID REFERENCES trips(id),
    seat_id UUID REFERENCES seats(id),
    passenger_name VARCHAR(200) NOT NULL,
    passenger_phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. 模拟支付表
CREATE TABLE mock_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    mock_transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. 系统设置表 (简化版)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏗️ 简化技术架构

### 🎨 前端技术栈 (学生友好)
- **框架**: React.js (或 Vue.js)
- **样式**: Bootstrap 或 Tailwind CSS (快速开发)
- **状态管理**: React Context API (不用Redux，减少复杂度)
- **图表**: Chart.js (简单图表库)
- **HTTP客户端**: Axios

### ⚙️ 后端技术栈 (简化版)
- **框架**: Node.js + Express.js (学习曲线平缓)
- **数据库**: PostgreSQL
- **ORM**: Prisma (易用的ORM)
- **认证**: 简化JWT (不用refresh token)
- **文件上传**: Multer (本地存储)

### 🔒 简化安全方案
- **基础JWT认证**
- **简单密码哈希** (bcrypt)
- **基础输入验证**
- **简单CORS配置**

---

## 📋 现实的开发计划

### 🗓️ 第1-2周: 项目搭建
- ✅ 数据库设计和创建
- ✅ 后端基础框架搭建
- ✅ 前端项目初始化
- ✅ 基础用户认证

### 🗓️ 第3-4周: 核心功能开发
- 🔍 用户搜索和浏览班次
- 🎫 基础预订流程
- 🔐 用户登录注册
- 💳 模拟支付功能

### 🗓️ 第5-6周: 管理功能
- 🚗 管理员车辆管理
- 🗺️ 路线和班次管理
- 📊 基础报表页面
- 🎨 UI美化

### 🗓️ 第7-8周: 测试和完善
- 🧪 功能测试
- 🐛 Bug修复
- 📖 文档编写
- 🎥 演示准备

---

## 💳 模拟支付系统设计

### 🎭 假支付流程
```javascript
// 模拟支付API
POST /api/mock-payment/process
{
  "booking_id": "uuid",
  "payment_method": "credit_card", // 或 "debit_card", "ewallet"
  "card_details": {
    "card_number": "4111111111111111", // 测试卡号
    "expiry": "12/25",
    "cvv": "123"
  }
}

// 模拟响应
{
  "success": true,
  "transaction_id": "MOCK_TXN_123456",
  "status": "completed",
  "message": "Payment processed successfully (MOCK)"
}
```

### 🎪 支付状态模拟
- **成功支付**: 90%概率自动成功
- **失败支付**: 10%概率模拟失败 (余额不足等)
- **延迟支付**: 可选择模拟处理中状态

---

## 📱 简化的功能界面

### 👤 用户界面
1. **首页**: 简单搜索表单 + 热门路线
2. **搜索结果**: 班次列表卡片
3. **预订页面**: 座位选择 + 乘客信息
4. **支付页面**: 模拟支付表单
5. **个人中心**: 预订历史列表

### 👑 管理员界面
1. **仪表板**: 基础统计卡片
2. **车辆管理**: 简单CRUD表格
3. **路线管理**: 路线列表和表单
4. **班次管理**: 班次时刻表
5. **预订管理**: 所有预订列表

---

## 🎯 简化的API设计 (25个接口)

### 🔐 认证 (3个)
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册  
- `POST /auth/logout` - 用户登出

### 🔍 公开接口 (5个)
- `GET /locations` - 获取所有站点
- `GET /routes/search` - 搜索班次
- `GET /trips/:id` - 获取班次详情
- `GET /trips/:id/seats` - 获取座位信息
- `GET /routes/popular` - 热门路线

### 🎫 用户功能 (7个)
- `POST /bookings` - 创建预订
- `GET /bookings` - 获取用户预订
- `GET /bookings/:id` - 预订详情
- `PUT /bookings/:id/cancel` - 取消预订
- `POST /mock-payment/process` - 模拟支付
- `GET /profile` - 获取用户信息
- `PUT /profile` - 更新用户信息

### 👑 管理员功能 (10个)
- `GET /admin/vehicles` - 车辆列表
- `POST /admin/vehicles` - 创建车辆
- `PUT /admin/vehicles/:id` - 更新车辆
- `GET /admin/routes` - 路线列表
- `POST /admin/routes` - 创建路线
- `GET /admin/trips` - 班次列表
- `POST /admin/trips` - 创建班次
- `GET /admin/bookings` - 所有预订
- `GET /admin/stats` - 基础统计
- `GET /admin/analytics` - 简单分析

---

## 🏆 学生项目成功标准

### 📈 最低可行产品 (MVP)
- ✅ 用户可以搜索班次
- ✅ 用户可以预订座位
- ✅ 模拟支付完成
- ✅ 管理员可以管理车辆和班次
- ✅ 基础统计报表

### 🌟 加分功能 (时间允许)
- 🎨 美观的UI设计
- 📱 响应式设计
- 🔔 简单的通知功能
- 📊 更丰富的图表
- ⚡ 性能优化

### 🎯 演示重点
1. **完整用户流程演示**: 搜索→预订→支付
2. **管理员功能演示**: 创建班次→查看预订
3. **数据可视化**: 简单的统计图表
4. **代码质量**: 清晰的代码结构和注释

---

## 📚 学习成果

### 💻 技术技能
- **全栈开发**: 前后端完整开发经验
- **数据库设计**: PostgreSQL关系型数据库
- **API设计**: RESTful API设计原则
- **用户体验**: 简单但有效的UI/UX设计

### 🎯 业务理解
- **预订系统业务逻辑**
- **用户角色和权限管理**
- **支付流程设计**
- **数据分析基础**

---

## 🚀 项目展示建议

### 📽️ 演示脚本
1. **项目介绍** (2分钟): 背景、目标、技术栈
2. **用户流程演示** (3分钟): 完整预订流程
3. **管理功能演示** (2分钟): 后台管理界面
4. **技术亮点** (2分钟): 数据库设计、API架构
5. **总结和学习** (1分钟): 项目收获和未来改进

### 📊 关键指标展示
- **代码行数**: 预计3000-5000行
- **功能完成度**: 核心功能100%完成
- **测试覆盖**: 主要功能测试
- **性能表现**: 基础性能指标

---

这个简化版本更适合学生项目，在6-8周内可以完成，同时保持了系统的专业性和完整性。重点是实现核心功能，使用模拟支付避免复杂的第三方集成，确保项目在有限时间内能够成功完成并有效演示。 