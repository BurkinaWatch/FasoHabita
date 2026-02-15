import { useParams, Link } from "wouter";
import { useListing } from "@/hooks/use-listings";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, BedDouble, Bath, Square, Calendar, CheckCircle, Phone, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ListingDetails() {
  const { id } = useParams();
  const listingId = Number(id);
  const { data: listing, isLoading, error } = useListing(listingId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[500px] bg-muted animate-pulse rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-40 bg-muted animate-pulse rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Listing not found</h1>
          <Link href="/explore"><Button>Browse Listings</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* Placeholder image (Architecture/Real Estate style from Unsplash) */
  const placeholderImage = "https://images.unsplash.com/photo-1600596542815-2a4d04774c71?q=80&w=1000&auto=format&fit=crop";
  const images = listing.images.length > 0 ? listing.images : [{ id: 0, url: placeholderImage, isMain: true }];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                  listing.type === 'sale' 
                    ? "bg-primary text-white" 
                    : "bg-secondary text-white"
                )}>
                  {listing.type === 'sale' ? 'À Vendre' : 'À Louer'}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase">{listing.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">{listing.title}</h1>
              <div className="flex items-center text-muted-foreground mt-2">
                <MapPin className="w-5 h-5 mr-2 text-secondary" />
                <span className="text-lg">{listing.district}, {listing.city}</span>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <div className="text-3xl font-bold text-primary">
                {listing.price.toLocaleString()} {listing.currency}
                {listing.type === 'rent' && <span className="text-lg font-normal text-muted-foreground">/mois</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Publié le {new Date(listing.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-muted relative group">
                <img 
                  src={images[activeImageIndex].url} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button 
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        activeImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30">
                <BedDouble className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-xl text-primary">{listing.bedrooms}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Chambres</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30">
                <Bath className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-xl text-primary">{listing.bathrooms}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Douches</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30">
                <Square className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-xl text-primary">{listing.area}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Mètres Carrés</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-display font-bold text-primary mb-4">Description</h2>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p className="whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-primary mb-4">Équipements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {listing.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="font-medium text-primary">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            {/* Owner Card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-lg sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                  {listing.owner?.profileImageUrl ? (
                    <img src={listing.owner.profileImageUrl} alt="Propriétaire" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Publié par</p>
                  <h3 className="text-xl font-bold text-primary">
                    {listing.owner?.firstName ? `${listing.owner.firstName} ${listing.owner.lastName || ''}` : "Agent FasoHabita"}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90 gap-2">
                  <Phone className="w-5 h-5" />
                  Appeler l'agent
                </Button>
                
                <Button variant="outline" className="w-full h-12 text-lg border-secondary text-secondary hover:bg-secondary/10 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Veuillez mentionner <strong className="text-primary">FasoHabita</strong> lors de votre contact.
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-2xl overflow-hidden h-[300px] relative flex items-center justify-center border border-border">
              <div className="text-center p-6">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground font-medium">Vue Carte</p>
                <p className="text-sm text-muted-foreground/70">{listing.district}, {listing.city}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
