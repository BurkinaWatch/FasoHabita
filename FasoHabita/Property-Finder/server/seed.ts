import { db } from "./db";
import { users, listings, listingImages } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database in French...");

  // Supprimer les anciennes données pour le re-seed propre
  await db.delete(listingImages);
  await db.delete(listings);

  // 1. Create a demo user if none exists
  let demoUser = await db.query.users.findFirst({
    where: eq(users.email, "contact@fasohabita.bf")
  });

  if (!demoUser) {
    const [user] = await db.insert(users).values({
      email: "contact@fasohabita.bf",
      firstName: "Faso",
      lastName: "Habita",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faso",
    }).returning();
    demoUser = user;
  }

  if (demoUser) {
    // Listing 1: Villa
    const [villa] = await db.insert(listings).values({
      title: "Splendide Villa F5 - Ouaga 2000",
      description: "Villa de luxe située dans la zone A de Ouaga 2000. 4 chambres, salon spacieux, piscine et garage pour 2 véhicules. Sécurité 24h/24.",
      type: "vente",
      category: "villa",
      price: 175000000,
      city: "Ouagadougou",
      district: "Ouaga 2000",
      bedrooms: 4,
      bathrooms: 3,
      area: 400,
      amenities: ["Piscine", "Garage", "Jardin", "Climatisation", "Clôture barbelée"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: villa.id, url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);

    // Listing 2: Cour commune
    const [cour] = await db.insert(listings).values({
      title: "Chambre-Salon à louer - Karpala",
      description: "Entrée-couché propre dans une cour commune calme. Eau et électricité disponibles. Proche du goudron.",
      type: "location",
      category: "cour_commune",
      price: 35000,
      city: "Ouagadougou",
      district: "Karpala",
      bedrooms: 1,
      bathrooms: 1,
      area: 25,
      amenities: ["Ventilé", "Carrelé"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: cour.id, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);

    // Listing 3: Magasin
    const [magasin] = await db.insert(listings).values({
      title: "Grand Magasin de stockage - Zone Industrielle",
      description: "Espace de 500m2 idéal pour stockage de marchandises. Accès facile pour gros camions.",
      type: "location",
      category: "magasin",
      price: 500000,
      city: "Bobo-Dioulasso",
      district: "Zone Industrielle",
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      amenities: ["Sécurisé", "Toiture haute"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: magasin.id, url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);
  }

  console.log("Seeding completed successfully.");
}

seed().catch(console.error);
