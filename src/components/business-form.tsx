// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { registerBusiness } from "@/app/action";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   ArrowRight,
//   Loader2,
//   CheckCircle2,
//   Building2,
//   User,
//   Mail,
//   Check,
//   AlertCircle,
//   Info,
//   ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import EmailVerification from "@/components/email-verification";
// import { motion } from "framer-motion";
// import {
//   updatedCountriesList,
//   isValidEmail,
//   isValidPhoneForCountry,
// } from "@/lib/form-utils";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useSearchParams } from "next/navigation";
// import CountrySelector from "@/components/country-selector";
// import PhoneInputWithFlag from "@/components/phone-input-with-flag";
// import { cn } from "@/lib/utils";
// import { useDebounce } from "@/hooks/use-debounce";
// import { Alert, AlertDescription } from "./ui/alert";

// interface BusinessFormProps {
//   utmSource?: string;
//   utmMedium?: string;
//   utmCampaign?: string;
//   onStepChange?: (step: number) => void;
//   parrainId?: string;
// }

// export default function BusinessForm({
//   utmSource,
//   utmMedium,
//   utmCampaign,
//   onStepChange,
//   parrainId,
// }: BusinessFormProps) {
//   const [step, setStep] = useState(1);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const urlParrainId = searchParams.get("ref");

//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionError, setSubmissionError] = useState<string | null>(null);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isCheckingPhone, setIsCheckingPhone] = useState(false);
//   const [isCheckingEmail, setIsCheckingEmail] = useState(false);
//   const [isStep1Valid, setIsStep1Valid] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     companyName: "",
//     city: "",
//     country: "",
//     companySize: "",
//     sector: "",
//     otherSector: "",
//     mainNeed: "",
//     companyNeeds: [] as string[],
//     companyChallenges: "",
//     companyDescription: "",
//     companyWebsite: "",
//     companyFoundingYear: "",
//     subscribedToNewsletter: false,
//     referralSource: "",
//   });

//   const [success, setSuccess] = useState<string | null>(null);

//   const [validationErrors, setValidationErrors] = useState<{
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     phone?: string;
//     companyName?: string;
//     city?: string;
//     country?: string;
//     companySize?: string;
//   }>({});

//   const debouncedEmail = useDebounce(formData.email, 500);
//   const debouncedPhone = useDebounce(formData.phone, 500);

//   useEffect(() => {
//     if (formData.email && !isValidEmail(formData.email)) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         email: "Veuillez entrer une adresse email valide",
//       }));
//     } else {
//       setValidationErrors((prev) => {
//         const { email, ...rest } = prev;
//         return rest;
//       });
//     }
//   }, [formData.email]);

//   useEffect(() => {
//     if (formData.phone && formData.country) {
//       if (!isValidPhoneForCountry(formData.phone, formData.country)) {
//         const country = updatedCountriesList.find(
//           (c) => c.code === formData.country
//         );
//         setValidationErrors((prev) => ({
//           ...prev,
//           phone: `Format invalide. Exemple: ${country?.example || ""}`,
//         }));
//       } else {
//         setValidationErrors((prev) => {
//           const { phone, ...rest } = prev;
//           return rest;
//         });
//       }
//     }
//   }, [formData.phone, formData.country]);

//   useEffect(() => {
//     const checkEmailUniqueness = async () => {
//       if (debouncedEmail && isValidEmail(debouncedEmail)) {
//         setIsCheckingEmail(true);
//         try {
//           const response = await fetch("/api/check-unique", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ field: "email", value: debouncedEmail }),
//           });

//           const data = await response.json();

//           if (!data.isUnique) {
//             setValidationErrors((prev) => ({
//               ...prev,
//               email: data.message,
//             }));
//           }
//         } catch (error) {
//           console.error("Error checking email uniqueness:", error);
//         } finally {
//           setIsCheckingEmail(false);
//         }
//       }
//     };

//     checkEmailUniqueness();
//   }, [debouncedEmail]);

//   useEffect(() => {
//     const checkPhoneUniqueness = async () => {
//       if (
//         debouncedPhone &&
//         formData.country &&
//         isValidPhoneForCountry(debouncedPhone, formData.country)
//       ) {
//         setIsCheckingPhone(true);
//         try {
//           const response = await fetch("/api/check-unique", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ field: "phone", value: debouncedPhone }),
//           });

//           const data = await response.json();

//           if (!data.isUnique) {
//             setValidationErrors((prev) => ({
//               ...prev,
//               phone: data.message,
//             }));
//           }
//         } catch (error) {
//           console.error("Error checking phone uniqueness:", error);
//         } finally {
//           setIsCheckingPhone(false);
//         }
//       }
//     };

//     checkPhoneUniqueness();
//   }, [debouncedPhone, formData.country]);

//   useEffect(() => {
//     if (onStepChange) {
//       onStepChange(step);
//     }
//   }, [step, onStepChange]);

//   useEffect(() => {
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "email",
//       "phone",
//       "companyName",
//       "city",
//       "country",
//       "companySize",
//     ];
//     const hasMissingFields = requiredFields.some(
//       (field) => !formData[field as keyof typeof formData]
//     );
//     const hasValidationErrors = Object.keys(validationErrors).length > 0;
//     setIsStep1Valid(!hasMissingFields && !hasValidationErrors);
//   }, [formData, validationErrors]);

//   const handleNeedChange = (need: string, checked: boolean) => {
//     setFormData((prev) => {
//       if (checked) {
//         return { ...prev, companyNeeds: [...prev.companyNeeds, need] };
//       } else {
//         return {
//           ...prev,
//           companyNeeds: prev.companyNeeds.filter((n) => n !== need),
//         };
//       }
//     });
//   };

//   const validateStep1 = () => {
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "email",
//       "phone",
//       "companyName",
//       "city",
//       "country",
//       "companySize",
//     ];
//     const newErrors: Record<string, string> = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field as keyof typeof formData]) {
//         newErrors[field] = `${
//           field.charAt(0).toUpperCase() +
//           field
//             .slice(1)
//             .replace(/([A-Z])/g, " $1")
//             .toLowerCase()
//         } est requis`;
//       }
//     });

//     setValidationErrors((prev) => ({ ...prev, ...newErrors }));
//     return (
//       Object.keys(newErrors).length === 0 &&
//       Object.keys(validationErrors).length === 0
//     );
//   };

//   const validateStep3 = () => {
//     const requiredFields = ["sector", "mainNeed"];
//     const missingFields = requiredFields.filter(
//       (field) => !formData[field as keyof typeof formData]
//     );
//     if (formData.sector === "AUTRE" && !formData.otherSector) {
//       return false;
//     }
//     return missingFields.length === 0;
//   };

//   const handlePhoneBlur = () => {
//     const phone = formData.phone.trim();
//     if (!phone) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         phone: "Le numéro de téléphone est requis",
//       }));
//       return;
//     }

//     if (formData.country && !isValidPhoneForCountry(phone, formData.country)) {
//       const country = updatedCountriesList.find(
//         (c) => c.code === formData.country
//       );
//       setValidationErrors((prev) => ({
//         ...prev,
//         phone: `Format invalide. Exemple: ${country?.example || ""}`,
//       }));
//       return;
//     }

