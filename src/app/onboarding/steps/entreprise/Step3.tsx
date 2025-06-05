import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const secteurOptions = [
  { value: "TECHNOLOGIE", label: "Technologie" },
  { value: "AGRO_HALIEUTIQUE", label: "Agro-Halieutique" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "FINANCE", label: "Finance" },
  { value: "SANTE", label: "Santé" },
  { value: "ÉNERGIE_DURABILITE", label: "Énergie & Durabilité" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "INDUSTRIE", label: "Industrie" },
  { value: "COMMERCE_DISTRIBUTION", label: "Commerce & Distribution" },
  { value: "SERVICES_PROFESSIONNELS", label: "Services Professionnels" },
  { value: "EDUCATION", label: "Éducation" },
  { value: "TOURISME", label: "Tourisme" },
  { value: "MEDIA_DIVERTISSEMENT", label: "Média & Divertissement" },
  { value: "AUTRE", label: "Autre" },
];

const formSchema = z.object({
  secteur: z.string().min(1, "Le secteur d'activité est requis."),
  secteurAutre: z.string().optional(),
  besoin: z.string().min(1, "Le besoin principal est requis."),
  site: z.string().optional(),
  decouverte: z.string().min(1, "Ce champ est requis."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer." }),
  }),
});

export default function EntrepriseStep3({
  onNext,
  defaultValues,
  submitRef,
  setCanProceed,
  setOnProceed,
}: {
  onNext: (data: any) => void;
  defaultValues?: any;
  submitRef?: React.Ref<HTMLButtonElement>;
  setCanProceed?: (can: boolean) => void;
  setOnProceed?: (cb: () => void) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      secteur: "",
      secteurAutre: "",
      besoin: "",
      site: "",
      decouverte: "",
      consent: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (setCanProceed) setCanProceed(form.formState.isValid);
    if (setOnProceed) setOnProceed(() => form.handleSubmit(handleSubmit));
  }, [form.formState.isValid, setCanProceed, setOnProceed]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);

      const storageKey = "onboardingEntrepriseFormData";
      const allFormData = localStorage.getItem(storageKey);

      if (!allFormData) {
        throw new Error("No form data found");
      }
      const formData = JSON.parse(allFormData);
      const referrerEmail = localStorage.getItem("referrerEmail");

      const response = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...data,
          profileType: "entreprise",
          referrerEmail: referrerEmail || null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      const result = await response.json();
      if (result.success) {
        onNext(data);
      } else {
        throw new Error(result.error || "Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#013959] mb-2">
            Votre profil entreprise
          </h2>
          <p className="text-[#7E8B93] text-sm mb-6">
            Partagez quelques informations pour mieux adapter la plateforme à
            votre structure.
          </p>
          <div className="flex flex-col gap-6 mb-4">
            <FormField
              control={form.control}
              name="secteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d'activité</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                        className="h-12 w-full"
                      >
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        {secteurOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {field.value === "AUTRE" && (
                    <Input
                      {...form.register("secteurAutre")}
                      className="h-12 w-full mt-2"
                      placeholder="Précisez votre secteur"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="besoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Besoin principal</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web d'entreprise.</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decouverte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Avez-Vous Découvert Catchhub ?</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                        className="h-12 w-full"
                      >
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="RESEAUX_SOCIAUX">
                          Réseaux sociaux
                        </SelectItem>
                        <SelectItem value="RECHERCHE_EN_LIGNE">
                          Recherche en ligne
                        </SelectItem>
                        <SelectItem value="RECOMMANDATION">
                          Recommandation d'un ami ou collègue
                        </SelectItem>
                        <SelectItem value="PUBLICITE">Publicité</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4">
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="consent"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="consent"
                    className="text-xs text-[#7E8B93] font-normal"
                  >
                    J'accepte Que Mes Données Soient Utilisées Par Catchhub Pour
                    Créer Mon Compte Et Recevoir Des Communications Liées À La
                    Plateforme, Conformément À La Politique De Confidentialité.
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription className="font-semibold text-xs mb-1 block mt-2">
              Fields With Are Required
            </FormDescription>
          </div>
        </div>
        <button
          ref={submitRef}
          type="button"
          className="hidden"
          aria-hidden="true"
        ></button>
      </form>
    </Form>
  );
}
