// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Copy,
//   Check,
//   Mail,
//   Facebook,
//   Linkedin,
//   Twitter,
// } from "lucide-react";
// import { useSearchParams } from "next/navigation";

// export default function ProStep4() {
//   const [referralLink, setReferralLink] = useState("");
//   const [copied, setCopied] = useState(false);
//   const searchParams = useSearchParams();
//   const profileType = searchParams.get("profile");

//   useEffect(() => {
//     const storageKey =
//       profileType === "entreprise"
//         ? "onboardingEntrepriseFormData"
//         : "onboardingFormData";

//     const userData = localStorage.getItem(storageKey);
//     if (userData) {
//       const { email } = JSON.parse(userData);
//       const link = `${window.location.origin}/onboarding?ref=${btoa(
//         email
//       )}&type=${profileType}`;
//       setReferralLink(link);

//       localStorage.removeItem("onboardingFormData");
//       localStorage.removeItem("onboardingEntrepriseFormData");
//       localStorage.removeItem("onboardingCurrentStep");
//       localStorage.removeItem("referrerEmail");
//       localStorage.removeItem("referrerType");
//       localStorage.removeItem("lastApiResponse");
//     }
//   }, [profileType]);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(referralLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const shareToFacebook = () => {
//     const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       referralLink
//     )}`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   const shareToLinkedIn = () => {
//     const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//       referralLink
//     )}`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   const shareToTwitter = () => {
//     const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       referralLink
//     )}&text=Rejoignez-moi sur CatchHub!`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   const shareViaEmail = () => {
//     const subject = "Rejoignez-moi sur CatchHub!";
//     const body = `Inscrivez-vous avec mon lien de parrainage : ${referralLink}`;
//     window.location.href = `mailto:?subject=${encodeURIComponent(
//       subject
//     )}&body=${encodeURIComponent(body)}`;
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-center">
//       <h2 className="text-2xl font-semibold text-[#013959] mb-4">
//         Merci pour votre inscription !
//       </h2>
//       <p className="text-[#7E8B93] mb-8">
//         Vous êtes parmi les premiers à découvrir Catchub.Le lancement officiel arrive cet été. 
//       </p>

//       <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">

//         <div className="p-0 m-0">Invitez des responsables ou dirigeants à rejoindre Catchub, </div>
//         <div className="flex items-center gap-2 mb-6">

//           <input
//             type="text"
//             value={referralLink}
//             readOnly
//             className="flex-1 p-2 border rounded-md bg-gray-50 text-sm"
//           />
//           <Button
//             onClick={handleCopy}
//             variant="outline"
//             className="whitespace-nowrap"
//             size="icon"
//           >
//             {copied ? <Check size={20} /> : <Copy size={20} />}
//           </Button>
//         </div>

//         <div className="space-y-4">
//           <p className="text-sm text-gray-600 mb-4">Partager via :</p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <Button
//               onClick={shareToFacebook}
//               className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
//             >
//               <Facebook size={20} />
//               <span>Facebook</span>
//             </Button>
//             <Button
//               onClick={shareToLinkedIn}
//               className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
//             >
//               <Linkedin size={20} />
//               <span>LinkedIn</span>
//             </Button>
//             <Button
//               onClick={shareToTwitter}
//               className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
//             >
//               <Twitter size={20} />
//               <span>Twitter</span>
//             </Button>
//             <Button
//               onClick={shareViaEmail}
//               className="flex items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#EA4335]/90 text-white"
//             >
//               <Mail size={20} />
//               <span>Email</span>
//             </Button>
//           </div>
//         </div>
//       </div>

    
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Mail, Facebook, Linkedin, Twitter, Share2, PartyPopper } from "lucide-react"
import { useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ProStep4() {
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams()
  const profileType = searchParams.get("profile")

  useEffect(() => {
    // Trigger confetti effect when component mounts
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Create confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#013959", "#4CADE6", "#FFD700", "#FF6B6B", "#7ED957"],
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#013959", "#4CADE6", "#FFD700", "#FF6B6B", "#7ED957"],
      })
    }, 250)

    // Get user data from localStorage
    const storageKey = profileType === "entreprise" ? "onboardingEntrepriseFormData" : "onboardingFormData"
    const userData = localStorage.getItem(storageKey)
    if (userData) {
      const { email } = JSON.parse(userData)
      const link = `${window.location.origin}/onboarding?ref=${btoa(email)}&type=${profileType}`
      setReferralLink(link)
      localStorage.removeItem("onboardingFormData")
      localStorage.removeItem("onboardingEntrepriseFormData")
      localStorage.removeItem("onboardingCurrentStep")
      localStorage.removeItem("referrerEmail")
      localStorage.removeItem("referrerType")
      localStorage.removeItem("lastApiResponse")
    }

    return () => clearInterval(interval)
  }, [profileType])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      referralLink,
    )}&text=Rejoignez-moi sur CatchHub!`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareViaEmail = () => {
    const subject = "Rejoignez-moi sur CatchHub!"
    const body = `Inscrivez-vous avec mon lien de parrainage : ${referralLink}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#013959]/10 mb-4">
          <PartyPopper className="h-8 w-8 text-[#013959]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#12c9e1] mb-3" style={{fontFamily: "Poppins, sans-serif"}}>Félicitations ! </h1>
        <p className="text-xl text-[#7E8B93] max-w-lg mx-auto" style={{fontFamily: "Poppins, sans-serif"}}>
          Merci pour votre inscription !
          <span className="block font-medium mt-2 text-[#013959]" style={{fontFamily: "Montserrat, sans-serif"}}>Vous êtes parmi les pionniers à découvrir Catchub.</span>
        </p>
      </div>

      <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-[#013959]/5 pb-4 pt-6">
          <h2 className="text-xl font-semibold text-center text-[#013959]">Partagez Catchub avec votre réseau</h2>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <p className="text-[#013959] font-medium mb-4 text-center">
             Invitez des contacts à rejoindre Catchub et développez votre réseau
          </p>

          <div className="flex items-center gap-2 mb-8 bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
            <Input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              size="icon"
              className={`rounded-md transition-all duration-200 ${copied ? "bg-green-50 text-green-600 border-green-200" : "bg-white"}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Share2 size={18} className="text-[#7E8B93]" />
              <p className="text-[#7E8B93] font-medium">Partager via :</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Facebook size={18} />
                <span>Facebook</span>
              </Button>
              <Button
                onClick={shareToLinkedIn}
                className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </Button>
              <Button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </Button>
              <Button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#EA4335]/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Mail size={18} />
                <span>Email</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

