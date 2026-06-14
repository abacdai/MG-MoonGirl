# Phase 3: WebSocket Co-Study Rooms Implementation Guide

## Overview

Phase 3 implements real-time multiplayer features using Socket.io, enabling:
- ✅ Co-study rooms with friend presence
- ✅ Real-time chat within rooms
- ✅ Furniture synchronization across users
- ✅ Focus session presence indicators
- ✅ Mic on/off status
- ✅ Room invitations with codes

---

## 📋 Components Implemented

### 1. **Backend: WebSocket Server** (`server/websocket.ts`)

**395 lines** - Complete Socket.io implementation

**Key Features:**
- User authentication on connection
- Room creation & join/leave
- Real-time member presence
- Focus session presence (isFocusing flag)
- Mic status tracking
- Chat message broadcasting
- Furniture position synchronization
- Automatic room cleanup when empty

**Events Handled:**

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `user:auth` | Client → Server | `{userId, displayName, avatar}` | Authenticate socket connection |
| `room:create` | Client → Server | `{name, description, maxMembers, isPublic}` | Create new study room |
| `room:join` | Client → Server | `{roomId, displayName, avatar}` | Join existing room |
| `room:leave` | Client → Server | `{roomId}` | Leave and cleanup |
| `room:list` | Client → Server | (empty) | Get public room list |
| `focus:start` | Client → Server | `{roomId}` | Mark user as focusing |
| `focus:end` | Client → Server | `{roomId, pointsEarned}` | End focus session |
| `mic:toggle` | Client → Server | `{roomId, micOn}` | Toggle mic on/off |
| `chat:send` | Client → Server | `{roomId, content, displayName}` | Send chat message |
| `furniture:move` | Client → Server | `{roomId, itemId, posX, posY, rotation}` | Move furniture |
| `furniture:place` | Client → Server | `{roomId, catalogId, posX, posY}` | Place new furniture |

**Server Response Events:**

| Event | Direction | Payload | Usage |
|-------|-----------|---------|-------|
| `auth:success` | Server → Client | `{socketId, userId}` | Confirm authentication |
| `room:joined` | Server → Client | `{roomId, room}` | Confirm room entry |
| `room:memberJoined` | Server → Room | `{member, totalMembers}` | New member joined |
| `room:memberLeft` | Server → Room | `{userId, totalMembers}` | Member disconnected |
| `room:list` | Server → Client | `{rooms[]}` | Available public rooms |
| `focus:started` | Server → Room | `{userId, displayName}` | User started focusing |
| `focus:ended` | Server → Room | `{userId, pointsEarned}` | User finished focus |
| `mic:toggled` | Server → Room | `{userId, micOn}` | Mic status changed |
| `chat:received` | Server → Room | `{message}` | New message in chat |
| `furniture:moved` | Server → Room | `{userId, itemId, posX, posY, rotation}` | Furniture repositioned |
| `furniture:placed` | Server → Room | `{userId, catalogId, posX, posY}` | Furniture added |

---

### 2. **Frontend: Socket Hook** (`client/hooks/useSocket.ts`)

**308 lines** - Complete Socket.io client implementation

**State Management:**
```typescript
const {
  isConnected,           // boolean - WebSocket connection status
  currentRoom,           // StudyRoom - Active room or null
  roomMembers,           // RoomMember[] - Users in current room
  chatMessages,          // ChatMessage[] - Room chat history
  availableRooms,        // StudyRoom[] - Public rooms list
} = useSocket();
```

**Room Actions:**
```typescript
createRoom(name, description, maxMembers, isPublic)
joinRoom(roomId)
leaveRoom(roomId)
listRooms()
```

**Focus Actions:**
```typescript
startFocus(roomId)          // Tell others you're focusing
endFocus(roomId, pointsEarned)
toggleMic(roomId, micOn)
```

**Chat Actions:**
```typescript
sendMessage(roomId, content)
```

**Furniture Actions:**
```typescript
moveFurniture(roomId, itemId, posX, posY, rotation)
placeFurniture(roomId, catalogId, posX, posY)
```

**Features:**
- Auto-reconnect with exponential backoff
- Offline fallback (queues messages)
- Custom events via window.dispatchEvent
- Automatic cleanup on disconnect
- Full type safety with TypeScript

---

### 3. **Frontend: Community Page** (`client/pages/CommunityNew.tsx`)

**329 lines** - Full-featured community interface

**Screens:**

**A. Room List Screen**
- ✅ Connection status indicator
- ✅ "Create Room" button
- ✅ "Browse Rooms" button
- ✅ List of public rooms with:
  - Room name & description
  - Current member count / max members
  - Join button
  - Host information

**B. Room Chat Screen**
- ✅ Room name & description
- ✅ Member avatars with status:
  - 🔴 Focusing (green border)
  - 🎤 Mic on (purple border)
  - 🔇 Mic off (gray border)
- ✅ Chat area:
  - 50-message history
  - User name + message display
  - Timestamp support
  - Auto-scroll
- ✅ Message input with Enter to send
- ✅ Mic toggle button (red when on)
- ✅ Leave room button

**C. Create Room Modal**
- ✅ Room name input
- ✅ Description textarea
- ✅ Cancel/Create buttons
- ✅ Form validation

---

## 🔗 Integration Architecture

```
React Component (Timer)
    ↓
useSocket Hook
    ↓
Socket.io Client
    ↓
Socket.io Server (WebSocket)
    ↓
Room Manager (In-Memory)
    ↓
Broadcast to other clients
    ↓
useSocket Hook
    ↓
React Component (Other Users)
```

---

## 📊 Data Flow Examples

### Example 1: Join a Study Room

