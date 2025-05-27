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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full bg-[#013959] text-white pt-12 pb-[220px] text-center relative">
        {activeTab && (
          <button
            className="absolute top-4 left-8 flex items-center text-white hover:underline"
            onClick={() => setActiveTab(null)}
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour
          </button>
        )}
        <h1 className="text-[32px] font-bold mb-2">Lorem ipsum dolor sit amet</h1>
        <p className="max-w-[600px] mx-auto text-sm text-white/80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt luctus, nunc erat sollicitudin ipsum.
        </p>
      </div>

      {/* MAIN CARD CONTAINER */}
      <div className="bg-white rounded-[30px] border border-[#E0E0E0] mt-[-150px] shadow-[0_3px_6px_rgba(171,171,171,0.06),0_11px_11px_rgba(171,171,171,0.05)] w-full max-w-[1013px] p-[47px_61px] flex flex-col items-center">
        {activeTab === null ? (
          <>
            <h2 className="text-[24px] font-semibold text-[#013959] mb-4">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-center text-gray-500 mb-8 max-w-[600px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt luctus, nunc erat sollicitudin ipsum.
            </p>

            <div className="flex flex-col md:flex-row gap-[56px]">
              {/* Professionnel CARD */}
              <div className="w-[427px] h-[462px] rounded-[30px] border-[1.9px] border-[#E0E0E0] p-[47px_38px] flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="w-[75px] h-[75px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-5">
                  <UserRound className="text-[#1CD5F5]" size={32} />
                </div>
                <h3 className="text-[22px] font-bold text-[#013959] mb-5">
                  Professionnel
                </h3>
                <ul className="text-gray-600 space-y-[16px] mb-8">
                  {features.map((feature, i) => (
                    <li key={`pro-${i}`} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-[222px] h-[46px] bg-[#00CFFF] text-white rounded-full text-sm font-medium hover:bg-[#00b8e6] transition"
                  onClick={() => setActiveTab("professional")}
                >
                  Get start
                </button>
              </div>

              {/* Entreprise CARD */}
              <div className="w-[427px] h-[462px] rounded-[30px] border-[1.9px] border-[#E0E0E0] p-[47px_38px] flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="w-[75px] h-[75px] rounded-full bg-[#1CD5F5]/10 flex items-center justify-center mb-5">
                  <Building2 className="text-[#1CD5F5]" size={32} />
                </div>
                <h3 className="text-[22px] font-bold text-[#013959] mb-5">
                  Entreprise
                </h3>
                <ul className="text-gray-600 space-y-[16px] mb-8">
                  {features.map((feature, i) => (
                    <li key={`biz-${i}`} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-[222px] h-[46px] bg-[#00CFFF] text-white rounded-full text-sm font-medium hover:bg-[#00b8e6] transition"
                  onClick={() => setActiveTab("business")}
                >
                  Get start
                </button>
              </div>
            </div>
          </>
        ) : activeTab === "professional" ? (
          <ProfessionalForm />
        ) : (
          <BusinessForm />
        )}      
      </div>
    </div>
  );
}
