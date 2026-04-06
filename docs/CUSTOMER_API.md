# Customer API Documentation

> Base URL: `/api/customer`  
> Auth: `Authorization: Bearer <token>` (required where marked 🔒)

---

## 1. Auth

### POST `/api/customer/auth/register`
Register a new customer account.

**Request Body**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "9876543210"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### POST `/api/customer/auth/login`

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "expiresIn": "7d",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

---

### POST `/api/customer/auth/logout`

**Request Body**: none

**Response `200`**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### POST `/api/customer/auth/forgot-password`

**Request Body**
```json
{ "email": "john@example.com" }
```

**Response `200`**
```json
{ "success": true, "message": "If the email exists, a reset link has been sent" }
```

---

### POST `/api/customer/auth/reset-password`

**Request Body**
```json
{
  "token": "reset_token_here",
  "newPassword": "newSecret123"
}
```

**Response `200`**
```json
{ "success": true, "message": "Password reset successful" }
```

---

## 2. Profile 🔒

### GET `/api/customer/profile`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "is_verified": false,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

---

### PUT `/api/customer/profile` 🔒

**Request Body**
```json
{
  "full_name": "John Updated",
  "phone": "9999999999"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "user": { "id": "uuid", "full_name": "John Updated", "phone": "9999999999" }
  }
}
```

---

### PUT `/api/customer/profile/change-password` 🔒

**Request Body**
```json
{
  "currentPassword": "secret123",
  "newPassword": "newSecret456"
}
```

**Response `200`**
```json
{ "success": true, "message": "Password changed successfully" }
```

---

### GET `/api/customer/profile/addresses` 🔒

**Response `200`**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "uuid",
        "address_line1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India",
        "is_default": true
      }
    ]
  }
}
```

---

### POST `/api/customer/profile/addresses` 🔒

**Request Body**
```json
{
  "address_line1": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "is_default": true
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Address added",
  "data": { "address": { "id": "uuid", "address_line1": "123 Main St", "city": "Mumbai" } }
}
```

---

### PUT `/api/customer/profile/addresses/:id` 🔒

**Request Body** (any fields to update)
```json
{
  "city": "Pune",
  "pincode": "411001"
}
```

**Response `200`**
```json
{ "success": true, "message": "Address updated", "data": { "address": { "id": "uuid" } } }
```

---

### DELETE `/api/customer/profile/addresses/:id` 🔒

**Response `200`**
```json
{ "success": true, "message": "Address deleted successfully" }
```

---

### PATCH `/api/customer/profile/addresses/:id/default` 🔒

**Response `200`**
```json
{ "success": true, "message": "Default address updated" }
```

---

## 3. Catalog (Public)

### GET `/api/customer/catalog/products`

**Query Params**
| Param | Type | Description |
|---|---|---|
| `page` | number | default 1 |
| `limit` | number | default 12 |
| `category` | string | category name |
| `search` | string | search keyword |
| `sort` | string | `newest`, `price_asc`, `price_desc` |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Wooden Sofa",
        "price": 25000.00,
        "image": "url",
        "category": "Sofas",
        "vendor": "Doe Furniture Co."
      }
    ],
    "pagination": { "page": 1, "limit": 12, "total": 50, "totalPages": 5 }
  }
}
```

---

### GET `/api/customer/catalog/products/:id`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Wooden Sofa",
      "description": "Premium quality sofa",
      "price": 25000.00,
      "image": "url",
      "category": { "id": "uuid", "name": "Sofas" },
      "vendor": { "id": "uuid", "name": "Doe Furniture Co." }
    }
  }
}
```

---

### GET `/api/customer/catalog/products/:id/reviews`

**Query Params**: `page`, `limit`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "reviews": [
      { "id": "uuid", "rating": 5, "comment": "Great product!", "user": "Jane", "createdAt": "2026-01-01T00:00:00.000Z" }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
  }
}
```

---

