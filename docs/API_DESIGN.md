# 🔌 Transport Booking System - API设计文档

## 📋 API概览

**Base URL**: `https://api.transportbooking.com/v1`  
**认证方式**: JWT Bearer Token  
**数据格式**: JSON  
**HTTP状态码**: 标准REST状态码  

---

## 🔐 认证相关 APIs

### POST `/auth/login`
用户登录
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }
}
```

### POST `/auth/register`
用户注册
```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+60123456789"
}
```

### POST `/auth/refresh`
刷新Token
```json
// Request
{
  "refresh_token": "refresh_token"
}
```

### POST `/auth/logout`
用户登出

---

## 🔍 搜索与路线 APIs (公开访问)

### GET `/routes/search`
搜索可用班次
```json
// Query Parameters
?origin_id=uuid&destination_id=uuid&departure_date=2024-01-15&passengers=2

// Response
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "uuid",
        "route": {
          "name": "KL - Johor Express",
          "origin": {
            "id": "uuid",
            "name": "KL Sentral Terminal",
            "city": "Kuala Lumpur"
          },
          "destination": {
            "id": "uuid", 
            "name": "Johor Bahru Terminal",
            "city": "Johor Bahru"
          }
        },
        "departure_datetime": "2024-01-15T08:00:00Z",
        "arrival_datetime": "2024-01-15T13:00:00Z",
        "vehicle": {
          "type": "Luxury Coach",
          "amenities": ["wifi", "ac", "usb_charging"]
        },
        "available_seats": 25,
        "total_seats": 30,
        "base_price": 45.00,
        "seat_types": [
          {
            "id": "uuid",
            "name": "Economy",
            "price": 45.00,
            "available": 20
          },
          {
            "id": "uuid", 
            "name": "Business",
            "price": 67.50,
            "available": 5
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 12
    }
  }
}
```

### GET `/locations`
获取所有站点
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "KL Sentral Terminal",
      "city": "Kuala Lumpur",
      "state": "Federal Territory",
      "country": "Malaysia"
    }
  ]
}
```

### GET `/trips/:tripId/seats`
获取班次座位布局
```json
// Response
{
  "success": true,
  "data": {
    "trip_id": "uuid",
    "seat_layout": [
      {
        "id": "uuid",
        "seat_number": "A1",
        "seat_type": "Economy",
        "price": 45.00,
        "is_available": true,
        "position": {
          "row": 1,
          "column": "A"
        }
      }
    ]
  }
}
```

---

## 🎫 预订相关 APIs (需要认证)

### POST `/bookings`
创建预订
```json
// Request
{
  "trip_id": "uuid",
  "passengers": [
    {
      "seat_id": "uuid",
      "passenger_name": "John Doe",
      "passenger_phone": "+60123456789",
      "passenger_email": "john@example.com",
      "age": 30,
      "gender": "male"
    }
  ],
  "contact_email": "john@example.com",
  "contact_phone": "+60123456789",
  "special_requests": "Window seat preferred"
}

// Response
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "booking_reference": "TBS20240115001",
      "total_amount": 45.00,
      "booking_status": "pending",
      "payment_status": "pending",
      "expires_at": "2024-01-15T10:15:00Z"
    }
  }
}
```

### GET `/bookings`
获取用户预订列表
```json
// Query Parameters  
?status=pending&page=1&limit=10

// Response
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "booking_reference": "TBS20240115001",
        "trip": {
          "departure_datetime": "2024-01-15T08:00:00Z",
          "route_name": "KL - Johor Express"
        },
        "total_amount": 45.00,
        "booking_status": "confirmed",
        "payment_status": "paid"
      }
    ]
  }
}
```

