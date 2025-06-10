"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Mail,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
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

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralLink
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      referralLink
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      referralLink
    )}&text=Rejoignez-moi sur CatchHub!`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareViaEmail = () => {
    const subject = "Rejoignez-moi sur CatchHub!";
    const body = `Inscrivez-vous avec mon lien de parrainage : ${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-[#013959] mb-4">
        Merci pour votre inscription !
      </h2>
      <p className="text-[#7E8B93] mb-8">
        Vous êtes parmi les premiers à découvrir Catchub.Le lancement officiel arrive cet été. 
      </p>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">

        <div className="p-0 m-0">Invitez des responsables ou dirigeants à rejoindre Catchub, </div>
        <div className="flex items-center gap-2 mb-6">

          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 p-2 border rounded-md bg-gray-50 text-sm"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            className="whitespace-nowrap"
            size="icon"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Partager via :</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
            >
              <Facebook size={20} />
              <span>Facebook</span>
            </Button>
            <Button
              onClick={shareToLinkedIn}
              className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </Button>
            <Button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
            >
              <Twitter size={20} />
              <span>Twitter</span>
            </Button>
            <Button
              onClick={shareViaEmail}
              className="flex items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#EA4335]/90 text-white"
            >
              <Mail size={20} />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        En partageant votre lien, vous permettez à vos contacts de bénéficier
        d'avantages exclusifs.
      </p>
    </div>
  );
}
