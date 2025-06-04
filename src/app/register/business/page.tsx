"use client";

import BusinessForm from "@/components/business-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, Suspense } from "react"; 
import { motion } from "framer-motion";

// Fallback component for Suspense
function BusinessRegisterPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}

// Main component wrapped in Suspense
function BusinessRegisterPageContent() {
  const searchParams = useSearchParams();
  const parrainId = searchParams.get("ref") || "";
  const utmSource = "";
  const utmMedium = "";
  const utmCampaign = "";
  const [currentStep, setCurrentStep] = useState(1);

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const getBusinessFormTitle = () => {
    if (currentStep === 1) return "Informations personnelles";
    if (currentStep === 2) return "Vérification email";
    return "Profil entreprise";
  };

  const getBusinessFormDescription = () => {
    if (currentStep === 1) return "Renseignez vos informations et celles de votre entreprise.";
    if (currentStep === 2) return "Confirmez votre adresse email pour sécuriser votre compte.";
    return "Complétez le profil de votre entreprise pour personnaliser votre expérience.";
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FCFCFD] flex flex-col items-center mx-auto">

      {/* Background Rectangle - Responsive */}
      <div className="absolute w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[563px] bg-[#013959] top-0 left-1/2 transform -translate-x-1/2 z-0" />
      
      {/* Back Button - Responsive positioning */}
      <a
        href="/"
        className="absolute z-20 top-4 left-4 sm:top-6 sm:left-6 md:top-12 md:left-12 lg:top-[77px] lg:left-[122px] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-[45px] lg:h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="text-white" size={16} />
      </a>
      
      {/* Header Section on Blue Background - Responsive */}
      <div className="absolute w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] px-4 sm:px-6 md:px-8 top-16 sm:top-20 md:top-24 lg:top-[140px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 sm:gap-5 md:gap-6 z-10">
        
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-3 md:mb-4 lg:mb-2 text-white leading-tight">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-sm text-white opacity-90 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl
            nec tincidunt luctus, nunc erat sollicitudin ipsum.
          </p>
        </div>
      </div>

      {/* Form Container - Responsive */}
      <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-48 sm:pt-52 md:pt-60 lg:pt-72 pb-8 sm:pb-12 md:pb-16">
        <BusinessForm
          utmSource={utmSource}
          utmMedium={utmMedium}
          utmCampaign={utmCampaign}
          onStepChange={onStepChange}
          parrainId={parrainId}
        />
      </div>
    </div>
  );
}

export default function BusinessRegisterPage() {
  return (
    <Suspense fallback={<BusinessRegisterPageFallback />}>
      <BusinessRegisterPageContent />
    </Suspense>
  );
}