//     setValidationErrors((prev) => {
//       const { phone, ...rest } = prev;
//       return rest;
//     });
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     const country = updatedCountriesList.find(
//       (c) => c.code === formData.country
//     );
//     const prefix = country?.prefix || "";

//     let cleanValue = value.replace(prefix, "").replace(/\D/g, "");
//     if (cleanValue.startsWith("0") && prefix) {
//       cleanValue = cleanValue.slice(1);
//     }
//     setFormData((prev) => ({
//       ...prev,
//       phone: prefix + cleanValue,
//     }));
//   };

//   const handleCountryChange = (countryCode: string) => {
//     const country = updatedCountriesList.find((c) => c.code === countryCode);
//     const prefix = country?.prefix || "";
//     const currentPhone = formData.phone.replace(prefix, "").replace(/\D/g, "");

//     setFormData((prev) => ({
//       ...prev,
//       country: countryCode,
//       phone: prefix + currentPhone,
//     }));
//     setValidationErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors.country;
//       delete newErrors.phone;
//       return newErrors;
//     });
//   };

//   const sendVerificationEmail = async (email: string) => {
//     try {
//       const verificationToken = Math.floor(
//         100000 + Math.random() * 900000
//       ).toString();

//       sessionStorage.setItem(`verification_${email}`, verificationToken);

//       const emailContent = {
//         to: email,
//         subject: "Vérification de votre adresse email",
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//             <h2 style="color: #2563eb;">Vérification de votre adresse email</h2>
//             <p>Merci de votre inscription ! Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>
//             <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
//               ${verificationToken}
//             </div>
//             <p>Ce code est valable pendant 10 minutes.</p>
//             <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
//           </div>
//         `,
//       };

//       const response = await fetch("/api/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(emailContent),
//       });

//       if (!response.ok) {
//         throw new Error("Erreur lors de l'envoi de l'email");
//       }
//       setSuccess("Code de vérification envoyé à votre adresse email");
//     } catch (err) {
//       console.error("Erreur:", err);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (step === 3) {
//       setIsSubmitting(true);
//       setSubmissionError(null);

//       const formDataObj = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           value.forEach((item) => formDataObj.append(key, item));
//         } else {
//           formDataObj.append(key, value.toString());
//         }
//       });

//       if (utmSource) formDataObj.append("utmSource", utmSource);
//       if (utmMedium) formDataObj.append("utmMedium", utmMedium);
//       if (utmCampaign) formDataObj.append("utmCampaign", utmCampaign);
//       formDataObj.append("emailVerified", isEmailVerified.toString());

//       const effectiveParrainId = parrainId || urlParrainId;
//       if (effectiveParrainId) {
//         formDataObj.append("parrainId", effectiveParrainId);
//       }

//       try {
//         const result = await registerBusiness(formDataObj);
//         if (result.success) {
//           setIsSuccess(true);
//           setTimeout(() => {
//             router.push(result.redirectTo || "/register/success");
//           }, 3000);
//         } else {
//           setSubmissionError(
//             result.error || "Une erreur est survenue lors de l'inscription."
//           );
//         }
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setSubmissionError(
//           "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
//         );
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const nextStep = async () => {
//     if (step === 1) {
//       await sendVerificationEmail(formData.email);

//       const isValid = validateStep1();
//       if (!isValid) return;
//       handlePhoneBlur();
//       if (Object.keys(validationErrors).length === 0) {
//         setStep(2);
//       }
//     } else if (step === 2 && isEmailVerified) {
//       setStep(3);
//     }
//   };

//   const prevStep = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   const handleEmailVerified = () => {
//     setIsEmailVerified(true);
//     setTimeout(() => {
//       setStep(3);
//     }, 1000);
//   };

//   const fadeInUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   const renderProgressSteps = () => {
//     const steps = [
//       { number: 1, title: "Identité", icon: <User className="h-5 w-5" /> },
//       { number: 2, title: "Validation", icon: <Mail className="h-5 w-5" /> },
//       { number: 3, title: "Profil", icon: <Building2 className="h-5 w-5" /> },
//     ];

//     return (
//       <div className="mb-6">
//         <div
//           className="flex items-center justify-between w-[460.83px] h-[32.94px] relative"
//           style={{ gap: "10px" }}
//         >
//           <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
//           {steps.map((item) => (
//             <div
//               key={item.number}
//               className="flex flex-col items-center z-10 relative"
//             >
//               <motion.div
//                 className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
//                   step >= item.number
//                     ? "bg-[#1CD5F5] text-white shadow-md"
//                     : "bg-white border-2 border-gray-200 text-gray-400"
//                 }`}
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//                 style={{ width: "40px", height: "40px" }}
//               >
//                 {step > item.number ? (
//                   <Check className="h-6 w-6" />
//                 ) : (
//                   item.icon
//                 )}
//               </motion.div>
//               <span
//                 className={`text-xs font-medium ${
//                   step >= item.number ? "text-[#1CD5F5]" : "text-gray-500"
//                 }`}
//               >
//                 {item.title}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const RequiredLabel = ({
//     htmlFor,
//     children,
//     tooltip,
//   }: {
//     htmlFor: string;
//     children: React.ReactNode;
//     tooltip?: string;
//   }) => (
//     <div className="flex items-center">
//       <Label
//         htmlFor={htmlFor}
//         className="flex items-center text-sm font-semibold text-[#013959]"
//       >
//         {children} <span className="text-red-500 ml-1">*</span>
//       </Label>
//       {tooltip && (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
//             </TooltipTrigger>
//             <TooltipContent>
//               <p className="max-w-xs text-xs">{tooltip}</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       )}
//     </div>
//   );

//   const ErrorMessage = ({ message }: { message: string }) => (
//     <div className="flex items-center mt-1 text-sm text-red-500 h-6">
//       <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
//       <span>{message}</span>
//     </div>
//   );

//   return (
//     <div
//       className="bg-white border-[3px] border-[rgba(215, 215, 219, 0.74)] rounded-[22px] flex flex-col justify-center items-center p-[91px_61px]"
//       style={{
//         width: "1013px",
//         minHeight: "1151.69px",
//         left: "calc(50% - 1013px/2 - 24.5px)",
//         top: "300px",
//         boxShadow:
//           "0px 44px 18px rgba(171, 171, 171, 0.01), 0px 25px 15px rgba(171, 171, 171, 0.03), 0px 11px 11px rgba(171, 171, 171, 0.05), 0px 3px 6px rgba(171, 171, 171, 0.06)",
//         position: "absolute",
//         gap: "10px",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="w-full h-full flex flex-col items-center"
//       >
//         <div className="mb-16 text-center">
//           {renderProgressSteps()}
//         </div>
//         {isSuccess ? (
//           <motion.div
//             className="flex flex-col items-start w-[893px]"
//             style={{ padding: "0px", gap: "29px" }}
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}
//           >
//             <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
//               <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//               Inscription réussie !
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300">
//               Merci pour votre inscription. Vous serez redirigé vers la page de
//               confirmation.
//             </p>
//           </motion.div>
//         ) : (
//           <>
//             {submissionError && (
//               <motion.div
//                 className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center w-full max-w-[893px]"
//                 initial="hidden"
//                 animate="visible"
//                 variants={fadeInUp}
//               >
//                 <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//                 <p className="text-sm text-red-500">{submissionError}</p>
//               </motion.div>
//             )}

//             {step === 1 && (
//               <motion.div
//                 className="flex flex-col items-start w-[893px]"
//                 style={{ padding: "0px", gap: "29px" }}
//                 initial="hidden"
//                 animate="visible"
//                 variants={fadeInUp}
//               >
//                 <div className="mb-6">
//                   <h3
//                     className="text-xl font-semibold text-[#013959] mb-2"
//                     style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
//                   >
//                     Informations personnelles
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eiusmod,
//                     nisi nec tincidun...
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-[29px] w-full">
//                   {/* Prénom et Nom */}
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="firstName">Prénom</RequiredLabel>
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       required
//                       value={formData.firstName}
//                       onChange={(e) => {
//                         setFormData({ ...formData, firstName: e.target.value });
//                         setValidationErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.firstName;
//                           return newErrors;
//                         });
//                       }}
//                       onBlur={() => {
//                         if (!formData.firstName) {
//                           setValidationErrors((prev) => ({
//                             ...prev,
//                             firstName: "Le prénom est requis",
//                           }));
//                         }
//                       }}
//                       className={cn(
//                         "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
//                         validationErrors.firstName && "border-red-500 focus:ring-red-100"
//                       )}
//                     />
//                     {validationErrors.firstName && (
//                       <ErrorMessage message={validationErrors.firstName} />
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="lastName">Nom</RequiredLabel>
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       required
//                       value={formData.lastName}
//                       onChange={(e) => {
//                         setFormData({ ...formData, lastName: e.target.value });
//                         setValidationErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.lastName;
//                           return newErrors;
//                         });
//                       }}
//                       onBlur={() => {
//                         if (!formData.lastName) {
//                           setValidationErrors((prev) => ({
//                             ...prev,
//                             lastName: "Le nom est requis",
//                           }));
//                         }
//                       }}
//                       className={cn(
//                         "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
//                         validationErrors.lastName && "border-red-500 focus:ring-red-100"
//                       )}
//                     />
//                     {validationErrors.lastName && (
//                       <ErrorMessage message={validationErrors.lastName} />
//                     )}
//                   </div>

//                   {/* Email et Pays */}
//                   <div className="space-y-2">
//                     <RequiredLabel
//                       htmlFor="email"
//                       tooltip="Utilisez une adresse email professionnelle valide. Elle sera vérifiée à l'étape suivante."
//                     >
//                       Email professionnel
//                     </RequiredLabel>
//                     <div className="relative">
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         required
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         className={cn(
//                           "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
//                           validationErrors.email && "border-red-500 focus:ring-red-100"
//                         )}
//                       />
//                       {isCheckingEmail && (
//                         <Loader2
//                           className="absolute right-3 top-3.5 text-[#1CD5F5] animate-spin"
//                           size={18}
//                         />
//                       )}
//                     </div>
//                     {validationErrors.email && (
//                       <ErrorMessage message={validationErrors.email} />
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="country">Pays</RequiredLabel>
//                     <CountrySelector
//                       value={formData.country}
//                       onChange={handleCountryChange}
//                       onPrefixChange={(prefix) =>
//                         setFormData((prev) => ({ ...prev, phone: prefix }))
//                       }
//                       error={validationErrors.country}
//                     />
//                     {validationErrors.country && (
//                       <ErrorMessage message={validationErrors.country} />
//                     )}
//                   </div>

//                   {/* Téléphone et Nom de l'entreprise */}
//                   <div className="space-y-2">
//                     <RequiredLabel
//                       htmlFor="phone"
//                       tooltip="Le format du numéro dépend du pays sélectionné. Vous pouvez commencer par le préfixe international (+) ou par 0."
//                     >
//                       Téléphone de l'entreprise
//                     </RequiredLabel>
//                     <div
//                       className={cn(
//                         "flex items-center rounded-lg border border-gray-300 bg-white h-12 overflow-hidden",
//                         validationErrors.phone
//                           ? "border-red-500"
//                           : "focus-within:border-[#1CD5F5] focus-within:ring-2 focus-within:ring-[#1CD5F5]/20"
//                       )}
//                     >
//                       <PhoneInputWithFlag
//                         country={
//                           updatedCountriesList.find((c) => c.code === formData.country)?.name || ""
//                         }
//                         flag={
//                           updatedCountriesList.find((c) => c.code === formData.country)?.flag || ""
//                         }
//                         prefix={
//                           updatedCountriesList.find((c) => c.code === formData.country)?.prefix || ""
//                         }
//                       />
//                       <Input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         required
//                         value={
//                           formData.country &&
//                           formData.phone.startsWith(
//                             updatedCountriesList.find((c) => c.code === formData.country)?.prefix || ""
//                           )
//                             ? formData.phone.replace(
//                                 updatedCountriesList.find((c) => c.code === formData.country)?.prefix || "",
//                                 ""
//                               )
//                             : formData.phone
//                         }
//                         onChange={handlePhoneChange}
//                         onBlur={handlePhoneBlur}
//                         placeholder="Numéro de téléphone"
//                         className={cn(
//                           "flex-1 border-0 rounded-r-lg h-full pl-2 pr-2 focus-visible:ring-0 focus-visible:ring-offset-0",
//                           validationErrors.phone && "text-red-600"
//                         )}
//                       />
//                       {isCheckingPhone && (
//                         <Loader2
//                           className="absolute right-3 top-3.5 text-[#1CD5F5] animate-spin"
//                           size={18}
//                         />
//                       )}
//                     </div>
//                     {validationErrors.phone ? (
//                       <ErrorMessage message={validationErrors.phone} />
//                     ) : (
//                       formData.country && (
//                         <p className="text-xs text-gray-500 mt-1">
//                           {updatedCountriesList.find((c) => c.code === formData.country)?.example ||
//                             "Format international"}
//                         </p>
//                       )
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="companyName">Nom de l'entreprise</RequiredLabel>
//                     <Input
//                       id="companyName"
//                       name="companyName"
//                       required
//                       value={formData.companyName}
//                       onChange={(e) => {
//                         setFormData({ ...formData, companyName: e.target.value });
//                         setValidationErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.companyName;
//                           return newErrors;
//                         });
//                       }}
//                       onBlur={() => {
//                         if (!formData.companyName) {
//                           setValidationErrors((prev) => ({
//                             ...prev,
//                             companyName: "Le nom de l'entreprise est requis",
//                           }));
//                         }
//                       }}
//                       className={cn(
//                         "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
//                         validationErrors.companyName && "border-red-500 focus:ring-red-100"
//                       )}
//                     />
//                     {validationErrors.companyName && (
//                       <ErrorMessage message={validationErrors.companyName} />
//                     )}
//                   </div>

//                   {/* Ville et Taille de l'entreprise */}
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="city">Ville (Siège social)</RequiredLabel>
//                     <Input
//                       id="city"
//                       name="city"
//                       required
//                       placeholder="Ex: Paris"
//                       value={formData.city}
//                       onChange={(e) => {
//                         setFormData({ ...formData, city: e.target.value });
//                         setValidationErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.city;
//                           return newErrors;
//                         });
//                       }}
//                       onBlur={() => {
//                         if (!formData.city) {
//                           setValidationErrors((prev) => ({
//                             ...prev,
//                             city: "La ville est requise",
//                           }));
//                         }
//                       }}
//                       className={cn(
//                         "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
//                         validationErrors.city && "border-red-500 focus:ring-red-100"
//                       )}
//                     />
//                     {validationErrors.city && <ErrorMessage message={validationErrors.city} />}
//                   </div>
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="companySize">Taille de l'entreprise</RequiredLabel>
//                     <Select
//                       name="companySize"
//                       value={formData.companySize}
//                       onValueChange={(value) => {
//                         setFormData({ ...formData, companySize: value });
//                         setValidationErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.companySize;
//                           return newErrors;
//                         });
//                       }}
//                       required
//                     >
//                       <SelectTrigger
//                         className={cn(
//                           "w-[424px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
//                           validationErrors.companySize && "border-red-500 focus:border-red-500 focus:ring-red-100",
//                           "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
//                         )}
//                         style={{ height: "50px", minHeight: "50px", borderWidth: "0.01px", boxSizing: "border-box" }}
//                       >
//                         <SelectValue placeholder="Sélectionnez la taille" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
//                         <SelectItem value="STARTUP" className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer">
//                           Startup
//                         </SelectItem>
//                         <SelectItem value="PME" className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer">
//                           PME
//                         </SelectItem>
//                         <SelectItem value="GRANDE_ENTREPRISE" className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer">
//                           Grande entreprise
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     {validationErrors.companySize && (
//                       <ErrorMessage message={validationErrors.companySize} />
//                     )}
//                   </div>
//                 </div>
//                 {success && (
//                   <Alert
//                     variant="default"
//                     className="mb-4 bg-green-50 border-green-200 text-green-800 w-full max-w-[893px]"
//                   >
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertDescription>{success}</AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="w-full h-[100px] flex items-end justify-end">
//                   <Button
//                     type="button"
//                     onClick={nextStep}
//                     className={cn(
//                       "flex items-center justify-center w-[152px] h-[58px] bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 text-white rounded-[10px] py-[13px] px-[43.5px] gap-[10px] flex-none order-1 font-medium transition-all duration-200",
//                       (!isStep1Valid || isCheckingPhone || isCheckingEmail) &&
//                         "bg-[#1CD5F5] cursor-not-allowed hover:bg-gray-300"
//                     )}
//                     disabled={!isStep1Valid || isCheckingPhone || isCheckingEmail}
//                   >
//                     {isCheckingPhone || isCheckingEmail ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Vérification...
//                       </>
//                     ) : (
//                       <>
//                         <span className="flex items-center justify-center w-full" style={{ fontFamily: "Montserrat, sans-serif" }}>
//                           Next
//                           <ArrowRight className="h-4 w-4 ml-2" />
//                         </span>
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </motion.div>
//             )}

// {step === 2 && (() => {
//   const [showSuccess, setShowSuccess] = useState(false); // État pour gérer la visibilité de l'alerte

//   // Effet pour gérer la disparition de l'alerte après 10 minutes
//   useEffect(() => {
//     if (success) {
//       setShowSuccess(true); // Affiche l'alerte lorsque success est défini
//       const timer = setTimeout(() => {
//         setShowSuccess(false); // Masque l'alerte après 10 minutes
//       }, 600000); // 10 minutes = 600 000 ms

//       return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté ou si success change
//     }
//   }, [success]); // Déclenché à chaque changement de success

//   return (
//     <motion.div
//       className="space-y-6 text-center w-full max-w-[893px]"
//       initial="hidden"
//       animate="visible"
//       variants={fadeInUp}
//       style={{
//         width: "893px",
//         height: "946.94px",
//         padding: "0px",
//         gap: "75px",
//       }}
//     >
//       <div className="mb-8" style={{ gap: "56px" }}>
//         <div
//           className="flex items-center justify-center w-[64px] h-[64px] bg-[#1CD5F5]/10 rounded-full mx-auto mb-4"
//         >
//           <Mail className="h-8 w-8 text-[#2f88bb]" />
//         </div>
//         <h3
//           className="mb-5 text-lg font-semibold text-[#013959]"
//           style={{ fontFamily: "Montserrat", fontWeight: 600, lineHeight: "29px" }}
//         >
//           Vérification d'email
//         </h3>

//         {success && showSuccess && ( // Ajout de la condition showSuccess
//           <Alert
//             variant="default"
//             className="mb-4 bg-green-50 border-green-200 text-green-800 w-full max-w-[893px]"
//           >
//             <CheckCircle2 className="h-4 w-4 text-green-600" />
//             <AlertDescription>{success}</AlertDescription>
//           </Alert>
//         )}
//       </div>

//       <EmailVerification
//         email={formData.email}
//         onVerified={handleEmailVerified}
//         onBack={prevStep}
//       />
//       <div className="flex flex-col gap-[13px] w-full max-w-[893px]"></div>

//       <div
//         className="flex justify-between items-center w-full max-w-[890px] h-[58px]"
//         style={{ gap: "618px" }}
//       >
//         <Button
//           type="button"
//           variant="outline"
//           onClick={prevStep}
//           className="flex items-center gap-2 border-none text-[#1CD5F5] bg-transparent"
//           style={{
//             fontFamily: "Montserrat",
//             fontWeight: 500,
//             fontSize: "20px",
//             lineHeight: "24px",
//           }}
//         >
//           <div
//             style={{
//               width: "12px",
//               height: "5.5px",
//               border: "2.39998px solid #1CD5F5",
//               transform: "rotate(-90deg)",
//             }}
//           />
//           Previous
//         </Button>
//         <Button
//           type="button"
//           onClick={nextStep}
//           className="bg-[#1CD5F5] text-white rounded-[10px] h-[58px] px-[34px]"
//           style={{
//             padding: "14px 34px 14px 53px",
//             fontFamily: "Montserrat",
//             fontWeight: 500,
//             fontSize: "20px",
//             lineHeight: "24px",
//           }}
//         >
//           Next
//           <div
//             style={{
//               width: "12px",
//               height: "5.5px",
//               border: "2.39998px solid #FFFFFF",
//               transform: "rotate(90deg)",
//             }}
//           />
//         </Button>
//       </div>
//     </motion.div>
//   );
// })()}

//             {step === 3 && (
//               <motion.div
//                 className="space-y-5 w-full max-w-[800px]"
//                 initial="hidden"
//                 animate="visible"
//                 variants={fadeInUp}
//               >
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-[#013959] mb-2">
//                     Profil entreprise
//                   </h3>
//                   <p className="text-gray-500 text-sm">
//                     Parlez-nous un peu plus de votre entreprise.
//                     <span className="text-red-500 ml-1">*</span>
//                     <span className="italic text-xs ml-1">
//                       Champs obligatoires
//                     </span>
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <RequiredLabel htmlFor="sector">
//                     Secteur d'activité
//                   </RequiredLabel>
//                   <Select
//                     name="sector"
//                     value={formData.sector}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, sector: value })
//                     }
//                     required
//                   >
//                     <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200">
//                       <SelectValue placeholder="Sélectionnez votre secteur" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="TECHNOLOGIE">Technologie</SelectItem>
//                       <SelectItem value="AGRO_HALIEUTIQUE">
//                         Agro-Halieutique
//                       </SelectItem>
//                       <SelectItem value="COMMERCE">Commerce</SelectItem>
//                       <SelectItem value="FINANCE">Finance</SelectItem>
//                       <SelectItem value="SANTE">Santé</SelectItem>
//                       <SelectItem value="ÉNERGIE_DURABILITE">
//                         Énergie & Durabilité
//                       </SelectItem>
//                       <SelectItem value="TRANSPORT">Transport</SelectItem>
//                       <SelectItem value="INDUSTRIE">Industrie</SelectItem>
//                       <SelectItem value="COMMERCE_DISTRIBUTION">
//                         Commerce & Distribution
//                       </SelectItem>
//                       <SelectItem value="SERVICES_PROFESSIONNELS">
//                         Services Professionnels
//                       </SelectItem>
//                       <SelectItem value="EDUCATION">Éducation</SelectItem>
//                       <SelectItem value="TOURISME">Tourisme</SelectItem>
//                       <SelectItem value="MEDIA_DIVERTISSEMENT">
//                         Média & Divertissement
//                       </SelectItem>
//                       <SelectItem value="AUTRE">Autre</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {formData.sector === "AUTRE" && (
//                   <div className="space-y-2">
//                     <RequiredLabel htmlFor="otherSector">
//                       Précisez votre secteur
//                     </RequiredLabel>
//                     <Input
//                       id="otherSector"
//                       name="otherSector"
//                       required
//                       value={formData.otherSector}
//                       onChange={(e) =>
//                         setFormData({ ...formData, otherSector: e.target.value })
//                       }
//                       placeholder="Veuillez préciser votre secteur d'activité"
//                       className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200"
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <RequiredLabel
//                     htmlFor="mainNeed"
//                     tooltip="Sélectionnez le besoin principal qui correspond le mieux à vos objectifs actuels."
//                   >
//                     Besoin principal
//                   </RequiredLabel>
//                   <Select
//                     name="mainNeed"
//                     value={formData.mainNeed}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, mainNeed: value })
//                     }
//                     required
//                   >
//                     <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200">
//                       <SelectValue placeholder="Dites-nous en plus sur vos besoins !" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="PRESENTATION_MARQUE">
//                         Présenter votre marque, votre vitrine
//                       </SelectItem>
//                       <SelectItem value="RESEAU_B2B">
//                         Développer votre réseau B2B
//                       </SelectItem>
//                       <SelectItem value="TALENTS_QUALIFIES">
//                         Attirer des talents qualifiés grâce au matching
//                       </SelectItem>
//                       <SelectItem value="TABLEAUX_BORD">
//                         Suivre vos performances via des tableaux de bord
//                         analytiques
//                       </SelectItem>
//                       <SelectItem value="INSIGHTS_SECTORIELS">
//                         Accéder à des insights sectoriels et des rapports de
//                         tendances
//                       </SelectItem>
//                       <SelectItem value="OFFRES_EMPLOI">
//                         Accéder aux offres d'emploi disponibles sur la plateforme
//                       </SelectItem>
//                       <SelectItem value="MENTORS_SECTORIELS">
//                         Être mis en relation avec des mentors sectoriels
//                       </SelectItem>
//                       <SelectItem value="FREELANCE_HUB">
//                         Accéder au Freelance & Consulting Hub pour publier des
//                         missions
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companyWebsite">
//                     Site web de l'entreprise (optionnel)
//                   </Label>
//                   <Input
//                     id="companyWebsite"
//                     name="companyWebsite"
//                     placeholder="https://example.com"
//                     value={formData.companyWebsite}
//                     onChange={(e) =>
//                       setFormData({ ...formData, companyWebsite: e.target.value })
//                     }
//                     className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companyDescription">
//                     Description de l'entreprise (optionnel)
//                   </Label>
//                   <Textarea
//                     id="companyDescription"
//                     name="companyDescription"
//                     placeholder="Une brève description de votre entreprise et de ses activités"
//                     className="min-h-[80px] border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 rounded-lg transition-all duration-200"
//                     value={formData.companyDescription}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         companyDescription: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companyFoundingYear">
//                     Année de fondation (optionnel)
//                   </Label>
//                   <Input
//                     id="companyFoundingYear"
//                     name="companyFoundingYear"
//                     placeholder="Ex: 2010"
//                     value={formData.companyFoundingYear}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         companyFoundingYear: e.target.value,
//                       })
//                     }
//                     className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label>Besoins additionnels (optionnel)</Label>
//                   <div className="grid sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
//                     {[
//                       {
//                         id: "need-brand",
//                         value: "PRESENTATION_MARQUE",
//                         label: "Présentation de marque",
//                         desc: "Augmentez votre visibilité",
//                       },
//                       {
//                         id: "need-b2b",
//                         value: "RESEAU_B2B",
//                         label: "Réseau B2B",
//                         desc: "Développez vos partenariats",
//                       },
//                       {
//                         id: "need-recruitment",
//                         value: "TALENTS_QUALIFIES",
//                         label: "Talents qualifiés",
//                         desc: "Recrutez les meilleurs",
//                       },
//                       {
//                         id: "need-analytics",
//                         value: "TABLEAUX_BORD",
//                         label: "Tableaux de bord",
//                         desc: "Suivez vos performances",
//                       },
//                       {
//                         id: "need-insights",
//                         value: "INSIGHTS_SECTORIELS",
//                         label: "Insights sectoriels",
//                         desc: "Accédez aux tendances",
//                       },
//                       {
//                         id: "need-mentoring",
//                         value: "MENTORS_SECTORIELS",
//                         label: "Mentors sectoriels",
//                         desc: "Bénéficiez d'expertise",
//                       },
//                       {
//                         id: "need-freelance",
//                         value: "FREELANCE_HUB",
//                         label: "Freelance Hub",
//                         desc: "Publiez des missions",
//                       },
//                     ].map((need) => (
//                       <div key={need.id} className="flex items-start space-x-2">
//                         <Checkbox
//                           id={need.id}
//                           className="mt-1 border-gray-300 text-[#1CD5F5] focus:ring-[#1CD5F5] rounded"
//                           checked={formData.companyNeeds.includes(need.value)}
//                           onCheckedChange={(checked) =>
//                             handleNeedChange(need.value, checked as boolean)
//                           }
//                         />
//                         <div>
//                           <Label
//                             htmlFor={need.id}
//                             className="font-medium text-[#013959]"
//                           >
//                             {need.label}
//                           </Label>
//                           <p className="text-xs text-gray-500">{need.desc}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companyChallenges">
//                     Défis actuels de votre entreprise (optionnel)
//                   </Label>
//                   <Textarea
//                     id="companyChallenges"
//                     name="companyChallenges"
//                     placeholder="Quels sont les principaux défis auxquels votre entreprise fait face actuellement?"
//                     className="min-h-[80px] border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 rounded-lg transition-all duration-200"
//                     value={formData.companyChallenges}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         companyChallenges: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2 mt-4">
//                   <Checkbox
//                     id="subscribedToNewsletter"
//                     checked={formData.subscribedToNewsletter}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         subscribedToNewsletter: checked as boolean,
//                       })
//                     }
//                     className="border-gray-300 text-[#1CD5F5] focus:ring-[#1CD5F5] rounded"
//                   />
//                   <Label
//                     htmlFor="subscribedToNewsletter"
//                     className="text-sm text-[#013959]"
//                   >
//                     Je souhaite recevoir des informations sur les événements et
//                     opportunités
//                   </Label>
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 w-full max-w-[600px]">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={prevStep}
//                     className="order-1 sm:order-none border-gray-300 text-[#1CD5F5] hover:bg-[#1CD5F5]/10 rounded-lg shadow-sm transition-all duration-300 font-semibold w-full sm:w-auto"
//                   >
//                     Retour
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting || !validateStep3()}
//                     className="bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 rounded-lg shadow-md transition-all duration-300 font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Traitement...
//                       </>
//                     ) : (
//                       "Finaliser l'inscription"
//                     )}
//                   </Button>
//                 </div>
//               </motion.div>
//             )}
//           </>
//         )}
//       </form>
//     </div>
//   );
// }









"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { registerBusiness } from "@/app/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Check,
  AlertCircle,
  Info,
  ArrowLeft,
  UserCheckIcon,
  Badge,
} from "lucide-react";
import { useRouter } from "next/navigation";
import EmailVerification from "@/components/email-verification";
import { motion } from "framer-motion";
import {
  updatedCountriesList,
  isValidEmail,
  isValidPhoneForCountry,
} from "@/lib/form-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "next/navigation";
import CountrySelector from "@/components/country-selector";
import PhoneInputWithFlag from "@/components/phone-input-with-flag";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Alert, AlertDescription } from "./ui/alert";
import PhoneInput from "react-phone-number-input";

interface BusinessFormProps {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  onStepChange?: (step: number) => void;
  parrainId?: string;
}

export default function BusinessForm({
  utmSource,
  utmMedium,
  utmCampaign,
  onStepChange,
  parrainId,
}: BusinessFormProps) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParrainId = searchParams.get("ref");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    city: "",
    country: "",
    companySize: "",
    sector: "",
    otherSector: "",
    mainNeed: "",
    companyNeeds: [] as string[],
    companyChallenges: "",
    companyDescription: "",
    companyWebsite: "",
    companyFoundingYear: "",
    subscribedToNewsletter: false,
    referralSource: "",
    discoverySource: "", 
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    city?: string;
    country?: string;
    companySize?: string;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effet pour gérer la disparition de l'alerte après 5s minutes
  useEffect(() => {
    if (success) {
      setShowSuccess(true); 
      const timer = setTimeout(() => {
        setShowSuccess(false); // Masque l'alerte après 5s
      }, 5000); //5s 

      return () => clearTimeout(timer); // Nettoie le timer si success change
    }
  }, [success]);

  const debouncedEmail = useDebounce(formData.email, 500);
  const debouncedPhone = useDebounce(formData.phone, 500);

  useEffect(() => {
    if (formData.email && !isValidEmail(formData.email)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Veuillez entrer une adresse email valide",
      }));
    } else {
      setValidationErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.phone && formData.country) {
      if (!isValidPhoneForCountry(formData.phone, formData.country)) {
        const country = updatedCountriesList.find(
          (c) => c.code === formData.country
        );
        setValidationErrors((prev) => ({
          ...prev,
          phone: `Format invalide. Exemple: ${country?.example || ""}`,
        }));
      } else {
        setValidationErrors((prev) => {
          const { phone, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [formData.phone, formData.country]);

  useEffect(() => {
    const checkEmailUniqueness = async () => {
      if (debouncedEmail && isValidEmail(debouncedEmail)) {
        setIsCheckingEmail(true);
        try {
          const response = await fetch("/api/check-unique", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ field: "email", value: debouncedEmail }),
          });

          const data = await response.json();

          if (!data.isUnique) {

            setValidationErrors((prev) => ({
              ...prev,
              email: data.message,
            }));
          }
        } catch (error) {
          console.error("Error checking email uniqueness:", error);
        } finally {
          setIsCheckingEmail(false);
        }
      }
    };

    checkEmailUniqueness();
  }, [debouncedEmail]);
  const checkUnique = async (field: string, value: string) => {
    try {
      const response = await fetch("/api/check-unique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      })

      const data = await response.json()

      if (!data.isUnique) {
        setErrors((prev) => ({ ...prev, [field]: data.message }))
        return false
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
        return true
      }
    } catch (error) {
      console.error(`Erreur lors de la vérification de l'unicité du ${field}:`, error)
     
      return true
    }
  }
  useEffect(() => {
    const checkPhoneUniqueness = async () => {
      if (
        debouncedPhone &&
        formData.country &&
        isValidPhoneForCountry(debouncedPhone, formData.country)
      ) {
        setIsCheckingPhone(true);
        try {
          const response = await fetch("/api/check-unique", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ field: "phone", value: debouncedPhone }),
          });

          const data = await response.json();

          if (!data.isUnique) {
            setValidationErrors((prev) => ({
              ...prev,
              phone: data.message,
            }));
          }
        } catch (error) {
          console.error("Error checking phone uniqueness:", error);
        } finally {
          setIsCheckingPhone(false);
        }
      }
    };

    checkPhoneUniqueness();
  }, [debouncedPhone, formData.country]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "companyName",
      "city",
      "country",
      "companySize",
    ];
    const hasMissingFields = requiredFields.some(
      (field) => !formData[field as keyof typeof formData]
    );
    const hasValidationErrors = Object.keys(validationErrors).length > 0;
    setIsStep1Valid(!hasMissingFields && !hasValidationErrors);
  }, [formData, validationErrors]);

  const handleNeedChange = (need: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, companyNeeds: [...prev.companyNeeds, need] };
      } else {
        return {
          ...prev,
          companyNeeds: prev.companyNeeds.filter((n) => n !== need),
        };
      }
    });
  };

  const validateStep1 = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "companyName",
      "city",
      "country",
      "companySize",
    ];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
        } est requis`;
      }
    });

    setValidationErrors((prev) => ({ ...prev, ...newErrors }));
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(validationErrors).length === 0
    );
  };

  const validateStep3 = () => {
    const requiredFields = ["sector"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );
    if (formData.sector === "AUTRE" && !formData.otherSector) {
      return false;
    }
    return missingFields.length === 0;
  };
    const cleanPhoneNumber = (phone: string): string => {
    if (!phone) return ""
    // Supprimer tous les caractères non numériques (espaces, tirets, parenthèses, points, +)
    return phone.replace(/\D/g, "")
  }

  const validatePhoneFormat = (phone: string, countryCode: string): { isValid: boolean; error?: string } => {
    if (!phone) {
      return { isValid: false, error: "Le numéro de téléphone est requis" }
    }

    const country = updatedCountriesList.find((c) => c.code === countryCode)
    if (!country) {
      return { isValid: false, error: "Pays non reconnu" }
    }

    // Nettoyer le numéro pour compter uniquement les chiffres
    const cleanPhone = cleanPhoneNumber(phone)

    // Obtenir les limites de longueur pour ce pays
    const limits = getPhoneLengthLimits(countryCode)

    // Vérifier la longueur selon le type de limite
    if (limits.exactLength) {
      // Longueur exacte requise
      if (cleanPhone.length !== limits.exactLength) {
        return { isValid: false, error: "Format invalide" }
      }
    } else if (limits.min && limits.max) {
      // Plage de longueurs
      if (cleanPhone.length < limits.min || cleanPhone.length > limits.max) {
        return { isValid: false, error: "Format invalide" }
      }
    }

    // Préparer le numéro pour la validation regex selon le pays SÉLECTIONNÉ
    let phoneToValidate = phone

    // Forcer le préfixe du pays sélectionné
    if (!phoneToValidate.startsWith(country.prefix)) {
      // Si le numéro commence par 0, le remplacer par le préfixe du pays sélectionné
      if (phoneToValidate.startsWith("0")) {
        phoneToValidate = country.prefix + phoneToValidate.substring(1)
      }
      // Si le numéro commence par un autre préfixe (+), vérifier s'il correspond au pays sélectionné
      else if (phoneToValidate.startsWith("+")) {
        if (!phoneToValidate.startsWith(country.prefix)) {
          return { isValid: false, error: "Format invalide pour " + country.name }
        }
      }
      // Sinon, ajouter le préfixe du pays sélectionné
      else {
        phoneToValidate = country.prefix + phoneToValidate
      }
    }

    // Valider le numéro avec le regex du pays sélectionné
    const isValid = isValidPhoneForCountry(phoneToValidate, countryCode)

    if (!isValid) {
      return { isValid: false, error: "Format invalide pour " + country.name }
    }

    return { isValid: true }
  }
    const toE164Format = (phone: string): string => {
    const cleaned = cleanPhoneNumber(phone)
    if (!cleaned) return ""

    // S'assurer que le numéro commence par +
    if (phone.startsWith("+")) {
      return "+" + cleaned
    }

    return cleaned
  }
  const handlePhoneBlur = async () => {
    const phone = formData.phone.trim()
    if (!phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "Le numéro de téléphone est requis",
      }))
      return false
    }

    const countryCode = formData.country
    if (!countryCode) {
      setErrors((prev) => ({
        ...prev,
        phone: "Pays non sélectionné",
      }))
      return false
    }

    // Valider le format
    const validation = validatePhoneFormat(phone, countryCode)

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        phone: validation.error || "Format invalide",
      }))
      return false
    }

    // Effacer les erreurs
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.phone
      return newErrors
    })

    // Vérification d'unicité avec le numéro nettoyé
    setIsCheckingPhone(true)
    const cleanPhone = toE164Format(phone)
    const isUnique = await checkUnique("phone", cleanPhone)
    setIsCheckingPhone(false)
    return isUnique
  }

  const handlePhoneChange = (value?: string) => {
    // Convertir au format E.164 strict pour éviter l'erreur
    const cleanValue = value ? toE164Format(value) : ""

    // Mettre à jour le numéro de téléphone SANS changer le pays
    setFormData((prev) => ({ ...prev, phone: cleanValue }))

    // Valider immédiatement selon le pays SÉLECTIONNÉ dans la liste déroulante
    if (cleanValue && cleanValue.length >= 3) {
      const countryCode = formData.country
      const validation = validatePhoneFormat(cleanValue, countryCode)

      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          phone: validation.error || "Format invalide",
        }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.phone
          return newErrors
        })
      }
    } else {
      // Effacer les erreurs si le champ est vide ou trop court
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.phone
        return newErrors
      })
    }
  }

  const handleCountryChange = (countryCode: string) => {
    const country = updatedCountriesList.find((c) => c.code === countryCode);
    const prefix = country?.prefix || "";
    const currentPhone = formData.phone.replace(prefix, "").replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      phone: prefix + currentPhone,
    }));
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.country;
      delete newErrors.phone;
      return newErrors;
    });
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      sessionStorage.setItem(`verification_${email}`, verificationToken);

      const emailContent = {
        to: email,
        subject: "Vérification de votre adresse email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Vérification de votre adresse email</h2>
            <p>Merci de votre inscription ! Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${verificationToken}
            </div>
            <p>Ce code est valable pendant 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
          </div>
        `,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailContent),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
      setSuccess("Code de vérification envoyé à votre adresse email");
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 3) {
      setIsSubmitting(true);
      setSubmissionError(null);

      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataObj.append(key, item));
        } else {
          formDataObj.append(key, value.toString());
        }
      });

      if (utmSource) formDataObj.append("utmSource", utmSource);
      if (utmMedium) formDataObj.append("utmMedium", utmMedium);
      if (utmCampaign) formDataObj.append("utmCampaign", utmCampaign);
      formDataObj.append("emailVerified", isEmailVerified.toString());

      const effectiveParrainId = parrainId || urlParrainId;
      if (effectiveParrainId) {
        formDataObj.append("parrainId", effectiveParrainId);
      }

      try {
        const result = await registerBusiness(formDataObj);
        if (result.success) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push(result.redirectTo || "/register/success");
          }, 3000);
        } else {
          setSubmissionError(
            result.error || "Une erreur est survenue lors de l'inscription."
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionError(
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = validateStep1();
      if (!isValid) return;
      handlePhoneBlur();
      if (Object.keys(validationErrors).length === 0) {
        await sendVerificationEmail(formData.email);
        setStep(2);
      }
    } else if (step === 2 && isEmailVerified) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleEmailVerified = () => {
    setIsEmailVerified(true);
    setTimeout(() => {
      setStep(3);
    }, 1000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderProgressSteps = () => {
    const steps = [
      { number: 1, title: "Identité", icon: <User className="h-5 w-5" /> },
      { number: 2, title: "Validation", icon: <Mail className="h-5 w-5" /> },
      { number: 3, title: "Profil", icon: <Building2 className="h-5 w-5" /> },
    ];

    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between w-[460.83px] h-[32.94px] relative"
          style={{ gap: "10px" }}
        >
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          {steps.map((item) => (
            <div
              key={item.number}
              className="flex flex-col items-center z-10 relative"
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  step >= item.number
                    ? "bg-[#1CD5F5] text-white shadow-md"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                style={{ width: "40px", height: "40px" }}
              >
                {step > item.number ? (
                  <Check className="h-6 w-6" />
                ) : (
                  item.icon
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  step >= item.number ? "text-[#1CD5F5]" : "text-gray-500"
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RequiredLabel = ({
    htmlFor,
    children,
    tooltip,
  }: {
    htmlFor: string;
    children: React.ReactNode;
    tooltip?: string;
  }) => (
    <div className="flex items-center">
      <Label
        htmlFor={htmlFor}
        className="flex items-center text-sm font-semibold text-[#013959]"
      >
        {children} <span className="text-red-500 ml-1">*</span>
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
     const getPhoneLengthLimits = (countryCode: string): { exactLength?: number; min?: number; max?: number } => {
    const limits: Record<string, { exactLength?: number; min?: number; max?: number }> = {
      // Pays avec longueur exacte
      MA: { exactLength: 12 }, // +212 + 9 chiffres = 12 chiffres total
      FR: { exactLength: 11 }, // +33 + 9 chiffres = 11 chiffres total
      CA: { exactLength: 11 }, // +1 + 10 chiffres = 11 chiffres total
      US: { exactLength: 11 }, // +1 + 10 chiffres = 11 chiffres total
      ES: { exactLength: 11 }, // +34 + 9 chiffres = 11 chiffres total
      IT: { exactLength: 12 }, // +39 + 9 chiffres = 12 chiffres total
      BE: { exactLength: 11 }, // +32 + 9 chiffres = 11 chiffres total
      CH: { exactLength: 11 }, // +41 + 9 chiffres = 11 chiffres total
      DZ: { exactLength: 12 }, // +213 + 9 chiffres = 12 chiffres total
      TN: { exactLength: 11 }, // +216 + 8 chiffres = 11 chiffres total
      SN: { exactLength: 12 }, // +221 + 9 chiffres = 12 chiffres total
      CI: { exactLength: 13 }, // +225 + 10 chiffres = 13 chiffres total
      CM: { exactLength: 12 }, // +237 + 9 chiffres = 12 chiffres total

      // Pays avec plage de longueurs
      GB: { min: 13, max: 14 }, // +44 + 10-11 chiffres
      DE: { min: 12, max: 15 }, // +49 + 10-13 chiffres (variable selon la région)
    }

    return limits[countryCode] || { min: 10, max: 15 } // Valeurs par défaut
  }
    const getCurrentCountryCode = (): string => {
    return formData.country || "MA"
  }
   const getPhoneExample = (): string => {
    const country = updatedCountriesList.find((c) => c.code === formData.country)
    const limits = getPhoneLengthLimits(formData.country)

    let lengthInfo = ""
    if (limits.exactLength) {
      lengthInfo = ` (exactement ${limits.exactLength} chiffres)`
    } else if (limits.min && limits.max) {
      lengthInfo = ` (${limits.min}-${limits.max} chiffres)`
    }

    const countryName = country?.name || "ce pays"
    return `Format pour ${countryName}${lengthInfo}`
  }
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center mt-1 text-sm text-red-500 h-6">
      <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
useEffect(() => {
  console.log("valldation error ",validationErrors);
})
  return (
    <div
      className="bg-white border-[3px] border-[rgba(215, 215, 219, 0.74)] rounded-[22px] flex flex-col justify-start items-center p-[91px_61px]"
      style={{
        width: "1013px",
        minHeight: "800px",
        left: "calc(50% - 1013px/2 - 24.5px)",
        top: "300px",
        boxShadow:
          "0px 44px 18px rgba(171, 171, 171, 0.01), 0px 25px 15px rgba(171, 171, 171, 0.03), 0px 11px 11px rgba(171, 171, 171, 0.05), 0px 3px 6px rgba(171, 171, 171, 0.06)",
        position: "absolute",
        gap: "10px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col items-center"
      >
        <div className="mb-16  text-center">{renderProgressSteps()}</div>
        {isSuccess ? (
          <motion.div
            className="flex flex-col items-start w-[893px]"
            style={{ padding: "0px", gap: "29px" }}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Inscription réussie !
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Merci pour votre inscription. Vous serez redirigé vers la page de
              confirmation.
            </p>
          </motion.div>
        ) : (
          <>
            {submissionError && (
              <motion.div
                className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center w-full max-w-[893px]"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-500">{submissionError}</p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                className="flex flex-col items-start w-[893px]"
                style={{ padding: "0px", gap: "29px" }}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="mb-6">
                  <h3
                    className="text-xl font-semibold text-[#013959] flex items-center mt-10 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif"}}
                  >
                  <User className="mr-2 text-[#78bce3]" size={24} />
                    Informations personnelles
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    eiusmod, nisi nec tincidun...
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-[29px] w-full">
                  {/* Prénom et Nom */}
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="firstName">Prénom</RequiredLabel>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.firstName;
                          return newErrors;
                        });
                      }}
                      onBlur={() => {
                        if (!formData.firstName) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            firstName: "Le prénom est requis",
                          }));
                        }
                      }}
                      className={cn(
                        "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
                        validationErrors.firstName &&
                          "border-red-500 focus:ring-red-100"
                      )}
                    />
                    {validationErrors.firstName && (
                      <ErrorMessage message={validationErrors.firstName} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="lastName">Nom</RequiredLabel>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.lastName;
                          return newErrors;
                        });
                      }}
                      onBlur={() => {
                        if (!formData.lastName) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            lastName: "Le nom est requis",
                          }));
                        }
                      }}
                      className={cn(
                        "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
                        validationErrors.lastName &&
                          "border-red-500 focus:ring-red-100"
                      )}
                    />
                    {validationErrors.lastName && (
                      <ErrorMessage message={validationErrors.lastName} />
                    )}
                  </div>

                  {/* Email et Pays */}
                  <div className="space-y-2">
                    <RequiredLabel
                      htmlFor="email"
                      tooltip="Utilisez une adresse email professionnelle valide. Elle sera vérifiée à l'étape suivante."
                    >
                      Email professionnel
                    </RequiredLabel>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(
                          "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
                          validationErrors.email &&
                            "border-red-500 focus:ring-red-100"
                        )}
                      />
                      {isCheckingEmail && (
                        <Loader2
                          className="absolute right-3 top-3.5 text-[#1CD5F5] animate-spin"
                          size={18}
                        />
                      )}
                    </div>
                    {validationErrors.email && (
                      <ErrorMessage message={validationErrors.email} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="country">Pays</RequiredLabel>
                    <CountrySelector
                      value={formData.country}
                      onChange={handleCountryChange}
                      onPrefixChange={(prefix) =>
                        setFormData((prev) => ({ ...prev, phone: prefix }))
                      }
                      error={validationErrors.country}
                    />
                    {validationErrors.country && (
                      <ErrorMessage message={validationErrors.country} />
                    )}
                  </div>

                  {/* Téléphone et Nom de l'entreprise */}
                   <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                  Téléphone <span className="text-red-500 ml-1">*</span>
                </Label>
                <div
                  className={cn(
                    "rounded-lg bg-white dark:bg-gray-800 h-12 border",
                    errors.phone ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400",
                  )}
                >
                  <PhoneInput
                    defaultCountry={getCurrentCountryCode() as any}
                    value={formData.phone || undefined} // Passer undefined si vide pour éviter l'erreur E.164
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    className="w-full h-full border-none focus:outline-none focus:ring-0"
                    international
                    countryCallingCodeEditable={false}
                    placeholder="Entrez votre numéro de téléphone"
                  />
                  {isCheckingPhone && (
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400" />
                    </div>
                  )}
                </div>
                {errors.phone ? (
                  <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                    <AlertCircle className="mr-1 h-4 w-4" /> {errors.phone}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getPhoneExample()}</p>
                )}
              </div>
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="companyName">
                      Nom de l'entreprise
                    </RequiredLabel>
                    <Input
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => {
                        setFormData({ ...formData, companyName: e.target.value });
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.companyName;
                          return newErrors;
                        });
                      }}
                      onBlur={() => {
                        if (!formData.companyName) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            companyName: "Le nom de l'entreprise est requis",
                          }));
                        }
                      }}
                      className={cn(
                        "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
                        validationErrors.companyName &&
                          "border-red-500 focus:ring-red-100"
                      )}
                    />
                    {validationErrors.companyName && (
                      <ErrorMessage message={validationErrors.companyName} />
                    )}
                  </div>

                  {/* Ville et Taille de l'entreprise */}
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="city">
                      Ville (Siège social)
                    </RequiredLabel>
                    <Input
                      id="city"
                      name="city"
                      required
                      placeholder="Ex: Paris"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.city;
                          return newErrors;
                        });
                      }}
                      onBlur={() => {
                        if (!formData.city) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            city: "La ville est requise",
                          }));
                        }
                      }}
                      className={cn(
                        "h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200",
                        validationErrors.city && "border-red-500 focus:ring-red-100"
                      )}
                    />
                    {validationErrors.city && (
                      <ErrorMessage message={validationErrors.city} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="companySize">
                      Taille de l'entreprise
                    </RequiredLabel>
                    <Select
                      name="companySize"
                      value={formData.companySize}
                      onValueChange={(value) => {
                        setFormData({ ...formData, companySize: value });
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.companySize;
                          return newErrors;
                        });
                      }}
                      required
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[424px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          validationErrors.companySize &&
                            "border-red-500 focus:border-red-500 focus:ring-red-100",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
                        )}
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                      >
                        <SelectValue placeholder="Sélectionnez la taille" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                        <SelectItem
                          value="STARTUP"
                          className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer"
                        >
                          Startup
                        </SelectItem>
                        <SelectItem
                          value="PME"
                          className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer"
                        >
                          PME
                        </SelectItem>
                        <SelectItem
                          value="GRANDE_ENTREPRISE"
                          className="hover:bg-[#1CD5F5]/10 focus:bg-[#1CD5F5]/10 cursor-pointer"
                        >
                          Grande entreprise
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.companySize && (
                      <ErrorMessage message={validationErrors.companySize} />
                    )}
                  </div>
                </div>

                <div className="w-full h-[100px] flex items-end justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={cn(
                      "flex items-center justify-center w-[152px] h-[58px] bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 text-white rounded-[10px] py-[13px] px-[43.5px] gap-[10px] flex-none order-1 font-medium transition-all duration-200",
                      (!isStep1Valid || isCheckingPhone || isCheckingEmail) &&
                        "bg-[#1CD5F5] cursor-not-allowed hover:bg-gray-300"
                    )}
                    disabled={
                      !isStep1Valid || isCheckingPhone || isCheckingEmail
                    }
                  >
                    {isCheckingPhone || isCheckingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        <span
                          className="flex items-center justify-center w-full"
                          style={{ 
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          fontSize: "17px",
                          lineHeight: "24px" }}
                        >
                          Next
                          <ArrowRight className="h-5 w-6 ml-3" />
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
{step === 2 && (
  <motion.div
    className="space-y-6 text-center w-full max-w-[893px]"
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    style={{
      width: "893px",
      height: "630px",
      padding: "0px",
      gap: "20px",
    }}
  >
    <div className="mb-8" style={{ gap: "20px" }}>
      <div className="flex items-center justify-center w-[64px] h-[64px] bg-[#1CD5F5]/10 rounded-full mx-auto mb-4">
        <Mail className="h-8 w-8 text-[#2f88bb]" />
      </div>
      <h3
        className="mb-5 text-lg font-semibold text-[#013959]"
        style={{
          fontFamily: "Montserrat",
          fontWeight: 600,
          lineHeight: "29px",
        }}
      >
        Vérification d'email
      </h3>

      {success && showSuccess && (
        <div
          className="flex items-center p-[17px_21px] gap-[18px] bg-[#F0FDF4] border-none rounded-[11px] w-full max-w-[893px]"
          style={{ width: "893px", height: "57px" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "22.45px",
              height: "22.45px",
              position: "relative",
              flex: "none",
              order: 0,
              flexGrow: 0,
            }}
          >
            <CheckCircle2
              className="w-[22.45px] h-[22.45px] text-[#15B600]"
              strokeWidth={1.87059}
            />
          </div>
          <p
            className="text-[#15B600] text-[14px] leading-[21px] font-normal"
            style={{
              width: "320px",
              height: "21px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Code de vérification envoyé à votre adresse email
          </p>
        </div>
      )}
    </div>

    <EmailVerification
      email={formData.email}
      onVerified={handleEmailVerified}
      onBack={prevStep}
    />
    <div className="flex flex-col gap-[13px] w-full max-w-[893px]"></div>

    <div
      className="flex justify-between items-center w-full max-w-[890px] h-[58px]"
      style={{ gap: "618px" }}
    >
        <Button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-[11px] px-0 py-0 bg-transparent text-[#1CD5F5] mt-10
            border-none shadow-none
            hover:text-[#1CD5F5] hover:bg-transparent
            focus:outline-none focus:ring-0 focus:bg-transparent
            active:bg-transparent active:scale-95 transition-transform duration-75"
          style={{
            fontFamily: "Montserrat, sans-serif",
            width: "86.5px",
            height: "24px",
            fontWeight: 500,
            fontSize: "17px",
            lineHeight: "24px",
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>



      <Button
        type="button"
        onClick={nextStep}
        className="bg-[#1CD5F5] text-white rounded-[10px] h-[49px] px-[30px] hover:bg-[#1CD5F5]/90 mt-10"
        style={{
          padding: "14px 18px",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: "17px",
          lineHeight: "24px",
        }}
      >
        Suivant
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  </motion.div>
)}

            {step === 3 && (
              <motion.div
                className="space-y-5 w-full max-w-[800px]"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#013959] mb-2" style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "0.03em" }}>
                    Votre profil entreprise
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Parlez-nous un peu plus de votre entreprise.
                    <span className="text-red-500 ml-1">*</span>
                    <span className="italic text-xs ml-1">
                      Champs obligatoires
                    </span>
                  </p>
                </div>

               <div className="space-y-2">
      <RequiredLabel htmlFor="sector">
        Secteur d'activité
      </RequiredLabel>
      <Select
        name="sector"
        value={formData.sector}
        onValueChange={(value) =>
          setFormData({ ...formData, sector: value })
        }
        required
      >
        <SelectTrigger
          className={cn(
            "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
            "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
          )}
          style={{
            height: "50px",
            minHeight: "50px",
            borderWidth: "0.01px",
            boxSizing: "border-box",
          }}
        >
          <SelectValue placeholder="Sélectionnez votre secteur" />
        </SelectTrigger>
        <SelectValue placeholder="Sélectionnez votre secteur" />
        <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
          <SelectItem value="TECHNOLOGIE">Technologie</SelectItem>
          <SelectItem value="AGRO_HALIEUTIQUE">
            Agro-Halieutique
          </SelectItem>
          <SelectItem value="COMMERCE">Commerce</SelectItem>
          <SelectItem value="FINANCE">Finance</SelectItem>
          <SelectItem value="SANTE">Santé</SelectItem>
          <SelectItem value="ÉNERGIE_DURABILITE">
            Énergie & Durabilité
          </SelectItem>
          <SelectItem value="TRANSPORT">Transport</SelectItem>
          <SelectItem value="INDUSTRIE">Industrie</SelectItem>
          <SelectItem value="COMMERCE_DISTRIBUTION">
            Commerce & Distribution
          </SelectItem>
          <SelectItem value="SERVICES_PROFESSIONNELS">
            Services Professionnels
          </SelectItem>
          <SelectItem value="EDUCATION">Éducation</SelectItem>
          <SelectItem value="TOURISME">Tourisme</SelectItem>
          <SelectItem value="MEDIA_DIVERTISSEMENT">
            Média & Divertissement
          </SelectItem>
          <SelectItem value="AUTRE">Autre</SelectItem>
        </SelectContent>
      </Select>
    </div>

                    {formData.sector === "AUTRE" && (
                      <div className="space-y-2">
                        <RequiredLabel htmlFor="otherSector">
                          Précisez votre secteur
                        </RequiredLabel>
                        <Input
                          id="otherSector"
                          name="otherSector"
                          required
                          value={formData.otherSector}
                          onChange={(e) =>
                            setFormData({ ...formData, otherSector: e.target.value })
                          }
                          placeholder="Veuillez préciser votre secteur d'activité"
                          className="h-12 rounded-lg border-gray-300 focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200"
                        />
                      </div>
                    )}

                  <div className="space-y-2">
      <Label
        htmlFor="mainNeed"
        // tooltip="Sélectionnez le besoin principal qui correspond le mieux à vos objectifs actuels."
      >
        Besoin principal
      </Label>
      <Select
        name="mainNeed"
        value={formData.mainNeed}
        onValueChange={(value) =>
          setFormData({ ...formData, mainNeed: value })
        }
        required
      >
        <SelectTrigger
          className={cn(
            "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
            "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
          )}
          style={{
            height: "50px",
            minHeight: "50px",
            borderWidth: "0.01px",
            boxSizing: "border-box",
          }}
        >
          <SelectValue placeholder="Dites-nous en plus sur vos besoins !" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PRESENTATION_MARQUE">
            Présenter votre marque, votre vitrine
          </SelectItem>
          <SelectItem value="RESEAU_B2B">
            Développer votre réseau B2B
          </SelectItem>
          <SelectItem value="TALENTS_QUALIFIES">
            Attirer des talents qualifiés grâce au matching
          </SelectItem>
          <SelectItem value="TABLEAUX_BORD">
            Suivre vos performances via des tableaux de bord
            analytiques
          </SelectItem>
          <SelectItem value="INSIGHTS_SECTORIELS">
            Accéder à des insights sectoriels et des rapports de
            tendances
          </SelectItem>
          <SelectItem value="OFFRES_EMPLOI">
            Accéder aux offres d'emploi disponibles sur la plateforme
          </SelectItem>
          <SelectItem value="MENTORS_SECTORIELS">
            Être mis en relation avec des mentors sectoriels
          </SelectItem>
          <SelectItem value="FREELANCE_HUB">
            Accéder au Freelance & Consulting Hub pour publier des
            missions
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
<div className="space-y-2">
  <Label htmlFor="companyWebsite">
    Site web de l'entreprise
  </Label>
  <Input
    id="companyWebsite"
    name="companyWebsite"
    placeholder="https://example.com"
    value={formData.companyWebsite}
    onChange={(e) =>
      setFormData({ ...formData, companyWebsite: e.target.value })
    }
    className={cn(
      "h-12 rounded-lg border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out text-gray-900 font-medium",
      "[&>input]:h-full [&>input]:flex [&>input]:items-center"
    )}
  />
</div>
                
<div className="space-y-2">
  <Label
  >
    Comment avez-vous découvert Catchub ?
  </Label>
  <Select
    name="discoverySource"
    value={formData.discoverySource}
    onValueChange={(value) =>
      setFormData({ ...formData, discoverySource: value })
    }
  >
    <SelectTrigger
      className={cn(
        "w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
        "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium"
      )}
      style={{
        height: "50px",
        minHeight: "50px",
        borderWidth: "0.01px",
        boxSizing: "border-box",
      }}
    >
      <SelectValue placeholder="Sélectionnez une option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="RESEAUX_SOCIAUX">Réseaux sociaux</SelectItem>
      <SelectItem value="RECHERCHE_EN_LIGNE">Recherche en ligne</SelectItem>
      <SelectItem value="RECOMMANDATION">Recommandation d’un ami ou collègue</SelectItem>
      <SelectItem value="PUBLICITE">Publicité</SelectItem>
      <SelectItem value="AUTRE">Autre</SelectItem>
    </SelectContent>
  </Select>
</div>

               <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="subscribedToNewsletter"
                    checked={formData.subscribedToNewsletter}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        subscribedToNewsletter: checked as boolean,
                      })
                    }
                    className="border-gray-300 text-[#1CD5F5] focus:ring-[#1CD5F5] rounded"
                  />
                  <Label
                    htmlFor="subscribedToNewsletter"
                    className="text-sm text-[#013959]"
                  >
                    Je souhaite recevoir des informations sur les événements et
                    opportunités
                  </Label>
                </div>

<div className="flex justify-between items-center mt-6 w-full">
  {/* Bouton Retour à gauche */}
  <div>
    <Button
      type="button"
      onClick={prevStep}
      className="flex items-center gap-[11px] px-0 py-0 bg-transparent text-[#1CD5F5] mt-20
        border-none shadow-none
        hover:text-[#1CD5F5] hover:bg-transparent
        focus:outline-none focus:ring-0 focus:bg-transparent
        active:bg-transparent active:scale-95 transition-transform duration-75"
      style={{
        fontFamily: "Montserrat, sans-serif",
        width: "86.5px",
        height: "24px",
        fontWeight: 500,
        fontSize: "17px",
        lineHeight: "24px",
      }}
    >
      <ArrowLeft className="h-4 w-4" />
      Retour
    </Button>
  </div>

  {/* Bouton Finaliser à droite */}
  <div>
    <Button
      type="submit"
      disabled={isSubmitting || !validateStep3()}
      className="bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 rounded-lg shadow-md transition-all duration-300 font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed mt-20 w-[200px] h-[50px]"
      style={{
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement...
        </>
      ) : (
        "Finaliser l'inscription"
      )}
    </Button>
  </div>
</div>


              </motion.div>
            )}
          </>
        )}
      </form>
    </div>
  );
}