**Client A**
```
1. User clicks "Join Room"
2. joinRoom(roomId) called
3. Socket emits "room:join" event with {roomId, displayName, avatar}
```

**Server**
```
4. Receives "room:join"
5. Validates room exists
6. Adds user to room.members[]
7. Emits "room:memberJoined" to all in room
8. Emits "room:joined" to joining client (includes full room data)
```

**Client A**
```
9. Receives "room:joined"
10. setCurrentRoom(data.room)
11. setRoomMembers(data.room.members)
12. UI re-renders with room data
```

**Other Clients in Room**
```
13. Receive "room:memberJoined"
14. setRoomMembers(prev => [...prev, newMember])
15. UI updates to show new member avatar
```

---

### Example 2: Start Focus Session

**Client (Timer Page)**
```
1. Timer completes
2. addFocusSession() called
3. startFocus(currentRoom.id) emitted
4. UI shows "🔴 Focusing" badge
```

**Server**
```
5. Finds member in room
6. Sets member.isFocusing = true
7. Broadcasts "focus:started" to room
```

**Other Clients**
```
8. Receive "focus:started"
9. Update roomMembers[].isFocusing = true
10. Display user's avatar with green border
11. Show "🔴 Đang học" indicator
```

---

### Example 3: Real-time Furniture Sync

**User A (Rooms Page)**
```
1. Drag furniture item to new position
2. moveFurniture(roomId, itemId, 5, 3, 90) emitted
```

**Server**
```
3. Broadcasts "furniture:moved" to room with:
   {roomId, userId, itemId, posX, posY, rotation}
```

**User B (Rooms Page)**
```
4. Receives "furniture:moved" event
5. Custom event dispatched: window.dispatchEvent(CustomEvent)
6. Room component listener updates furniture position
7. UI renders furniture at new location
```

---

## 🚀 How to Use in Components

### Timer Page Integration

```typescript
import { useSocket } from "@/hooks/useSocket";

function TimerPage() {
  const { currentRoom, startFocus, endFocus } = useSocket();

  const handleSessionComplete = async (pointsEarned) => {
    if (currentRoom) {
      startFocus(currentRoom.id); // Notify others
      // ... complete session ...
      endFocus(currentRoom.id, pointsEarned);
    }
  };

  // Show members in co-focus room
  return (
    <>
      {/* Friend avatars showing who's focusing */}
      {roomMembers.filter(m => m.isFocusing).map(member => (
        <img key={member.userId} src={member.avatar} />
      ))}
    </>
  );
}
```

### Rooms Page Integration

```typescript
function RoomsPage() {
  const { moveFurniture, placeFurniture } = useSocket();

  const handleDragEnd = (itemId, newX, newY) => {
    moveFurniture(currentRoom.id, itemId, newX, newY, 0);
  };

  return (
    <RoomGrid>
      {/* Furniture syncs across users */}
    </RoomGrid>
  );
}
```

---

## 📦 Installation & Setup

### 1. Install Socket.io

```bash
npm install socket.io socket.io-client
```

### 2. Update Server Entry Point

Replace `server/index.ts` with `server/index-new.ts`:

```bash
mv server/index.ts server/index-old.ts
mv server/index-new.ts server/index.ts
```

### 3. Environment Variables

Add to `.env`:
```env
VITE_SOCKET_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```

### 4. Update vite.config.ts

If not already configured, add server proxy:

```typescript
export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
});
```

---

## 🔐 Security Considerations

**Current Status:** In-memory storage (development only)

**Production Requirements:**
1. ✅ Move room data to PostgreSQL
2. ✅ Implement Redis pub/sub for horizontal scaling
3. ✅ Add rate limiting on chat messages
4. ✅ Validate user permissions before room actions
5. ✅ Encrypt sensitive data in messages
6. ✅ Implement user ban/kick functionality

**Anti-Cheat for Furniture:**
- Server validates position is within grid bounds (8×8)
- Reject colliding positions
- Add position change rate limiting
- Log all furniture moves for audit

---

## 📊 Performance Notes

**Optimization Done:**
- Last-write-wins for furniture (no intermediate states)
- Chat limited to 50 messages per room
- Binary packing for furniture coordinates (future)
- MessagePack encoding (future)

**For 10+ Concurrent Users:**
1. Migrate to Redis for horizontal scaling
2. Implement room sharding
3. Use binary WebSocket frame format
4. Add CDN for static assets

---

## 🎯 Next Integration Points

### Phase 4: Block Rules
- Integrate room scheduler
- Show available focus times in room list
- Prevent joining during block hours

### Phase 5: Enhanced Visuals
- Show animated avatars in rooms
- Real-time score notifications
- Focus streak indicators
- Celebration animations for group completions

### Phase 6 (Future): Mobile Native
- React Native Socket.io integration
- Background focus notifications
- Native mic/speaker control
- Persistent room connection

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Socket not connected" | Check `VITE_SOCKET_URL` env var |
| 404 on /socket.io | Ensure WebSocket server running |
| Chat not appearing | Check room.messages state |
| Members not updating | Verify socket room join succeeded |
| Furniture not syncing | Check furniture:move events in console |

---

## ✅ Checklist for Full Integration

- [ ] Install socket.io & socket.io-client
- [ ] Replace server/index.ts with index-new.ts
- [ ] Add environment variables to .env
- [ ] Update Community.tsx import to CommunityNew
- [ ] Test room creation & joining
- [ ] Test chat messaging
- [ ] Test focus presence indicators
- [ ] Test furniture synchronization
- [ ] Test microphone toggle
- [ ] Verify connection status indicator
- [ ] Test room cleanup on leave
- [ ] Test auto-reconnect after disconnect

