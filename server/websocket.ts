import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

interface User {
  id: string;
  displayName: string;
  avatar: string;
}

interface RoomMember {
  userId: string;
  displayName: string;
  avatar: string;
  isFocusing: boolean;
  micOn: boolean;
  socketId: string;
  joinedAt: Date;
}

interface StudyRoom {
  id: string;
  hostId: string;
  name: string;
  description: string;
  isPublic: boolean;
  maxMembers: number;
  members: RoomMember[];
  messages: ChatMessage[];
  createdAt: Date;
  inviteCode?: string;
}

interface ChatMessage {
  userId: string;
  displayName: string;
  content: string;
  timestamp: Date;
}

interface FurnitureSync {
  itemId: string;
  userId: string;
  posX: number;
  posY: number;
  rotation: number;
}

// In-memory store (will be replaced with database)
const studyRooms = new Map<string, StudyRoom>();
const userSockets = new Map<string, string>(); // userId -> socketId
const socketUsers = new Map<string, string>(); // socketId -> userId

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // ═══════════════════════════════════════
  // CONNECTION & AUTHENTICATION
  // ═══════════════════════════════════════

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("user:auth", (data: { userId: string; displayName: string; avatar: string }) => {
      const { userId, displayName, avatar } = data;

      userSockets.set(userId, socket.id);
      socketUsers.set(socket.id, userId);

      socket.emit("auth:success", {
        socketId: socket.id,
        userId,
      });

      console.log(`User authenticated: ${userId}`);
    });

    // ═══════════════════════════════════════
    // STUDY ROOM MANAGEMENT
    // ═══════════════════════════════════════

    socket.on("room:create", (data: { name: string; description: string; maxMembers: number; isPublic: boolean }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) {
        socket.emit("error", "Not authenticated");
        return;
      }

      const roomId = `room_${Date.now()}`;
      const inviteCode = generateInviteCode();

      const newRoom: StudyRoom = {
        id: roomId,
        hostId: userId,
        name: data.name,
        description: data.description,
        isPublic: data.isPublic ?? true,
        maxMembers: data.maxMembers ?? 10,
        members: [
          {
            userId,
            displayName: "Host",
            avatar: "👤",
            isFocusing: false,
            micOn: true,
            socketId: socket.id,
            joinedAt: new Date(),
          },
        ],
        messages: [],
        createdAt: new Date(),
        inviteCode,
      };

      studyRooms.set(roomId, newRoom);
      socket.join(roomId);

      io.emit("room:created", {
        roomId,
        room: newRoom,
      });

      socket.emit("room:joined", {
        roomId,
        room: newRoom,
      });
    });

    socket.on("room:join", (data: { roomId: string; displayName: string; avatar: string }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) {
        socket.emit("error", "Not authenticated");
        return;
      }

      const room = studyRooms.get(data.roomId);
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }

      if (room.members.length >= room.maxMembers) {
        socket.emit("error", "Room is full");
        return;
      }

      // Add member to room
      const member: RoomMember = {
        userId,
        displayName: data.displayName,
        avatar: data.avatar || "👤",
        isFocusing: false,
        micOn: false,
        socketId: socket.id,
        joinedAt: new Date(),
      };

      room.members.push(member);
      socket.join(data.roomId);

      // Notify room members
      io.to(data.roomId).emit("room:memberJoined", {
        roomId: data.roomId,
        member,
        totalMembers: room.members.length,
      });

      socket.emit("room:joined", {
        roomId: data.roomId,
        room,
      });
    });

    socket.on("room:leave", (data: { roomId: string }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      const room = studyRooms.get(data.roomId);
      if (!room) return;

      // Remove member from room
      room.members = room.members.filter((m) => m.userId !== userId);

      socket.leave(data.roomId);

      if (room.members.length === 0) {
        // Delete empty room
        studyRooms.delete(data.roomId);
        io.emit("room:deleted", { roomId: data.roomId });
      } else {
        // Notify remaining members
        io.to(data.roomId).emit("room:memberLeft", {
          roomId: data.roomId,
          userId,
          totalMembers: room.members.length,
        });
      }
    });

    socket.on("room:list", () => {
      const publicRooms = Array.from(studyRooms.values()).filter((r) => r.isPublic);

      socket.emit("room:list", {
        rooms: publicRooms.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          hostId: r.hostId,
          memberCount: r.members.length,
          maxMembers: r.maxMembers,
          createdAt: r.createdAt,
        })),
      });
    });

    // ═══════════════════════════════════════
    // FOCUS PRESENCE
    // ═══════════════════════════════════════

    socket.on("focus:start", (data: { roomId: string }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      const room = studyRooms.get(data.roomId);
      if (!room) return;

      const member = room.members.find((m) => m.userId === userId);
      if (member) {
        member.isFocusing = true;

        io.to(data.roomId).emit("focus:started", {
          roomId: data.roomId,
          userId,
          displayName: member.displayName,
        });
      }
    });

    socket.on("focus:end", (data: { roomId: string; pointsEarned: number }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      const room = studyRooms.get(data.roomId);
      if (!room) return;

      const member = room.members.find((m) => m.userId === userId);
      if (member) {
        member.isFocusing = false;

        io.to(data.roomId).emit("focus:ended", {
          roomId: data.roomId,
          userId,
          displayName: member.displayName,
          pointsEarned: data.pointsEarned,
        });
      }
    });

    socket.on("mic:toggle", (data: { roomId: string; micOn: boolean }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      const room = studyRooms.get(data.roomId);
      if (!room) return;

      const member = room.members.find((m) => m.userId === userId);
      if (member) {
        member.micOn = data.micOn;

        io.to(data.roomId).emit("mic:toggled", {
          roomId: data.roomId,
          userId,
          micOn: data.micOn,
        });
      }
    });

    // ═══════════════════════════════════════
    // CHAT
    // ═══════════════════════════════════════

    socket.on("chat:send", (data: { roomId: string; content: string; displayName: string }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      const room = studyRooms.get(data.roomId);
      if (!room) return;

      const message: ChatMessage = {
        userId,
        displayName: data.displayName,
        content: data.content,
        timestamp: new Date(),
      };

      room.messages.push(message);

      // Keep only last 50 messages
      if (room.messages.length > 50) {
        room.messages = room.messages.slice(-50);
      }

      io.to(data.roomId).emit("chat:received", {
        roomId: data.roomId,
        message,
      });
    });

    // ═══════════════════════════════════════
    // FURNITURE SYNC (Real-time)
    // ═══════════════════════════════════════

    socket.on("furniture:move", (data: { roomId: string; itemId: string; posX: number; posY: number; rotation: number }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      io.to(data.roomId).emit("furniture:moved", {
        roomId: data.roomId,
        userId,
        itemId: data.itemId,
        posX: data.posX,
        posY: data.posY,
        rotation: data.rotation,
      });
    });

    socket.on("furniture:place", (data: { roomId: string; catalogId: string; posX: number; posY: number }) => {
      const userId = socketUsers.get(socket.id);
      if (!userId) return;

      io.to(data.roomId).emit("furniture:placed", {
        roomId: data.roomId,
        userId,
        catalogId: data.catalogId,
        posX: data.posX,
        posY: data.posY,
      });
    });

    // ═══════════════════════════════════════
    // DISCONNECT
    // ═══════════════════════════════════════

    socket.on("disconnect", () => {
      const userId = socketUsers.get(socket.id);

      if (userId) {
        userSockets.delete(userId);
        socketUsers.delete(socket.id);

        // Remove from all rooms
        studyRooms.forEach((room, roomId) => {
          const memberIndex = room.members.findIndex((m) => m.socketId === socket.id);
          if (memberIndex !== -1) {
            room.members.splice(memberIndex, 1);

            if (room.members.length === 0) {
              studyRooms.delete(roomId);
              io.emit("room:deleted", { roomId });
            } else {
              io.to(roomId).emit("room:memberLeft", {
                roomId,
                userId,
                totalMembers: room.members.length,
              });
            }
          }
        });
      }

      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error: ${error}`);
    });
  });

  return io;
}

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
