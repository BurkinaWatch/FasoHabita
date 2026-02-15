import { Link } from "wouter";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, ArrowRight, Home as HomeIcon, Key, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: listings, isLoading } = useListings();
  const featuredListings = listings?.slice(0, 3) || [];

  const [searchParams, setSearchParams] = useState({
    type: "rent",
    location: "",
    category: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.type) params.append("type", searchParams.type);
    if (searchParams.location) params.append("city", searchParams.location);
    if (searchParams.category) params.append("category", searchParams.category);
    window.location.href = `/explore?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-0 lg:h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           {/* Luxury African Villa */}
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Trouvez votre <span className="text-secondary-foreground italic font-serif">Sanctuaire Idéal</span> au Burkina Faso
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-light">
              Découvrez des villas exclusives, des appartements modernes et des terrains de choix à Ouagadougou et au-delà.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl bg-white rounded-2xl p-4 md:p-6 shadow-2xl shadow-black/20"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2 text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ml-1">Je cherche</label>
                <Select 
                  value={searchParams.type} 
                  onValueChange={(val) => setSearchParams(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="h-12 border-muted bg-muted/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">À Louer</SelectItem>
                    <SelectItem value="sale">À Acheter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2 text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ml-1">Localisation</label>
                <Input 
                  placeholder="Ville, Quartier..." 
                  className="h-12 border-muted bg-muted/30"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="flex-1 space-y-2 text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ml-1">Catégorie</label>
                <Select
                  value={searchParams.category}
                  onValueChange={(val) => setSearchParams(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="h-12 border-muted bg-muted/30">
                    <SelectValue placeholder="Toutes catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white w-full md:w-auto text-lg"
                >
                  Rechercher
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked selection of the finest properties.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-secondary">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {featuredListings.length === 0 && (
                <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground text-lg">No listings found. Be the first to post!</p>
                  <Link href="/create-listing">
                    <Button className="mt-4" variant="outline">Create Listing</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/explore">
              <Button variant="outline" className="w-full">View All Properties</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Why Choose FasoHabita?</h2>
            <p className="text-muted-foreground">We connect buyers, sellers, and renters with transparency and trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-muted/20 border border-border/50 text-center hover:bg-muted/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HomeIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Wide Selection</h3>
              <p className="text-muted-foreground">From luxury villas to affordable studios, find properties that match your lifestyle.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-muted/20 border border-border/50 text-center hover:bg-muted/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Trusted Agents</h3>
              <p className="text-muted-foreground">We verify listings to ensure you deal with legitimate owners and professionals.</p>
            </div>

            <div className="p-8 rounded-2xl bg-muted/20 border border-border/50 text-center hover:bg-muted/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Easy Process</h3>
              <p className="text-muted-foreground">User-friendly platform designed to make buying, selling, and renting seamless.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
