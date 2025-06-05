"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import "react-phone-input-2/lib/style.css";
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
  firstName: z.string().min(3, "Le prénom est requis."),
  lastName: z.string().min(3, "Le nom est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().min(1, "Le téléphone est requis."),
  country: z.string().min(1, "Le pays est requis."),
  city: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer." }),
  }),
});

export default function ProStep1({
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
    email: providedDefaults?.email || "",
    phone: "",
    country: providedDefaults?.country || "",
    city: providedDefaults?.city || "",
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
  }, [form.formState.isValid, setCanProceed, setOnProceed, form]);

  const handleSubmit = async (data: any) => {
    try {
      form.clearErrors("email");

      const response = await fetch("/api/email/check-unique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "email", value: data.email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (!result.isUnique) {
        console.log("Setting email error:", result.message);
        form.setError("email", {
          type: "manual",
          message: result.message,
        });
        return;
      }

      const referrerEmail = localStorage.getItem("referrerEmail");
      const referrerType = localStorage.getItem("referrerType");

      localStorage.setItem(
        "onboardingFormData",
        JSON.stringify({
          ...(defaultValues || {}),
          ...data,
          referrerEmail: referrerEmail || null,
          referrerType: referrerType || null,
        })
      );
      localStorage.setItem("onboardingCurrentStep", "0");
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
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      sessionStorage.setItem(`verification_${email}`, verificationToken);

      const emailContent = {
        to: email,
        subject: "Vérification de votre adresse email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Vérification de votre adresse email</h2>
            <p>Merci de votre inscription ! Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${verificationToken}
            </div>
            <p>Ce code est valable pendant 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
          </div>
        `,
      };
      const response = await fetch("/api/email/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      });
      if (!response.ok) throw new Error("Erreur lors de l'envoi de l'email");
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#013959] mb-2">
            Informations personnelles
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
                    <Input className="h-12" {...field} id="firstName" />
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
                    <Input className="h-12" {...field} id="lastName" />
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
                    Email <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12"
                      {...field}
                      id="email"
                      type="email"
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear email errors when user starts typing
                        if (form.formState.errors.email) {
                          form.clearErrors("email");
                        }
                      }}
                    />
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
                      onPrefixChange={() => {}}
                      error={form.formState.errors.country?.message}
                      countries={countries}
                    />
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
                    <Input className="h-12" {...field} id="city" />
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
                    Téléphone <span className="text-[#1CD5F5]">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "rounded-lg bg-white h-12 border relative",
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
                  <FormMessage />
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
                    J'accepte que mes données soient utilisées par Catchhub pour
                    créer mon compte et recevoir des communications liées à la
                    plateforme, conformément à la politique de confidentialité.
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
