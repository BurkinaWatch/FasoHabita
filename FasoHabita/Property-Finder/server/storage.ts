import { db } from "./db";
import {
  listings,
  listingImages,
  type InsertListing,
  type Listing,
  type ListingImage,
  type CreateListingRequest,
  type UpdateListingRequest,
  type ListingResponse,
  type ListingsQueryParams,
} from "@shared/schema";
import { eq, and, desc, like, gte, lte } from "drizzle-orm";
import { users } from "@shared/models/auth";

export interface IStorage {
  getListings(params?: ListingsQueryParams): Promise<ListingResponse[]>;
  getListing(id: number): Promise<ListingResponse | undefined>;
  createListing(listing: CreateListingRequest & { ownerId: string }): Promise<ListingResponse>;
  updateListing(id: number, listing: UpdateListingRequest, ownerId: string): Promise<ListingResponse | undefined>;
  deleteListing(id: number, ownerId: string): Promise<boolean>;
  getUserListings(ownerId: string): Promise<ListingResponse[]>;
}

export class DatabaseStorage implements IStorage {
  async getListings(params?: ListingsQueryParams): Promise<ListingResponse[]> {
    const conditions = [];
    
    // Status is always available for public search
    conditions.push(eq(listings.status, "available"));

    if (params?.search) {
      conditions.push(like(listings.title, `%${params.search}%`));
    }
    if (params?.type) {
      conditions.push(eq(listings.type, params.type));
    }
    if (params?.category) {
      conditions.push(eq(listings.category, params.category));
    }
    if (params?.city) {
      conditions.push(eq(listings.city, params.city));
    }
    if (params?.district) {
      conditions.push(eq(listings.district, params.district));
    }
    if (params?.minPrice) {
      conditions.push(gte(listings.price, params.minPrice));
    }
    if (params?.maxPrice) {
      conditions.push(lte(listings.price, params.maxPrice));
    }
    if (params?.bedrooms) {
      conditions.push(gte(listings.bedrooms, params.bedrooms));
    }

    const rows = await db.query.listings.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(listings.createdAt)],
      with: {
        images: true,
        owner: true
      }
    });

    return rows as ListingResponse[];
  }

  async getListing(id: number): Promise<ListingResponse | undefined> {
    const row = await db.query.listings.findFirst({
      where: eq(listings.id, id),
      with: {
        images: true,
        owner: true
      }
    });

    return row as ListingResponse | undefined;
  }

  async createListing(req: CreateListingRequest & { ownerId: string }): Promise<ListingResponse> {
    const { images, ownerId, ...listingData } = req;

    return await db.transaction(async (tx) => {
      const [newListing] = await tx.insert(listings).values({
        ...listingData,
        ownerId,
      }).returning();

      if (images && images.length > 0) {
        await tx.insert(listingImages).values(
          images.map((img) => ({
            listingId: newListing.id,
            url: img.url,
            isMain: img.isMain || false,
          }))
        );
      }

      const listing = await tx.query.listings.findFirst({
        where: eq(listings.id, newListing.id),
        with: {
          images: true,
          owner: true
        }
      });

      return listing as ListingResponse;
    });
  }

  async updateListing(id: number, req: UpdateListingRequest, ownerId: string): Promise<ListingResponse | undefined> {
    const listing = await this.getListing(id);
    if (!listing || listing.ownerId !== ownerId) return undefined;

    const { images, ...listingUpdates } = req;

    return await db.transaction(async (tx) => {
      if (Object.keys(listingUpdates).length > 0) {
        await tx.update(listings)
          .set({ ...listingUpdates, updatedAt: new Date() })
          .where(eq(listings.id, id));
      }

      if (images) {
        // Replace images strategy for simplicity: delete all and re-insert
        // In a real app, you might want to diff them
        await tx.delete(listingImages).where(eq(listingImages.listingId, id));
        if (images.length > 0) {
          await tx.insert(listingImages).values(
            images.map((img) => ({
              listingId: id,
              url: img.url,
              isMain: img.isMain || false,
            }))
          );
        }
      }

      const updatedListing = await tx.query.listings.findFirst({
        where: eq(listings.id, id),
        with: {
          images: true,
          owner: true
        }
      });

      return updatedListing as ListingResponse;
    });
  }

  async deleteListing(id: number, ownerId: string): Promise<boolean> {
    const listing = await this.getListing(id);
    if (!listing || listing.ownerId !== ownerId) return false;

    await db.transaction(async (tx) => {
      await tx.delete(listingImages).where(eq(listingImages.listingId, id));
      await tx.delete(listings).where(eq(listings.id, id));
    });

    return true;
  }

  async getUserListings(ownerId: string): Promise<ListingResponse[]> {
    const rows = await db.query.listings.findMany({
      where: eq(listings.ownerId, ownerId),
      orderBy: [desc(listings.createdAt)],
      with: {
        images: true,
        owner: true
      }
    });

    return rows as ListingResponse[];
  }
}

export const storage = new DatabaseStorage();
