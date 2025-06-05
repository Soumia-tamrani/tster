"use client";
import { useEffect } from "react";
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
import { CountryCombobox } from "@/components/CountryCombobox";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const countries = [
  { name: "Maroc", code: "+212" },
  { name: "Mali", code: "+223" },
  { name: "Malte", code: "+356" },
  { name: "Martinique", code: "+596" },
];

const formSchema = z.object({
  firstName: z.string().min(3, "Le prénom est requis."),
  lastName: z.string().min(3, "Le nom est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().min(1, "Le téléphone est requis."),
  country: z.string().min(1, "Le pays est requis."),
  city: z.string().min(1, "La ville est requise."),
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      consent: false,
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
    if (setCanProceed) setCanProceed(form.formState.isValid);
    if (setOnProceed) setOnProceed(() => form.handleSubmit(handleSubmit));
  }, [defaultValues, form.formState.isValid, setCanProceed, setOnProceed]);

  const handleSubmit = async (data: any) => {
    localStorage.setItem(
      "onboardingFormData",
      JSON.stringify({
        ...(defaultValues || {}),
        ...data,
      })
    );
    localStorage.setItem("onboardingCurrentStep", "0");
    await sendVerificationEmail(data.email);
    onNext(data);
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
                    <CountryCombobox
                      className="h-12"
                      value={field.value}
                      onChange={field.onChange}
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
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                      inputClass="w-full"
                    />
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
