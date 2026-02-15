import { Link } from "wouter";
import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";
import type { ListingResponse } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: ListingResponse;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  // Use first image or a placeholder
  const mainImage = listing.images.find(img => img.isMain) || listing.images[0];
  
  // Placeholder image (Architecture/Real Estate style from Unsplash)
  /* Modern white villa architecture */
  const placeholderImage = "https://images.unsplash.com/photo-1600596542815-2a4d04774c71?q=80&w=1000&auto=format&fit=crop";
  const imageUrl = mainImage?.url || placeholderImage;

  return (
    <div className={cn("group flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/50 card-hover h-full", className)}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[1.8rem]">
        <img 
          src={imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md",
            listing.type === 'sale' 
              ? "bg-primary/90 text-white" 
              : "bg-black/40 text-white"
          )}>
            {listing.type === 'sale' ? 'Vente' : 'Location'}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-2xl font-bold text-foreground shadow-xl border border-white/50">
            {listing.price.toLocaleString()} <span className="text-primary">{listing.currency}</span>
            {listing.type === 'rent' && <span className="text-xs font-medium text-muted-foreground">/mois</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{listing.category}</p>
        </div>

        <h3 className="text-2xl font-display font-bold text-foreground mb-2 line-clamp-1">
          {listing.title}
        </h3>

        <div className="flex items-center text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 mr-1.5 text-primary flex-shrink-0" />
          <p className="text-sm font-medium">{listing.district}, {listing.city}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 py-5 border-y border-border/50 mt-auto">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold">{listing.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold">{listing.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold">{listing.area}m²</span>
          </div>
        </div>

        <Link href={`/listings/${listing.id}`} className="mt-6 w-full">
          <button className="w-full py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-xl shadow-foreground/10 hover:shadow-primary/30 active:scale-95">
            Détails du bien
            <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-500" />
          </button>
        </Link>
      </div>
    </div>
  );
}
