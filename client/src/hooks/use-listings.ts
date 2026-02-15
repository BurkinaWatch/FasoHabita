import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type errorSchemas } from "@shared/routes";
import { type ListingResponse, type CreateListingRequest, type UpdateListingRequest, type ListingsQueryParams } from "@shared/schema";
import { z } from "zod";

// ============================================
// HOOKS
// ============================================

// GET /api/listings
export function useListings(filters?: ListingsQueryParams) {
  // Construct query key that includes filters to trigger refetch
  const queryKey = [api.listings.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Manually build query string since fetch doesn't do it automatically for GET bodies usually
      const url = new URL(api.listings.list.path, window.location.origin);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch listings");
      
      // We accept 'any' here because Zod parsing large arrays in strict mode can be slow/strict
      // and we trust the backend type signature mostly. 
      // Ideally: return api.listings.list.responses[200].parse(await res.json());
      return await res.json() as ListingResponse[];
    },
  });
}

// GET /api/listings/:id
export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      return await res.json() as ListingResponse;
    },
    enabled: !!id,
  });
}

// GET /api/me/listings
export function useMyListings() {
  return useQuery({
    queryKey: [api.listings.myListings.path],
    queryFn: async () => {
      const res = await fetch(api.listings.myListings.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch my listings");
      return await res.json() as ListingResponse[];
    },
  });
}

// POST /api/listings
export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateListingRequest) => {
      // Validate with shared schema input
      const validated = api.listings.create.input.parse(data);
      
      const res = await fetch(api.listings.create.path, {
        method: api.listings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create listing");
      }
      return await res.json() as ListingResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.myListings.path] });
    },
  });
}

// PUT /api/listings/:id
export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateListingRequest) => {
      const validated = api.listings.update.input.parse(updates);
      const url = buildUrl(api.listings.update.path, { id });
      
      const res = await fetch(url, {
        method: api.listings.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update listing");
      }
      return await res.json() as ListingResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.get.path, variables.id] });
      queryClient.invalidateQueries({ queryKey: [api.listings.myListings.path] });
    },
  });
}

// DELETE /api/listings/:id
export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.listings.delete.path, { id });
      const res = await fetch(url, { 
        method: api.listings.delete.method,
        credentials: "include" 
      });

      if (!res.ok) throw new Error("Failed to delete listing");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.listings.myListings.path] });
    },
  });
}
