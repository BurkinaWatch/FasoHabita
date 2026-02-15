import { useMyListings, useDeleteListing } from "@/hooks/use-listings";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle, Edit2, Trash2, Loader2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: listings, isLoading: listingsLoading } = useMyListings();
  const deleteMutation = useDeleteListing();
  const { toast } = useToast();

  if (authLoading || listingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Listing deleted" });
    } catch (error) {
      toast({ title: "Error deleting listing", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">Tableau de Bord</h1>
            <p className="text-muted-foreground">Gérez vos propriétés et vos annonces.</p>
          </div>
          <Link href="/create-listing">
            <Button className="bg-secondary hover:bg-secondary/90 gap-2">
              <PlusCircle className="w-4 h-4" /> Publier un bien
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-primary">Propriété</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-primary">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-primary">Prix</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-primary">Stats</th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      Vous n'avez pas encore publié d'annonces.
                    </td>
                  </tr>
                ) : (
                  listings?.map((listing) => (
                    <tr key={listing.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {listing.images[0] && (
                              <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">{listing.title}</h4>
                            <p className="text-sm text-muted-foreground">{listing.district}, {listing.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${listing.status === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {listing.price.toLocaleString()} {listing.currency}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {/* Placeholder stats */}
                        0 vues
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/listings/${listing.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-listing/${listing.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'annonce</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(listing.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
