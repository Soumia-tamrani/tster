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
    <div className="relative w-[1440px] h-[1705px] bg-[#FCFCFD] flex flex-col items-center mx-auto">
      {/* Background Rectangle */}
      <div className="absolute w-[1550px] h-[563px] bg-[#013959] top-0 left-1/2 transform -translate-x-1/2 z-0" />
      <a
        href="/"
        className="absolute z-20 top-[77px] left-[122px] w-[45px] h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="text-white" size={20} />
      </a>
 
      {/* Header Section on Blue Background */}
      <div className="absolute w-[700px] h-[120px] top-[140px] left-[369px] flex flex-col items-center gap-6 z-10">
        {activeTab && (
          <button
            className="absolute top-[-90px] left-[-290px] flex items-center text-white hover:underline"
            onClick={() => setActiveTab(null)}
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour
          </button>
        )}
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-2 text-white">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl
            nec tincidunt luctus, nunc erat sollicitudin ipsum.
          </p>
        </div>
      </div>
 
      {/* Conditional Rendering Based on activeTab */}
      {activeTab === null ? (
        // Main Card Container for Selection Page
        <div className="bg-white rounded-[22px] mt-[300px] shadow-[0_44px_18px_rgba(171,171,171,0.01),0_25px_15px_rgba(171,171,171,0.03),0_11px_11px_rgba(171,171,171,0.05),0_3px_6px_rgba(171,171,171,0.06)] w-[1013px] h-[799.44px] p-[91px_61px] flex flex-col items-center text-[#013959] relative z-10 border-[3px] border-rgba(215,215,219,0.74)">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-2">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-sm text-[#7E8B93]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
              nisl nec tincidunt luctus, nunc erat sollicitudin ipsum.
            </p>
          </div>
 
          <div className="flex flex-col md:flex-row gap-10">
            {/* Professionnel CARD */}
            <div className="w-[426.79px] h-[462.44px] rounded-[29.73px] border-[1.92px] border-[#E0E0E0] p-[47px_38.36px] flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-[75.05px] h-[75.05px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-5">
                <UserRound className="text-[#1CD5F5]" size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-5"> Professionnel</h3>
              <ul className="text-[#8C8C8C] space-y-[12px] mb-8">
                {features.map((feature, i) => (
                  <li key={`pro-${i}`} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={12} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-[222px] h-[46.13px] bg-[#1CD5F5] text-white rounded-[73.18px] text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
                onClick={() => setActiveTab("professional")}
              >
                Get start
              </button>
            </div>
 
            {/* Entreprise CARD */}
            <div className="w-[410.84px] h-[455.37px] rounded-[28.62px] border-[1.85px] border-[#E0E0E0] p-[47px_36.93px] flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-[72.25px] h-[72.25px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-5">
                <Building2 className="text-[#1CD5F5]" size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-5">Entreprise</h3>
              <ul className="text-[#8C8C8C] space-y-[12px] mb-8">
                {features.map((feature, i) => (
                  <li key={`biz-${i}`} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={12} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-[222px] h-[46.13px] bg-[#1CD5F5] text-white rounded-[73.18px] text-base font-semibold hover:bg-[#00b8e6] transition flex items-center justify-center"
                onClick={() => setActiveTab("business")}
              >
                Get start
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "professional" ? (
        // Personalized Main Card Container for ProfessionalForm
        <div className="bg-white rounded-[15px] mt-[300px] shadow-[0_20px_15px_rgba(171,171,171,0.05)] w-[1013px] h-[850px] p-[50px] flex flex-col items-center text-[#013959] relative z-10 border-[2px] border-[#D7D7DBBD]">
          <ProfessionalForm />
        </div>
      ) : (
        // Personalized Main Card Container for BusinessForm
        <div>
        {/* // className="bg-white rounded-[25px] mt-[300px] shadow-[0_30px_20px_rgba(171,171,171,0.07)] w-[1013px] h-[1151.69px] p-[60px] flex flex-col items-center text-[#013959] relative z-10 border-[2px] border-[#D7D7DBBD]"> */}
          <BusinessForm />
        </div>
      )}
    </div>
  );
}