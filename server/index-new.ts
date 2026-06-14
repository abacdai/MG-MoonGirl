import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import * as users from "./routes/users";
import * as focus from "./routes/focus";
import * as rooms from "./routes/rooms";
import { setupWebSocket } from "./websocket";

export function createAppServer() {
  const app = express();
  const httpServer = createServer(app);

  // Setup WebSocket
  const io = setupWebSocket(httpServer);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping, timestamp: new Date() });
  });

  // WebSocket status
  app.get("/api/socket/status", (_req, res) => {
    res.json({
      connected: true,
      clientCount: io.engine.clientsCount,
    });
  });

  // ═══════════════════════════════════════
  // USER & AUTH ROUTES
  // ═══════════════════════════════════════
  app.post("/api/auth/register", users.registerUser);
  app.post("/api/auth/login", users.loginUser);
  app.get("/api/auth/profile", users.getProfile);
  app.patch("/api/auth/profile", users.updateProfile);
  app.post("/api/auth/link-account", users.linkAccount);
  app.post("/api/auth/unlink-account", users.unlinkAccount);

  // ═══════════════════════════════════════
  // FOCUS SESSION ROUTES
  // ═══════════════════════════════════════
  app.post("/api/focus/start", focus.startSession);
  app.post("/api/focus/end", focus.endSession);
  app.get("/api/focus/sessions", focus.getSessions);
  app.get("/api/focus/stats", focus.getStats);

  // ═══════════════════════════════════════
  // ROOM & FURNITURE ROUTES
  // ═══════════════════════════════════════
  app.get("/api/rooms", rooms.getRooms);
  app.post("/api/rooms/unlock", rooms.unlockRoom);
  app.get("/api/rooms/:roomId/furniture", rooms.getRoomFurniture);
  app.post("/api/rooms/furniture/place", rooms.placeFurniture);
  app.patch("/api/rooms/furniture/move", rooms.moveFurniture);
  app.delete("/api/rooms/furniture/:itemId", rooms.deleteFurniture);

  return { app, httpServer, io };
}

export default createAppServer;
