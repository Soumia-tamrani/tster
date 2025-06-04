"use client";

import React, { useState } from "react";
import { UserRound, Building2, CheckCircle, ArrowLeft } from "lucide-react";
import ProfessionalForm from "@/components/professional-form";
import BusinessForm from "@/components/business-form";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const features = [
    "Offres d'emploi exclusives",
    "Mentorat personnalisé",
    "Événements de networking",
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#FCFCFD] flex flex-col items-center mx-auto">
      {/* Background Rectangle - Responsive */}
      <div className="absolute w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[563px] bg-[#013959] top-0 left-0 z-0" />
      
      {/* Back Button - Responsive positioning */}
      <a
        href="/"
        className="absolute z-20 top-4 left-4 sm:top-6 sm:left-6 md:top-[77px] md:left-[60px] lg:left-[122px] w-[40px] h-[40px] sm:w-[45px] sm:h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="text-white" size={18} />
      </a>

      {/* Header Section - Responsive */}
      <div className="relative w-full max-w-[700px] px-4 sm:px-6 md:px-8 mt-16 sm:mt-20 md:mt-[140px] flex flex-col items-center gap-4 sm:gap-6 z-10">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-white px-4">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-xs sm:text-sm text-white px-4 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl
            nec tincidunt luctus, nunc erat sollicitudin ipsum.
          </p>
        </div>
      </div>

      {/* Conditional Rendering Based on activeTab */}
      {activeTab === null ? (
        // Main Card Container - Fully Responsive
        <div className="bg-white rounded-[16px] sm:rounded-[20px] md:rounded-[22px] mt-8 sm:mt-16 md:mt-20 lg:mt-[100px] mx-4 sm:mx-6 md:mx-8 shadow-[0_20px_25px_rgba(171,171,171,0.15)] w-full max-w-[1013px] p-4 sm:p-6 md:p-8 lg:p-[91px_61px] flex flex-col items-center text-[#013959] relative z-10 border border-[rgba(215,215,219,0.74)] mb-8">
          
          {/* Header Text - Responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 px-2">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-xs sm:text-sm text-[#7E8B93] px-4 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
              nisl nec tincidunt luctus, nunc erat sollicitudin ipsum.
            </p>
          </div>
          
          {/* Cards Container - Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 w-full max-w-[900px]">
            
            {/* Professionnel CARD - Responsive */}
            <div className="flex-1 max-w-[426px] mx-auto lg:mx-0 rounded-[20px] sm:rounded-[25px] md:rounded-[29.73px] border border-[#E0E0E0] p-6 sm:p-8 md:p-[47px_38.36px] flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:border-[#1CD5F5]/30">
              
              {/* Icon Container - Responsive */}
              <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[75.05px] md:h-[75.05px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 sm:mb-5">
                <UserRound className="text-[#1CD5F5]" size={20} />
              </div>
              
              {/* Title - Responsive */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5">
                Professionnel
              </h3>
              
              {/* Features List - Responsive */}
              <ul className="text-[#8C8C8C] space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base">
                {features.map((feature, i) => (
                  <li key={`pro-${i}`} className="flex items-center justify-start">
                    <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={12} />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Button - Responsive */}
              <button
                className="w-full max-w-[222px] h-[42px] sm:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-sm sm:text-base font-semibold hover:bg-[#00b8e6] transition-colors duration-300 flex items-center justify-center"
                onClick={() => setActiveTab("professional")}
              >
                Get started
              </button>
            </div>

            {/* Entreprise CARD - Responsive */}
            <div className="flex-1 max-w-[426px] mx-auto lg:mx-0 rounded-[20px] sm:rounded-[25px] md:rounded-[28.62px] border border-[#E0E0E0] p-6 sm:p-8 md:p-[47px_36.93px] flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:border-[#1CD5F5]/30">
              
              {/* Icon Container - Responsive */}
              <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[72.25px] md:h-[72.25px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-4 sm:mb-5">
                <Building2 className="text-[#1CD5F5]" size={20} />
              </div>
              
              {/* Title - Responsive */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5">
                Entreprise
              </h3>
              
              {/* Features List - Responsive */}
              <ul className="text-[#8C8C8C] space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base">
                {features.map((feature, i) => (
                  <li key={`biz-${i}`} className="flex items-center justify-start">
                    <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={12} />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Button - Responsive */}
              <button
                className="w-full max-w-[222px] h-[42px] sm:h-[46.13px] bg-[#1CD5F5] text-white rounded-full text-sm sm:text-base font-semibold hover:bg-[#00b8e6] transition-colors duration-300 flex items-center justify-center"
                onClick={() => setActiveTab("business")}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "professional" ? (
        <div className="w-full">
          <ProfessionalForm />
        </div>
      ) : (
        <div className="w-full"> 
          <BusinessForm />
        </div>
      )}
    </div>
  );
}