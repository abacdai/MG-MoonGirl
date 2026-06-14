import { RequestHandler } from "express";

// In-memory user store (temporary - will use database later)
const users = new Map<string, any>();
const sessions = new Map<string, string>();

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

export const registerUser: RequestHandler = (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const userId = `user_${Date.now()}`;
  const user: UserProfile = {
    userId,
    displayName: displayName || "Moon Girl",
    userId_id: `moongirl_${userId.slice(-6)}`,
    birthday: "15/06/2004",
    avatar_url: "",
    linkedAccounts: [],
    moonCoins: 0,
    focusHours: 0,
    sleepHours: 0,
    screenTimeHours: 0,
    level: 1,
    streak: 0,
  };

  users.set(userId, { email, password, ...user });
  const token = `token_${userId}`;
  sessions.set(token, userId);

  res.status(201).json({ token, user });
};

export const loginUser: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = Array.from(users.values()).find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = `token_${user.userId}`;
  sessions.set(token, user.userId);

  res.json({ token, user });
};

export const getProfile: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = sessions.get(token);
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};

export const updateProfile: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { displayName, birthday, linkedAccounts } = req.body;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = sessions.get(token);
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (displayName) user.displayName = displayName;
  if (birthday) user.birthday = birthday;
  if (linkedAccounts) user.linkedAccounts = linkedAccounts;

  users.set(userId, user);

  res.json(user);
};

export const linkAccount: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { account } = req.body;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = sessions.get(token);
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.linkedAccounts.includes(account)) {
    user.linkedAccounts.push(account);
    users.set(userId, user);
  }

  res.json(user);
};

export const unlinkAccount: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { account } = req.body;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = sessions.get(token);
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.linkedAccounts = user.linkedAccounts.filter((a) => a !== account);
  users.set(userId, user);

  res.json(user);
};
