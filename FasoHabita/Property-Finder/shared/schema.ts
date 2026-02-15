import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Re-export auth models
export * from "./models/auth";
import { users } from "./models/auth";

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'location' | 'vente'
  category: text("category").notNull(), // 'villa', 'appartement', 'maison', 'cour_commune', 'bureau', 'magasin'
  price: integer("price").notNull(),
  currency: text("currency").default("FCFA").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(), // quartier
  bedrooms: integer("bedrooms").default(0),
  bathrooms: integer("bathrooms").default(0),
  area: integer("area").default(0), // m2
  amenities: jsonb("amenities").$type<string[]>().default([]),
  status: text("status").default("disponible").notNull(), // 'disponible', 'loué', 'vendu'
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const listingImages = pgTable("listing_images", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  url: text("url").notNull(),
  isMain: boolean("is_main").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const listingsRelations = relations(listings, ({ one, many }) => ({
  owner: one(users, {
    fields: [listings.ownerId],
    references: [users.id],
  }),
  images: many(listingImages),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listingId],
    references: [listings.id],
  }),
}));

// Schemas
export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  ownerId: true 
});

export const insertListingImageSchema = createInsertSchema(listingImages).omit({
  id: true,
  createdAt: true
});

// Types
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type ListingImage = typeof listingImages.$inferSelect;
export type InsertListingImage = z.infer<typeof insertListingImageSchema>;

export type CreateListingRequest = InsertListing & {
  images?: { url: string; isMain?: boolean }[];
};

export type UpdateListingRequest = Partial<InsertListing> & {
  images?: { url: string; isMain?: boolean }[];
};

export type ListingResponse = Listing & {
  images: ListingImage[];
  owner?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
};

export interface ListingsQueryParams {
  search?: string;
  type?: string;
  category?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}
