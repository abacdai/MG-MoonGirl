# MG-Moon Girl: UX Pattern Integration Guide

## Overview
Integration of design patterns from **StayFree**, **Forest**, **Opal**, and **NoxOcean** apps into the Moon Girl application.

---

## ✅ Completed Features

### 1. **Multi-Language Support (i18n)**
- ✅ Vietnamese (VI) & English (EN) support
- ✅ Real-time language switching in Settings
- ✅ Persistent language preference (localStorage)
- **Hook**: `useLanguage()` in `client/hooks/useLanguage.ts`
- **Usage**: `const { t, language, changeLanguage } = useLanguage();`

### 2. **Profile System**
- ✅ User profile modal with avatar, stats, and achievements
- ✅ Edit profile with display name, user ID, birthday validation
- ✅ Account linking (Gmail, Facebook, Apple)
- ✅ Settings modal with language, sync, privacy, and version info

### 3. **Focus Session Tracking**
- ✅ Real-time timer with strict/normal/infinite modes
- ✅ Automatic coin earning (100 coins/hour)
- ✅ Session completion modal with rewards
- ✅ Stats persistence with localStorage

### 4. **Stats & Analytics Page** ⭐ (NEW)
**Route**: `/stats`

**Features**:
- Day/Week/Month/Year tabs for filtering
- **Opal-style composite scoring**:
  - Sleep Score (0-100): `(sleepHours / 8) * 100`
  - Focus Score (0-100): `(focusHours / 5) * 100`
  - Rest Score (0-100): `100 - (screenTimeHours * 5)`
  - Overall Score: Average of the three
  
- **Visualizations**:
  - Circular progress indicators for each score
  - Line chart: Focus time trend by day of week
  - Donut chart: Activity distribution (Focus/Sleep/Screen Time)
  - Stat cards: Session count, streak days

- **Design**: Glassmorphism with transparent cards, gradient backgrounds

### 5. **Room Customization & House Building** ⭐ (NEW)
**Route**: `/rooms`

**Features**:
- **6 Unlockable Rooms**:
  - 🛏️ Bedroom (unlocked, free)
  - 🍳 Kitchen (500 coins)
  - 📚 Study (800 coins)
  - 🎹 Music (1200 coins)
  - 🐠 Aquarium (1500 coins)
  - 🌿 Garden (2000 coins)

- **Customization System**:
  - Drag-and-drop furniture placement (9 grid cells per room)
  - 9 Furniture types: Sofa, Chair, Plant, Light, Painting, Photo, Mirror, Stuffed Animal, Guitar
  - Theme colors per room (bedroom=amber, kitchen=gray, etc.)
  - Collectibles gallery (15+ items, 8 earned/7 locked)

- **Design**: Isometric-inspired room previews with gradient backgrounds

---

## 🛠️ Architecture & Database

### Frontend Stack
```
React 18 + React Router 6
├── TypeScript
├── Tailwind CSS 3
├── Lucide React (icons)
├── Zustand (state - future)
├── React Query (API - future)
└── Sonner (toast notifications)
```

### Backend Architecture (Planned)
```
┌─────────────────┬───────────────┬───────────────────┐
│   CLIENT LAYER  │  API GATEWAY  │  BACKEND SERVICES │
│                 │               │                   │
│  React Native   │  Kong Gateway │  Auth Service     │
│  + Expo SDK 51  │  + Rate Limit │  Focus Service    │
│  + Reanimated 3 │  + JWT Verify │  Room Service     │
│  + MMKV         │  + WAF Rules  │  Social Service   │
│                 │               │  Analytics Service│
│  iOS Extension  │  WebSocket    │  Store Service    │
│  (ScreenTime)   │  Hub (Socket) │  Notification Svc │
│                 │               │  AI Service       │
│  Android VPN    │  CDN          │                   │
│  Service        │  (CloudFront) │  PostgreSQL 16    │
│                 │               │  Redis Cluster    │
└─────────────────┴───────────────┴───────────────────┘
```

### Database Schema (PostgreSQL 16 + TimescaleDB)
Key tables to implement:
```sql
-- Users & Auth
users (id, email, username, password_hash, locale)
user_profiles (user_id, display_name, avatar_url, streak_count, total_points, level)

-- Focus Sessions
focus_sessions (id, user_id, mode, started_at, ended_at, planned_mins, actual_mins, completed, points_earned)
  └─ TimescaleDB hypertable on started_at

-- House & Rooms
houses (id, user_id, name, total_tiles)
rooms (id, house_id, room_type, unlocked_at, points_cost, theme, bg_color)
furniture_items (id, catalog_id, room_id, pos_x, pos_y, rotation, scale, color_tint, z_index)
item_catalog (id, category, name_vi, name_en, asset_key, points_cost, rarity, unlock_level)

-- Gamification
daily_checkins (user_id, checkin_date, points_earned)
streak_snapshots (user_id, snapshot_date, streak_count)

-- Social
study_rooms (id, host_id, name, is_public, max_members)
study_room_members (room_id, user_id, mic_on, is_focusing)
friendships (user_id_a, user_id_b, status)

-- Analytics
screen_time_reports (id, user_id, report_date, total_mins, apps_data, encrypted_raw)
  └─ TimescaleDB hypertable on report_date

-- Store
store_listings (id, title_vi, title_en, type, points_price, stock)
store_transactions (id, user_id, listing_id, points_spent, idempotency_key, status)

-- Anti-Cheat
anticheat_events (id, user_id, event_type, client_ts, server_ts, delta_ms, severity)
  └─ TimescaleDB hypertable on server_ts
```

