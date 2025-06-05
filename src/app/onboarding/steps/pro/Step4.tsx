"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProStep4() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
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

      // Get referral count from the last API response
      const lastResponse = localStorage.getItem("lastApiResponse");
      if (lastResponse) {
        const { referralCount } = JSON.parse(lastResponse);
        setReferralCount(referralCount);
      }

      localStorage.removeItem("onboardingFormData");
      localStorage.removeItem("onboardingEntrepriseFormData");
      localStorage.removeItem("onboardingCurrentStep");
      localStorage.removeItem("referrerEmail");
      localStorage.removeItem("lastApiResponse");
    }
  }, [profileType]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rejoignez CatchHub",
          text: "Rejoignez-moi sur CatchHub, la plateforme de networking professionnel au Maroc!",
          url: referralLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
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
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="text-[#1CD5F5]" size={24} />
          <span className="text-lg font-semibold">
            {referralCount}{" "}
            {referralCount === 1 ? "personne invitée" : "personnes invitées"}
          </span>
        </div>

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

        <Button
          onClick={handleShare}
          className="w-full bg-[#1CD5F5] hover:bg-[#00b8e6] text-white"
        >
          <Share2 className="mr-2" size={20} />
          Partager
        </Button>
      </div>

      <div className="bg-[#F7F9FA] p-4 rounded-lg">
        <h3 className="font-semibold text-[#013959] mb-2">
          Avantages du parrainage
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• 1ère invitation : Accès premium pendant 1 mois</li>
          <li>• 5 invitations : Accès premium pendant 3 mois</li>
          <li>• 10 invitations : Accès premium pendant 6 mois</li>
        </ul>
      </div>
    </div>
  );
}
