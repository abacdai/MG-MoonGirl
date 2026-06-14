import {
  pgTable,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════
// USERS & AUTH
// ═══════════════════════════════════════

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    locale: text("locale").default("vi"), // 'vi' | 'en'
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
    deletedAtIdx: index("users_deleted_at_idx").on(table.deletedAt),
  })
);

export const userProfiles = pgTable(
  "user_profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    timezone: text("timezone").default("Asia/Ho_Chi_Minh"),
    streakCount: integer("streak_count").default(0),
    lastCheckin: timestamp("last_checkin"),
    totalPoints: bigint("total_points").default(0n), // MoonCoins
    level: integer("level").default(1),
  },
  (table) => ({
    streakIdx: index("user_profiles_streak_idx").on(table.streakCount),
    totalPointsIdx: index("user_profiles_total_points_idx").on(table.totalPoints),
  })
);

export const linkedAccounts = pgTable(
  "linked_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // 'gmail' | 'facebook' | 'apple'
    providerUserId: text("provider_user_id").notNull(),
    email: text("email"),
    linkedAt: timestamp("linked_at").defaultNow(),
  },
  (table) => ({
    userProviderIdx: uniqueIndex("linked_accounts_user_provider_idx").on(
      table.userId,
      table.provider
    ),
  })
);

// ═══════════════════════════════════════
// FOCUS SESSIONS
// ═══════════════════════════════════════

export const focusSessions = pgTable(
  "focus_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: text("mode").notNull(), // 'infinite' | 'normal' | 'strict'
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at"),
    plannedMinutes: integer("planned_minutes"),
    actualMinutes: integer("actual_minutes"),
    pomodoroConfig: jsonb("pomodoro_config"), // {focus: 25, break: 5, sessions: 4}
    completed: boolean("completed").default(false),
    brokenAt: timestamp("broken_at"),
    roomId: uuid("room_id"), // For co-study
    pointsEarned: integer("points_earned").default(0),
    serverTick: bigint("server_tick"),
    clientHash: text("client_hash"),
  },
  (table) => ({
    userIdIdx: index("focus_sessions_user_id_idx").on(table.userId),
    startedAtIdx: index("focus_sessions_started_at_idx").on(table.startedAt),
    completedIdx: index("focus_sessions_completed_idx").on(table.completed),
  })
);

// ═══════════════════════════════════════
// GAMIFICATION: HOUSE & ROOMS
// ═══════════════════════════════════════

export const houses = pgTable(
  "houses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").default("Moon House"),
    totalTiles: integer("total_tiles").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("houses_user_id_idx").on(table.userId),
  })
);

export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    houseId: uuid("house_id")
      .notNull()
      .references(() => houses.id, { onDelete: "cascade" }),
    roomType: text("room_type").notNull(), // 'bedroom' | 'kitchen' | 'study' | 'music' | 'aquarium' | 'garden'
    name: text("name"),
    unlockedAt: timestamp("unlocked_at"),
    pointsCost: integer("points_cost").notNull(),
    gridWidth: integer("grid_width").default(8),
    gridHeight: integer("grid_height").default(8),
    theme: text("theme").default("default"),
    bgColor: text("bg_color").default("#FFFFFF"),
    isShared: boolean("is_shared").default(false),
  },
  (table) => ({
    houseIdIdx: index("rooms_house_id_idx").on(table.houseId),
    roomTypeIdx: index("rooms_room_type_idx").on(table.roomType),
  })
);

export const furnitureItems = pgTable(
  "furniture_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    catalogId: text("catalog_id").notNull(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    posX: integer("pos_x").notNull(),
    posY: integer("pos_y").notNull(),
    rotation: integer("rotation").default(0), // 0 | 90 | 180 | 270
    scale: text("scale").default("1.0"), // NUMERIC(3,2)
    colorTint: text("color_tint"), // hex override
    zIndex: integer("z_index").default(0),
    placedAt: timestamp("placed_at").defaultNow(),
  },
  (table) => ({
    roomIdIdx: index("furniture_items_room_id_idx").on(table.roomId),
    positionIdx: uniqueIndex("furniture_items_room_pos_idx").on(
      table.roomId,
      table.posX,
      table.posY
    ),
  })
);

// ═══════════════════════════════════════
// COLLECTIBLES
// ═══════════════════════════════════════

export const itemCatalog = pgTable(
  "item_catalog",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(), // 'furniture' | 'plant' | 'decoration'
    nameVi: text("name_vi").notNull(),
    nameEn: text("name_en").notNull(),
    assetKey: text("asset_key").notNull(),
    pointsCost: integer("points_cost").default(0),
    rarity: text("rarity").default("common"), // common | rare | epic | legendary
    unlockLevel: integer("unlock_level").default(1),
  }
);

export const userInventory = pgTable(
  "user_inventory",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => itemCatalog.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1),
    obtainedAt: timestamp("obtained_at").defaultNow(),
  },
  (table) => ({
    userItemIdx: uniqueIndex("user_inventory_user_item_idx").on(
      table.userId,
      table.itemId
    ),
    userIdIdx: index("user_inventory_user_id_idx").on(table.userId),
  })
);

// ═══════════════════════════════════════
// SOCIAL & CO-STUDY
// ═══════════════════════════════════════

