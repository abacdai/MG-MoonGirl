import { RequestHandler } from "express";

interface BlockRule {
  id: string;
  userId: string;
  name: string;
  description?: string;
  appBundles: string[]; // App bundle IDs to block
  startTime?: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  weekdays: number[]; // 0-6 (Sun-Sat)
  enabled: boolean;
  createdAt: Date;
}

// In-memory store (temporary)
const userRules = new Map<string, BlockRule[]>();

const APP_CATALOG = [
  { id: "com.instagram.android", name: "Instagram", icon: "📷", category: "social" },
  { id: "com.facebook.katana", name: "Facebook", icon: "👥", category: "social" },
  { id: "com.twitter.android", name: "Twitter", icon: "🐦", category: "social" },
  { id: "com.tiktok.client.android", name: "TikTok", icon: "🎵", category: "social" },
  { id: "com.snapchat.android", name: "Snapchat", icon: "👻", category: "social" },
  { id: "com.youtube.android", name: "YouTube", icon: "📺", category: "video" },
  { id: "com.netflix.mediaclient", name: "Netflix", icon: "🎬", category: "video" },
  { id: "com.spotify.music", name: "Spotify", icon: "🎧", category: "music" },
  { id: "com.discord", name: "Discord", icon: "💜", category: "messaging" },
  { id: "com.whatsapp", name: "WhatsApp", icon: "💬", category: "messaging" },
  { id: "com.telegram", name: "Telegram", icon: "✈️", category: "messaging" },
  { id: "com.reddit.frontpage", name: "Reddit", icon: "🔴", category: "social" },
  { id: "com.candy.crush", name: "Candy Crush", icon: "🍬", category: "games" },
  { id: "com.supercell.clashofclans", name: "Clash of Clans", icon: "⚔️", category: "games" },
  { id: "com.pubg.imobile", name: "PUBG Mobile", icon: "🎮", category: "games" },
];

export const getAppCatalog: RequestHandler = (_req, res) => {
  res.json({ apps: APP_CATALOG });
};

export const createRule: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { name, description, appBundles, startTime, endTime, weekdays } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!name || !appBundles || appBundles.length === 0) {
    return res.status(400).json({ error: "Name and at least one app required" });
  }

  const ruleId = `rule_${Date.now()}`;
  const rule: BlockRule = {
    id: ruleId,
    userId: token,
    name,
    description,
    appBundles,
    startTime: startTime || "00:00",
    endTime: endTime || "23:59",
    weekdays: weekdays || [0, 1, 2, 3, 4, 5, 6], // All days by default
    enabled: true,
    createdAt: new Date(),
  };

  if (!userRules.has(token)) {
    userRules.set(token, []);
  }
  userRules.get(token)!.push(rule);

  res.status(201).json({ rule });
};

export const getRules: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rules = userRules.get(token) || [];

  res.json({ rules });
};

export const updateRule: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { ruleId } = req.params;
  const { name, description, appBundles, startTime, endTime, weekdays, enabled } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rules = userRules.get(token);
  if (!rules) {
    return res.status(404).json({ error: "Rule not found" });
  }

  const rule = rules.find((r) => r.id === ruleId);
  if (!rule) {
    return res.status(404).json({ error: "Rule not found" });
  }

  if (name) rule.name = name;
  if (description !== undefined) rule.description = description;
  if (appBundles) rule.appBundles = appBundles;
  if (startTime) rule.startTime = startTime;
  if (endTime) rule.endTime = endTime;
  if (weekdays) rule.weekdays = weekdays;
  if (enabled !== undefined) rule.enabled = enabled;

  res.json({ rule });
};

export const deleteRule: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { ruleId } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rules = userRules.get(token);
  if (!rules) {
    return res.status(404).json({ error: "Rule not found" });
  }

  const index = rules.findIndex((r) => r.id === ruleId);
  if (index === -1) {
    return res.status(404).json({ error: "Rule not found" });
  }

  rules.splice(index, 1);

  res.json({ success: true });
};

export const toggleRule: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { ruleId } = req.params;
  const { enabled } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rules = userRules.get(token);
  if (!rules) {
    return res.status(404).json({ error: "Rule not found" });
  }

  const rule = rules.find((r) => r.id === ruleId);
  if (!rule) {
    return res.status(404).json({ error: "Rule not found" });
  }

  rule.enabled = enabled;

  res.json({ rule });
};

export const getActiveRules: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rules = userRules.get(token) || [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();
  const currentTime = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;

  const activeRules = rules.filter((rule) => {
    if (!rule.enabled) return false;

    // Check if today is in weekdays
    if (!rule.weekdays.includes(currentDay)) return false;

    // Check if current time is within rule timeframe
    if (rule.startTime && rule.endTime) {
      return currentTime >= rule.startTime && currentTime <= rule.endTime;
    }

    return true;
  });

  const blockedApps = activeRules.flatMap((r) => r.appBundles);

  res.json({
    activeRules,
    blockedApps,
    totalBlockedApps: blockedApps.length,
  });
};
