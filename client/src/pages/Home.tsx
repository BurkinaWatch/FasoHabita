import { Link } from "wouter";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, ArrowRight, Home as HomeIcon, Key, Building2, MapPin } from "lucide-react";
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
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
              L'immobilier <br />
              <span className="text-primary italic">Réinventé</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-xl mx-auto">
              Votre porte d'entrée vers les plus beaux biens immobiliers au cœur du Burkina Faso.
            </p>
          </motion.div>

          {/* Search Card - Floating Modern Design */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl glass-panel p-2 rounded-3xl shadow-2xl"
          >
            <div className="bg-white/90 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase text-primary tracking-[0.2em] ml-1">Type de bien</label>
                <Select 
                  value={searchParams.type} 
                  onValueChange={(val) => setSearchParams(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="h-14 border-none bg-muted/20 rounded-xl focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="rent">À Louer</SelectItem>
                    <SelectItem value="sale">À Acheter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 w-full space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase text-primary tracking-[0.2em] ml-1">Où cherchez-vous ?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Ville, Quartier..." 
                    className="h-14 pl-12 border-none bg-muted/20 rounded-xl focus:ring-2 focus:ring-primary/20"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex-1 w-full space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase text-primary tracking-[0.2em] ml-1">Catégorie</label>
                <Select
                  value={searchParams.category}
                  onValueChange={(val) => setSearchParams(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="h-14 border-none bg-muted/20 rounded-xl focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Toutes catégories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSearch}
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white w-full md:w-auto text-lg rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                Explorer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties with Pattern Decor */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 pattern-danfani opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                Sélection Premium
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">Biens <span className="text-primary italic">Incontournables</span></h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="hidden md:flex gap-3 text-foreground font-bold hover:text-primary group">
                Tout voir <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[500px] bg-muted animate-pulse rounded-[2.5rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {featuredListings.length === 0 && (
                <div className="col-span-3 text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-border/50">
                  <p className="text-muted-foreground text-xl">Aucune annonce trouvée pour le moment.</p>
                  <Link href="/create-listing">
                    <Button className="mt-6 rounded-xl" variant="outline">Publier la première annonce</Button>
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
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 pattern-danfani opacity-30" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Pourquoi <span className="text-primary italic">FasoHabita</span> ?</h2>
            <p className="text-muted-foreground text-lg">Nous connectons acheteurs et vendeurs avec une transparence totale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <HomeIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Large Sélection</h3>
              <p className="text-muted-foreground leading-relaxed">Villas de luxe ou studios abordables, trouvez le bien qui vous ressemble.</p>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Agents de Confiance</h3>
              <p className="text-muted-foreground leading-relaxed">Nous vérifions chaque annonce pour garantir votre sérénité totale.</p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/50 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <Key className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Processus Simple</h3>
              <p className="text-muted-foreground leading-relaxed">Une plateforme intuitive pour acheter ou louer en quelques clics.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
