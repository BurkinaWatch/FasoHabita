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
    <div className={cn("group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-border/30 shadow-sm hover:shadow-2xl transition-all duration-700 h-full relative", className)}>
      <div className="absolute top-6 right-6 z-10">
        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 -rotate-45" />
        </div>
      </div>
      
      {/* Image Container - Organic Mask */}
      <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-[2.5rem]">
        <img 
          src={imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
        
        {/* Type Badge - Floating */}
        <div className="absolute bottom-6 left-6">
          <span className={cn(
            "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-xl border border-white/20",
            listing.type === 'sale' 
              ? "bg-primary text-white" 
              : "bg-foreground text-white"
          )}>
            {listing.type === 'sale' ? 'Propriété' : 'Location'}
          </span>
        </div>
      </div>

      {/* Content - Typographic Focus */}
      <div className="p-8 pt-4 flex flex-col flex-grow">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <span className="w-4 h-[1px] bg-primary" />
          {listing.category}
        </p>

        <h3 className="text-3xl font-display font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center text-muted-foreground mb-8">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          <p className="text-sm font-bold tracking-tight">{listing.district}, {listing.city}</p>
        </div>

        {/* Features - Minimalist */}
        <div className="flex gap-8 mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold text-foreground">{listing.bedrooms}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ch.</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold text-foreground">{listing.area}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">m²</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
          <p className="text-2xl font-black text-foreground tracking-tighter">
            {listing.price.toLocaleString()} <span className="text-primary text-sm font-bold uppercase ml-1">{listing.currency}</span>
          </p>
          <Link href={`/listings/${listing.id}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:underline">Détails</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
