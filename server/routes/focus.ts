import { RequestHandler } from "express";

interface FocusSession {
  id: string;
  userId: string;
  mode: "infinite" | "normal" | "strict";
  duration: number; // minutes
  startedAt: Date;
  endedAt?: Date;
  completed: boolean;
  pointsEarned: number;
  serverTick: number;
  clientHash: string;
}

const sessions = new Map<string, FocusSession>();
const userSessions = new Map<string, FocusSession[]>();
const users = new Map<string, any>();

const COINS_PER_HOUR = 100;
const MAX_CLOCK_SKEW_MS = 30000; // 30 seconds

export const startSession: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { mode, focusTime } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionId = `session_${Date.now()}`;
  const serverTick = Date.now();

  const session: FocusSession = {
    id: sessionId,
    userId: token,
    mode: mode || "normal",
    duration: focusTime || 25,
    startedAt: new Date(),
    completed: false,
    pointsEarned: 0,
    serverTick,
    clientHash: "", // Will be set by client
  };

  sessions.set(sessionId, session);

  res.json({
    sessionId,
    serverTick,
    clientHash: `hash_${serverTick}`, // Simple hash for now
  });
};

export const endSession: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { sessionId, clientEndTimestamp, claimedDuration, clientHash } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  // Validate clock skew
  const serverNow = Date.now();
  const skew = Math.abs(serverNow - clientEndTimestamp);

  if (skew > MAX_CLOCK_SKEW_MS) {
    return res.status(400).json({
      error: "Clock skew detected",
      delta_ms: skew,
    });
  }

  // Validate claimed duration doesn't exceed 105% of expected
  const expectedDuration = serverNow - session.serverTick;
  if (claimedDuration > expectedDuration * 1.05) {
    return res.status(400).json({
      error: "Invalid session duration claimed",
    });
  }

  // Calculate points (100 coins per hour)
  const actualMinutes = Math.floor(claimedDuration / 60 / 1000);
  const pointsEarned = Math.floor((actualMinutes / 60) * COINS_PER_HOUR);

  session.endedAt = new Date();
  session.completed = true;
  session.pointsEarned = pointsEarned;

  sessions.set(sessionId, session);

  // Track session for user
  if (!userSessions.has(token)) {
    userSessions.set(token, []);
  }
  userSessions.get(token)!.push(session);

  // Update user stats
  const user = users.get(token) || {};
  user.focusHours = (user.focusHours || 0) + actualMinutes / 60;
  user.moonCoins = (user.moonCoins || 0) + pointsEarned;
  user.screenTimeHours = (user.screenTimeHours || 0) + (actualMinutes / 60) * 0.3;
  users.set(token, user);

  res.json({
    sessionId,
    pointsEarned,
    actualMinutes,
    newBalance: user.moonCoins,
  });
};

export const getSessions: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userSessionsList = userSessions.get(token) || [];

  res.json({
    sessions: userSessionsList,
    totalSessions: userSessionsList.length,
    totalMinutes: userSessionsList.reduce(
      (sum, s) => sum + s.duration,
      0
    ),
  });
};

export const getStats: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = users.get(token) || {
    moonCoins: 0,
    focusHours: 0,
    sleepHours: 0,
    screenTimeHours: 0,
  };

  res.json({
    moonCoins: user.moonCoins,
    focusHours: user.focusHours,
    sleepHours: user.sleepHours,
    screenTimeHours: user.screenTimeHours,
    level: Math.floor((user.focusHours || 0) / 2),
    streak: userSessions.get(token)?.length || 0,
  });
};
