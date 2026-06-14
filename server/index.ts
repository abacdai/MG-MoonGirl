import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as users from "./routes/users";
import * as focus from "./routes/focus";
import * as rooms from "./routes/rooms";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

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

  return app;
}
