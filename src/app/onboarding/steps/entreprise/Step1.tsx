import { useEffect } from "react";
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
import { CountryCombobox } from "@/components/CountryCombobox";
import { countries } from "../pro/Step1";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  role: z.string().min(1, "Le rôle est requis."),
  country: z.string().min(1, "Le pays est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().min(1, "Le téléphone est requis."),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis."),
  city: z.string().min(1, "La ville est requise."),
  companySize: z.string().min(1, "La taille de l'entreprise est requise."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer." }),
  }),
});

const roleOptions = [
  { value: "ceo", label: "CEO" },
  { value: "hr", label: "RH" },
  { value: "manager", label: "Manager" },
  { value: "autre", label: "Autre" },
];
const countryOptions = [
  { value: "maroc", label: "Maroc" },
  { value: "france", label: "France" },
  { value: "espagne", label: "Espagne" },
];
const cityOptions = [
  { value: "casablanca", label: "Casablanca" },
  { value: "rabat", label: "Rabat" },
  { value: "marrakech", label: "Marrakech" },
];
const companySizeOptions = [
  { value: "pme", label: "PME" },
  { value: "startup", label: "Startup" },
  { value: "grande_entreprise", label: "Grande entreprise" },
];

export default function EntrepriseStep1({
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      role: "",
      country: "",
      email: "",
      phone: "",
      companyName: "",
      city: "",
      companySize: "",
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

  const handleSubmit = (data: any) => {
    // Save to localStorage
    localStorage.setItem(
      "onboardingEntrepriseFormData",
      JSON.stringify({ ...(defaultValues || {}), ...data })
    );
    localStorage.setItem("onboardingEntrepriseCurrentStep", "0");
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#013959] mb-2">
            Informations entreprise
          </h2>
          <p className="text-[#7E8B93] text-sm mb-6">
            Merci de compléter ces informations pour poursuivre votre
            inscription.
            <br />
            Tous les champs marqués d'un{" "}
            <span className="text-[#1CD5F5]">*</span> sont obligatoires
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prénom <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="firstName" className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="lastName" className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Votre Rôle Dans L'entreprise{" "}
                    <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
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
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pays <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <CountryCombobox
                      value={field.value}
                      onChange={field.onChange}
                      countries={countries}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Professionnel{" "}
                    <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Téléphone De L'entreprise{" "}
                    <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="phone" className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom De L'entreprise{" "}
                    <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="companyName" className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ville <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="city" className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Taille De L'entreprise{" "}
                    <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                        className=" w-full"
                      >
                        <SelectValue placeholder="Taille de l'entreprise" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
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
          type="submit"
          className="hidden"
          aria-hidden="true"
        ></button>
      </form>
    </Form>
  );
}