export const studyRooms = pgTable(
  "study_rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isPublic: boolean("is_public").default(true),
    maxMembers: integer("max_members").default(10),
    currentCount: integer("current_count").default(0),
    inviteCode: text("invite_code").unique(),
    createdAt: timestamp("created_at").defaultNow(),
    endsAt: timestamp("ends_at"),
  },
  (table) => ({
    hostIdIdx: index("study_rooms_host_id_idx").on(table.hostId),
    inviteCodeIdx: uniqueIndex("study_rooms_invite_code_idx").on(table.inviteCode),
  })
);

export const studyRoomMembers = pgTable(
  "study_room_members",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => studyRooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow(),
    micOn: boolean("mic_on").default(false),
    isFocusing: boolean("is_focusing").default(false),
  },
  (table) => ({
    roomUserIdx: uniqueIndex("study_room_members_room_user_idx").on(
      table.roomId,
      table.userId
    ),
  })
);

export const friendships = pgTable(
  "friendships",
  {
    userIdA: uuid("user_id_a")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userIdB: uuid("user_id_b")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").default("pending"), // 'pending' | 'accepted' | 'blocked'
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    friendshipIdx: uniqueIndex("friendships_idx").on(table.userIdA, table.userIdB),
  })
);

// ═══════════════════════════════════════
// STREAKS & CHECK-IN
// ═══════════════════════════════════════

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    checkinDate: timestamp("checkin_date").notNull(),
    pointsEarned: integer("points_earned").default(10),
    note: text("note"),
  },
  (table) => ({
    userDateIdx: uniqueIndex("daily_checkins_user_date_idx").on(
      table.userId,
      table.checkinDate
    ),
  })
);

export const streakSnapshots = pgTable(
  "streak_snapshots",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    snapshotDate: timestamp("snapshot_date").notNull(),
    streakCount: integer("streak_count").notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("streak_snapshots_user_date_idx").on(
      table.userId,
      table.snapshotDate
    ),
  })
);

// ═══════════════════════════════════════
// BLOCK RULES
// ═══════════════════════════════════════

export const blockRules = pgTable(
  "block_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    appBundles: jsonb("app_bundles").notNull(), // array of bundle IDs
    startTime: text("start_time"), // "HH:MM"
    endTime: text("end_time"), // "HH:MM"
    weekdays: jsonb("weekdays").default([0, 1, 2, 3, 4, 5, 6]), // 0-6 (Sun-Sat)
    enabled: boolean("enabled").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("block_rules_user_id_idx").on(table.userId),
    enabledIdx: index("block_rules_enabled_idx").on(table.enabled),
  })
);

// ═══════════════════════════════════════
// ANTI-CHEAT
// ═══════════════════════════════════════

export const anticheatEvents = pgTable(
  "anticheat_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(), // 'clock_skew' | 'session_tamper' | 'rapid_point'
    clientTs: timestamp("client_ts"),
    serverTs: timestamp("server_ts").defaultNow(),
    deltaMs: bigint("delta_ms"),
    sessionId: uuid("session_id"),
    metadata: jsonb("metadata"),
    severity: text("severity").default("warning"), // 'warning' | 'ban_trigger'
  },
  (table) => ({
    userIdIdx: index("anticheat_events_user_id_idx").on(table.userId),
    serverTsIdx: index("anticheat_events_server_ts_idx").on(table.serverTs),
    severityIdx: index("anticheat_events_severity_idx").on(table.severity),
  })
);

// ═══════════════════════════════════════
// STORE / E-COMMERCE
// ═══════════════════════════════════════

export const storeListings = pgTable(
  "store_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    titleVi: text("title_vi").notNull(),
    titleEn: text("title_en").notNull(),
    description: text("description"),
    type: text("type").notNull(), // 'virtual' | 'physical'
    pointsPrice: integer("points_price").notNull(),
    stock: integer("stock").default(-1), // -1 = unlimited
    active: boolean("active").default(true),
    imgUrl: text("img_url"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    activeIdx: index("store_listings_active_idx").on(table.active),
    typeIdx: index("store_listings_type_idx").on(table.type),
  })
);

export const storeTransactions = pgTable(
  "store_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => storeListings.id, { onDelete: "restrict" }),
    pointsSpent: integer("points_spent").notNull(),
    balanceBefore: bigint("balance_before").notNull(),
    balanceAfter: bigint("balance_after").notNull(),
    status: text("status").default("pending"), // 'pending' | 'fulfilled' | 'failed'
    idempotencyKey: text("idempotency_key").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    fulfilledAt: timestamp("fulfilled_at"),
  },
  (table) => ({
    userIdIdx: index("store_transactions_user_id_idx").on(table.userId),
    idempotencyIdx: uniqueIndex("store_transactions_idempotency_idx").on(
      table.idempotencyKey
    ),
    createdAtIdx: index("store_transactions_created_at_idx").on(table.createdAt),
  })
);

// ═══════════════════════════════════════
// RELATIONS (Drizzle)
// ═══════════════════════════════════════

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  linkedAccounts: many(linkedAccounts),
  focusSessions: many(focusSessions),
  house: one(houses),
  studyRooms: many(studyRooms),
  blockRules: many(blockRules),
  anticheatEvents: many(anticheatEvents),
  storeTransactions: many(storeTransactions),
}));

export const housesRelations = relations(houses, ({ one, many }) => ({
  user: one(users, { fields: [houses.userId], references: [users.id] }),
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  house: one(houses, { fields: [rooms.houseId], references: [houses.id] }),
  furniture: many(furnitureItems),
}));

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, {
    fields: [focusSessions.userId],
    references: [users.id],
  }),
}));
