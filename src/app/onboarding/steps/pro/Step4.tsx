"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProStep4() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const profileType = searchParams.get("profile");

  useEffect(() => {
    const storageKey =
      profileType === "entreprise"
        ? "onboardingEntrepriseFormData"
        : "onboardingFormData";

    const userData = localStorage.getItem(storageKey);
    if (userData) {
      const { email } = JSON.parse(userData);
      const link = `${window.location.origin}/onboarding?ref=${btoa(
        email
      )}&type=${profileType}`;
      setReferralLink(link);

      localStorage.removeItem("onboardingFormData");
      localStorage.removeItem("onboardingEntrepriseFormData");
      localStorage.removeItem("onboardingCurrentStep");
      localStorage.removeItem("referrerEmail");
      localStorage.removeItem("referrerType");
      localStorage.removeItem("lastApiResponse");
    }
  }, [profileType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Rejoignez-moi sur CatchHub!",
        text: "Inscrivez-vous avec mon lien de parrainage :",
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-[#013959] mb-4">
        Bienvenue sur CatchHub!
      </h2>
      <p className="text-[#7E8B93] mb-8">
        Partagez votre lien de parrainage et invitez vos contacts à rejoindre la
        communauté.
      </p>
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <p className="text-sm text-gray-600 mb-2">Votre lien de parrainage</p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 p-2 border rounded-md bg-gray-50"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            className="whitespace-nowrap"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
