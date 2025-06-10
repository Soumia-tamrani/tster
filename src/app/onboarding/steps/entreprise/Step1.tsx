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
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import CountrySelector from "@/components/country-selector-pro";
import { isValidPhoneForCountry, updatedCountriesList } from "@/lib/form-utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const countries = updatedCountriesList.map((country) => ({
  name: country.name,
  code: country.code,
  prefix: country.prefix,
  flag: country.flag,
}));

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
  { value: "fondateur", label: "Fondateur / Co-fondateur" },
  { value: "dirigeant", label: "Dirigeant(e) / CEO / Président(e)" },
  { value: "rh", label: "Responsable RH / Recruteur" },
  { value: "commercial", label: "Responsable commercial / ventes" },
  { value: "marketing", label: "Responsable marketing / communication" },
  { value: "partenariats", label: "Responsable des partenariats" },
  {
    value: "produit",
    label: "Directeur / Responsable produit (Product Owner)",
  },
  { value: "technique", label: "Responsable technique / CTO / Lead Dev" },
  { value: "administratif", label: "Responsable administratif / financier" },
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
  const [selectedCountryCode, setSelectedCountryCode] = useState("MA");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState<Record<string, string>>({});

  const getDefaultFormValues = (providedDefaults?: any) => ({
    firstName: providedDefaults?.firstName || "",
    lastName: providedDefaults?.lastName || "",
    role: providedDefaults?.role || "",
    country: providedDefaults?.country || "",
    email: providedDefaults?.email || "",
    phone: providedDefaults?.phone || "",
    companyName: providedDefaults?.companyName || "",
    city: providedDefaults?.city || "",
    companySize: providedDefaults?.companySize || "",
    consent: providedDefaults?.consent || false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultFormValues(defaultValues),
    mode: "onChange",
  });

  const getCurrentCountryCode = (): string => {
    return selectedCountryCode || "MA";
  };

  const handlePhoneBlur = async () => {
    const phone = (form.getValues("phone") || "").trim();
    if (!phone) {
      setPhoneErrors({ phone: "Le numéro de téléphone est requis" });
      return false;
    }

    const validation = validatePhoneFormat(phone, selectedCountryCode);
    if (!validation.isValid) {
      setPhoneErrors({ phone: validation.error || "Format invalide" });
      return false;
    }

    setPhoneErrors({});
    return true;
  };

  const getPhoneExample = (): string => {
    const country = updatedCountriesList.find(
      (c) => c.code === selectedCountryCode
    );
    const limits = getPhoneLengthLimits(selectedCountryCode);

    let lengthInfo = "";
    if (limits.exactLength) {
      lengthInfo = ` (exactement ${limits.exactLength} chiffres)`;
    } else if (limits.min && limits.max) {
      lengthInfo = ` (${limits.min}-${limits.max} chiffres)`;
    }

    const countryName = country?.name || "ce pays";
    return `Format pour ${countryName}${lengthInfo}`;
  };

  const toE164Format = (phone: string): string => {
    const cleaned = cleanPhoneNumber(phone);
    if (!cleaned) return "";

    if (phone.startsWith("+")) {
      return "+" + cleaned;
    }

    return cleaned;
  };

  const handlePhoneChange = (value?: string) => {
    const cleanValue = value ? toE164Format(value) : "";
    form.setValue("phone", cleanValue);

    if (cleanValue && cleanValue.length >= 3) {
      const validation = validatePhoneFormat(cleanValue, selectedCountryCode);
      if (!validation.isValid) {
        setPhoneErrors({ phone: validation.error || "Format invalide" });
      } else {
        setPhoneErrors({});
      }
    } else {
      setPhoneErrors({});
    }
  };

  const handleCountryChange = (countryName: string) => {
    const selected = countries.find((c) => c.name === countryName);
    if (!selected) return;

    setSelectedCountryCode(selected.code);
    form.setValue("country", selected.name);
    setPhoneErrors({});

    const currentPhone = form.getValues("phone");
    if (currentPhone) {
      setTimeout(() => {
        const validation = validatePhoneFormat(currentPhone, selected.code);
        if (!validation.isValid) {
          setPhoneErrors({ phone: validation.error || "Format invalide" });
        }
      }, 0);
    }
  };

  const getPhoneLengthLimits = (
    countryCode: string
  ): { exactLength?: number; min?: number; max?: number } => {
    const limits: Record<
      string,
      { exactLength?: number; min?: number; max?: number }
    > = {
      MA: { exactLength: 12 },
      FR: { exactLength: 11 },
      CA: { exactLength: 11 },
      US: { exactLength: 11 },
      ES: { exactLength: 11 },
      IT: { exactLength: 12 },
      BE: { exactLength: 11 },
      CH: { exactLength: 11 },
      DZ: { exactLength: 12 },
      TN: { exactLength: 11 },
      SN: { exactLength: 12 },
      CI: { exactLength: 13 },
      CM: { exactLength: 12 },
      GB: { min: 13, max: 14 },
      DE: { min: 12, max: 15 },
    };
    return limits[countryCode] || { min: 10, max: 15 };
  };

  const cleanPhoneNumber = (phone: string): string => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const validatePhoneFormat = (
    phone: string,
    countryCode: string
  ): { isValid: boolean; error?: string } => {
    if (!phone) {
      return { isValid: false, error: "Le numéro de téléphone est requis" };
    }

    const country = updatedCountriesList.find((c) => c.code === countryCode);
    if (!country) {
      return { isValid: false, error: "Pays non reconnu" };
    }

    const cleanPhone = cleanPhoneNumber(phone);
    const limits = getPhoneLengthLimits(countryCode);

    if (limits.exactLength) {
      if (cleanPhone.length !== limits.exactLength) {
        return { isValid: false, error: "Format invalide" };
      }
    } else if (limits.min && limits.max) {
      if (cleanPhone.length < limits.min || cleanPhone.length > limits.max) {
        return { isValid: false, error: "Format invalide" };
      }
    }

    let phoneToValidate = phone;

    if (!phoneToValidate.startsWith(country.prefix)) {
      if (phoneToValidate.startsWith("0")) {
        phoneToValidate = country.prefix + phoneToValidate.substring(1);
      } else if (phoneToValidate.startsWith("+")) {
        if (!phoneToValidate.startsWith(country.prefix)) {
          return {
            isValid: false,
            error: "Format invalide pour " + country.name,
          };
        }
      } else {
        phoneToValidate = country.prefix + phoneToValidate;
      }
    }

    const isValid = isValidPhoneForCountry(phoneToValidate, countryCode);

    if (!isValid) {
      return { isValid: false, error: "Format invalide pour " + country.name };
    }

    return { isValid: true };
  };

  useEffect(() => {
    const defaultCountry = countries.find((c) => c.name === "Maroc");
    if (defaultCountry) {
      setSelectedCountryCode(defaultCountry.code);
      form.setValue("country", defaultCountry.name);
    }
  }, []);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (setCanProceed) setCanProceed(form.formState.isValid);
    if (setOnProceed) setOnProceed(() => form.handleSubmit(handleSubmit));
  }, [form.formState.isValid, setCanProceed, setOnProceed]);

  const handleSubmit = async (data: any) => {
    try {
      form.clearErrors("email");
      form.clearErrors("phone");

      // Check email uniqueness
      const emailResponse = await fetch("/api/email/check-unique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "email", value: data.email }),
      });

      if (!emailResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const emailResult = await emailResponse.json();
      if (!emailResult.isUnique) {
        form.setError("email", {
          type: "manual",
          message: emailResult.message,
        });
        return;
      }

      // Check phone uniqueness
      const phoneResponse = await fetch("/api/email/check-unique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "phone", value: data.phone }),
      });

      if (!phoneResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const phoneResult = await phoneResponse.json();
      if (!phoneResult.isUnique) {
        form.setError("phone", {
          type: "manual",
          message: phoneResult.message,
        });
        return;
      }

      localStorage.setItem(
        "onboardingEntrepriseFormData",
        JSON.stringify({ ...(defaultValues || {}), ...data })
      );
      localStorage.setItem("onboardingEntrepriseCurrentStep", "0");
      await sendVerificationEmail(data.email);
      onNext(data);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      form.setError("email", {
        type: "manual",
        message: "Une erreur est survenue lors de la vérification.",
      });
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch("/api/email/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        console.log("Erreur lors de l'envoi de l'email");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col max-w-2xl mx-auto mt-7 gap-4 ">
          <h2 className="text-2xl font-semibold text-[#013959] mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "22px" }}>
            Informations entreprise
          </h2>
          <p className="text-[#7E8B93] text-sm mb-6">
            Merci de compléter ces informations pour poursuivre votre
            inscription.
            <br />
            Tous les champs marqués par {" "}
            <span className="text-[#1CD5F5]"> * </span> sont obligatoires
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-7">
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
                    Votre rôle dans l&apos;entreprise
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
                    <CountrySelector
                      value={field.value}
                      onChange={handleCountryChange}
                      defaultValue="Maroc"
                      onPrefixChange={() => {}}
                      error={form.formState.errors.country?.message}
                      countries={countries}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1 min-w-[250px]">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email professionnel{" "}
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
            </div>
            <div className="flex-1 min-w-[250px]">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Téléphone <span className="text-[#1CD5F5]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        className={cn(
                          "rounded-lg bg-white h-12 border relative pl-3",
                          phoneErrors.phone || form.formState.errors.phone
                            ? "border-red-500"
                            : "border-gray-300 focus-within:border-blue-500"
                        )}
                      >
                        <PhoneInput
                          defaultCountry={getCurrentCountryCode() as any}
                          value={field.value || undefined}
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          className="w-full h-full border-none focus:outline-none focus:ring-0"
                          international
                          countryCallingCodeEditable={false}
                          placeholder="Entrez votre numéro de téléphone"
                        />
                        {isCheckingPhone && (
                          <div className="absolute right-3 top-3 pointer-events-none">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {phoneErrors.phone || form.formState.errors.phone ? (
                      <p className="text-red-500 text-xs flex items-center mt-1 animate-in fade-in">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {phoneErrors.phone ||
                          form.formState.errors.phone?.message}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {getPhoneExample()}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom de l&apos;entreprise
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
                    Taille de l&apos;entreprise{" "}
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
                        <SelectContent>
                          <SelectItem value="PETITE_ENTREPRISE">
                            Petite entreprise (1 à 10)
                          </SelectItem>
                          <SelectItem value="ENTREPRISE_CROISSANCE">
                            Entreprise en croissance (11 à 50)
                          </SelectItem>
                          <SelectItem value="MOYENNE_ENTREPRISE">
                            Moyenne entreprise (PME) (51 à 250)
                          </SelectItem>
                          <SelectItem value="GRANDE_ENTREPRISE">
                            Grande entreprise (251 et plus)
                          </SelectItem>
                        </SelectContent>
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