### GET `/api/customer/catalog/categories`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Sofas",
        "children": [{ "id": "uuid", "name": "Sectional Sofas" }]
      }
    ]
  }
}
```

---

### GET `/api/customer/catalog/categories/:id/products`

**Query Params**: `page`, `limit`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "products": [{ "id": "uuid", "name": "Wooden Sofa", "price": 25000.00, "image": "url" }],
    "pagination": { "page": 1, "limit": 12, "total": 10, "totalPages": 1 }
  }
}
```

---

### GET `/api/customer/catalog/search?q=sofa`

**Query Params**: `q` (search term), `page`, `limit`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "products": [{ "id": "uuid", "name": "Wooden Sofa", "price": 25000.00, "category": "Sofas" }],
    "pagination": { "page": 1, "limit": 12, "total": 3, "totalPages": 1 }
  }
}
```

---

### GET `/api/customer/catalog/featured`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "products": [{ "id": "uuid", "name": "Wooden Sofa", "price": 25000.00, "image": "url", "category": "Sofas" }]
  }
}
```

---

### GET `/api/customer/catalog/vendor/:id`

**Query Params**: `page`, `limit`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "vendor": { "id": "uuid", "name": "Doe Furniture Co.", "contact": "John Doe" },
    "products": [{ "id": "uuid", "name": "Wooden Sofa", "price": 25000.00 }],
    "pagination": { "page": 1, "limit": 12, "total": 5, "totalPages": 1 }
  }
}
```

---

## 4. Customizer

### GET `/api/customer/customizer/product/:id/options` (Public)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "basePrice": 25000.00,
    "options": {
      "materials": [{ "id": "uuid", "name": "Teak Wood", "price_multiplier": 1.5 }],
      "colors": [{ "id": "uuid", "name": "Walnut Brown", "hex_code": "#5C4033", "price_modifier": 500 }],
      "fabrics": [{ "id": "uuid", "name": "Velvet", "price_multiplier": 1.2 }],
      "sizes": [{ "id": "uuid", "name": "Large", "width": 200, "height": 90, "depth": 85, "price_multiplier": 1.3 }],
      "addons": [{ "id": "uuid", "name": "Cup Holder", "price": 800 }]
    }
  }
}
```

---

### POST `/api/customer/customizer/calculate-price` (Public)

**Request Body**
```json
{
  "model_id": "uuid",
  "material_id": "uuid",
  "color_id": "uuid",
  "fabric_id": "uuid",
  "size_id": "uuid",
  "addon_ids": ["uuid", "uuid"]
}
```

**Response `200`**
```json
{
  "success": true,
  "data": { "calculatedPrice": 42300.00 }
}
```

---

### POST `/api/customer/customizer/save-design` 🔒

**Request Body**
```json
{
  "model_id": "uuid",
  "material_id": "uuid",
  "color_id": "uuid",
  "fabric_id": "uuid",
  "size_id": "uuid",
  "addon_ids": ["uuid"]
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Design saved",
  "data": {
    "design": { "id": "uuid", "calculatedPrice": 42300.00, "createdAt": "2026-01-01T00:00:00.000Z" }
  }
}
```

---

### GET `/api/customer/customizer/designs` 🔒

**Response `200`**
```json
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "uuid",
        "calculated_price": "42300.00",
        "model": { "id": "uuid", "name": "Wooden Sofa", "base_image": "url" },
        "material": { "id": "uuid", "name": "Teak Wood" },
        "color": { "id": "uuid", "name": "Walnut Brown", "hex_code": "#5C4033" },
        "fabric": { "id": "uuid", "name": "Velvet" },
        "size": { "id": "uuid", "name": "Large" }
      }
    ]
  }
}
```

---

### GET `/api/customer/customizer/designs/:id` 🔒

**Response `200`**
```json
{
  "success": true,
  "data": {
    "design": {
      "id": "uuid",
      "calculated_price": "42300.00",
      "model": { "id": "uuid", "name": "Wooden Sofa" },
      "material": { "id": "uuid", "name": "Teak Wood" },
      "AddOns": [{ "id": "uuid", "name": "Cup Holder", "price": "800.00" }]
    }
  }
}
```

---

### DELETE `/api/customer/customizer/designs/:id` 🔒

**Response `200`**
```json
{ "success": true, "message": "Design deleted successfully" }
```

---

## 5. Cart 🔒

