import { RequestHandler } from "express";

interface Room {
  id: string;
  userId: string;
  type: "bedroom" | "kitchen" | "study" | "music" | "aquarium" | "garden";
  name: string;
  unlocked: boolean;
  unlockedAt?: Date;
  theme: string;
  bgColor: string;
  pointsCost: number;
}

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  createdAt: Date;
}

interface FurnitureItem {
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

const userRooms = new Map<string, Room[]>();
const furniture = new Map<string, FurnitureItem[]>();
const users = new Map<string, any>();
const studyRooms = new Map<string, StudyRoom>();
const roomMembers = new Map<string, Set<string>>();

const ROOM_CONFIG: Record<string, any> = {
  bedroom: {
    pointsCost: 0,
    theme: "default",
    bgColor: "#FBBF24",
  },
  kitchen: {
    pointsCost: 500,
    theme: "modern",
    bgColor: "#D1D5DB",
  },
  study: {
    pointsCost: 800,
    theme: "classic",
    bgColor: "#FBBF24",
  },
  music: {
    pointsCost: 1200,
    theme: "vibrant",
    bgColor: "#E9D5FF",
  },
  aquarium: {
    pointsCost: 1500,
    theme: "aquatic",
    bgColor: "#CFFAFE",
  },
  garden: {
    pointsCost: 2000,
    theme: "natural",
    bgColor: "#DCFCE7",
  },
};

export const getRooms: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rooms = userRooms.get(token) || [];

  res.json({ rooms });
};

export const createStudyRoom: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "") || `user_${Date.now()}`;
  const { name, description, maxMembers, isPublic } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Room name is required" });
  }

  const roomId = `study_room_${Date.now()}`;
  const room: StudyRoom = {
    id: roomId,
    name: name.trim(),
    description: description?.trim() || "",
    hostId: token,
    memberCount: 1,
    maxMembers: maxMembers || 10,
    isPublic: isPublic !== false,
    createdAt: new Date(),
  };

  studyRooms.set(roomId, room);
  roomMembers.set(roomId, new Set([token]));

  res.json({ room });
};

export const listStudyRooms: RequestHandler = (req, res) => {
  const rooms = Array.from(studyRooms.values()).filter((r) => r.isPublic);

  res.json({
    rooms: rooms.map((room) => ({
      ...room,
      memberCount: roomMembers.get(room.id)?.size || 1,
    })),
  });
};

export const unlockRoom: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { roomType } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = users.get(token);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const config = ROOM_CONFIG[roomType];
  if (!config) {
    return res.status(400).json({ error: "Invalid room type" });
  }

  if (user.moonCoins < config.pointsCost) {
    return res.status(400).json({
      error: "Insufficient coins",
      required: config.pointsCost,
      current: user.moonCoins,
    });
  }

  const roomId = `room_${Date.now()}`;
  const room: Room = {
    id: roomId,
    userId: token,
    type: roomType,
    name: getRoomName(roomType),
    unlocked: true,
    unlockedAt: new Date(),
    theme: config.theme,
    bgColor: config.bgColor,
    pointsCost: config.pointsCost,
  };

  if (!userRooms.has(token)) {
    userRooms.set(token, []);
  }
  userRooms.get(token)!.push(room);

  // Deduct coins
  user.moonCoins -= config.pointsCost;
  users.set(token, user);

  res.json({ room, newBalance: user.moonCoins });
};

export const placeFurniture: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { roomId, catalogId, posX, posY, rotation, scale } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate position not already occupied
  const roomFurniture = furniture.get(roomId) || [];
  const occupied = roomFurniture.some(
    (item) => item.posX === posX && item.posY === posY
  );

  if (occupied) {
    return res.status(400).json({ error: "Position already occupied" });
  }

  const itemId = `item_${Date.now()}`;
  const item: FurnitureItem = {
    id: itemId,
    roomId,
    catalogId,
    posX,
    posY,
    rotation: rotation || 0,
    scale: scale || 1,
    zIndex: 0,
  };

  if (!furniture.has(roomId)) {
    furniture.set(roomId, []);
  }
  furniture.get(roomId)!.push(item);

  res.json({ item });
};

export const moveFurniture: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { itemId, posX, posY, rotation } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Find and update item across all rooms
  let updated = false;

  furniture.forEach((items, roomId) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      // Check new position not occupied by other items
      const occupied = items.some(
        (other) =>
          other.id !== itemId && other.posX === posX && other.posY === posY
      );

      if (occupied) {
        return res.status(400).json({ error: "Position already occupied" });
      }

      item.posX = posX;
      item.posY = posY;
      if (rotation !== undefined) item.rotation = rotation;
      updated = true;
    }
  });

  if (!updated) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ success: true });
};

export const deleteFurniture: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { itemId } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let deleted = false;

  furniture.forEach((items, roomId) => {
    const index = items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      items.splice(index, 1);
      deleted = true;
    }
  });

  if (!deleted) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ success: true });
};

export const getRoomFurniture: RequestHandler = (req, res) => {
  const roomId = String(req.params.roomId);

  const items = furniture.get(roomId) || [];

  res.json({ items });
};

const getRoomName = (type: string): string => {
  const names: Record<string, string> = {
    bedroom: "Phòng ngủ",
    kitchen: "Bếp",
    study: "Phòng học",
    music: "Phòng nhạc",
    aquarium: "Bể cá",
    garden: "Vườn",
  };
  return names[type] || "Phòng";
};
