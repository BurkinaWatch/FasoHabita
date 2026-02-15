import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Marque */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold">FH</span>
              </div>
              <span className="font-display font-bold text-xl">FasoHabita</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Votre partenaire de confiance pour l'immobilier haut de gamme au Burkina Faso. 
              Trouvez la maison de vos rêves ou un investissement rentable dès aujourd'hui.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/explore" className="hover:text-white transition-colors">Acheter un bien</Link></li>
              <li><Link href="/explore?type=rent" className="hover:text-white transition-colors">Louer un bien</Link></li>
              <li><Link href="/create-listing" className="hover:text-white transition-colors">Publier une annonce</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Contactez-nous</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Ouagadougou, Burkina Faso<br/>Avenue Kwame Nkrumah</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+226 25 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>hello@fasohabita.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Restez Connectés</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
            <p className="text-xs text-primary-foreground/50">
              © 2025 FasoHabita. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
