// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { AlignCenter, ArrowLeft, Building2, CheckCircle, UserRound } from "lucide-react";
// import MultistepWrap from "./MultistepWrap";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// const proFeatures = [
//   "Offres d’emploi ciblées et exclusives",
//   "Mentorat personnalisé",
//   "Fonctionnalités avancées.",
// ];

// const entrepriseFeatures = [
//   "Offres illimitées & matching intelligent",
//   "Vitrine marque employeur",
//   "Suivi & opportunités B2B",
// ];

// function OnboardingPageInner() {
//   const searchParams = useSearchParams();
//   const initialProfile = searchParams.get("profile");
//   const [selectedProfile, setSelectedProfile] = useState<
//     null | "pro" | "entreprise"
//   >(
//     initialProfile === "pro" || initialProfile === "entreprise"
//       ? initialProfile
//       : null
//   );

//   useEffect(() => {
//     const ref = searchParams.get("ref");
//     const type = searchParams.get("type");

//     if (ref) {
//       try {
//         const referrerEmail = atob(ref);
//         localStorage.setItem("referrerEmail", referrerEmail);
//         if (type) {
//           localStorage.setItem("referrerType", type);
//         }
//       } catch (error) {
//         console.error("Invalid referral code", error);
//       }
//     }
//   }, [searchParams]);

//   if (selectedProfile) {
//     return (
//       <MultistepWrap
//         profileType={selectedProfile}
//         onBackToSelection={() => setSelectedProfile(null)}
//       />
//     );
//   }

//   return (
//     <div className="relative w-full min-h-screen bg-[#FCFCFD] flex flex-col items-center mx-auto">
//       <div className="absolute w-full h-[300px] md:h-[563px] bg-[#013959] top-0 left-1/2 transform -translate-x-1/2 z-0" />
//       <Link
//         href="/"
//         className="absolute z-20 top-4 left-4 md:top-[77px] md:left-[122px] w-10 h-10 md:w-[45px] md:h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
//       >
//         <ArrowLeft className="text-white" size={20} />
//       </Link>

//       <div className="absolute w-[90vw] max-w-[700px] h-[80px] md:h-[120px] top-[80px] md:top-[140px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:gap-6 z-10">
//         <div className="text-center">
//           <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-white" style={{ fontFamily: "Montserrat, sans-serif" , fontWeight: 600 }}>
//             Bâtissez l’avenir de vos collaborations.
//           </h1>
//           <p className="text-xs md:text-sm text-white" style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
//             Rejoignez Catchub pour développer votre réseau, attirer les bons profils et activer de vraies opportunités professionnelles. 
//           </p>
//         </div>
//       </div>

//       {!selectedProfile && (
//         <div className="bg-white rounded-[18px] md:rounded-[22px] mt-[180px] md:mt-[300px] shadow-[0_8px_8px_rgba(171,171,171,0.03),0_11px_11px_rgba(171,171,171,0.05),0_3px_6px_rgba(171,171,171,0.06)] w-[95vw] max-w-[1013px] h-auto md:h-[799.44px] p-4 md:p-[91px_61px] flex flex-col items-center text-[#013959] relative z-10 border border-[#E0E0E0]">
//           <div className="text-center mb-6 md:mb-8">
//             <h2 className="text-xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "Montserrat, sans-serif" , fontWeight: 600 }}>
//               Choisissez votre profil
//             </h2>
//             <p className="text-xs md:text-sm text-[#7E8B93]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
//               Adoptez celui qui correspond à vos ambitions et accédez à des opportunités personnalisées pour développer votre réseau et faire grandir vos projets. 
//             </p>
//           </div>

