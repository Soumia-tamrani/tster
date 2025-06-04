  "use client"

  import type React from "react"
  import { useState, useEffect } from "react"
  import { registerProfessional } from "@/app/action"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Checkbox } from "@/components/ui/checkbox"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import {
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    Mail,
    MapPin,
    Building2,
    Check,
    ArrowLeft,
  } from "lucide-react"
  import { useRouter } from "next/navigation"
  import EmailVerification from "@/components/email-verification"
  import { z } from "zod"
  import { toast } from "sonner"
  import { emailSchema, phoneSchema } from "@/utils/validation"
  import { useSearchParams } from "next/navigation"
  import CountrySelector from "@/components/country-selector-pro"
  import { cn } from "@/lib/utils"
  import "react-phone-number-input/style.css"
  import PhoneInput from "react-phone-number-input"
  import { updatedCountriesList, isValidPhoneForCountry } from "@/lib/form-utils"
  import { motion } from "framer-motion"

  // Animation variants for fadeInUp
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const formSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: emailSchema,
    phone: phoneSchema,
    city: z.string().optional(),
    country: z.string().min(1, "Le pays est requis"),
    sector: z.string().min(1, "Sélectionnez un secteur"),
    professionalInterests: z.string().optional(),
    professionalChallenges: z.string().optional(),
    subscribedToNewsletter: z.boolean().default(false),
    referralSource: z.string().optional(),
    parrainId: z.string().optional(),
  })

  interface ProfessionalFormProps {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    parrainId?: string
    onStepChange?: (step: number) => void
  }

  export default function ProfessionalForm({
    utmSource,
    utmMedium,
    utmCampaign,
    parrainId,
    onStepChange,
  }: ProfessionalFormProps) {
    const [step, setStep] = useState(1)
    const router = useRouter()
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isCheckingPhone, setIsCheckingPhone] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const searchParams = useSearchParams()
    const ref = searchParams.get("ref") || ""
    const [success, setSuccess] = useState<string | null>(null)
    const [isStep1Valid, setIsStep1Valid] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "Maroc",
      selectedCountryCode: "MA",
      sector: "",
      professionalInterests: "",
      professionalChallenges: "",
      subscribedToNewsletter: false,
      referralSource: "",
      parrainId: ref || parrainId || "",
      acceptDataUsage: false,
    })

    // Convertir la liste des pays au format attendu par le composant CountrySelector
    const countries = updatedCountriesList.map((country) => ({
      name: country.name,
      code: country.code,
      prefix: country.prefix,
      flag: country.flag,
    }))

    useEffect(() => {
      // Définir le pays par défaut
      const defaultCountry = countries.find((c) => c.name === "Maroc")
      if (defaultCountry) {
        setFormData((prev) => ({
          ...prev,
          country: defaultCountry.name,
          selectedCountryCode: defaultCountry.code,
          phone: "",
        }))
      }
    }, [])

    useEffect(() => {
      if (success) {
        setShowSuccess(true)
        const timer = setTimeout(() => {
          setShowSuccess(false) // Masque l'alerte après 5s
        }, 5000) //5s

        return () => clearTimeout(timer)
      }
    }, [success])

    useEffect(() => {
      if (onStepChange) onStepChange(step)
    }, [step, onStepChange])

    useEffect(() => {
      if (ref && !formData.referralSource) {
        setFormData((prev) => ({
          ...prev,
          parrainId: ref,
          referralSource: "FRIEND",
        }))
      }
    }, [ref])

    const cleanPhoneNumber = (phone: string): string => {
      if (!phone) return ""
      return phone.replace(/\D/g, "")
    }

    const toE164Format = (phone: string): string => {
      const cleaned = cleanPhoneNumber(phone)
      if (!cleaned) return ""

      if (phone.startsWith("+")) {
        return "+" + cleaned
      }

      return cleaned
    }

    const getPhoneLengthLimits = (countryCode: string): { exactLength?: number; min?: number; max?: number } => {
      const limits: Record<string, { exactLength?: number; min?: number; max?: number }> = {
        
        MA: { exactLength: 12 }, 
        FR: { exactLength: 11 }, 
        CA: { exactLength: 11 }, 
        US: { exactLength: 11 }, 
        ES: { exactLength: 11 }, 
        IT: { exactLength: 12 }, 
        BE: { exactLength: 11 }, 
        CH: { exactLength: 11 }, 
        DZ: { exactLength: 12 }, 
        TN: { exactLength: 11 }, 
        SN: { exactLength: 12 }, 
        CI: { exactLength: 13 }, 
        CM: { exactLength: 12 }, 

       
        GB: { min: 13, max: 14 },
        DE: { min: 12, max: 15 }, 
      }

      return limits[countryCode] || { min: 10, max: 15 } 
    }

    // Fonction pour valider le format selon le pays sélectionné avec vérification de longueur stricte
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

      let phoneToValidate = phone

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
        toast.error("Erreur réseau", {
          description: "Impossible de vérifier l'unicité. Veuillez réessayer.",
        })
        return true
      }
    }

    const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      const email = e.target.value.trim()
      if (!email) {
        setErrors((prev) => ({ ...prev, email: "L'email est requis" }))
        return
      }
      try {
        emailSchema.parse(email)
        setIsCheckingEmail(true)
        await checkUnique("email", email)
        setIsCheckingEmail(false)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({ ...prev, email: error.errors[0].message }))
        }
      }
    }

    useEffect(() => {
      const allFieldsFilled = requiredFields.every((field) => formData[field as keyof typeof formData])
      const noErrors = Object.keys(errors).length === 0
      setIsStep1Valid(allFieldsFilled && noErrors)
    }, [formData, errors])

    const handleContinue = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      console.log("handleContinue called with step:", step)

      const isValid = await validateStep(1)
      if (!isValid) {
        toast.error("Erreur de validation", {
          description: "Veuillez corriger les champs marqués en rouge avant de continuer",
        })
        return
      }

      // Check email and phone uniqueness
      const isEmailValid = formData.email ? await checkUnique("email", formData.email) : false
      const isPhoneValid = await handlePhoneBlur()

      if (!isEmailValid || !isPhoneValid) {
        toast.error("Erreur de validation", {
          description: "Veuillez vérifier que l'email et le numéro de téléphone sont uniques",
        })
        return
      }

      try {
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        sessionStorage.setItem(`verification_${formData.email}`, verificationToken)

        const emailContent = {
          to: formData.email,
          subject: "Vérification de votre adresse email",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Vérification de votre adresse email</h2>
            <p>Merci de votre inscription ! Voici votre code :</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${verificationToken}
            </div>
            <p>Ce code est valable pendant 10 minutes.</p>
          </div>
        `,
        }

        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailContent),
        })

        if (!response.ok) throw new Error("Échec de l'envoi du code")

        setSuccess("Code de vérification envoyé à votre adresse email")
        setStep(2)
      } catch (error) {
        console.error("Erreur :", error)
        toast.error("Erreur lors de l'envoi de l'email de vérification.")
      }
    }

    // Fonction pour gérer les changements du numéro de téléphone avec validation stricte par pays sélectionné
    const handlePhoneChange = (value?: string) => {
      // Convertir au format E.164 strict pour éviter l'erreur
      const cleanValue = value ? toE164Format(value) : ""

      // Mettre à jour le numéro de téléphone SANS changer le pays
      setFormData((prev) => ({ ...prev, phone: cleanValue }))

      // Valider immédiatement selon le pays SÉLECTIONNÉ dans la liste déroulante
      if (cleanValue && cleanValue.length >= 3) {
        const countryCode = formData.selectedCountryCode
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
          setIsStep1Valid(true)
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

    const handlePhoneBlur = async () => {
      const phone = formData.phone.trim()
      if (!phone) {
        setErrors((prev) => ({
          ...prev,
          phone: "Le numéro de téléphone est requis",
        }))
        return false
      }

      const countryCode = formData.selectedCountryCode
      if (!countryCode) {
        setErrors((prev) => ({
          ...prev,
          phone: "Pays non sélectionné",
        }))
        return false
      }

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

    const validateStep = (stepToValidate: number) => {
      try {
        const partialSchema =
          stepToValidate === 1
            ? formSchema.pick({
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                country: true,
              })
            : stepToValidate === 3
              ? formSchema.pick({
                  sector: true,
                  professionalInterests: true,
                })
              : z.object({})

        if (stepToValidate === 1) {
          const phone = formData.phone
          const countryCode = formData.selectedCountryCode

          if (phone && countryCode) {
            const validation = validatePhoneFormat(phone, countryCode)
            if (!validation.isValid) {
              throw new z.ZodError([
                {
                  code: z.ZodIssueCode.custom,
                  path: ["phone"],
                  message: validation.error || "Format invalide",
                },
              ])
            }
          }

          partialSchema.parse({ ...formData, phone: formData.phone })
        } else if (stepToValidate === 3) {
          partialSchema.parse(formData)
        }

        if (stepToValidate === 1) {
          if (errors.email || errors.phone) {
            toast.error("Erreur de validation", {
              description: "Veuillez corriger les champs marqués en rouge avant de continuer",
            })
            return false
          }
        }

        if (stepToValidate === 3) {
          if (!formData.sector) {
            setErrors((prev) => ({ ...prev, sector: "Sélectionnez un secteur" }))
            return false
          }
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.professionalInterests
            return newErrors
          })
        }

        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {}
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              newErrors[err.path[0]] = err.message
            }
          })
          setErrors((prev) => ({ ...prev, ...newErrors }))
          toast.error("Erreur de validation", {
            description: "Veuillez corriger les champs marqués en rouge avant de continuer",
          })
        }
        return false
      }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)

      if (!validateStep(step)) {
        setIsSubmitting(false)
        return
      }

      try {
        const dataToSend = {
          ...formData,
          phone: toE164Format(formData.phone),
          professionalInterests: formData.professionalInterests || "",
        }

        const formDataObj = new FormData()
        Object.entries(dataToSend).forEach(([key, value]) => {
          if (key !== "professionalInterests") {
            formDataObj.append(key, String(value))
          }
        })
        if (dataToSend.professionalInterests && dataToSend.professionalInterests.length > 0) {
          const interests = Array.isArray(dataToSend.professionalInterests)
            ? dataToSend.professionalInterests
            : [dataToSend.professionalInterests]
          interests.forEach((interest) => {
            formDataObj.append("professionalInterests", interest)
          })
        }
        formDataObj.append("parrainId", dataToSend.parrainId || "")
        const result = await registerProfessional(formDataObj)

        if (result.error) {
          if (result.field === "email") {
            setErrors((prev) => ({
              ...prev,
              email: result.error || "Cet email est déjà utilisé",
            }))
            toast.error("Email déjà utilisé", {
              description: result.error,
            })
          } else if (result.field === "phone") {
            setErrors((prev) => ({
              ...prev,
              phone: result.error || "Ce numéro est déjà utilisé",
            }))
            toast.error("Téléphone déjà utilisé", {
              description: result.error,
            })
          } else {
            toast.error("Erreur", {
              description: result.error || "Une erreur est survenue",
            })
          }
          setIsSubmitting(false)
        } else if (result.success) {
          if (result.redirectTo) {
            router.push(result.redirectTo)
          } else {
            toast.success("Inscription réussie", {
              description: "Votre compte a été créé avec succès.",
            })
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error)
        toast.error("Erreur", {
          description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        })
        setIsSubmitting(false)
      }
    }

    const renderProgressSteps = () => {
      const steps = [
        { number: 1, title: "Identité", icon: <User className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { number: 2, title: "Validation", icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { number: 3, title: "Profil", icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" /> },
      ]

      return (
        <div className="mb-8 sm:mb-12 lg:mb-16 w-full">
          <div
            className="flex items-center justify-between 
                  w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]
                  relative mt-6 sm:mt-8 lg:mt-10 mb-6 sm:mb-8 lg:mb-10 mx-auto"
          >
            {/* Ligne horizontale qui va du centre du premier icône au centre du dernier icône */}
            <div
              className="absolute top-1/2 h-[2px] bg-gray-200 -translate-y-1/2 z-0"
              style={{
                left: "calc(16px + 4px)", // Mobile: rayon icône (16px) + border (2px) + padding (2px)
                right: "calc(16px + 4px)", // Mobile: même calcul
              }}
            ></div>

            {/* Version tablette et desktop de la ligne */}
            <div
              className="absolute top-1/2 h-[2px] bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"
              style={{
                left: "calc(20px + 4px)", // Tablette: rayon icône (20px) + border (2px) + padding (2px)
                right: "calc(20px + 4px)", // Tablette: même calcul
              }}
            ></div>

            <div
              className="absolute top-1/2 h-[2px] bg-gray-200 -translate-y-1/2 z-0 hidden lg:block"
              style={{
                left: "calc(24px + 4px)", // Desktop: rayon icône (24px) + border (2px) + padding (2px)
                right: "calc(24px + 4px)", // Desktop: même calcul
              }}
            ></div>

            {steps.map((item, index) => (
              <div key={item.number} className="flex flex-col items-center z-10 relative">
                <motion.div
                  className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    step >= item.number
                      ? "bg-[#1CD5F5] text-white shadow-md"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {step > item.number ? (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">{item.icon}</div>
                  )}
                </motion.div>
                <span
                  className={`text-xs sm:text-sm font-medium text-center ${
                    step >= item.number ? "text-[#1CD5F5]" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const nextStep = async () => {
      if (!validateStep(step)) return

      if (step === 1) {
        const isPhoneValid = await handlePhoneBlur()
        if (!isPhoneValid || errors.email || errors.phone) {
          toast.error("Erreur de validation", {
            description: "Veuillez corriger les champs marqués en rouge avant de continuer",
          })
          return
        }
        setStep(2)
      } else if (step === 2) {
        if (isEmailVerified) {
          setStep(3)
        } else {
          toast.info("Vérification requise", {
            description: "Veuillez vérifier votre email avant de continuer",
          })
        }
      }
    }

    const handleEmailVerified = () => {
      setIsEmailVerified(true)
      toast.success("Email vérifié", {
        description: "Votre email a été vérifié avec succès",
      })
    }

    const prevStep = () => {
      setStep((prev) => Math.max(1, prev - 1))
    }

    const handleCountryChange = (countryName: string) => {
      const selected = countries.find((c) => c.name === countryName)
      if (!selected) return

      setFormData((prev) => ({
        ...prev,
        country: selected.name,
        selectedCountryCode: selected.code,
      }))

      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.country
        delete newErrors.phone
        return newErrors
      })

      // Revalider le téléphone avec le nouveau pays si il y en a un
      if (formData.phone) {
        setTimeout(() => {
          const validation = validatePhoneFormat(formData.phone, selected.code)
          if (!validation.isValid) {
            setErrors((prev) => ({
              ...prev,
              phone: validation.error || "Format invalide",
            }))
          }
        }, 0)
      }
    }
    const requiredFields = ["firstName", "lastName", "email", "country", "phone"]
    // Use useEffect to update isStep1Valid state if needed
    useEffect(() => {
      const allFieldsFilled = requiredFields.every((field) => formData[field as keyof typeof formData])
      const noErrors = Object.keys(errors).length === 0
      const noValidationInProgress = !isCheckingEmail && !isCheckingPhone
      setIsStep1Valid(allFieldsFilled && noErrors && noValidationInProgress)
    }, [formData, errors, isCheckingEmail, isCheckingPhone])

    // Obtenir le code pays actuel pour PhoneInput
    const getCurrentCountryCode = (): string => {
      return formData.selectedCountryCode || "MA"
    }

    // Obtenir l'exemple de format pour le pays sélectionné avec indication de longueur stricte
    const getPhoneExample = (): string => {
      const country = updatedCountriesList.find((c) => c.code === formData.selectedCountryCode)
      const limits = getPhoneLengthLimits(formData.selectedCountryCode)

      let lengthInfo = ""
      if (limits.exactLength) {
        lengthInfo = ` (exactement ${limits.exactLength} chiffres)`
      } else if (limits.min && limits.max) {
        lengthInfo = ` (${limits.min}-${limits.max} chiffres)`
      }

      const countryName = country?.name || "ce pays"
      return `Format pour ${countryName}${lengthInfo}`
    }

    return (
      <div
        className="bg-white border-[3px] border-[rgba(215, 215, 219, 0.74)] rounded-[22px] flex flex-col justify-start items-center 
              p-4 sm:p-8 md:p-12 lg:p-[91px_61px]
              w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1013px]
              min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]
              mx-auto my-4 sm:my-8 lg:my-0
              relative lg:absolute lg:left-[calc(50%-1013px/2-24.5px)] lg:top-[300px]"
        style={{
          boxShadow:
            "0px 44px 18px rgba(171, 171, 171, 0.01), 0px 25px 15px rgba(171, 171, 171, 0.03), 0px 11px 11px rgba(171, 171, 171, 0.05), 0px 3px 6px rgba(171, 171, 171, 0.06)",
          gap: "10px",
        }}
      >
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center">
          {renderProgressSteps()}

          {/* Étape 1 - Identité */}

          {step === 1 && (
            <motion.div
              className="flex flex-col items-start w-full max-w-[893px] px-2 sm:px-4 lg:px-0"
              style={{ padding: "0px", gap: "20px sm:gap-[29px]" }}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="mb-4 sm:mb-6">
                <h3
                  className="text-lg sm:text-xl font-semibold text-[#013959] dark:text-gray-100 flex items-center mt-6 sm:mt-8 lg:mt-10 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <User className="mr-2 text-[#78bce3]" size={20} />
                  Informations personnelles
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Tous les champs marqués d'un * sont obligatoires
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-[29px] w-full">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                  >
                    Prénom <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        if (errors.firstName) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.firstName
                            return newErrors
                          })
                        }
                        setFormData({ ...formData, firstName: e.target.value })
                      }}
                      onBlur={() =>
                        !formData.firstName &&
                        setErrors((prev) => ({
                          ...prev,
                          firstName: "Le prénom est requis",
                        }))
                      }
                      className={cn(
                        "pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-200",
                        errors.firstName &&
                          "border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50",
                      )}
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                  >
                    Nom <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        if (errors.lastName) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.lastName
                            return newErrors
                          })
                        }
                        setFormData({ ...formData, lastName: e.target.value })
                      }}
                      onBlur={() =>
                        !formData.lastName &&
                        setErrors((prev) => ({
                          ...prev,
                          lastName: "Le nom est requis",
                        }))
                      }
                      className={cn(
                        "pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-200",
                        errors.lastName &&
                          "border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50",
                      )}
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                  >
                    Email <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        if (errors.email) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.email
                            return newErrors
                          })
                        }
                        setFormData({ ...formData, email: e.target.value })
                      }}
                      onBlur={handleEmailBlur}
                      className={cn(
                        "pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-200",
                        errors.email &&
                          "border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50",
                      )}
                    />
                    <Mail className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                    {isCheckingEmail && (
                      <Loader2
                        className="absolute right-3 top-3.5 text-blue-500 dark:text-blue-400 animate-spin"
                        size={18}
                      />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.email}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format : exemple@domaine.com</p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                  >
                    Pays <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <CountrySelector
                    value={formData.country}
                    onChange={handleCountryChange}
                    onPrefixChange={() => {}}
                    error={errors.country}
                    countries={countries}
                  />
                  {errors.country && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.country}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Ville
                  </Label>
                  <div className="relative">
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => {
                        setIsStep1Valid(true)
                        setFormData({ ...formData, city: e.target.value })
                      }}
                      className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-200"
                    />
                    <MapPin className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                  >
                    Téléphone <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div
                    className={cn(
                      "rounded-lg bg-white dark:bg-gray-800 h-12 border",
                      errors.phone
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400",
                    )}
                  >
                    <PhoneInput
                      defaultCountry={getCurrentCountryCode() as any}
                      value={formData.phone || undefined}
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
              </div>

              <div className="w-full flex items-end justify-center sm:justify-end mt-6 sm:mt-8 lg:h-[100px] lg:items-end">
                <Button
                  type="button"
                  onClick={handleContinue}
                  className={cn(
                    "flex items-center justify-center w-full sm:w-[152px] h-[50px] sm:h-[58px] bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 text-white rounded-[10px] py-[13px] px-[20px] sm:px-[43.5px] gap-[10px] font-medium transition-all duration-200",
                    (!isStep1Valid || isCheckingPhone || isCheckingEmail) &&
                      "bg-[#1CD5F5] cursor-not-allowed hover:bg-gray-300",
                  )}
                  disabled={!isStep1Valid || isCheckingEmail || isCheckingPhone}
                >
                  {isCheckingEmail || isCheckingPhone ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Vérification...</span>
                    </>
                  ) : (
                    <>
                      <span
                        className="flex items-center justify-center w-full text-sm sm:text-base"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          lineHeight: "24px",
                        }}
                      >
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Étape 2 - Vérification email */}

          {step === 2 && (
            <motion.div
              className="space-y-6 text-center w-full max-w-[893px] px-4 sm:px-6 lg:px-0"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              style={{
                padding: "0px",
                gap: "20px",
              }}
            >
              <div className="mb-6 sm:mb-8" style={{ gap: "20px" }}>
                <div className="flex items-center justify-center w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] bg-[#1CD5F5]/10 rounded-full mx-auto mb-4">
                  <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-[#2f88bb]" />
                </div>
                <h3
                  className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-[#013959]"
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
                    className="flex items-center p-4 sm:p-[17px_21px] gap-3 sm:gap-[18px] bg-[#F0FDF4] border-none rounded-[11px] w-full"
                    style={{ minHeight: "57px" }}
                  >
                    <div className="flex items-center justify-center flex-shrink-0">
                      <CheckCircle2
                        className="w-5 h-5 sm:w-[22.45px] sm:h-[22.45px] text-[#15B600]"
                        strokeWidth={1.87059}
                      />
                    </div>
                    <p
                      className="text-[#15B600] text-sm leading-[21px] font-normal"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Code de vérification envoyé à votre adresse email
                    </p>
                  </div>
                )}
              </div>

              <EmailVerification email={formData.email} onVerified={handleEmailVerified} onBack={prevStep} />

              <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 sm:gap-6 mt-8">
                <Button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-[11px] px-0 py-0 bg-transparent text-[#1CD5F5] 
                    border-none shadow-none
                    hover:text-[#1CD5F5] hover:bg-transparent
                    focus:outline-none focus:ring-0 focus:bg-transparent
                    active:bg-transparent active:scale-95 transition-transform duration-75 order-2 sm:order-1"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px sm:17px",
                    lineHeight: "24px",
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#1CD5F5] text-white rounded-[10px] h-[49px] px-[30px] hover:bg-[#1CD5F5]/90 w-full sm:w-auto order-1 sm:order-2"
                  style={{
                    padding: "14px 18px",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px sm:17px",
                    lineHeight: "24px",
                  }}
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Étape 3 - Profil */}
          {step === 3 && (
            <div className="space-y-6 sm:space-y-8 w-full max-w-[893px] px-4 sm:px-6 lg:px-0">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  Votre profil professionnel
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Parlez-nous de vos intérêts et objectifs professionnels
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="sector"
                    className="text-sm font-semibold text-[#013959] dark:text-gray-200 flex items-center"
                  >
                    Secteur d'activité <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => setFormData({ ...formData, sector: value })}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full max-w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium",
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
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="TECHNOLOGIE">Technologie</SelectItem>
                        <SelectItem value="AGRO_HALIEUTIQUE">Agro-Halieutique</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="SANTE">Santé</SelectItem>
                        <SelectItem value="COMMERCE">Commerce</SelectItem>
                        <SelectItem value="ENERGIE_DURABILITE">Énergie & Durabilité</SelectItem>
                        <SelectItem value="TRANSPORT">Transport</SelectItem>
                        <SelectItem value="INDUSTRIE">Industrie</SelectItem>
                        <SelectItem value="COMMERCE_DISTRIBUTION">Commerce & Distribution</SelectItem>
                        <SelectItem value="SERVICES_PROFESSIONNELS">Services Professionnels</SelectItem>
                        <SelectItem value="EDUCATION">Éducation</SelectItem>
                        <SelectItem value="TOURISME">Tourisme</SelectItem>
                        <SelectItem value="MEDIA_DIVERTISSEMENT">Média & Divertissement</SelectItem>
                        <SelectItem value="AUTRE">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.sector && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.sector}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="professionalInterests"
                    className="text-sm font-semibold text-[#013959] dark:text-gray-200 flex items-center"
                  >
                    Centres d'intérêt professionnels
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.professionalInterests}
                      onValueChange={(value) => setFormData({ ...formData, professionalInterests: value })}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full max-w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium",
                          errors.professionalInterests && "border-red-500 focus:ring-red-100",
                        )}
                        style={{
                          height: "50px",
                          minHeight: "50px",
                          borderWidth: "0.01px",
                          boxSizing: "border-box",
                        }}
                      >
                        <SelectValue placeholder="Sélectionnez vos centres d'intérêt" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="MENTORAT">Mentorat</SelectItem>
                        <SelectItem value="RESEAUTAGE">Réseautage</SelectItem>
                        <SelectItem value="EMPLOI">Emploi</SelectItem>
                        <SelectItem value="FORMATION">Formation</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.professionalInterests && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center mt-1 animate-in fade-in">
                      <AlertCircle className="mr-1 h-4 w-4" /> {errors.professionalInterests}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource" className="text-sm font-semibold text-[#013959] dark:text-gray-200">
                    Comment avez-vous entendu parler de nous ?
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.referralSource}
                      onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full max-w-[800px] rounded-[11px] border-[#CACACA] bg-white focus:border-[#1CD5F5] focus:ring-2 focus:ring-[#1CD5F5]/20 transition-all duration-200 ease-in-out flex items-center justify-between px-4",
                          "[&>span]:flex [&>span]:items-center [&>span]:h-full text-gray-900 font-medium",
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
                      <SelectContent className="max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-gray-100 dark:border-gray-700">
                        <SelectItem value="SOCIAL_MEDIA">Réseaux sociaux</SelectItem>
                        <SelectItem value="SEARCH">Moteur de recherche</SelectItem>
                        <SelectItem value="FRIEND">Recommandation</SelectItem>
                        <SelectItem value="EVENT">Événement</SelectItem>
                        <SelectItem value="OTHER">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="flex items-start sm:items-center space-x-3">
                    <Checkbox
                      id="acceptDataUsage"
                      checked={formData.acceptDataUsage}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          acceptDataUsage: checked as boolean,
                        })
                      }
                      className="border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded mt-1 sm:mt-0 flex-shrink-0"
                    />
                    <Label
                      htmlFor="acceptDataUsage"
                      className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed"
                    >
                      J'accepte que mes données soient utilisées par Catchub pour créer mon compte et recevoir des
                      communications liées à la plateforme, conformément à la politique de confidentialité.
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-gray-100 dark:border-gray-700 gap-4 sm:gap-0">
                <Button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-[11px] px-0 py-0 bg-transparent text-[#1CD5F5] 
                        border-none shadow-none
                        hover:text-[#1CD5F5] hover:bg-transparent
                        focus:outline-none focus:ring-0 focus:bg-transparent
                        active:bg-transparent active:scale-95 transition-transform duration-75 order-2 sm:order-1"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px sm:17px",
                    lineHeight: "24px",
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1CD5F5] hover:bg-[#1CD5F5]/90 rounded-lg shadow-md transition-all duration-300 font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-[200px] h-[50px] order-1 sm:order-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">Finalisation...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base">Finaliser l'inscription</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    )
  }
