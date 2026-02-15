import { useListings } from "@/hooks/use-listings";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Filter, X, Loader2 } from "lucide-react";

export default function Explore() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    minPrice: 0,
    maxPrice: 100000000,
    bedrooms: 0,
  });

  // Convert "all" to undefined for API
  const apiFilters = {
    search: filters.search || undefined,
    type: filters.type === "all" ? undefined : filters.type,
    category: filters.category === "all" ? undefined : filters.category,
    minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice < 100000000 ? filters.maxPrice : undefined,
    bedrooms: filters.bedrooms > 0 ? filters.bedrooms : undefined,
  };

  const { data: listings, isLoading } = useListings(apiFilters);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-primary">Recherche</h3>
        <Input 
          placeholder="Ville, quartier, titre..." 
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="bg-white"
        />
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-primary">Type</h3>
        <Select 
          value={filters.type} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="rent">À Louer</SelectItem>
            <SelectItem value="sale">À Vendre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-primary">Catégorie</h3>
        <Select 
          value={filters.category} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="land">Terrain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4 text-primary">Chambres: {filters.bedrooms > 0 ? filters.bedrooms + "+" : "Indifférent"}</h3>
        <Slider 
          value={[filters.bedrooms]} 
          max={10} 
          step={1} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, bedrooms: val[0] }))}
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setFilters({
          search: "",
          type: "all",
          category: "all",
          minPrice: 0,
          maxPrice: 100000000,
          bedrooms: 0,
        })}
      >
        Réinitialiser
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button onClick={() => setShowMobileFilters(!showMobileFilters)} className="w-full flex gap-2">
              <Filter className="w-4 h-4" /> Filtres
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`
            lg:w-1/4 lg:block
            ${showMobileFilters ? 'block' : 'hidden'}
          `}>
            <div className="bg-muted/30 p-6 rounded-2xl sticky top-24 border border-border">
              <FilterPanel />
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-display font-bold text-primary">
                {isLoading ? "Chargement..." : `${listings?.length || 0} Biens Trouvés`}
              </h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : listings?.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listings?.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