---

## 🎮 UX Patterns Integrated

### From **Opal**:
- ✅ Composite scoring system (Sleep/Focus/Rest)
- ✅ Circular progress indicators
- ⏳ Daily check-in rewards system
- ⏳ Focus streak tracking
- ⏳ Quick stats dashboard

### From **Forest**:
- ✅ Time-based progression (coins → unlocks)
- ✅ Room/space customization
- ✅ Collectible plant/item gallery
- ⏳ Idle visual feedback (growing tree)
- ⏳ Social co-study rooms

### From **StayFree**:
- ✅ App blocking rules interface
- ✅ Screen time analytics
- ⏳ Timeline view of app usage
- ⏳ App category breakdown

### From **NoxOcean**:
- ✅ Isometric room visualization
- ✅ Unlock progression system
- ⏳ 3D isometric asset rendering
- ⏳ Room visiting/exploration mechanic

---

## 🚀 Next Steps & Roadmap

### Phase 1: Core Backend (Weeks 1-2)
- [ ] PostgreSQL + TimescaleDB setup
- [ ] User auth service (Go/Rust)
- [ ] Focus session API endpoints
- [ ] Room unlock system

### Phase 2: Social & Real-time (Weeks 3-4)
- [ ] WebSocket server for co-study rooms
- [ ] Friend request/acceptance flow
- [ ] Real-time room sync (furniture positions)
- [ ] Notification service

### Phase 3: Analytics & AI (Week 5)
- [ ] Screen time API integration (iOS/Android)
- [ ] AI inference for app categorization
- [ ] Analytics dashboard queries
- [ ] Prediction models (sleep/focus recommendations)

### Phase 4: Mobile Native (Weeks 6-8)
- [ ] React Native + Expo setup
- [ ] iOS Screen Time extension
- [ ] Android AccessibilityService + VPN
- [ ] Offline-first sync with MMKV

### Phase 5: Polish & Launch (Weeks 9-10)
- [ ] 3D room rendering (Three.js/Skia)
- [ ] Animation polish (Reanimated 3)
- [ ] App Store submission
- [ ] Beta store integration

---

## 🔐 Security Considerations

### Anti-Cheat Mechanisms
1. **Clock Skew Validation**: ±30 second tolerance
2. **Server-Authoritative Timer**: Backend tracks start_at, validates duration
3. **HMAC Session Signing**: Verify payload integrity
4. **Rate Limiting**: Max 5 transactions/minute per user
5. **Idempotency Keys**: Prevent double-spend in store

### Data Protection
- AES-256-GCM encryption for screen time data
- Argon2id password hashing (NOT bcrypt)
- TLS 1.3 for all transit
- HashiCorp Vault for secrets management

### Android/iOS Specific
- **iOS**: Family Controls API for Strict Mode (system-level, can't bypass)
- **Android**: DevicePolicyManager + AccessibilityService (requires admin approval)

---

## 📊 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| API Latency | <100ms | Go backend + Redis cache |
| Room Sync | <50ms | Delta compression + binary packing |
| Screen Time Process | <200ms (client) | Async queue + background worker |
| Battery (Background Timer) | <0.1% CPU | Server time + local interpolation |
| Network Payload | <25 bytes/message | MessagePack + bit-packing |

---

## 🎯 Key Differentiators

1. **Isometric Room Building**: Unlike Forest (just planting), rooms.xyz-like house customization
2. **Server-Authoritative Anti-Cheat**: Unlike StayFree (client-side rules), server validates all points
3. **Dual-Time Analytics**: Sleep + Focus + Rest composite score (Opal pattern but tied to focus app)
4. **Native Screen Time Integration**: Reads real OS APIs, not just app focus events
5. **Co-Study Rooms**: Real-time synchronization for group focus sessions

---

## 🛣️ File Structure
```
client/
├── pages/
│   ├── Index.tsx          (Home dashboard)
│   ├── Timer.tsx          (Focus timer + visual feedback)
│   ├── Stats.tsx          (Analytics with Day/Week/Month tabs)
│   ├── Rooms.tsx          (House customization + collectibles)
│   ├── MyApps.tsx         (App management)
│   ├── Community.tsx      (Social + co-study)
│   └── NotFound.tsx
├── components/
│   └── ui/                (Radix UI + TailwindCSS)
├── hooks/
│   ├── useStats.ts        (Session tracking + persistence)
│   ├── useLanguage.ts     (i18n with localStorage)
│   └── use-toast.ts       (Sonner integration)
└── App.tsx                (Router + security setup)

shared/
└── api.ts                 (Shared types - future)
```

---

## 🤝 Contributing

When adding new features:
1. Add translations to `useLanguage()` hook
2. Use transparent glassmorphism design (bg-opacity-50 + backdrop-blur-md)
3. Follow the gradient pattern from existing pages
4. Test on mobile viewport (375px width)
5. All modals should have z-40 (backdrop) and z-50 (modal)

---

## 📝 Notes

- Current app uses localStorage for all data (temp solution)
- No backend API yet - all state is client-side
- Security measures will be fully implemented when backend is live
- Room customization is placeholder UI - 3D rendering comes in Phase 4
- Screen time data collection requires native code (iOS/Android)

