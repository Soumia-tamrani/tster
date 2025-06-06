/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Le code doit comporter 6 chiffres.")
    .max(6, "Le code doit comporter 6 chiffres.")
    .regex(/^\d{6}$/, "Le code doit comporter 6 chiffres."),
});

export default function ProStep2({
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
  const [email, setEmail] = useState("");
  const [, setResent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (defaultValues?.email) setEmail(defaultValues.email);
    else if (typeof window !== "undefined") {
      const data = localStorage.getItem("onboardingFormData");
      if (data) {
        try {
          setEmail(JSON.parse(data).email || "");
        } catch {}
      }
    }
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [defaultValues]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: data.otp }),
      });
      const result = await response.json();
      if (response.ok && result.valid) {
        setIsVerified(true);
      } else {
        form.setError("otp", {
          type: "manual",
          message: "Le code est incorrect. Veuillez réessayer.",
        });
      }
    } catch (err) {
      console.error("Erreur:", err);
      form.setError("otp", {
        type: "manual",
        message: "Une erreur est survenue. Veuillez réessayer.",
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
      if (!response.ok) throw new Error("Erreur lors de l'envoi de l'email");
      setShowSuccess(true);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setResent(true);
    setShowSuccess(true);
    if (email) sendVerificationEmail(email);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => setResent(false), 3000);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const proceed = () => onNext({ verified: true });

  useEffect(() => {
    if (setCanProceed) setCanProceed(isVerified);
    if (setOnProceed) {
      if (isVerified) {
        setOnProceed(() => proceed);
      } else {
        setOnProceed(() => () => {});
      }
    }
  }, [isVerified, setCanProceed, setOnProceed]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-w-2xl py-2 mx-auto">
          <h2 className="text-2xl font-semibold text-[#013959] mb-2">
            Vérification de votre email
          </h2>
          <p className="text-[#7E8B93] text-sm mb-6">
            Veuillez confirmer votre adresse e-mail afin de garantir la sécurité
            de votre compte et de pouvoir continuer
          </p>

          <div className="mb-4">
            {showSuccess && (
              <div className="rounded-md bg-green-100 border border-green-300 text-green-800 px-4 py-2 mb-2 text-sm transition-opacity duration-300">
                Un code de vérification a été envoyé à votre adresse.
              </div>
            )}
            <div className="rounded-md bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 flex items-center gap-2 text-sm">
              <Mail className="text-[#1CD5F5] mr-2" size={18} />
              <span className="py-2">
                Veuillez consulter votre boîte de réception (ou vos spams)
                <br />
                <span className="font-semibold text-[#013959]">{email}</span>
              </span>
            </div>
          </div>

          {!isVerified && (
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="mb-4 flex flex-col items-center">
                  <FormLabel className="self-start mb-2">
                    Code De Vérification
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      className="flex justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                        <InputOTPSlot
                          index={4}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                        <InputOTPSlot
                          index={5}
                          className="h-11 w-11 md:h-14 md:w-14 text-2xl md:text-3xl border-2 rounded-lg mx-1"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                  <span className="block text-xs text-[#7E8B93] mt-2">
                    Saisissez le code à 6 chiffres reçu pour finaliser votre
                    inscription.
                  </span>
                </FormItem>
              )}
            />
          )}

          {isVerified && (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="text-green-500" size={96} />
              <h3 className="text-2xl font-bold text-[#13B94D] mt-6 mb-2 text-center">
                Vérification réussie !
              </h3>
              <p className="text-[#7E8B93] text-base text-center">
                Votre adresse e-mail a été confirmée.
              </p>
            </div>
          )}

          {!isVerified && (
            <Button
              type="submit"
              className="w-full bg-[#1CD5F5] hover:bg-[#00b8e6] text-white text-base font-semibold rounded-md h-12 mb-2"
              ref={submitRef}
            >
              Vérifiez le code
            </Button>
          )}
          {!isVerified && (
            <Button
              variant="link"
              className="block w-full text-[#1CD5F5] text-center text-base mt-2 hover:underline"
              onClick={handleResend}
              disabled={countdown > 0}
              tabIndex={-1}
            >
              {countdown > 0
                ? `Renvoyer le code (${countdown}s)`
                : "Renvoyer le code"}
            </Button>
          )}
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
