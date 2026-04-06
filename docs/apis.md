# Furniture Customizer — Admin API Structure

This document lists all backend APIs required for the **Furniture Customizer Admin Panel**.

Each API includes:

- Method
- Endpoint
- Request Body
- Response
- User Role
- Important Notes

---

# Authentication APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, refreshToken, user }` | Admin | Returns JWT token |
| POST | `/api/auth/register` | `{ name, email, password }` | `{ user }` | Admin | Optional registration |
| POST | `/api/auth/forgot-password` | `{ email }` | `{ message }` | Admin | Sends reset email |
| POST | `/api/auth/reset-password` | `{ token, newPassword }` | `{ message }` | Admin | Password reset |
| POST | `/api/auth/refresh-token` | `{ refreshToken }` | `{ token }` | Admin | Token renewal |
| POST | `/api/auth/logout` | `{}` | `{ message }` | Admin | Ends session |

---

# Global APIs (Header / Layout)

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/me` | — | `{ id, name, email, role, avatar, permissions }` | Admin | Current logged-in user |
| GET | `/api/admin/search` | query: `?q={query}&type={all|orders|products|users|vendors}&limit=10` | `{ results, totalCount }` | Admin | Global search |
| GET | `/api/admin/notifications` | query: `?unread=true&limit=10` | `{ notifications, unreadCount }` | Admin | Notification dropdown |
| PATCH | `/api/admin/notifications/mark-all-read` | `{}` | `{ message }` | Admin | Mark all notifications read |
| PATCH | `/api/admin/notifications/{id}/read` | — | `{ message }` | Admin | Mark single notification read |

---

# Dashboard APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/dashboard/stats` | — | `{ stats }` | Admin | KPI cards |
| GET | `/api/admin/dashboard/sales-chart` | query: `?period={daily|monthly}` | `{ period, labels, datasets }` | Admin | Daily/monthly chart |
| GET | `/api/admin/dashboard/conversion` | — | `{ conversionMetrics }` | Admin | Conversion widget |
| GET | `/api/admin/dashboard/activity` | query: `?limit=5` | `{ activities }` | Admin | Recent activity |
| GET | `/api/admin/dashboard/top-products` | query: `?limit=5` | `{ products }` | Admin | Top selling models |

---

# User Management APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/users/stats` | — | `{ stats }` | Admin | User statistics |
| GET | `/api/admin/users` | query: `?page=1&limit=10&search={q}&role={role}&status={status}` | `{ users, pagination }` | Admin | List users |
| GET | `/api/admin/users/{id}` | — | `{ user }` | Admin | User profile |
| POST | `/api/admin/users` | `{ name, email, role, password }` | `{ user }` | Admin | Create user |
| PUT | `/api/admin/users/{id}` | `{ name, email, role, status }` | `{ user }` | Admin | Update user |
| PATCH | `/api/admin/users/{id}/status` | `{ status }` | `{ message }` | Admin | Toggle status |
| DELETE | `/api/admin/users/{id}` | — | `{ message }` | Admin | Delete user |
| GET | `/api/admin/users/export` | query: `?format={csv|excel}` | `CSV/Excel file` | Admin | Export users |

---

# Vendor Management APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/vendors/stats` | — | `{ stats }` | Admin | Vendor KPIs |
| GET | `/api/admin/vendors` | query: `?status=active&search={q}&page=1&limit=10` | `{ vendors, pagination }` | Admin | Vendor list |
| GET | `/api/admin/vendors/{id}` | — | `{ vendor }` | Admin | Vendor profile |
| GET | `/api/admin/vendors/applications` | query: `?status=pending&page=1&limit=10` | `{ applications }` | Admin | Pending applications |
| POST | `/api/admin/vendors/invite` | `{ name, email, phone }` | `{ invitation }` | Admin | Invite vendor |
| PATCH | `/api/admin/vendors/applications/{id}/approve` | `{ note }` | `{ message }` | Admin | Approve vendor |
| PATCH | `/api/admin/vendors/applications/{id}/reject` | `{ reason }` | `{ message }` | Admin | Reject vendor |
| PUT | `/api/admin/vendors/{id}` | `{ vendorData }` | `{ vendor }` | Admin | Edit vendor |
| PATCH | `/api/admin/vendors/{id}/status` | `{ status }` | `{ message }` | Admin | Activate/deactivate |
| GET | `/api/admin/vendors/export` | query: `?format={csv|excel}` | `CSV file` | Admin | Export vendors |

---

# Product Moderation APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/products/stats` | — | `{ stats }` | Admin | Product KPIs |
| GET | `/api/admin/products` | query: `?category={cat}&status={status}&page=1&limit=10` | `{ products, pagination }` | Admin | Product catalog |
| GET | `/api/admin/products/{id}` | — | `{ product }` | Admin | Product detail |
| GET | `/api/admin/products/pending` | query: `?page=1&limit=10` | `{ pendingProducts }` | Admin | Moderation list |
| POST | `/api/admin/products` | `{ name, vendor, category, status, price, sku, description, images }` | `{ product }` | Admin | Create product |
| PUT | `/api/admin/products/{id}` | `{ name, vendor, category, status, price, sku, description, images }` | `{ product }` | Admin | Edit product |
| DELETE | `/api/admin/products/{id}` | — | `{ message }` | Admin | Delete product |
| PATCH | `/api/admin/products/pending/{id}/approve` | — | `{ message }` | Admin | Approve listing |
| PATCH | `/api/admin/products/pending/{id}/reject` | `{ reason }` | `{ message }` | Admin | Reject listing |
| GET | `/api/admin/products/export` | query: `?format={csv|excel}` | `CSV/Excel file` | Admin | Export products |

