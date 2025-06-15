import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertInventoryItemSchema,
  insertDonationSchema,
  insertDistributionEventSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/recent-activity", isAuthenticated, async (req, res) => {
    try {
      const activity = await storage.getRecentActivity(10);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/dashboard/alerts", isAuthenticated, async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockItems();
      const expiringItems = await storage.getExpiringItems(7);
      
      const alerts = [
        ...lowStockItems.map(item => ({
          id: item.id,
          type: "low_stock",
          title: `${item.name}`,
          description: `${item.quantity} ${item.unit} remaining`,
          priority: "high",
        })),
        ...expiringItems.map(item => ({
          id: item.id,
          type: "expiring",
          title: `${item.name}`,
          description: `Expires ${item.expiryDate}`,
          priority: "medium",
        }))
      ];

      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", isAuthenticated, async (req, res) => {
    try {
      const { category, status, search, sortBy, sortOrder } = req.query;
      const items = await storage.getInventoryItems({
        category: category as string,
        status: status as string,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
      });
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getInventoryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const item = await storage.createInventoryItem(validatedData, userId);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const userId = req.user.claims.sub;
      const item = await storage.updateInventoryItem(id, validatedData, userId);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      await storage.deleteInventoryItem(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Donation routes
  app.get("/api/donations", isAuthenticated, async (req, res) => {
    try {
      const { donationType, dateFrom, dateTo } = req.query;
      const donations = await storage.getDonations({
        donationType: donationType as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.get("/api/donations/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const donation = await storage.getDonation(id);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      console.error("Error fetching donation:", error);
      res.status(500).json({ message: "Failed to fetch donation" });
    }
  });

  app.post("/api/donations", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const donation = await storage.createDonation(validatedData, userId);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.put("/api/donations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDonationSchema.partial().parse(req.body);
      const userId = req.user.claims.sub;
      const donation = await storage.updateDonation(id, validatedData, userId);
      res.json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating donation:", error);
      res.status(500).json({ message: "Failed to update donation" });
    }
  });

  app.delete("/api/donations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      await storage.deleteDonation(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting donation:", error);
      res.status(500).json({ message: "Failed to delete donation" });
    }
  });

  // Distribution routes
  app.get("/api/distributions", isAuthenticated, async (req, res) => {
    try {
      const { status, dateFrom, dateTo } = req.query;
      const events = await storage.getDistributionEvents({
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(events);
    } catch (error) {
      console.error("Error fetching distribution events:", error);
      res.status(500).json({ message: "Failed to fetch distribution events" });
    }
  });

  app.get("/api/distributions/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getDistributionEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Distribution event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching distribution event:", error);
      res.status(500).json({ message: "Failed to fetch distribution event" });
    }
  });

  app.post("/api/distributions", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDistributionEventSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const event = await storage.createDistributionEvent(validatedData, userId);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating distribution event:", error);
      res.status(500).json({ message: "Failed to create distribution event" });
    }
  });

  app.put("/api/distributions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDistributionEventSchema.partial().parse(req.body);
      const userId = req.user.claims.sub;
      const event = await storage.updateDistributionEvent(id, validatedData, userId);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating distribution event:", error);
      res.status(500).json({ message: "Failed to update distribution event" });
    }
  });

  app.delete("/api/distributions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      await storage.deleteDistributionEvent(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting distribution event:", error);
      res.status(500).json({ message: "Failed to delete distribution event" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
