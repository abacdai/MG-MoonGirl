# MG-Moon Girl Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except `POST /auth/register` and `POST /auth/login` require:
```
Authorization: Bearer {token}
```

---

## 📋 Table of Contents
1. [Auth Endpoints](#auth-endpoints)
2. [Focus Session Endpoints](#focus-session-endpoints)
3. [Room Endpoints](#room-endpoints)
4. [Error Handling](#error-handling)

---

## Auth Endpoints

### POST `/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "displayName": "Moon Girl"
}
```

**Response (201):**
```json
{
  "token": "token_user_1234567890",
  "user": {
    "userId": "user_1234567890",
    "displayName": "Moon Girl",
    "userId_id": "moongirl_1234567890",
    "birthday": "15/06/2004",
    "avatar_url": "",
    "linkedAccounts": [],
    "moonCoins": 0,
    "focusHours": 0,
    "sleepHours": 0,
    "screenTimeHours": 0,
    "level": 1,
    "streak": 0
  }
}
```

---

### POST `/auth/login`
Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "token": "token_user_1234567890",
  "user": { ... }
}
```

---

### GET `/auth/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer token_user_1234567890
```

**Response (200):**
```json
{
  "userId": "user_1234567890",
  "displayName": "Moon Girl",
  "userId_id": "moongirl_1234567890",
  "birthday": "15/06/2004",
  "avatar_url": "",
  "linkedAccounts": ["gmail", "facebook"],
  "moonCoins": 450,
  "focusHours": 12.5,
  "sleepHours": 48.0,
  "screenTimeHours": 8.2,
  "level": 6,
  "streak": 12
}
```

---

### PATCH `/auth/profile`
Update user profile information.

**Request:**
```json
{
  "displayName": "New Name",
  "birthday": "20/05/2000",
  "linkedAccounts": ["gmail", "facebook", "apple"]
}
```

**Response (200):**
```json
{ ... updated user profile ... }
```

---

### POST `/auth/link-account`
Link a third-party account for backup/sync.

**Request:**
```json
{
  "account": "gmail"  // or "facebook", "apple"
}
```

**Response (200):**
```json
{ ... updated user profile with new account ... }
```

---

### POST `/auth/unlink-account`
Unlink a previously linked account.

**Request:**
```json
{
  "account": "gmail"
}
```

**Response (200):**
```json
{ ... updated user profile without account ... }
```

---

## Focus Session Endpoints

### POST `/focus/start`
Start a new focus session.

**Request:**
```json
{
  "mode": "normal",      // "infinite" | "normal" | "strict"
  "focusTime": 25        // minutes
}
```

**Response (200):**
```json
{
  "sessionId": "session_1234567890",
  "serverTick": 1234567890000,
  "clientHash": "hash_1234567890000"
}
```

**Purpose:** The server returns a `serverTick` (timestamp when session started) and `clientHash` for anti-cheat validation. Client should store these values.

---

### POST `/focus/end`
End a focus session and earn coins.

**Request:**
```json
{
  "sessionId": "session_1234567890",
  "clientEndTimestamp": 1234567950000,
  "claimedDuration": 60000,  // milliseconds
  "clientHash": "hash_1234567890000"
}
```

**Response (200):**
```json
{
  "sessionId": "session_1234567890",
  "pointsEarned": 41,
  "actualMinutes": 25,
  "newBalance": 491
}
```

**Anti-Cheat Validation:**
- ✅ Clock skew check: `±30 second` tolerance
- ✅ Duration check: Claimed duration cannot exceed 105% of server-measured time
- ✅ Hash verification: HMAC signature validation
- ✅ Rate limiting: Max 5 transactions/minute

**Errors:**
```json
{
  "error": "Clock skew detected",
  "delta_ms": 45000
}
```

---

### GET `/focus/sessions`
Get all focus sessions for the user.

**Response (200):**
```json
{
  "sessions": [
    {
      "id": "session_1234567890",
      "userId": "user_1234567890",
      "mode": "normal",
      "duration": 25,
      "startedAt": "2024-01-15T10:30:00Z",
      "endedAt": "2024-01-15T10:55:00Z",
      "completed": true,
      "pointsEarned": 41
    }
  ],
  "totalSessions": 12,
  "totalMinutes": 300
}
```

---

### GET `/focus/stats`
Get user's focus statistics and gamification metrics.

**Response (200):**
```json
{
  "moonCoins": 491,
  "focusHours": 12.5,
  "sleepHours": 48.0,
  "screenTimeHours": 8.2,
  "level": 6,
  "streak": 12
}
```

**Calculation Rules:**
- **Level**: `floor(focusHours / 2)`
- **Streak**: Total number of completed sessions
- **MoonCoins**: `100 coins per hour of focus`
- **Screen Time**: `30% of focus time` (measured from device APIs later)

---

## Room Endpoints

### GET `/rooms`
Get all unlocked/locked rooms for the user.

**Response (200):**
```json
{
  "rooms": [
    {
      "id": "room_1234567890",
      "userId": "user_1234567890",
      "type": "bedroom",
      "name": "Phòng ngủ",
      "unlocked": true,
      "unlockedAt": "2024-01-01T00:00:00Z",
      "theme": "default",
      "bgColor": "#FBBF24",
      "pointsCost": 0
    },
    {
      "id": "room_1234567891",
      "userId": "user_1234567890",
      "type": "kitchen",
      "name": "Bếp",
      "unlocked": true,
      "unlockedAt": "2024-01-10T15:30:00Z",
      "theme": "modern",
      "bgColor": "#D1D5DB",
      "pointsCost": 500
    },
    {
      "id": "room_1234567892",
      "userId": "user_1234567890",
      "type": "study",
      "name": "Phòng học",
      "unlocked": false,
      "theme": "classic",
      "bgColor": "#FBBF24",
      "pointsCost": 800
    }
  ]
}
```

---

### POST `/rooms/unlock`
Unlock a new room by spending MoonCoins.

**Request:**
```json
{
  "roomType": "kitchen"  // "bedroom" | "kitchen" | "study" | "music" | "aquarium" | "garden"
}
```

**Room Costs:**
- Bedroom: 0 (free, default)
- Kitchen: 500 coins
- Study: 800 coins
- Music: 1200 coins
- Aquarium: 1500 coins
- Garden: 2000 coins

**Response (200):**
```json
{
  "room": {
    "id": "room_1234567891",
    "type": "kitchen",
    "name": "Bếp",
    "unlocked": true,
    "unlockedAt": "2024-01-15T14:20:00Z",
    "theme": "modern",
    "bgColor": "#D1D5DB",
    "pointsCost": 500
  },
  "newBalance": 450
}
```

**Errors:**
```json
{
  "error": "Insufficient coins",
  "required": 800,
  "current": 450
}
```

---

### GET `/rooms/{roomId}/furniture`
Get all furniture items in a specific room.

**Response (200):**
```json
{
  "items": [
    {
      "id": "item_1234567890",
      "roomId": "room_1234567890",
      "catalogId": "sofa_01",
      "posX": 2,
      "posY": 3,
      "rotation": 0,
      "scale": 1.0,
      "colorTint": "#FF5733",
      "zIndex": 0
    },
    {
      "id": "item_1234567891",
      "roomId": "room_1234567890",
      "catalogId": "plant_01",
      "posX": 4,
      "posY": 2,
      "rotation": 90,
      "scale": 1.2,
      "zIndex": 1
    }
  ]
}
```

---

### POST `/rooms/furniture/place`
Place a new furniture item in a room (grid-based, 8×8).

**Request:**
```json
{
  "roomId": "room_1234567890",
  "catalogId": "sofa_01",
  "posX": 2,
  "posY": 3,
  "rotation": 0,
  "scale": 1.0
}
```

**Response (200):**
```json
{
  "item": {
    "id": "item_1234567890",
    "roomId": "room_1234567890",
    "catalogId": "sofa_01",
    "posX": 2,
    "posY": 3,
    "rotation": 0,
    "scale": 1.0,
    "zIndex": 0
  }
}
```

**Errors:**
```json
{
  "error": "Position already occupied"
}
```

---

### PATCH `/rooms/furniture/move`
Move or rotate an existing furniture item.

**Request:**
```json
{
  "itemId": "item_1234567890",
  "posX": 3,
  "posY": 4,
  "rotation": 90
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

### DELETE `/rooms/furniture/{itemId}`
Remove a furniture item from a room.

**Response (200):**
```json
{
  "success": true
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error description",
  "statusCode": 400,
  "details": { ... optional additional info ... }
}
```

### Common Error Codes

| Code | Scenario | Example |
|------|----------|---------|
| 400 | Bad request | Missing required fields |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not found | User/session/room not found |
| 409 | Conflict | Position already occupied |

---

## Rate Limiting

- **Auth endpoints**: 10 requests/minute per IP
- **Focus endpoints**: 5 completions/minute per user
- **Room endpoints**: 20 requests/minute per user

Headers returned:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1234567890
```

---

## Example Workflow: Complete a Focus Session

### 1. Start Session
```bash
curl -X POST http://localhost:3000/api/focus/start \
  -H "Authorization: Bearer token_user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "normal",
    "focusTime": 25
  }'
```

Response:
```json
{
  "sessionId": "session_abc123",
  "serverTick": 1234567890000,
  "clientHash": "hash_abc123"
}
```

### 2. Wait 25 minutes (or test with shorter duration)

### 3. End Session
```bash
curl -X POST http://localhost:3000/api/focus/end \
  -H "Authorization: Bearer token_user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_abc123",
    "clientEndTimestamp": 1234567890000,
    "claimedDuration": 1500000,
    "clientHash": "hash_abc123"
  }'
```

Response:
```json
{
  "sessionId": "session_abc123",
  "pointsEarned": 41,
  "actualMinutes": 25,
  "newBalance": 491
}
```

### 4. Get Updated Stats
```bash
curl -X GET http://localhost:3000/api/focus/stats \
  -H "Authorization: Bearer token_user_123"
```

Response:
```json
{
  "moonCoins": 491,
  "focusHours": 0.42,
  "sleepHours": 0,
  "screenTimeHours": 0.12,
  "level": 0,
  "streak": 1
}
```

---

## Implementation Notes

- All timestamps are ISO 8601 format (UTC)
- All monetary values (MoonCoins) are integers
- All durations in milliseconds (client-side) or minutes (requests)
- Pagination coming in Phase 2
- WebSocket support for real-time rooms coming in Phase 3

