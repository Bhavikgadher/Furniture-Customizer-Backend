# API Endpoints Documentation

## Base URL
```
http://localhost:3000
```

---

## 1. Authentication Module

### POST /api/auth/login
Authenticate user and issue JWT token (stored in httpOnly cookie).

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "admin",
    "avatarUrl": null
  }
}
```

**Cookie Set:**
- Name: `token`
- Value: JWT token
- HttpOnly: true
- Secure: true (in production)
- SameSite: strict
- Max-Age: 7 days (604800 seconds)

**Error Response:**
```json
{
  "success": false,
  "errorCode": "INVALID_CREDENTIALS",
  "message": "Invalid credentials"
}
```

---

### POST /api/auth/logout
Clear authentication cookie.

**Request Body:** None required

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookie Cleared:** `token` cookie is removed

---

## 2. Admin Users Module
**Authentication Required: Yes (JWT Bearer Token)**

### GET /api/admin/users
Get paginated list of users with filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role name
- `status` (optional): Filter by status (active/inactive)

**Example Request:**
```
GET /api/admin/users?page=1&limit=10&role=customer&status=active
```

**Response (Success - 200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "status": "active",
      "joinDate": "2024-01-15T10:30:00.000Z",
      "avatarUrl": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### POST /api/admin/users
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "customer",
  "status": "active"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Note:** Default password is set to `Password123!`

---

## 3. Vendors Module
**Authentication Required: Yes (JWT Bearer Token)**

### GET /api/admin/vendors
List vendors with optional status filter.

**Query Parameters:**
- `status` (optional): Filter by approval status (approved/pending)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Request:**
```
GET /api/admin/vendors?status=approved&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "vendors": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "companyName": "Furniture Co.",
      "status": "approved",
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

---

## 4. Products Module
**Authentication Required: Yes (JWT Bearer Token)**

### POST /api/admin/products
Create a new furniture model.

**Request Body:**
```json
{
  "name": "Modern Sofa",
  "categoryId": "880e8400-e29b-41d4-a716-446655440003",
  "vendorId": "770e8400-e29b-41d4-a716-446655440002",
  "basePrice": 25000.00,
  "sku": "SOFA-001",
  "status": "active"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
```json
{
  "success": false,
  "errorCode": "CATEGORY_NOT_FOUND",
  "message": "Category not found"
}
```

```json
{
  "success": false,
  "errorCode": "VENDOR_NOT_FOUND",
  "message": "Vendor not found"
}
```

---

## 5. Orders Module
**Authentication Required: Yes (JWT Bearer Token)**

### GET /api/admin/orders
Get paginated list of orders with filters.

**Query Parameters:**
- `status` (optional): Filter by order status (pending/confirmed/processing/shipped/delivered/cancelled)
- `payment` (optional): Filter by payment status (pending/paid/failed/refunded)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Request:**
```
GET /api/admin/orders?status=pending&payment=paid&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440005",
      "orderNumber": "ORD-AA0E8400",
      "customerName": "John Doe",
      "total": 50000.00,
      "paymentStatus": "paid",
      "orderStatus": "processing",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

---

## 6. Coupons Module
**Authentication Required: Yes (JWT Bearer Token)**

### POST /api/admin/coupons
Create a new discount coupon.

**Request Body:**
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20.00,
  "expiryDate": "2024-12-31T23:59:59.000Z",
  "usageLimit": 100
}
```

**Discount Types:**
- `percentage`: Discount as percentage (e.g., 20 = 20%)
- `fixed`: Fixed amount discount

**Response (Success - 200):**
```json
{
  "success": true,
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "errorCode": "COUPON_EXISTS",
  "message": "Coupon code already exists"
}
```

---

## 7. Security Module
**Authentication Required: Yes (JWT Bearer Token)**

### GET /api/admin/security/roles
List all system roles.

**Response (Success - 200):**
```json
{
  "success": true,
  "roles": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440007",
      "name": "admin",
      "description": "System administrator"
    },
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440008",
      "name": "vendor",
      "description": "Furniture vendor"
    },
    {
      "id": "ee0e8400-e29b-41d4-a716-446655440009",
      "name": "designer",
      "description": "Furniture designer"
    },
    {
      "id": "ff0e8400-e29b-41d4-a716-446655440010",
      "name": "customer",
      "description": "End customer"
    }
  ]
}
```

---

## Authentication

JWT tokens are automatically stored in httpOnly cookies after login. The token expires after 7 days.

**Two ways to authenticate:**

1. **Cookie-based (Recommended):** Token is automatically sent with requests
2. **Header-based:** Include JWT token in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

The middleware checks for token in cookies first, then falls back to Authorization header.

---

## Error Response Format

All endpoints return errors in this standardized format:

```json
{
  "success": false,
  "errorCode": "ERROR_CODE_STRING",
  "message": "Human-readable error message"
}
```

### Common Error Codes

| Error Code | Status | Description |
|------------|--------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | No token provided |
| INVALID_TOKEN | 401 | Invalid or malformed token |
| TOKEN_EXPIRED | 401 | Token has expired |
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| ACCOUNT_INACTIVE | 403 | User account is inactive |
| EMAIL_EXISTS | 400 | Email already registered |
| INVALID_ROLE | 400 | Role does not exist |
| CATEGORY_NOT_FOUND | 404 | Category not found |
| VENDOR_NOT_FOUND | 404 | Vendor not found |
| COUPON_EXISTS | 400 | Coupon code already exists |
| INVALID_DISCOUNT_TYPE | 400 | Invalid discount type |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |

---

## Database Schema Notes

### Key Tables:
- **users**: Stores all users (admin, vendor, designer, customer)
- **roles**: System roles with permissions
- **vendors**: Vendor-specific data linked to users
- **designers**: Designer-specific data linked to users
- **furniture_models**: Product catalog
- **orders**: Customer orders with status tracking
- **coupons**: Discount coupons with usage tracking
- **materials, colors, fabrics, sizes, add_ons**: Product customization options
- **saved_designs**: User-saved furniture configurations
- **cart**: Shopping cart functionality
- **reviews**: Product reviews and ratings

### Enum Types:
- **order_status_enum**: pending, confirmed, processing, shipped, delivered, cancelled
- **payment_status_enum**: pending, paid, failed, refunded
- **discount_type_enum**: percentage, fixed
- **inventory_change_enum**: IN, OUT
