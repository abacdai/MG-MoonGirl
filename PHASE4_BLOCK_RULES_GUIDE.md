# Phase 4: Block Rules Management Implementation Guide

## Overview

Phase 4 implements app blocking and scheduling system, enabling:
- ✅ Create blocking rules with custom names
- ✅ Select multiple apps to block
- ✅ Set time ranges (start/end hours)
- ✅ Choose which days rules apply
- ✅ Enable/disable rules on the fly
- ✅ Real-time active rules display
- ✅ Visual app selection with 12+ popular apps

---

## 📋 Components Implemented

### 1. **Backend: Block Rules API** (`server/routes/blockRules.ts`)

**200 lines** - Complete block rule management

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/block-rules/apps` | Get available app catalog |
| POST | `/api/block-rules` | Create new block rule |
| GET | `/api/block-rules` | List all user rules |
| PATCH | `/api/block-rules/:ruleId` | Update rule settings |
| DELETE | `/api/block-rules/:ruleId` | Delete a rule |
| PATCH | `/api/block-rules/:ruleId/toggle` | Enable/disable rule |
| GET | `/api/block-rules/active` | Get currently active rules |

**App Catalog (12 apps):**

| Category | Apps |
|----------|------|
| Social | Instagram, Facebook, Twitter, TikTok, Snapchat, Reddit |
| Video | YouTube, Netflix |
| Music | Spotify |
| Messaging | Discord, WhatsApp, Telegram |
| Games | Candy Crush, Clash of Clans, PUBG Mobile |

**Data Structure:**

```typescript
interface BlockRule {
  id: string;                    // Unique identifier
  userId: string;                // Owner
  name: string;                  // "Morning Focus", "Study Time"
  description?: string;          // Optional note
  appBundles: string[];          // ["com.instagram.android", ...]
  startTime: string;             // "09:00" format
  endTime: string;               // "17:00" format
  weekdays: number[];            // [0-6] Sun=0, Mon=1, ..., Sat=6
  enabled: boolean;              // Active/Paused toggle
  createdAt: Date;               // Creation timestamp
}
```

**Active Rules Logic:**

Rules are considered "active" when:
1. `enabled: true`
2. Current day is in `weekdays[]`
3. Current time is between `startTime` and `endTime`

Example:
```
Rule: "Morning Focus"
- startTime: "09:00"
- endTime: "12:00"
- weekdays: [1, 2, 3, 4, 5]  (Mon-Fri)
- enabled: true

Current time: 10:30 AM on Tuesday
→ ACTIVE ✓
```

---

### 2. **Frontend: Block Rules Page** (`client/pages/BlockRules.tsx`)

**445 lines** - Complete block rules interface

**Screens:**

**A. Main Rules View**
- ✅ Header showing:
  - Total blocked apps count
  - Number of active rules
- ✅ "Create Rule" button
- ✅ List of all rules with:
  - Rule name & description
  - Enable/disable toggle (red when on)
  - Time range (HH:MM - HH:MM)
  - Days applied (e.g., "5 days")
  - App count
  - Blocked apps badges
  - Delete button

**B. Create Rule Modal**
- ✅ Rule name input
- ✅ Description textarea (optional)
- ✅ Time range picker:
  - "From" time input (HH:MM)
  - "To" time input (HH:MM)
  - Dual inputs for start/end
- ✅ Weekday selector:
  - 7 buttons (CN, T2, T3, T4, T5, T6, T7)
  - Toggle selection on click
  - Multi-select support
  - Default: Mon-Fri [1,2,3,4,5]
- ✅ App grid selector:
  - 12 popular apps displayed
  - 4 columns grid layout
  - Visual app icons (emojis)
  - Selection indicators (border + background)
  - Counter showing selected count
- ✅ Form actions:
  - Cancel button
  - Create button (enabled only with name + app)

**C. Active Rules Alert**
- ✅ Red warning box at bottom
- ✅ Shows active rules list
- ✅ Updates in real-time

**Features:**
- ✅ Form validation (name required, ≥1 app selected)
- ✅ Visual feedback for selections
- ✅ Easy on/off toggle
- ✅ Destructive delete with confirmation
- ✅ Time format validation (HH:MM)
- ✅ Weekday multi-select
- ✅ App grid with visual selection

---

## 🎯 User Flow

### Creating a Block Rule

```
1. User clicks "Tạo quy tắc mới"
   ↓
