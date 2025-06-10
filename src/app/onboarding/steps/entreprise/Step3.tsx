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

const secteurOptions = [
  { value: "TECHNOLOGIE", label: "Technologie" },
  { value: "AGRO_HALIEUTIQUE", label: "Agro-Halieutique" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "FINANCE", label: "Finance" },
  { value: "SANTE", label: "Santé" },
  { value: "ENERGIE_DURABILITE", label: "Énergie & Durabilité" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "INDUSTRIE", label: "Industrie" },
  { value: "COMMERCE_DISTRIBUTION", label: "Commerce & Distribution" },
  { value: "SERVICES_PROFESSIONNELS", label: "Services Professionnels" },
  { value: "EDUCATION", label: "Éducation" },
  { value: "TOURISME", label: "Tourisme" },
  { value: "MEDIA_DIVERTISSEMENT", label: "Média & Divertissement" },
  { value: "AUTRE", label: "Autre" },
];

const besoinOptions = [
  "Présenter ma marque et mes activités",
  "Développer mon réseau B2B (partenariats, clients, collaborations)",
  "Attirer des talents qualifiés pour rejoindre mon entreprise",
  "Accéder à des insights sectoriels (veille, tendances, comparatifs)",
  "Accéder à un vivier de freelances qualifiés pour mes projets",
  "Rechercher des intervenants, ou formateurs",
  "Échanger avec d'autres PME ou acteurs de mon secteur",
  "Être guidé dans ma transformation numérique ou stratégique",
  "Je ne sais pas encore / Découvrir la plateforme",
];

const formSchema = z.object({
  secteur: z.string().min(1, "Le secteur d'activité est requis."),
  secteurAutre: z.string().optional(),
  besoin: z
    .array(z.string())
    .min(1, "Au moins un besoin doit être sélectionné.")
    .max(3, "Maximum 3 besoins peuvent être sélectionnés."),
  site: z
    .string()
    .min(1, "Le site web est requis.")
    .url("Veuillez entrer une URL valide (ex: www.xyz.com)")
    .refine((url) => {
      try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
      } catch {
        return false;
      }
    }, "Format d'URL invalide"),
  referralSource: z.string().min(1, "Ce champ est requis."),
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
      besoin: [],
      site: "",
      referralSource: "",
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

      console.log("Step3 form data:", data);
      console.log("Stored form data:", formData);

      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        companyName: formData.companyName,
        companySize: formData.companySize,
        roleInCompany: formData.role,

        secteur: data.secteur,
        besoin: data.besoin,
        site: data.site,
        referralSource: data.referralSource,

        role: "ENTREPRISE",
        referrerEmail: referrerEmail || null,
        profileType: "entreprise",
        consent: data.consent,
      };

      if (data.secteur === "AUTRE" && data.secteurAutre) {
        payload.secteurAutre = data.secteurAutre;
      }

      console.log("Final payload:", payload);

      const response = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <div className="max-w-2xl mx-auto mt-6">
          <h2 className="text-2xl font-semibold text-[#013959] mb-3">
            Votre profil entreprise
          </h2>
          <p className="text-[#7E8B93] text-sm mb-8">
            Partagez quelques informations pour mieux adapter la plateforme à votre structure.
          </p>
          <div className="flex flex-col gap-8 mb-4">
            <FormField
              control={form.control}
              name="secteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d&apos;activité</FormLabel>
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
                <FormItem className="space-y-4">
                  <FormLabel>Besoin principal</FormLabel>
                  <FormControl>
                    <div className="space-y-4 ">
                      {besoinOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option}
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                if (currentValue.length < 3) {
                                  field.onChange([...currentValue, option]);
                                }
                              } else {
                                field.onChange(
                                  currentValue.filter(
                                    (value) => value !== option
                                  )
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={option}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
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
                  <FormLabel>Site web d&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value && !value.startsWith("http")) {
                          value = `https://${value}`;
                        }
                        field.onChange(value);
                      }}
                      placeholder="www.xyz.com"
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormDescription>Format attendu: www.xyz.com</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment avez-vous découvert Catchhub ?</FormLabel>
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
                          Moteur de recherche
                        </SelectItem>
                        <SelectItem value="RECOMMANDATION">
                          Recommandation
                        </SelectItem>
                        <SelectItem value="PUBLICITE">Événement</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          <div className="mb-4 mt-9 ">
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
                    J&apos;accepte que mes données soient utilisées par Catchhub
                    pour créer mon compte et recevoir des communications liées à
                    la plateforme, conformément à la politique de
                    confidentialité.
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <button
          ref={submitRef}
          type="submit"
          className="hidden"
          aria-hidden="true"
        ></button>
      </form>
    </Form>
  );
}
