import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateListing, useListing, useUpdateListing } from "@/hooks/use-listings";
import { useLocation, useRoute } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import { insertListingSchema } from "@shared/schema";

// Schema for the form, including images array
const formSchema = insertListingSchema.extend({
  images: z.array(z.object({
    url: z.string(),
    isMain: z.boolean().optional()
  })).min(1, "Au moins une image est requise"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateListing() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/edit-listing/:id");
  const isEdit = match && !!params?.id;
  const listingId = params?.id ? parseInt(params.id) : 0;

  const { data: existingListing, isLoading: isLoadingListing } = useListing(listingId);
  
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();

  const [uploadedImages, setUploadedImages] = useState<{ url: string; isMain: boolean }[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "location",
      category: "apartment",
      price: 0,
      currency: "FCFA",
      city: "",
      district: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      amenities: [],
      status: "disponible",
      images: [],
    },
  });

  // Load existing data if editing
  useEffect(() => {
    if (existingListing) {
      form.reset({
        ...existingListing,
        // Ensure arrays and nulls are handled
        amenities: existingListing.amenities || [],
        images: existingListing.images.map(img => ({ url: img.url, isMain: img.isMain ?? false })),
      });
      setUploadedImages(existingListing.images.map(img => ({ url: img.url, isMain: img.isMain ?? false })));
    }
  }, [existingListing, form]);

  // Sync state images with form
  useEffect(() => {
    form.setValue("images", uploadedImages);
  }, [uploadedImages, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: listingId, ...data });
        toast({ title: "Succès", description: "Annonce mise à jour avec succès" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Succès", description: "Annonce créée avec succès" });
      }
      setLocation("/dashboard");
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: error instanceof Error ? error.message : "Quelque chose s'est mal passé",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const res = await fetch("/api/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });
    const { uploadURL } = await res.json();
    return {
      method: "PUT" as const,
      url: uploadURL,
      headers: { "Content-Type": file.type },
    };
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingListing) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-border">
          <h1 className="text-3xl font-display font-bold text-primary mb-8">
            {isEdit ? "Modifier l'annonce" : "Publier une nouvelle annonce"}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Titre de l'annonce</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Villa de luxe à Ouaga 2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="location">À Louer</SelectItem>
                          <SelectItem value="vente">À Vendre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Appartement</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="land">Terrain</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Devise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FCFA">FCFA</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Ouagadougou" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartier</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Ouaga 2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chambres</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Douches</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez le bien..." className="h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images Section */}
              <div className="space-y-4">
                <FormLabel>Photos</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center">
                        <button
                          type="button"
                          onClick={() => setUploadedImages(prev => prev.map((img, i) => ({ ...img, isMain: i === idx })))}
                          className={`text-xs ${img.isMain ? 'text-secondary font-bold' : 'text-white'}`}
                        >
                          {img.isMain ? 'Photo principale' : 'Définir comme principale'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <ObjectUploader
                    maxNumberOfFiles={5}
                    onGetUploadParameters={async (file) => {
                       const params = await handleImageUpload(file as unknown as File);
                       setUploadedImages(prev => [...prev, { url: params.url.split('?')[0], isMain: prev.length === 0 }]);
                       return params;
                    }}
                    buttonClassName="w-full h-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 text-muted-foreground rounded-lg p-0"
                  >
                    <UploadCloud className="w-6 h-6 mb-2" />
                    <span className="text-xs">Ajouter Photo</span>
                  </ObjectUploader>
                </div>
                {form.formState.errors.images && (
                   <p className="text-sm font-medium text-destructive">{form.formState.errors.images.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setLocation("/dashboard")}>Annuler</Button>
                <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 min-w-[150px]">
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</>
                  ) : (
                    isEdit ? "Mettre à jour" : "Publier l'annonce"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
