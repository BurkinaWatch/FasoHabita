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
    <div className={cn("group flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 card-hover h-full", className)}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm",
            listing.type === 'sale' 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground"
          )}>
            {listing.type === 'sale' ? 'À Vendre' : 'À Louer'}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-primary shadow-lg">
            {listing.price.toLocaleString()} {listing.currency}
            {listing.type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mois</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">{listing.category}</p>
        </div>

        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <p className="text-sm line-clamp-1">{listing.district}, {listing.city}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-border mt-auto">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <BedDouble className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-medium">{listing.bedrooms} Ch.</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <Bath className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-medium">{listing.bathrooms} Dou.</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50">
            <Square className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-medium">{listing.area} m²</span>
          </div>
        </div>

        <Link href={`/listings/${listing.id}`} className="mt-4 w-full">
          <button className="w-full py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            Voir les détails
            <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