### GET `/api/customer/cart`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "uuid",
      "total": 42300.00,
      "items": [
        {
          "id": "uuid",
          "quantity": 2,
          "SavedDesign": {
            "id": "uuid",
            "calculated_price": "42300.00",
            "model": { "id": "uuid", "name": "Wooden Sofa", "base_image": "url" }
          }
        }
      ]
    }
  }
}
```

---

### POST `/api/customer/cart/items` 🔒

**Request Body**
```json
{
  "saved_design_id": "uuid",
  "quantity": 1
}
```

**Response `201`**
```json
{ "success": true, "message": "Item added to cart", "data": { "item": { "id": "uuid", "quantity": 1 } } }
```

---

### PATCH `/api/customer/cart/items/:id` 🔒

**Request Body**
```json
{ "quantity": 3 }
```

**Response `200`**
```json
{ "success": true, "message": "Cart updated", "data": { "item": { "id": "uuid", "quantity": 3 } } }
```

---

### DELETE `/api/customer/cart/items/:id` 🔒

**Response `200`**
```json
{ "success": true, "message": "Item removed from cart" }
```

---

### DELETE `/api/customer/cart` 🔒

**Response `200`**
```json
{ "success": true, "message": "Cart cleared" }
```

---

## 6. Checkout 🔒

### POST `/api/customer/checkout/validate`

**Response `200`**
```json
{
  "success": true,
  "data": { "valid": true, "itemCount": 2, "total": 84600.00 }
}
```

---

### POST `/api/customer/checkout/apply-coupon`

**Request Body**
```json
{
  "code": "SAVE10",
  "orderTotal": 84600.00
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "couponId": "uuid",
    "discount": 8460.00,
    "finalTotal": 76140.00
  }
}
```

---

### POST `/api/customer/checkout/create-order`

**Request Body**
```json
{
  "address_id": "uuid",
  "coupon_code": "SAVE10"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-A1B2C3D4",
      "total": 76140.00,
      "status": "pending"
    }
  }
}
```

---

## 7. Orders 🔒

### GET `/api/customer/orders`

**Query Params**: `page`, `limit`, `status` (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-A1B2C3D4",
        "total": 76140.00,
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
  }
}
```

---

### GET `/api/customer/orders/:id`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "total_amount": "84600.00",
      "discount_amount": "8460.00",
      "final_amount": "76140.00",
      "status": "pending",
      "payment_status": "pending",
      "address": { "address_line1": "123 Main St", "city": "Mumbai" },
      "OrderItems": [
        {
          "id": "uuid",
          "quantity": 2,
          "unit_price": "42300.00",
          "total_price": "84600.00",
          "snapshot_data": {}
        }
      ],
      "Payment": { "status": "pending", "amount": "76140.00" }
    }
  }
}
```

---

### POST `/api/customer/orders/:id/cancel`

**Request Body**: none

**Response `200`**
```json
{ "success": true, "message": "Order cancelled successfully" }
```

---

## 8. Payments 🔒

### POST `/api/customer/payments/initiate`

**Request Body**
```json
{
  "order_id": "uuid",
  "payment_method": "upi"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "amount": 76140.00,
    "paymentMethod": "upi",
    "status": "pending",
    "message": "Proceed with payment using the provided details"
  }
}
```

---

### POST `/api/customer/payments/verify`

**Request Body**
```json
{
  "order_id": "uuid",
  "transaction_id": "TXN123456789"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": { "paymentStatus": "paid" }
}
```

---

### GET `/api/customer/payments/history`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "orderId": "uuid",
        "orderNumber": "ORD-A1B2C3D4",
        "amount": 76140.00,
        "method": "upi",
        "status": "paid",
        "paidAt": "2026-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 9. Reviews 🔒

### POST `/api/customer/reviews`

> Only allowed for products from delivered orders.

**Request Body**
```json
{
  "model_id": "uuid",
  "rating": 5,
  "comment": "Excellent quality and finish!"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Review submitted",
  "data": {
    "review": { "id": "uuid", "rating": 5, "comment": "Excellent quality and finish!", "createdAt": "2026-01-01T00:00:00.000Z" }
  }
}
```

---

### PUT `/api/customer/reviews/:id`

**Request Body**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response `200`**
```json
{ "success": true, "message": "Review updated", "data": { "review": { "id": "uuid", "rating": 4 } } }
```

---

### DELETE `/api/customer/reviews/:id`

**Response `200`**
```json
{ "success": true, "message": "Review deleted successfully" }
```

---

### GET `/api/customer/reviews/my-reviews`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent!",
        "is_approved": true,
        "FurnitureModel": { "id": "uuid", "name": "Wooden Sofa", "base_image": "url" }
      }
    ]
  }
}
```