2. Modal opens with:
   - Empty form
   - Time: 09:00 - 17:00 (defaults)
   - Weekdays: Mon-Fri selected
   ↓
3. User enters rule name (e.g., "Tập trung sáng")
   ↓
4. User selects apps:
   - Click Instagram (selected, green border)
   - Click TikTok (selected, green border)
   - Click YouTube (selected, green border)
   ↓
5. User adjusts time range:
   - From: 09:00
   - To: 12:00
   ↓
6. User selects weekdays:
   - Only Mon-Fri (1,2,3,4,5)
   ↓
7. User clicks "Tạo quy tắc"
   ↓
8. Rule created & displayed in list
   ↓
9. Rule is now active during:
   - Mon-Fri
   - 09:00 AM - 12:00 PM
   - Blocks Instagram, TikTok, YouTube
```

---

### Managing an Existing Rule

```
User sees rule in list:
┌─────────────────────────────────┐
│ Tập trung sáng                  │[Bật]
│ Tập trung buổi sáng             │
│ Giờ: 09:00 - 12:00              │
│ Ngày: 5 ngày                    │
│ Ứng dụng: 3 ứng dụng             │
│ [📷 Instagram] [🎵 TikTok]      │
│ [📺 YouTube]                     │
│ [Xóa quy tắc]                   │
└─────────────────────────────────┘

Actions:
1. Click [Bật] to toggle enable/disable
   - Enabled: Red "Bật" button
   - Disabled: Gray "Tắt" button
   
2. Click [Xóa quy tắc] to remove rule
   - Shows confirmation
   - Permanently deletes rule

3. Rule updates active list in real-time
```

---

## 📊 App Catalog

**12 Popular Apps Pre-loaded:**

```javascript
const APPS = [
  // Social Media (6)
  { icon: "📷", name: "Instagram" },
  { icon: "👥", name: "Facebook" },
  { icon: "🐦", name: "Twitter" },
  { icon: "🎵", name: "TikTok" },
  { icon: "👻", name: "Snapchat" },
  { icon: "🔴", name: "Reddit" },
  
  // Video (2)
  { icon: "📺", name: "YouTube" },
  { icon: "🎬", name: "Netflix" },
  
  // Music (1)
  { icon: "🎧", name: "Spotify" },
  
  // Messaging (3)
  { icon: "💜", name: "Discord" },
  { icon: "💬", name: "WhatsApp" },
  { icon: "✈️", name: "Telegram" },
];
```

**Adding Custom Apps:**

```typescript
// In backend (blockRules.ts):
const APP_CATALOG = [
  // ... existing apps
  { id: "com.my.app", name: "My App", icon: "🎮", category: "custom" }
];

// Then available in frontend via GET /api/block-rules/apps
```

---

## 🔗 Integration Points

### With Timer Page

```typescript
import { useEffect } from "react";

function TimerPage() {
  const [canStartSession, setCanStartSession] = useState(true);
  
  useEffect(() => {
    // Check if any block rules are active
    fetch('/api/block-rules/active')
      .then(r => r.json())
      .then(data => {
        if (data.activeRules.length > 0) {
          // Show warning: "Apps are blocked, focus mode active"
          setCanStartSession(false);
        }
      });
  }, []);

  return (
    <>
      {!canStartSession && (
        <div className="bg-red-100 p-4 rounded">
          ⚠️ Chặn ứng dụng đang hoạt động
        </div>
      )}
      {/* Timer UI */}
    </>
  );
}
```

### With Rooms Page

```typescript
// Show which rules prevent co-study room access
if (activeRules.length > 0) {
  return (
    <p>Bạn không thể tham gia phòng vì có quy tắc chặn đang hoạt động</p>
  );
}
```

### With Native Platforms (Future)

```swift
// iOS: Use FamilyControls API to enforce blocking
// Integrate with DeviceActivitySchedule