### GET `/bookings/:bookingId`
获取预订详情
```json
// Response
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "booking_reference": "TBS20240115001",
      "trip": {
        "id": "uuid",
        "departure_datetime": "2024-01-15T08:00:00Z",
        "route": {
          "name": "KL - Johor Express",
          "origin": "KL Sentral Terminal",
          "destination": "Johor Bahru Terminal"
        }
      },
      "passengers": [
        {
          "passenger_name": "John Doe",
          "seat_number": "A1",
          "seat_type": "Economy"
        }
      ],
      "total_amount": 45.00,
      "booking_status": "confirmed",
      "payment_status": "paid",
      "qr_code": "data:image/png;base64,..."
    }
  }
}
```

### PUT `/bookings/:bookingId/cancel`
取消预订
```json
// Request
{
  "cancellation_reason": "Change of plans"
}
```

---

## 💳 支付相关 APIs

### POST `/payments/process`
处理支付
```json
// Request
{
  "booking_id": "uuid",
  "payment_method": "credit_card",
  "payment_gateway": "stripe",
  "payment_details": {
    "card_token": "stripe_token",
    "billing_address": {
      "street": "123 Main St",
      "city": "Kuala Lumpur",
      "postal_code": "50100"
    }
  }
}

// Response
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid",
      "status": "completed",
      "transaction_id": "pi_1234567890",
      "amount": 45.00
    },
    "booking": {
      "booking_status": "confirmed",
      "payment_status": "paid"
    }
  }
}
```

### POST `/payments/:paymentId/refund`
申请退款
```json
// Request
{
  "refund_reason": "Trip cancelled",
  "refund_amount": 45.00
}
```

---

## 👑 管理员 APIs (需要admin角色)

### 🚗 车辆管理

#### GET `/admin/vehicles`
获取车辆列表
```json
// Query Parameters
?status=active&page=1&limit=20

// Response
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "uuid",
        "vehicle_number": "TBS-001",
        "model": "Mercedes Benz OH1830",
        "year": 2022,
        "status": "active",
        "vehicle_type": {
          "name": "Standard Bus",
          "capacity": 45
        }
      }
    ]
  }
}
```

#### POST `/admin/vehicles`
添加新车辆
```json
// Request
{
  "vehicle_number": "TBS-005",
  "vehicle_type_id": "uuid",
  "model": "Volvo B8R",
  "year": 2023,
  "status": "active"
}
```

#### PUT `/admin/vehicles/:vehicleId`
更新车辆信息

#### DELETE `/admin/vehicles/:vehicleId`
删除车辆

### 🗺️ 路线管理

#### GET `/admin/routes`
获取路线列表

#### POST `/admin/routes`
创建新路线
```json
// Request
{
  "name": "KL - Penang Express",
  "origin_id": "uuid",
  "destination_id": "uuid", 
  "distance_km": 365.2,
  "estimated_duration_minutes": 240,
  "base_price": 55.00,
  "stops": [
    {
      "location_id": "uuid",
      "stop_order": 1,
      "arrival_offset_minutes": 60,
      "price_from_origin": 20.00
    }
  ]
}
```

### ⏰ 班次管理

#### GET `/admin/trips`
获取班次列表
```json
// Query Parameters
?status=scheduled&date_from=2024-01-01&date_to=2024-01-31

// Response
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "uuid",
        "departure_datetime": "2024-01-15T08:00:00Z",
        "route_name": "KL - Johor Express",
        "vehicle_number": "TBS-001",
        "available_seats": 25,
        "total_seats": 45,
        "status": "scheduled"
      }
    ]
  }
}
```

#### POST `/admin/trips`
创建新班次

#### PUT `/admin/trips/:tripId`
更新班次信息

#### PUT `/admin/trips/:tripId/status`
更新班次状态
```json
// Request
{
  "status": "delayed",
  "reason": "Traffic congestion",
  "new_departure_time": "2024-01-15T08:30:00Z"
}
```

### 📊 预订管理

