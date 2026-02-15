import { z } from 'zod';
import { insertListingSchema, listings, listingImages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// Custom schema for creating a listing with images
const createListingWithImagesSchema = insertListingSchema.extend({
  images: z.array(z.object({
    url: z.string(),
    isMain: z.boolean().optional(),
  })).optional(),
});

export const api = {
  listings: {
    list: {
      method: 'GET' as const,
      path: '/api/listings' as const,
      input: z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        bedrooms: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // Returns ListingResponse[]
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/listings/:id' as const,
      responses: {
        200: z.custom<any>(), // Returns ListingResponse
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/listings' as const,
      input: createListingWithImagesSchema,
      responses: {
        201: z.custom<any>(), // Returns ListingResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/listings/:id' as const,
      input: createListingWithImagesSchema.partial(),
      responses: {
        200: z.custom<any>(), // Returns ListingResponse
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/listings/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    // Special route for "my listings" (dashboard)
    myListings: {
      method: 'GET' as const,
      path: '/api/me/listings' as const,
      responses: {
        200: z.array(z.custom<any>()), // Returns ListingResponse[]
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
