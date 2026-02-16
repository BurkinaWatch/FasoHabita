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

      {/* Hero Section - Unique Asymmetric Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF9F6] text-grainy">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              L'immobilier d'exception
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 leading-[0.9] tracking-tighter">
              Le Faso <br />
              <span className="text-primary italic">À Votre Portée.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-lg leading-relaxed">
              Découvrez l'élégance de l'immobilier Burkinabè. Trouvez votre foyer idéal au pays des hommes intègres.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button className="h-16 px-10 bg-primary text-white rounded-2xl text-lg font-bold hover:bg-secondary transition-all duration-500 shadow-2xl shadow-primary/20">
                Trouver mon bien
              </Button>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-bold text-foreground uppercase tracking-widest text-sm">Voir la vidéo</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-[4/5] overflow-hidden blob-shape shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1590001158193-79cd23445694?q=80&w=2070&auto=format&fit=crop" 
                alt="Architecture Moderne Burkina" 
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 pattern-danfani rounded-full z-0" />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-primary rounded-2xl rotate-12 flex items-center justify-center shadow-xl">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-3 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="px-6 py-4 rounded-3xl hover:bg-muted/30 transition-colors cursor-pointer group">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Catégorie</p>
              <p className="font-bold text-foreground group-hover:text-primary transition-colors">Villa Moderne</p>
            </div>
            <div className="px-6 py-4 rounded-3xl hover:bg-muted/30 transition-colors cursor-pointer group border-l border-border/50">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Localisation</p>
              <p className="font-bold text-foreground group-hover:text-primary transition-colors">Ouaga 2000</p>
            </div>
            <div className="px-6 py-4 rounded-3xl hover:bg-muted/30 transition-colors cursor-pointer group border-l border-border/50">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Budget Max</p>
              <p className="font-bold text-foreground group-hover:text-primary transition-colors">500.000 FCFA</p>
            </div>
            <Button className="h-full rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20">
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </div>
        </motion.div>
      </div>

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
            <div className="asymmetric-grid">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {featuredListings.length === 0 && (
                <div className="col-span-12 text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-primary/20">
                  <p className="text-muted-foreground text-xl italic font-serif">Votre futur sanctuaire vous attend encore...</p>
                  <Link href="/create-listing">
                    <Button className="mt-8 rounded-2xl h-14 px-8" variant="outline">Devenez le premier annonceur</Button>
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
