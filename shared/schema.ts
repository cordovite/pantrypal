import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table 
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table 
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("volunteer").notNull(), // volunteer, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory items
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  quantity: integer("quantity").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  expiryDate: date("expiry_date"),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Donations
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorName: varchar("donor_name", { length: 255 }).notNull(),
  donorEmail: varchar("donor_email", { length: 255 }),
  donorPhone: varchar("donor_phone", { length: 50 }),
  donationType: varchar("donation_type", { length: 100 }).notNull(), // food, monetary, other
  description: text("description"),
  value: decimal("value", { precision: 10, scale: 2 }),
  donationDate: timestamp("donation_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Donation items (for food donations)
export const donationItems = pgTable("donation_items", {
  id: serial("id").primaryKey(),
  donationId: integer("donation_id").references(() => donations.id),
  inventoryItemId: integer("inventory_item_id").references(() => inventoryItems.id),
  quantity: integer("quantity").notNull(),
  expiryDate: date("expiry_date"),
});

// Distribution events
export const distributionEvents = pgTable("distribution_events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 255 }),
  maxFamilies: integer("max_families"),
  registeredFamilies: integer("registered_families").default(0),
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, active, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Distribution items (what items are distributed at events)
export const distributionItems = pgTable("distribution_items", {
  id: serial("id").primaryKey(),
  distributionEventId: integer("distribution_event_id").references(() => distributionEvents.id),
  inventoryItemId: integer("inventory_item_id").references(() => inventoryItems.id),
  quantityPlanned: integer("quantity_planned").notNull(),
  quantityDistributed: integer("quantity_distributed").default(0),
});

// Activity log for tracking changes
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  inventoryItems: many(inventoryItems),
  donations: many(donations),
  distributionEvents: many(distributionEvents),
  activityLogs: many(activityLog),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [inventoryItems.createdBy],
    references: [users.id],
  }),
  donationItems: many(donationItems),
  distributionItems: many(distributionItems),
}));

export const donationsRelations = relations(donations, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [donations.createdBy],
    references: [users.id],
  }),
  donationItems: many(donationItems),
}));

export const donationItemsRelations = relations(donationItems, ({ one }) => ({
  donation: one(donations, {
    fields: [donationItems.donationId],
    references: [donations.id],
  }),
  inventoryItem: one(inventoryItems, {
    fields: [donationItems.inventoryItemId],
    references: [inventoryItems.id],
  }),
}));

export const distributionEventsRelations = relations(distributionEvents, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [distributionEvents.createdBy],
    references: [users.id],
  }),
  distributionItems: many(distributionItems),
}));

export const distributionItemsRelations = relations(distributionItems, ({ one }) => ({
  distributionEvent: one(distributionEvents, {
    fields: [distributionItems.distributionEventId],
    references: [distributionEvents.id],
  }),
  inventoryItem: one(inventoryItems, {
    fields: [distributionItems.inventoryItemId],
    references: [inventoryItems.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  createdByUser: one(users, {
    fields: [activityLog.createdBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

export const insertDonationItemSchema = createInsertSchema(donationItems).omit({
  id: true,
});

export const insertDistributionEventSchema = createInsertSchema(distributionEvents).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

export const insertDistributionItemSchema = createInsertSchema(distributionItems).omit({
  id: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertDonationItem = z.infer<typeof insertDonationItemSchema>;
export type DonationItem = typeof donationItems.$inferSelect;

export type InsertDistributionEvent = z.infer<typeof insertDistributionEventSchema>;
export type DistributionEvent = typeof distributionEvents.$inferSelect;

export type InsertDistributionItem = z.infer<typeof insertDistributionItemSchema>;
export type DistributionItem = typeof distributionItems.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;
