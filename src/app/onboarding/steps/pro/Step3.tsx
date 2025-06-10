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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  secteur: z.string().min(1, "Le secteur d'activité est requis."),
  centre: z.string().min(1, "Le centre d'intérêt est requis."),
  source: z.string().min(1, "Ce champ est requis."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer." }),
  }),
});

export default function ProStep3({
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
      centre: "",
      source: "",
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

      const allFormData = localStorage.getItem("onboardingFormData");
      if (!allFormData) {
        throw new Error("No form data found");
      }

      const formData = JSON.parse(allFormData);
      const referrerEmail = localStorage.getItem("referrerEmail");

      const mappedData = {
        firstName: formData.firstName ?? "",
        lastName: formData.lastName ?? "",
        email: formData.email ?? "",
        phone: formData.phone ?? "",
        city: formData.city ?? "",
        country: formData.country ?? "",
        role: "PROFESSIONAL",
        secteur: data?.secteur ?? "",
        centreInteret: data?.centre ?? "",
        referralSource: data?.source ?? "",
        referrerEmail: referrerEmail || null,
      };

      console.log("mapped data====>", mappedData);

      const response = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedData),
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
            Votre profil professionnel
          </h2>
          <p className="text-[#7E8B93] text-sm mb-6">
            Parlez-nous un peu de vous pour mieux adapter votre expérience sur
            Catchhub.
          </p>
          <div className="flex flex-col gap-6 mb-4">
            <FormField
              control={form.control}
              name="secteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d&apos;activité</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
                        )}
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                      >
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="TECHNOLOGIE">Technologie</SelectItem>
                        <SelectItem value="AGRO_HALIEUTIQUE">
                          Agro-Halieutique
                        </SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="SANTE">Santé</SelectItem>
                        <SelectItem value="COMMERCE">Commerce</SelectItem>
                        <SelectItem value="ENERGIE_DURABILITE">
                          Énergie & Durabilité
                        </SelectItem>
                        <SelectItem value="TRANSPORT">Transport</SelectItem>
                        <SelectItem value="INDUSTRIE">Industrie</SelectItem>
                        <SelectItem value="COMMERCE_DISTRIBUTION">
                          Commerce & Distribution
                        </SelectItem>
                        <SelectItem value="SERVICES_PROFESSIONNELS">
                          Services Professionnels
                        </SelectItem>
                        <SelectItem value="EDUCATION">Éducation</SelectItem>
                        <SelectItem value="TOURISME">Tourisme</SelectItem>
                        <SelectItem value="MEDIA_DIVERTISSEMENT">
                          Média & Divertissement
                        </SelectItem>
                        <SelectItem value="AUTRE">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="centre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centre d&apos;intérêt professionnel</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
                        )}
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                      >
                        <SelectValue placeholder="Sélectionnez vos centres d'intérêt" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="MENTORAT">Mentorat</SelectItem>
                        <SelectItem value="RESEAUTAGE">Réseautage</SelectItem>
                        <SelectItem value="EMPLOI">Emploi</SelectItem>
                        <SelectItem value="FORMATION">Formation</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Comment avez-vous entendu parler de nous?
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
                        )}
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
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
                    J&apos;accepte que mes données soient utilisées par Catchhub pour
                    créer mon compte et recevoir des communications liées à la
                    plateforme, conformément à la politique de confidentialité.
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
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
