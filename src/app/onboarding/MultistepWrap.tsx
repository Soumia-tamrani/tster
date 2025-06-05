"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Step2 from "./steps/pro/Step2";
import Step3 from "./steps/pro/Step3";
import ProStep1 from "./steps/pro/Step1";
import ProStep2 from "./steps/pro/Step2";
import ProStep3 from "./steps/pro/Step3";
import ProStep4 from "./steps/pro/Step4";
import EntrepriseStep1 from "./steps/entreprise/Step1";
import EntrepriseStep3 from "./steps/entreprise/Step3";
import { Button } from "@/components/ui/button";

const LOCAL_STORAGE_KEY = "onboardingFormData";
const STEP_STORAGE_KEY = "onboardingCurrentStep";

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === i
                ? "bg-[#1CD5F5] border-4 border-[#1CD5F5]"
                : "bg-[#E6F7FB] text-[#1CD5F5] border-4 border-[#E6F7FB]"
            }`}
          >
            {i + 1}
          </div>
          {i < 2 && (
            <div className="w-16 h-1 bg-[#E6F7FB] mx-2">
              <div
                className={`h-1 ${step > i ? "bg-[#1CD5F5]" : "bg-[#E6F7FB]"}`}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const proStepTitles = [
  "Informations personnelles",
  "Votre parcours professionnel",
  "Complétez votre profil",
];
const proStepSubtitles = [
  "Merci de compléter ces informations pour poursuivre votre inscription.\nTous les champs marqués d'un * sont obligatoires",
  "Ajoutez vos expériences et compétences pour enrichir votre profil.",
  "Ajoutez une photo et finalisez votre inscription.",
];
const entrepriseStepTitles = [
  "Informations entreprise",
  "Détails de l'entreprise",
  "Finalisez l'inscription",
];
const entrepriseStepSubtitles = [
  "Merci de compléter les informations de votre entreprise.",
  "Ajoutez des détails pour enrichir votre profil entreprise.",
  "Ajoutez un logo et finalisez l'inscription.",
];

export default function MultistepWrap({
  profileType,
  onBackToSelection,
}: {
  profileType: "pro" | "entreprise";
  onBackToSelection: () => void;
}) {
  const [step, setStep] = useState(0);
  const [formReady, setFormReady] = useState(false);
  const [allData, setAllData] = useState<{ [key: string]: any }>({});
  const submitRef = useRef<HTMLButtonElement>(null);
  const [canProceed, setCanProceed] = useState(true);
  const [onProceed, setOnProceed] = useState<(() => void) | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE_KEY)
        : null;
    setAllData(saved ? JSON.parse(saved) : {});
    setFormReady(true);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [step]);

  const handleStepNext = (stepData: any) => {
    setLoading(false);
    const merged = { ...allData, ...stepData };
    setAllData(merged);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(STEP_STORAGE_KEY, String(step + 1));
    setStep((s) => s + 1);
  };

  const steps =
    profileType === "pro"
      ? [
          <ProStep1
            key={0}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <ProStep2
            key={1}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <ProStep3
            key={2}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <ProStep4 key={3} />,
        ]
      : [
          <EntrepriseStep1
            key={0}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <ProStep2
            key={1}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <EntrepriseStep3
            key={0}
            onNext={handleStepNext}
            defaultValues={allData}
            submitRef={submitRef}
            setCanProceed={setCanProceed}
            setOnProceed={setOnProceed}
          />,
          <ProStep4 key={3} />,
        ];

  const progressStep = profileType === "pro" ? step : step;

  if (!formReady) return null;

  return (
    <div className="relative w-full min-h-screen bg-[#FCFCFD] flex flex-col items-center mx-auto">
      <div className="absolute w-full h-[300px] md:h-[563px] bg-[#013959] top-0 left-1/2 transform -translate-x-1/2 z-0" />
      <a
        href="/"
        className="absolute z-20 top-4 left-4 md:top-[77px] md:left-[122px] w-10 h-10 md:w-[45px] md:h-[46.25px] flex items-center justify-center border border-white rounded-full bg-transparent hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="text-white" size={20} />
      </a>
      <div
        className="relative flex flex-col items-center justify-center pt-8 pb-8 md:pt-12 md:pb-12 bg-transparent z-10 w-[90vw] max-w-[700px]"
        style={{ marginTop: 40 }}
      >
        <h1 className="text-2xl md:text-4xl font-semibold mb-2 text-white text-center">
          Dynamisez votre carrière
        </h1>
        <p className="text-center max-w-xs md:max-w-xl mx-auto text-sm md:text-lg text-white opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nisl nec tincidunt luctus, nunc erat sollicitudin ipsum.
        </p>
      </div>
      <div className="bg-white rounded-[18px] md:rounded-[22px] mt-[10vw] md:mt-[20px] shadow-[0_8px_8px_rgba(171,171,171,0.03),0_11px_11px_rgba(171,171,171,0.05),0_3px_6px_rgba(171,171,171,0.06)] w-[95vw] max-w-[1013px] min-h-[60vh] md:min-h-[799.44px] p-4 md:p-[91px_61px] flex flex-col items-center text-[#013959] relative z-10 border border-[#E0E0E0]">
        {!(step === 3) && (
          <div className="w-full flex justify-center">
            <ProgressBar step={progressStep} />
          </div>
        )}
        <div className="w-full">{steps[step]}</div>
        {!(step === 3) && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 w-full gap-4 md:gap-0">
            <Button
              variant="link"
              onClick={() => {
                if (step > 0) setStep((s) => s - 1);
                else onBackToSelection();
              }}
              className="flex items-center text-[#1CD5F5] font-semibold text-base hover:underline"
            >
              <ArrowLeft size={20} className="mr-1" />
              {step > 0 ? "Retour" : "Retour à la sélection"}
            </Button>
            <Button
              type="button"
              onClick={async () => {
                setLoading(true);
                if (onProceed) await onProceed();
                else submitRef.current?.click();
              }}
              disabled={canProceed === false || loading}
              className="w-full md:w-[200px] h-12 md:h-[60px] bg-[#1CD5F5] text-white rounded-[12px] text-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#00b8e6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Chargement...</span>
              ) : step < steps.length - 1 ? (
                <>
                  suivant <ArrowRight size={20} />
                </>
              ) : (
                <>
                  terminer <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
