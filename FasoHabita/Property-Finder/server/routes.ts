import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Auth Routes
  await setupAuth(app);
  registerAuthRoutes(app);

  // Register Object Storage Routes
  registerObjectStorageRoutes(app);

  // --- Listings Routes ---

  // Get all listings (public)
  app.get(api.listings.list.path, async (req, res) => {
    try {
      // Parse query params if provided
      const params = req.query as any;
      // Convert numeric params
      if (params.minPrice) params.minPrice = Number(params.minPrice);
      if (params.maxPrice) params.maxPrice = Number(params.maxPrice);
      if (params.bedrooms) params.bedrooms = Number(params.bedrooms);

      const listings = await storage.getListings(params);
      res.json(listings);
    } catch (error) {
      console.error("Error listing properties:", error);
      res.status(500).json({ message: "Failed to list properties" });
    }
  });

  // Get my listings (protected)
  app.get(api.listings.myListings.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listings = await storage.getUserListings(userId);
      res.json(listings);
    } catch (error) {
      console.error("Error getting user listings:", error);
      res.status(500).json({ message: "Failed to get user listings" });
    }
  });

  // Get single listing (public)
  app.get(api.listings.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid ID" });
      }
      const listing = await storage.getListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error getting listing:", error);
      res.status(500).json({ message: "Failed to get listing" });
    }
  });

  // Create listing (protected)
  app.post(api.listings.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.listings.create.input.parse(req.body);
      const userId = req.user.claims.sub;
      
      const listing = await storage.createListing({
        ...input,
        ownerId: userId
      });
      
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Update listing (protected)
  app.put(api.listings.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.listings.update.input.parse(req.body);
      const userId = req.user.claims.sub;

      const listing = await storage.updateListing(id, input, userId);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found or you don't have permission" });
      }
      
      res.json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      console.error("Error updating listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  // Delete listing (protected)
  app.delete(api.listings.delete.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user.claims.sub;

      const success = await storage.deleteListing(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Listing not found or you don't have permission" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  return httpServer;
}