---

## 10. Wishlist 🔒

### GET `/api/customer/wishlist`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "wishlist": {
      "id": "uuid",
      "items": [
        {
          "id": "uuid",
          "added_at": "2026-01-01T00:00:00.000Z",
          "product": { "id": "uuid", "name": "Wooden Sofa", "base_price": "25000.00", "base_image": "url", "category": { "name": "Sofas" } }
        }
      ]
    }
  }
}
```

---

### POST `/api/customer/wishlist/items`

**Request Body**
```json
{ "model_id": "uuid" }
```

**Response `201`**
```json
{ "success": true, "message": "Added to wishlist", "data": { "item": { "id": "uuid", "model_id": "uuid" } } }
```

---

### DELETE `/api/customer/wishlist/items/:id`

**Response `200`**
```json
{ "success": true, "message": "Removed from wishlist" }
```

---

### GET `/api/customer/wishlist/check/:modelId`

**Response `200`**
```json
{ "success": true, "data": { "inWishlist": true } }
```

---

## 11. Consultations

### GET `/api/customer/consultations/designers` (Public)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "designers": [
      { "id": "uuid", "name": "Jane Smith", "bio": "10 years experience", "experienceYears": 10, "rating": 4.8 }
    ]
  }
}
```

---

### POST `/api/customer/consultations/book` 🔒

**Request Body**
```json
{
  "designer_id": "uuid",
  "scheduled_at": "2026-02-15T10:00:00.000Z",
  "notes": "Looking for a modern living room setup"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Consultation booked",
  "data": {
    "consultation": { "id": "uuid", "designerId": "uuid", "scheduledAt": "2026-02-15T10:00:00.000Z", "status": "pending" }
  }
}
```

---

### GET `/api/customer/consultations` 🔒

**Response `200`**
```json
{
  "success": true,
  "data": {
    "consultations": [
      {
        "id": "uuid",
        "status": "pending",
        "scheduled_at": "2026-02-15T10:00:00.000Z",
        "notes": "Modern living room",
        "designer": { "id": "uuid", "user": { "full_name": "Jane Smith" } }
      }
    ]
  }
}
```

---

### GET `/api/customer/consultations/:id` 🔒

**Response `200`**
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "uuid",
      "status": "confirmed",
      "scheduled_at": "2026-02-15T10:00:00.000Z",
      "notes": "Modern living room",
      "designer": { "id": "uuid", "user": { "full_name": "Jane Smith", "email": "jane@example.com" } }
    }
  }
}
```

---

### POST `/api/customer/consultations/:id/cancel` 🔒

**Request Body**: none

**Response `200`**
```json
{ "success": true, "message": "Consultation cancelled successfully" }
```

---

## 12. Notifications 🔒

### GET `/api/customer/notifications`

**Query Params**: `page`, `limit`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "ORDER_UPDATE",
        "title": "Order Confirmed",
        "message": "Your order ORD-A1B2C3D4 has been confirmed.",
        "is_read": false,
        "created_at": "2026-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
  }
}
```

---

### GET `/api/customer/notifications/unread-count`

**Response `200`**
```json
{ "success": true, "data": { "unreadCount": 3 } }
```

---

### PATCH `/api/customer/notifications/:id/read`

**Response `200`**
```json
{ "success": true, "message": "Marked as read" }
```

---

### PATCH `/api/customer/notifications/read-all`

**Response `200`**
```json
{ "success": true, "message": "All notifications marked as read" }
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
| Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (not eligible) |
| `404` | Resource not found |
| `500` | Internal server error |
