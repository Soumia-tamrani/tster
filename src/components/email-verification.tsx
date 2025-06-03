"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function EmailVerification({
  email,
  onVerified,
  onBack,
}: EmailVerificationProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Fonction pour formater le temps restant (mm:ss)
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // Effet pour gérer le compte à rebours
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [remainingTime, resendDisabled]);

  const sendVerificationEmail = async () => {
    setIsSending(true);
    setError(null);

    try {
      let verificationToken;
      const existingToken = sessionStorage.getItem(`verification_${email}`);

      if (existingToken) {
        verificationToken = existingToken;
      } else {
        verificationToken = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        sessionStorage.setItem(`verification_${email}`, verificationToken);
      }

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

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailContent),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }

      setSuccess("Code de vérification envoyé à votre adresse email");

      setRemainingTime(60);
      setResendDisabled(true);
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        "Une erreur est survenue lors de l'envoi du code de vérification"
      );
    } finally {
      setIsSending(false);
    }
  };

  const verifyToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer le token stocké
      const storedToken = sessionStorage.getItem(`verification_${email}`);

      if (!storedToken) {
        throw new Error(
          "Le code de vérification a expiré. Veuillez demander un nouveau code."
        );
      }

      if (token === storedToken) {
        setIsVerified(true);
        setSuccess("Adresse email vérifiée avec succès !");

        // Nettoyer le token après vérification réussie
        sessionStorage.removeItem(`verification_${email}`);

        // Informer le composant parent que l'email est vérifié
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        throw new Error("Code de vérification incorrect");
      }
    } catch (err: any) {
      setError(
        err.message || "Une erreur est survenue lors de la vérification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1CD5F512] p-4 rounded-lg border border-[#1CD5F5]">
        <div className="flex">
          <div className="flex-shrink-0">
            <Mail className="h-5 w-5 text-[#1CD5F5]" />
          </div>
          <div className="ml-3">
           <p className="text-sm text-[#008399]">
              Nous devons vérifier votre adresse email pour continuer  :  {" "}
              <span className="font-medium text-blue-900">{email}</span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" 
className={`mb-4 ${error === "Code de vérification incorrect" ? "bg-[#ffe4e4] border-[#f5c2c2] text-[#ee5858]" : "bg-red-50 border-red-200 text-white"}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {error === "Le code de vérification a expiré. Veuillez demander un nouveau code." && (
        <Alert variant="destructive" className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
<AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="default"
          className="mb-4 bg-green-50 border-green-200 text-green-800"
        >
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {isVerified ? (
        <div className="flex flex-col items-center justify-center py-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center font-medium">Vérification réussie !</p>
          <p className="text-center text-sm text-muted-foreground">
            Vous pouvez maintenant continuer
          </p>
        </div>
      ) : (
        <>
<div className="space-y-2 justify-center py-6">
  <Label htmlFor="verificationToken" className="text-gray-700 font-medium text-center">
    Code de vérification
  </Label>
  <div className="flex justify-center">
    <InputOTP
      maxLength={6}
      value={token}
      onChange={(value) => setToken(value)}
      className="flex"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
        <InputOTPSlot index={1} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
        <InputOTPSlot index={2} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
        <InputOTPSlot index={4} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
        <InputOTPSlot index={5} className="h-12 w-12 text-center text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-md" />
      </InputOTPGroup>
    </InputOTP>
  </div>
  <p className="text-xs text-gray-500 mt-1 text-center">
    Vérifiez votre boîte de réception et saisissez le code à 6 chiffres
  </p>
</div>

<div className="flex flex-col space-y-3">
  <Button
    type="button"
    onClick={verifyToken}
    disabled={token.length !== 6 || isLoading}
    className="w-full bg-[#1CD5F5] h-12 hover:bg-[#1CD5F5] transition-colors duration-200"
    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '500', fontSize: '16px' }}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Vérification...
      </>
    ) : (
      "Vérifier le code"
    )}
  </Button>

  <Button
    type="button"
    variant="ghost"
    onClick={sendVerificationEmail}
    disabled={isSending || resendDisabled}
    className="text-[#1CD5F5] hover:text-[#1CD5F5] hover:bg-blue-50 w-full text-center"
  >
    {isSending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Envoi en cours...
      </>
    ) : (
      `Renvoyer le code${resendDisabled ? ` (${formatTime(remainingTime)})` : ""}`
    )}
  </Button>
</div>

{isVerified && (
  <div className="flex justify-center mt-6">
    <Button
      type="button"
      onClick={onVerified}
      className="w-[152px] bg-[#1CD5F5] h-12 hover:bg-[#1CD5F5]/90 text-white rounded-[10px] py-[13px] px-[43.5px] font-medium transition-all duration-200"
      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '500', fontSize: '17px' }}
    >
      Suivant
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </div>
)}
        </>
      )}
    </div>
  );
}
