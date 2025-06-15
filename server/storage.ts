import {
  users,
  inventoryItems,
  donations,
  donationItems,
  distributionEvents,
  distributionItems,
  activityLog,
  type User,
  type UpsertUser,
  type InventoryItem,
  type InsertInventoryItem,
  type Donation,
  type InsertDonation,
  type DonationItem,
  type InsertDonationItem,
  type DistributionEvent,
  type InsertDistributionEvent,
  type DistributionItem,
  type InsertDistributionItem,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, and, or, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Inventory operations
  getInventoryItems(filters?: {
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem, userId: string): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>, userId: string): Promise<InventoryItem>;
  deleteInventoryItem(id: number, userId: string): Promise<void>;
  getLowStockItems(): Promise<InventoryItem[]>;
  getExpiringItems(days?: number): Promise<InventoryItem[]>;

  // Donation operations
  getDonations(filters?: {
    donationType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation, userId: string): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>, userId: string): Promise<Donation>;
  deleteDonation(id: number, userId: string): Promise<void>;
  getDonationItems(donationId: number): Promise<DonationItem[]>;
  createDonationItem(item: InsertDonationItem): Promise<DonationItem>;

  // Distribution operations
  getDistributionEvents(filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<DistributionEvent[]>;
  getDistributionEvent(id: number): Promise<DistributionEvent | undefined>;
  createDistributionEvent(event: InsertDistributionEvent, userId: string): Promise<DistributionEvent>;
  updateDistributionEvent(id: number, event: Partial<InsertDistributionEvent>, userId: string): Promise<DistributionEvent>;
  deleteDistributionEvent(id: number, userId: string): Promise<void>;
  getDistributionItems(eventId: number): Promise<DistributionItem[]>;
  createDistributionItem(item: InsertDistributionItem): Promise<DistributionItem>;

  // Activity log operations
  createActivityLog(log: InsertActivityLog, userId: string): Promise<ActivityLog>;
  getRecentActivity(limit?: number): Promise<ActivityLog[]>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalItems: number;
    monthlyDonations: number;
    familiesServed: number;
    upcomingEvents: number;
    lowStockCount: number;
    expiringCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Inventory operations
  async getInventoryItems(filters?: {
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<InventoryItem[]> {
    let query = db.select().from(inventoryItems);
    
    const conditions = [];
    
    if (filters?.category && filters.category !== "All Categories") {
      conditions.push(eq(inventoryItems.category, filters.category));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          sql`${inventoryItems.name} ILIKE ${`%${filters.search}%`}`,
          sql`${inventoryItems.category} ILIKE ${`%${filters.search}%`}`
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortBy = filters?.sortBy || "name";
    const sortOrder = filters?.sortOrder || "asc";
    
    if (sortBy === "name") {
      query = query.orderBy(sortOrder === "asc" ? asc(inventoryItems.name) : desc(inventoryItems.name));
    } else if (sortBy === "quantity") {
      query = query.orderBy(sortOrder === "asc" ? asc(inventoryItems.quantity) : desc(inventoryItems.quantity));
    } else if (sortBy === "expiryDate") {
      query = query.orderBy(sortOrder === "asc" ? asc(inventoryItems.expiryDate) : desc(inventoryItems.expiryDate));
    }
    
    const items = await query;
    
    // Apply status filter after fetch since it requires calculated fields
    if (filters?.status && filters.status !== "All Items") {
      const now = new Date();
      const soonDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return items.filter(item => {
        if (filters.status === "In Stock") {
          return item.quantity > item.lowStockThreshold;
        } else if (filters.status === "Low Stock") {
          return item.quantity <= item.lowStockThreshold && item.quantity > 0;
        } else if (filters.status === "Out of Stock") {
          return item.quantity === 0;
        } else if (filters.status === "Expiring Soon") {
          return item.expiryDate && new Date(item.expiryDate) <= soonDate;
        }
        return true;
      });
    }
    
    return items;
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem, userId: string): Promise<InventoryItem> {
    const [newItem] = await db
      .insert(inventoryItems)
      .values({ ...item, createdBy: userId })
      .returning();

    await this.createActivityLog({
      action: "create",
      entityType: "inventory_item",
      entityId: newItem.id,
      description: `Added new inventory item: ${newItem.name} (${item.quantity} ${item.unit})`,
    }, userId);

    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>, userId: string): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();

    await this.createActivityLog({
      action: "update",
      entityType: "inventory_item",
      entityId: id,
      description: `Updated inventory item: ${updatedItem.name}`,
    }, userId);

    return updatedItem;
  }

  async deleteInventoryItem(id: number, userId: string): Promise<void> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));

    if (item) {
      await this.createActivityLog({
        action: "delete",
        entityType: "inventory_item",
        entityId: id,
        description: `Deleted inventory item: ${item.name}`,
      }, userId);
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventoryItems)
      .where(sql`${inventoryItems.quantity} <= ${inventoryItems.lowStockThreshold}`);
  }

  async getExpiringItems(days: number = 7): Promise<InventoryItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db
      .select()
      .from(inventoryItems)
      .where(
        and(
          sql`${inventoryItems.expiryDate} IS NOT NULL`,
          lte(inventoryItems.expiryDate, futureDate.toISOString().split('T')[0])
        )
      );
  }

  // Donation operations
  async getDonations(filters?: {
    donationType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Donation[]> {
    let query = db.select().from(donations);
    
    const conditions = [];
    
    if (filters?.donationType) {
      conditions.push(eq(donations.donationType, filters.donationType));
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(donations.donationDate, filters.dateFrom));
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(donations.donationDate, filters.dateTo));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(donations.donationDate));
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation;
  }

  async createDonation(donation: InsertDonation, userId: string): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values({ ...donation, createdBy: userId })
      .returning();

    await this.createActivityLog({
      action: "create",
      entityType: "donation",
      entityId: newDonation.id,
      description: `Recorded new donation from ${donation.donorName}`,
    }, userId);

    return newDonation;
  }

  async updateDonation(id: number, donation: Partial<InsertDonation>, userId: string): Promise<Donation> {
    const [updatedDonation] = await db
      .update(donations)
      .set(donation)
      .where(eq(donations.id, id))
      .returning();

    await this.createActivityLog({
      action: "update",
      entityType: "donation",
      entityId: id,
      description: `Updated donation from ${updatedDonation.donorName}`,
    }, userId);

    return updatedDonation;
  }

  async deleteDonation(id: number, userId: string): Promise<void> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    
    await db.delete(donations).where(eq(donations.id, id));

    if (donation) {
      await this.createActivityLog({
        action: "delete",
        entityType: "donation",
        entityId: id,
        description: `Deleted donation from ${donation.donorName}`,
      }, userId);
    }
  }

  async getDonationItems(donationId: number): Promise<DonationItem[]> {
    return await db.select().from(donationItems).where(eq(donationItems.donationId, donationId));
  }

  async createDonationItem(item: InsertDonationItem): Promise<DonationItem> {
    const [newItem] = await db.insert(donationItems).values(item).returning();
    return newItem;
  }

  // Distribution operations
  async getDistributionEvents(filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<DistributionEvent[]> {
    let query = db.select().from(distributionEvents);
    
    const conditions = [];
    
    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(distributionEvents.status, filters.status));
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(distributionEvents.eventDate, filters.dateFrom));
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(distributionEvents.eventDate, filters.dateTo));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(distributionEvents.eventDate));
  }

  async getDistributionEvent(id: number): Promise<DistributionEvent | undefined> {
    const [event] = await db.select().from(distributionEvents).where(eq(distributionEvents.id, id));
    return event;
  }

  async createDistributionEvent(event: InsertDistributionEvent, userId: string): Promise<DistributionEvent> {
    const [newEvent] = await db
      .insert(distributionEvents)
      .values({ ...event, createdBy: userId })
      .returning();

    await this.createActivityLog({
      action: "create",
      entityType: "distribution_event",
      entityId: newEvent.id,
      description: `Scheduled distribution event: ${event.name}`,
    }, userId);

    return newEvent;
  }

  async updateDistributionEvent(id: number, event: Partial<InsertDistributionEvent>, userId: string): Promise<DistributionEvent> {
    const [updatedEvent] = await db
      .update(distributionEvents)
      .set(event)
      .where(eq(distributionEvents.id, id))
      .returning();

    await this.createActivityLog({
      action: "update",
      entityType: "distribution_event",
      entityId: id,
      description: `Updated distribution event: ${updatedEvent.name}`,
    }, userId);

    return updatedEvent;
  }

  async deleteDistributionEvent(id: number, userId: string): Promise<void> {
    const [event] = await db.select().from(distributionEvents).where(eq(distributionEvents.id, id));
    
    await db.delete(distributionEvents).where(eq(distributionEvents.id, id));

    if (event) {
      await this.createActivityLog({
        action: "delete",
        entityType: "distribution_event",
        entityId: id,
        description: `Deleted distribution event: ${event.name}`,
      }, userId);
    }
  }

  async getDistributionItems(eventId: number): Promise<DistributionItem[]> {
    return await db.select().from(distributionItems).where(eq(distributionItems.distributionEventId, eventId));
  }

  async createDistributionItem(item: InsertDistributionItem): Promise<DistributionItem> {
    const [newItem] = await db.insert(distributionItems).values(item).returning();
    return newItem;
  }

  // Activity log operations
  async createActivityLog(log: InsertActivityLog, userId: string): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLog)
      .values({ ...log, createdBy: userId })
      .returning();
    return newLog;
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalItems: number;
    monthlyDonations: number;
    familiesServed: number;
    upcomingEvents: number;
    lowStockCount: number;
    expiringCount: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const soonDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [totalItemsResult] = await db.select({ count: count() }).from(inventoryItems);
    
    const [monthlyDonationsResult] = await db
      .select({ count: count() })
      .from(donations)
      .where(gte(donations.donationDate, startOfMonth));

    const [upcomingEventsResult] = await db
      .select({ count: count() })
      .from(distributionEvents)
      .where(
        and(
          gte(distributionEvents.eventDate, now),
          eq(distributionEvents.status, "scheduled")
        )
      );

    const [lowStockResult] = await db
      .select({ count: count() })
      .from(inventoryItems)
      .where(sql`${inventoryItems.quantity} <= ${inventoryItems.lowStockThreshold}`);

    const [expiringResult] = await db
      .select({ count: count() })
      .from(inventoryItems)
      .where(
        and(
          sql`${inventoryItems.expiryDate} IS NOT NULL`,
          lte(inventoryItems.expiryDate, soonDate.toISOString().split('T')[0])
        )
      );

    // Calculate families served this month from completed distribution events
    const completedEvents = await db
      .select({ registeredFamilies: distributionEvents.registeredFamilies })
      .from(distributionEvents)
      .where(
        and(
          gte(distributionEvents.eventDate, startOfMonth),
          eq(distributionEvents.status, "completed")
        )
      );

    const familiesServed = completedEvents.reduce((sum, event) => sum + (event.registeredFamilies || 0), 0);

    return {
      totalItems: totalItemsResult.count,
      monthlyDonations: monthlyDonationsResult.count,
      familiesServed,
      upcomingEvents: upcomingEventsResult.count,
      lowStockCount: lowStockResult.count,
      expiringCount: expiringResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