---

# Analytics APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/analytics/kpis` | query: `?range={oct|q3|h1|ytd|custom}&from={date}&to={date}` | `{ kpis, totalSales, rangeLabel }` | Admin | KPI analytics |
| GET | `/api/admin/analytics/revenue-chart` | query: `?range={oct|q3|h1|ytd}` | `{ months, currentYear, previousYear }` | Admin | Revenue chart |
| GET | `/api/admin/analytics/sales-by-category` | query: `?range={oct|q3|h1|ytd}` | `{ categories }` | Admin | Donut chart |
| GET | `/api/admin/analytics/vendor-performance` | query: `?range={oct|q3|h1|ytd}` | `{ vendors }` | Admin | Vendor analytics |
| GET | `/api/admin/analytics/user-growth` | query: `?range={oct|q3|h1|ytd}` | `{ userGrowth }` | Admin | Growth metrics |
| GET | `/api/admin/analytics/export` | query: `?format={csv|excel|pdf}&range={range}` | `file` | Admin | Export analytics |

---

# Coupon APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/coupons/stats` | — | `{ stats }` | Admin | Coupon KPIs |
| GET | `/api/admin/coupons` | query: `?tab={all|active|expired}&search={code}&page=1&limit=10` | `{ coupons, pagination }` | Admin | Coupon list |
| GET | `/api/admin/coupons/{id}` | — | `{ coupon }` | Admin | Single coupon detail |
| POST | `/api/admin/coupons` | `{ code, discountType, discountValue, expiryDate, usageLimit, description }` | `{ coupon }` | Admin | Create coupon |
| PUT | `/api/admin/coupons/{id}` | `{ code, discountType, discountValue, expiryDate, usageLimit, description }` | `{ coupon }` | Admin | Edit coupon |
| PATCH | `/api/admin/coupons/{id}/visibility` | `{ isVisible }` | `{ message }` | Admin | Toggle visibility |
| DELETE | `/api/admin/coupons/{id}` | — | `{ message }` | Admin | Delete coupon |
| GET | `/api/admin/coupons/export` | query: `?format={csv|excel}` | `CSV/Excel file` | Admin | Export coupons |

---

# Order Management APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/orders/stats` | — | `{ stats }` | Admin | Order KPIs |
| GET | `/api/admin/orders` | query: `?page=1&limit=10&status={status}&payment={payment}&dateFrom={date}&dateTo={date}` | `{ orders, pagination }` | Admin | Orders list |
| GET | `/api/admin/orders/{id}` | — | `{ order }` | Admin | Order detail |
| POST | `/api/admin/orders` | `{ customerName, total, paymentStatus, orderStatus }` | `{ order }` | Admin | Create order |
| PUT | `/api/admin/orders/{id}` | `{ customerName, total, paymentStatus, orderStatus }` | `{ order }` | Admin | Update order |
| PATCH | `/api/admin/orders/{id}/status` | `{ status, reason }` | `{ message }` | Admin | Status override |
| GET | `/api/admin/orders/{id}/invoice` | — | `invoice file` | Admin | Invoice |
| GET | `/api/admin/orders/export` | query: `?format={csv|excel}&status={status}&payment={payment}&dateFrom={date}&dateTo={date}` | `CSV file` | Admin | Export orders |

---

# Security APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| GET | `/api/admin/security/stats` | — | `{ stats }` | Admin | Security overview |
| GET | `/api/admin/security/roles` | — | `{ roles }` | Admin | Role management |
| POST | `/api/admin/security/roles` | `{ name, description, accessLevel, permissions }` | `{ role }` | Admin | Create role |
| PUT | `/api/admin/security/roles/{id}` | `{ name, description, accessLevel, permissions }` | `{ role }` | Admin | Edit role |
| DELETE | `/api/admin/security/roles/{id}` | — | `{ message }` | Admin | Delete role |
| GET | `/api/admin/security/audit-logs` | query: `?page=1&limit=10` | `{ logs, pagination }` | Admin | Security logs |
| GET | `/api/admin/security/audit-logs/export` | query: `?format={csv|excel}` | `CSV file` | Admin | Export logs |
| GET | `/api/admin/security/user-assignments` | query: `?page=1&limit=10` | `{ assignments, pagination }` | Admin | User-role mapping |

---

# Utility APIs

| Method | Endpoint | Request Body | Response | User | Important Info |
|------|------|------|------|------|------|
| POST | `/api/admin/upload` | `multipart/form-data (file)` | `{ url, filename, size }` | Admin | Generic file upload for product images, avatars |

---

# Standard API Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "errors": null
}
```

# Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

# Pagination Parameters (Standard)

```
?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

# Authentication Notes

- All `/api/admin/*` endpoints require `Authorization: Bearer <token>` header
- Token obtained from `POST /api/auth/login`
- Token refresh via `POST /api/auth/refresh-token`
- Backend must allow CORS for the frontend origin (e.g., `http://localhost:5173` in dev)

# Total Endpoints: 75