//           <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full items-center justify-center">
//             {/* Professionnel CARD */}
//             <div className="w-full max-w-[400px] md:w-[426.79px] h-auto md:h-[462.44px] rounded-[20px] md:rounded-[29.73px] border border-[#E0E0E0] p-6 md:p-[47px_38.36px] flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer mb-6 md:mb-0">
//               <div className="w-16 h-16 md:w-[75.05px] md:h-[75.05px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 md:mb-5">
//                 <UserRound className="text-[#1CD5F5]" size={24} />
//               </div>
//               <h3 className="text-lg md:text-2xl font-semibold mb-4 md:mb-5">       
//                 {" "}
//                 Professionnel
//               </h3>
//               <ul className="text-[#8C8C8C] space-y-2 md:space-y-[12px] mb-6 md:mb-8">
//                 {proFeatures.map((feature, i) => (
//                   <li
//                     key={`pro-${i}`}
//                     className="flex items-center justify-center"
//                   >
//                     <CheckCircle className="text-green-500 mr-2" size={12} />
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//               <a
//                 href="/onboarding?profile=pro"
//                 className="w-full max-w-[222px] h-12 md:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
//               >
//                 Get start
//               </a>
//             </div>

//             <div className="w-full max-w-[400px] md:w-[410.84px] h-auto md:h-[455.37px] rounded-[20px] md:rounded-[28.62px] border border-[#E0E0E0] p-6 md:p-[47px_36.93px] flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer">
//               <div className="w-16 h-16 md:w-[72.25px] md:h-[72.25px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 md:mb-5">
//                 <Building2 className="text-[#1CD5F5]" size={24} />
//               </div>
//               <h3 className="text-lg md:text-2xl font-semibold mb-4 md:mb-5">
//                 Entreprise
//               </h3>
//               <ul className="text-[#8C8C8C] space-y-2 md:space-y-[12px] mb-6 md:mb-8">
//                 {entrepriseFeatures.map((feature, i) => (
//                   <li
//                     key={`biz-${i}`}
//                     className="flex items-center justify-center"
//                   >
//                     <CheckCircle className="text-green-500 mr-2" size={12} />
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//               <a
//                 href="/onboarding?profile=entreprise"
//                 className="w-full max-w-[222px] h-12 md:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
//               >
//                 Get start
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function OnboardingPage() {
//   return (
//     <Suspense>
//       <OnboardingPageInner />
//     </Suspense>
//   );
// }
"use client";

import { useState, useEffect, Suspense } from "react";
import { AlignCenter, ArrowLeft, Building2, CheckCircle, UserRound } from "lucide-react";
import MultistepWrap from "./MultistepWrap";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const proFeatures = [
  "Offres d’emploi ciblées et exclusives",
  "Mentorat personnalisé",
  "Fonctionnalités avancées.",
];

const entrepriseFeatures = [
  "Offres illimitées & matching intelligent",
  "Vitrine marque employeur",
  "Suivi & opportunités B2B",
];

function OnboardingPageInner() {
  const searchParams = useSearchParams();
  const initialProfile = searchParams.get("profile");
  const [selectedProfile, setSelectedProfile] = useState<
    null | "pro" | "entreprise"
  >(
    initialProfile === "pro" || initialProfile === "entreprise"
      ? initialProfile
      : null
  );

  useEffect(() => {
    const ref = searchParams.get("ref");
    const type = searchParams.get("type");

    if (ref) {
      try {
        const referrerEmail = atob(ref);
        localStorage.setItem("referrerEmail", referrerEmail);
        if (type) {
          localStorage.setItem("referrerType", type);
        }
      } catch (error) {
        console.error("Invalid referral code", error);
      }
    }
  }, [searchParams]);

  if (selectedProfile) {
    return (
      <MultistepWrap
        profileType={selectedProfile}
        onBackToSelection={() => setSelectedProfile(null)}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FCFCFD] flex flex-col items-center mx-auto">
      <div className="absolute w-full h-[300px] md:h-[563px] bg-[#013959] top-0 left-1/2 transform -translate-x-1/2 z-0" />
      <Link
        href="/"
        className="absolute z-20 top-4 left-4 md:top-[77px] md:left-[122px] w-10 h-10 md:w-[45px] md:h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="text-white" size={20} />
      </Link>

      <div className="absolute w-[90vw] max-w-[700px] h-[80px] md:h-[120px] top-[80px] md:top-[140px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:gap-6 z-10">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-white" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
            Bâtissez l’avenir de vos collaborations.
          </h1>
          <p className="text-xs md:text-sm text-white" style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
            Rejoignez Catchub pour développer votre réseau, attirer les bons profils et activer de vraies opportunités professionnelles. 
          </p>
        </div>
      </div>

      {!selectedProfile && (
        <div className="bg-white rounded-[18px] md:rounded-[22px] mt-[180px] md:mt-[300px] shadow-[0_8px_8px_rgba(171,171,171,0.03),0_11px_11px_rgba(171,171,171,0.05),0_3px_6px_rgba(171,171,171,0.06)] w-[95vw] max-w-[1013px] h-auto md:h-[799.44px] p-4 md:p-[91px_61px] flex flex-col items-center text-[#013959] relative z-10 border border-[#E0E0E0]">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Choisissez votre profil
            </h2>
            <p className="text-xs md:text-sm text-[#7E8B93]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
              Adoptez celui qui correspond à vos ambitions et accédez à des opportunités personnalisées pour développer votre réseau et faire grandir vos projets. 
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full items-center justify-center">
{/* Professionnel CARD */}
  <div className="w-full max-w-[400px] sm:max-w-[350px] md:max-w-[426.79px] h-auto md:h-[462.44px] rounded-[20px] md:rounded-[29.73px] border border-[#E0E0E0] p-4 sm:p-6 md:p-[47px_38.36px] flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer mb-6 sm:mb-8 md:mb-0 mx-auto">
    <div className="w-16 h-16 sm:w-[60px] sm:h-[60px] md:w-[75.05px] md:h-[75.05px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 sm:mb-5 md:mb-5">
      <UserRound className="text-[#1CD5F5] w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
    </div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
      Professionnel
    </h3>
<p className="text-sm sm:text-base md:text-sm text-[#1CD5F5] font-semibold mb-2 md:mb-3">      Inscription 100% gratuite
    </p>
    <p className="text-xs sm:text-sm md:text-xs text-[#7E8B93] mb-2 md:mb-6">
      Idéal pour talents indépendants ou professionnels
    </p>
    <ul className="text-[#8C8C8C] space-y-2 sm:space-y-3 md:space-y-[12px] mb-6 md:mb-8 text-left w-full pl-5">
      {proFeatures.map((feature, i) => (
        <li
          key={`pro-${i}`}
          className="flex items-center justify-start"
        >
          <CheckCircle className="text-green-500 mr-2 w-3.5 h-3.5 sm:w-4 h-4 md:w-4 h-4" />
          {feature}
        </li>
      ))}
    </ul>
    <a
      href="/onboarding?profile=pro"
      className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[222px] h-10 sm:h-11 md:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-sm sm:text-base md:text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
    >
      S’inscrire gratuitement
    </a>
  </div>

  {/* Entreprise CARD */}
  <div className="w-full max-w-[400px] sm:max-w-[350px] md:max-w-[410.84px] h-auto md:h-[455.37px] rounded-[20px] md:rounded-[28.62px] border border-[#E0E0E0] p-4 sm:p-6 md:p-[47px_36.93px] flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer mx-auto">
    <div className="w-16 h-16 sm:w-[60px] sm:h-[60px] md:w-[72.25px] md:h-[72.25px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 sm:mb-5 md:mb-5">
      <Building2 className="text-[#1CD5F5] w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
    </div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
      Entreprise
    </h3>
    <p className="text-sm sm:text-base md:text-sm text-[#1CD5F5] font-semibold mb-2 md:mb-3">      1 mois offert pour les 100 premiers
    </p>
    <p className="text-xs sm:text-sm md:text-xs text-[#7E8B93] mb-2 md:mb-6">
      Solution complète pour recruter, collaborer, accroître
    </p>
    <ul className="text-[#8C8C8C] space-y-2 sm:space-y-3 md:space-y-[12px] mb-6 md:mb-8 text-left w-full pl-5">
      {entrepriseFeatures.map((feature, i) => (
        <li
          key={`entreprise-${i}`}
          className="flex items-center justify-start"
        >
          <CheckCircle className="text-green-500 mr-2 w-3.5 h-3.5 sm:w-4 h-4 md:w-4 h-4" />
          {feature}
        </li>
      ))}
    </ul>
    <a
      href="/onboarding?profile=entreprise"
      className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[222px] h-10 sm:h-11 md:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-sm sm:text-base md:text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
    >
      S’inscrire gratuitement
    </a>
  </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingPageInner />
    </Suspense>
  );
}