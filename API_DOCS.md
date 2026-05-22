# Natheef API Documentation

Base URL: `http://localhost:5000/api`

Auth header: `Authorization: Bearer <token>`

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register (client or provider) |
| POST | `/auth/login` | ❌ | Login → returns JWT |
| GET | `/auth/me` | ✅ | Get current user + shop (if provider) |

### POST /auth/register
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123",
  "role": "client",         // or "provider"
  "phone": "0501234567",
  "username": "johndoe"
}
```

### POST /auth/login
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Response:** `{ token, user: { _id, name, email, role } }`

---

## Shops (Explore Page)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/shops` | ❌ | — | List shops with filters |
| GET | `/shops/:id` | ❌ | — | Shop detail |
| GET | `/shops/:id/services` | ❌ | — | Services offered |
| GET | `/shops/:id/reviews` | ❌ | — | Shop reviews |
| GET | `/shops/provider/my` | ✅ | provider | My shop |
| POST | `/shops` | ✅ | provider | Create shop |
| PUT | `/shops/:id` | ✅ | provider | Update shop |
| GET | `/shops/:id/dashboard` | ✅ | provider | Shop analytics |
| POST | `/shops/:id/services` | ✅ | provider | Add service |
| DELETE | `/shops/:id/services/:psId` | ✅ | provider | Remove service |

### GET /shops — Explore page query params

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lat` | float | — | User latitude |
| `lng` | float | — | User longitude |
| `max_distance` | km | 15 | Radius filter |
| `services` | string | — | Comma-separated service IDs |
| `price_range` | string | — | `economy` / `medium` / `luxury` |
| `fast_delivery` | bool | — | `true` to filter fast-delivery shops |
| `sort_by` | string | `rating` | `rating` / `distance` / `price_asc` / `price_desc` |
| `page` | int | 1 | Page number |
| `limit` | int | 10 | Results per page |

**Example:**
```
GET /api/shops?lat=24.774&lng=46.738&max_distance=10&services=ID1,ID2&price_range=medium&sort_by=rating&page=1&limit=10
```

**Response:**
```json
{
  "total": 125,
  "page": 1,
  "pages": 13,
  "shops": [
    {
      "_id": "...",
      "name": "مغسلة السحاب الفاخرة",
      "address": "حي الملقا، الرياض",
      "lat": 24.774265,
      "lng": 46.738586,
      "avg_rating": 4.9,
      "review_count": 42,
      "avg_price": 115,
      "price_tier": "$$$",
      "distance_km": 1.2,
      "fast_delivery_available": false,
      "services_offered": [
        { "_id": "...", "name": "غسيل ملابس" }
      ]
    }
  ]
}
```

### POST /shops/:id/services
```json
{
  "service": "<service_id>",
  "price": 50
}
```

---

## Services (Categories)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/services` | ❌ | — | All services as tree |
| POST | `/services` | ✅ | admin | Create service/category |
| DELETE | `/services/:id` | ✅ | admin | Delete service |

**GET /services response:**
```json
[
  {
    "_id": "...",
    "name": "غسيل ملابس",
    "parent": null,
    "children": [
      { "_id": "...", "name": "غسيل عادي" },
      { "_id": "...", "name": "كوي" }
    ]
  }
]
```

---

## Orders

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/orders` | ✅ | client | Place order |
| GET | `/orders` | ✅ | client/provider | My orders |
| GET | `/orders/:id` | ✅ | any | Order detail |
| GET | `/orders/:id/items` | ✅ | any | Order items |
| PATCH | `/orders/:id/status` | ✅ | provider/admin/client | Update status |

### POST /orders
```json
{
  "provider": "<shop_id>",
  "pickup_time": "2025-06-15T10:00:00Z",
  "notes": "Please be careful with the suit",
  "items": [
    { "provider_service_id": "<ps_id>", "quantity": 2 },
    { "provider_service_id": "<ps_id>", "quantity": 1 }
  ]
}
```

**Response:** Order + items. Prices are auto-calculated:
- `provider_price` = sum of (service price × qty)
- `app_price` = 5% of provider_price
- `shipping_price` = 10 SAR flat
- `total_price` = all three combined

### Order Statuses Flow
```
pending → accepted → picked_up → in_progress → ready → out_for_delivery → delivered
                                                                          ↑
                                                                      cancelled (from pending only, by client)
```

### PATCH /orders/:id/status
```json
{ "status": "accepted" }
```

---

## Reviews

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/reviews/shop/:shopId` | ❌ | — | Shop reviews |
| POST | `/reviews` | ✅ | client | Review a delivered order |
| DELETE | `/reviews/:id` | ✅ | admin | Delete review |

### POST /reviews
```json
{
  "order": "<order_id>",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## Regions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/regions` | ❌ | All regions |
| POST | `/regions` | admin | Create region |
| DELETE | `/regions/:id` | admin | Delete region |

---

## Addresses (Client)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/addresses` | ✅ | My addresses |
| POST | `/addresses` | ✅ | Add address |
| DELETE | `/addresses/:id` | ✅ | Delete address |

### POST /addresses
```json
{ "region": "<region_id>", "address": "شارع الأمير محمد بن سلمان، حي الملقا" }
```

---

## Delivery Agents (Provider)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/delivery` | ✅ | provider | My delivery agents |
| POST | `/delivery` | ✅ | provider | Add agent |
| PATCH | `/delivery/:id/status` | ✅ | provider | Update agent status |

---

## Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform-wide stats |
| GET | `/admin/users?role=client` | All users |
| GET | `/admin/shops?verified=false` | All shops |
| PATCH | `/admin/shops/:id/verify` | Verify a shop |

**GET /admin/stats response:**
```json
{
  "totalUsers": 1500,
  "totalShops": 130,
  "verifiedShops": 125,
  "totalOrders": 8420,
  "platformRevenue": 42100
}
```

---

## User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | ✅ | Get profile |
| PUT | `/users/profile` | ✅ | Update profile/password |

---

## Error Format

All errors follow:
```json
{ "message": "Human readable error description" }
```

HTTP status codes used: 200, 201, 400, 401, 403, 404, 409, 500
