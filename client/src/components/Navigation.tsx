import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Menu, X, PlusCircle, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href} className={cn(
        "font-medium transition-colors hover:text-secondary relative py-1",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">FH</span>
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-primary tracking-tight">
              Faso<span className="text-secondary">Habita</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/explore">Explorer</NavLink>
            <NavLink href="/about">À propos</NavLink>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/create-listing">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Publier une annonce
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border border-border">
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.firstName || "Utilisateur"} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                    <div className="px-2 py-1.5 text-sm font-semibold text-primary">
                      {user.firstName ? `Salut, ${user.firstName}` : "Mon compte"}
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer rounded-lg">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/create-listing">
                      <DropdownMenuItem className="cursor-pointer rounded-lg">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Publier un bien
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive rounded-lg"
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20"
              >
                Se connecter
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-primary"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link href="/" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/explore" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
          <Link href="/about" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <div className="pt-4 border-t border-border">
            {user ? (
              <div className="space-y-3">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">My Dashboard</Button>
                </Link>
                <Link href="/create-listing" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-secondary text-secondary">Post Ad</Button>
                </Link>
                <Button variant="destructive" onClick={() => logout()} className="w-full">Logout</Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"} className="w-full bg-primary">Sign In</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
