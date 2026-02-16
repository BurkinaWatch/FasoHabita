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

    // Listing 3: Magasin (Boutique)
    const [boutique] = await db.insert(listings).values({
      title: "Boutique moderne à louer - Grand Marché",
      description: "Emplacement stratégique au cœur du grand marché. Idéal pour prêt-à-porter ou électronique. Vitrine sécurisée.",
      type: "location",
      category: "magasin",
      price: 150000,
      city: "Ouagadougou",
      district: "Centre-ville",
      bedrooms: 0,
      bathrooms: 0,
      area: 30,
      amenities: ["Vitrine", "Electricité", "Sécurisé"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: boutique.id, url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);

    // Listing 4: Kiosque
    const [kiosque] = await db.insert(listings).values({
      title: "Kiosque commercial - Zone 1",
      description: "Kiosque métallique bien situé pour petit commerce ou services rapides. Proche d'une zone de fort passage.",
      type: "location",
      category: "magasin",
      price: 25000,
      city: "Ouagadougou",
      district: "Dassasgho",
      bedrooms: 0,
      bathrooms: 0,
      area: 10,
      amenities: ["Métallique", "Passage"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: kiosque.id, url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);

    // Listing 5: Mini Villa
    const [miniVilla] = await db.insert(listings).values({
      title: "Mini Villa F3 en vente - Saaba",
      description: "Mini villa neuve comprenant 2 chambres, 1 salon, cuisine interne. Cour spacieuse, extensible.",
      type: "vente",
      category: "maison",
      price: 25000000,
      city: "Ouagadougou",
      district: "Saaba",
      bedrooms: 2,
      bathrooms: 1,
      area: 250,
      amenities: ["Cour spacieuse", "Neuf", "Extensible"],
      status: "disponible",
      ownerId: demoUser.id,
    }).returning();

    await db.insert(listingImages).values([
      { listingId: miniVilla.id, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070", isMain: true },
    ]);
  }

  console.log("Seeding completed successfully.");
}

seed().catch(console.error);