#### GET `/admin/bookings`
获取所有预订
```json
// Query Parameters
?status=pending&payment_status=paid&date_from=2024-01-01

// Response
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "booking_reference": "TBS20240115001",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "trip": {
          "departure_datetime": "2024-01-15T08:00:00Z",
          "route_name": "KL - Johor Express"
        },
        "passengers_count": 2,
        "total_amount": 90.00,
        "booking_status": "confirmed",
        "payment_status": "paid"
      }
    ]
  }
}
```

#### PUT `/admin/bookings/:bookingId`
管理员修改预订

#### POST `/admin/bookings/:bookingId/refund`
处理退款申请

### 👥 用户管理

#### GET `/admin/users`
获取用户列表
```json
// Response
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "is_active": true,
        "total_bookings": 5,
        "last_login": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### PUT `/admin/users/:userId/status`
更新用户状态
```json
// Request
{
  "is_active": false,
  "reason": "Suspicious activity"
}
```

### 📈 报表和分析

#### GET `/admin/analytics/revenue`
收入分析
```json
// Query Parameters
?period=monthly&year=2024

// Response
{
  "success": true,
  "data": {
    "revenue_by_month": [
      {
        "month": "2024-01",
        "total_revenue": 25000.00,
        "total_bookings": 500,
        "average_booking_value": 50.00
      }
    ]
  }
}
```

#### GET `/admin/analytics/popular-routes`
热门路线分析

#### GET `/admin/analytics/occupancy`
座位占有率分析

### ⚙️ 系统设置

#### GET `/admin/settings`
获取系统设置

#### PUT `/admin/settings`
更新系统设置
```json
// Request
{
  "booking_cancellation_hours": 24,
  "max_passengers_per_booking": 8,
  "notification_email_enabled": true
}
```

---

## 🔔 通知相关 APIs

### GET `/notifications`
获取用户通知
```json
// Response
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "booking_confirmation",
        "title": "Booking Confirmed",
        "message": "Your booking TBS20240115001 has been confirmed",
        "is_read": false,
        "created_at": "2024-01-15T09:00:00Z"
      }
    ],
    "unread_count": 3
  }
}
```

### PUT `/notifications/:notificationId/read`
标记通知为已读

### PUT `/notifications/mark-all-read`
标记所有通知为已读

---

## 📱 移动端特定 APIs

### GET `/mobile/trips/:tripId/qr-code`
获取行程二维码

### POST `/mobile/tickets/validate`
验证电子票
```json
// Request
{
  "qr_code_data": "encrypted_booking_data",
  "scanner_location": "KL Sentral Terminal"
}

// Response
{
  "success": true,
  "data": {
    "valid": true,
    "booking_reference": "TBS20240115001",
    "passenger_name": "John Doe",
    "seat_number": "A1",
    "trip_info": {
      "departure_time": "2024-01-15T08:00:00Z",
      "route_name": "KL - Johor Express"
    }
  }
}
```

---

## 🔧 错误处理

### 标准错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 常见错误码
- `UNAUTHORIZED` (401): 未认证
- `FORBIDDEN` (403): 无权限
- `NOT_FOUND` (404): 资源不存在
- `VALIDATION_ERROR` (422): 输入验证失败
- `PAYMENT_FAILED` (402): 支付失败
- `BOOKING_EXPIRED` (410): 预订已过期
- `SEAT_UNAVAILABLE` (409): 座位不可用

---

## 📋 API使用说明

### 认证流程
1. 使用 `/auth/login` 获取访问令牌
2. 在请求头中包含: `Authorization: Bearer {access_token}`
3. 令牌过期时使用 `/auth/refresh` 刷新

### 分页参数
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)

### 排序参数
- `sort_by`: 排序字段
- `sort_order`: `asc` 或 `desc` (默认: `desc`)

### 搜索参数
- `search`: 关键词搜索
- `filter[field]`: 字段筛选

这套API设计覆盖了Transport Booking System的所有核心功能，支持完整的业务流程，同时考虑了安全性、性能和易用性。 