// Android: Use AppBlockingService + DevicePolicyManager
// Enforce rules even if app is force-closed
```

---

## 💾 Data Storage

**Currently:** localStorage (development)

```javascript
// Save rules
localStorage.setItem('blockRules', JSON.stringify(rules));

// Load rules
const saved = localStorage.getItem('blockRules');
const rules = saved ? JSON.parse(saved) : [];
```

**Production:** PostgreSQL table `block_rules`

```sql
CREATE TABLE block_rules (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  app_bundles JSONB NOT NULL,
  start_time TEXT,
  end_time TEXT,
  weekdays JSONB DEFAULT [0,1,2,3,4,5,6],
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_block_rules_user_active 
ON block_rules(user_id, enabled);
```

---

## 🔐 Security Considerations

**Current:** Client-side only (dev mode)

**Production Requirements:**

1. **Server-side Enforcement**
   - Validate rules on server before allowing actions
   - Can't bypass by disconnecting app
   - Database source of truth

2. **Native Integration**
   - iOS: Family Controls (can't disable from user space)
   - Android: Device Admin + AccessibilityService (requires approval)
   - Prevent uninstall or bypass

3. **Clock Manipulation Prevention**
   - Server validates time against NTP
   - Can't change device time to bypass rules
   - Log bypass attempts for audit

4. **Rate Limiting**
   - Can't spam enable/disable toggles
   - Rate limit: 10 changes/minute per user
   - Cooldown: 30 seconds between rule changes

---

## 📊 Performance

**Optimization:**
- Rules cached in memory (recheckevery 60 seconds)
- Active rules computed locally
- No API call needed to check if blocked

**Scaling for 1M+ users:**
1. Cache rules in Redis (grouped by user)
2. Periodic sync (every 5 minutes)
3. Real-time updates via WebSocket
4. Time-based indexing for fast lookup

---

## 🎯 Next Phase: Enhanced Timer Visuals

Phase 5 will integrate with block rules:
- Show active rules in timer header
- Visual progress for time-limited sessions
- Motivation messages based on rules
- Celebration when completing session during active rule
- Co-study bonus during locked-down focus time

---

## ✅ Checklist

- [x] Create block rules API endpoints
- [x] Create frontend Block Rules page
- [x] App catalog with 12 apps
- [x] Time range picker (HH:MM)
- [x] Weekday selector (7 days)
- [x] App grid selector (4 cols)
- [x] Rule enable/disable toggle
- [x] Rule deletion
- [x] Active rules display
- [x] Real-time active rules calculation
- [x] Form validation
- [x] localStorage persistence
- [ ] API integration (when backend ready)
- [ ] Android native enforcement
- [ ] iOS native enforcement

---

## 🚀 Testing Scenarios

### Test 1: Create Rule for Morning Focus
1. Click "Tạo quy tắc mới"
2. Name: "Morning Focus"
3. Apps: Instagram, YouTube, TikTok
4. Time: 08:00 - 12:00
5. Days: Mon-Fri
6. Create → Should appear in list

### Test 2: Toggle Rule On/Off
1. Click [Bật] on rule
2. Button should change to [Tắt] (gray)
3. Rule should disappear from "active rules"
4. Click [Tắt] again
5. Button should change to [Bật] (red)

### Test 3: Active Rules
1. Create rule with current time in range
2. Current day in weekdays
3. Rule should show in "Quy tắc đang hoạt động"
4. Blocked apps count should update
5. Change time outside range
6. Rule should disappear from active list

### Test 4: Multiple Rules
1. Create 3 rules
2. Overlap time ranges
3. Multiple active rules showing
4. Total blocked apps = union of all

