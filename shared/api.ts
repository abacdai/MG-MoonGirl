// ═══════════════════════════════════════
// AUTH API TYPES
// ═══════════════════════════════════════

export interface UserProfile {
  userId: string;
  displayName: string;
  userId_id: string;
  birthday: string;
  avatar_url: string;
  linkedAccounts: string[];
  moonCoins: number;
  focusHours: number;
  sleepHours: number;
  screenTimeHours: number;
  level: number;
  streak: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  birthday?: string;
  linkedAccounts?: string[];
}

// ═══════════════════════════════════════
// FOCUS SESSION API TYPES
// ═══════════════════════════════════════

export interface FocusSession {
  id: string;
  userId: string;
  mode: "infinite" | "normal" | "strict";
  duration: number;
  startedAt: Date;
  endedAt?: Date;
  completed: boolean;
  pointsEarned: number;
  serverTick: number;
  clientHash: string;
}

export interface StartSessionRequest {
  mode: "infinite" | "normal" | "strict";
  focusTime: number;
}

export interface StartSessionResponse {
  sessionId: string;
  serverTick: number;
  clientHash: string;
}

export interface EndSessionRequest {
  sessionId: string;
  clientEndTimestamp: number;
  claimedDuration: number;
  clientHash: string;
}

export interface EndSessionResponse {
  sessionId: string;
  pointsEarned: number;
  actualMinutes: number;
  newBalance: number;
}

export interface SessionsResponse {
  sessions: FocusSession[];
  totalSessions: number;
  totalMinutes: number;
}

export interface StatsResponse {
  moonCoins: number;
  focusHours: number;
  sleepHours: number;
  screenTimeHours: number;
  level: number;
  streak: number;
}

// ═══════════════════════════════════════
// ROOM & FURNITURE API TYPES
// ═══════════════════════════════════════

export type RoomType = "bedroom" | "kitchen" | "study" | "music" | "aquarium" | "garden";

export interface Room {
  id: string;
  userId: string;
  type: RoomType;
  name: string;
  unlocked: boolean;
  unlockedAt?: Date;
  theme: string;
  bgColor: string;
  pointsCost: number;
}

export interface FurnitureItem {
  id: string;
  roomId: string;
  catalogId: string;
  posX: number;
  posY: number;
  rotation: number;
  scale: number;
  colorTint?: string;
  zIndex: number;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface UnlockRoomRequest {
  roomType: RoomType;
}

export interface UnlockRoomResponse {
  room: Room;
  newBalance: number;
}

export interface PlaceFurnitureRequest {
  roomId: string;
  catalogId: string;
  posX: number;
  posY: number;
  rotation?: number;
  scale?: number;
}

export interface PlaceFurnitureResponse {
  item: FurnitureItem;
}

export interface MoveFurnitureRequest {
  itemId: string;
  posX: number;
  posY: number;
  rotation?: number;
}

export interface FurnitureResponse {
  items: FurnitureItem[];
}

// ═══════════════════════════════════════
// ERROR RESPONSE
// ═══════════════════════════════════════

export interface ApiError {
  error: string;
  [key: string]: any;
}
