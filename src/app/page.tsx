/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Target,
  UserSearchIcon,
  SearchCheck,
  CalendarCheck2,
  HandshakeIcon,
} from "lucide-react";
import NewsletterSection from "@/components/Newsletter";
import Analytics from "@/components/Analytics";

const navItems = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Avantages", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

export default function Home() {
  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500`}
    >
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow-sm font-[Montserrat, sans-serif]">
        <div className="max-w-screen mx-3 px-4 md:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Catchub Logo"
                className="h-10 w-auto hover:opacity-90 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center font-[Montserrat, sans-serif]">
            <div className="flex space-x-1">
              {navItems.map((item, index) => (
                <div key={item.href} className="flex items-center">
                  <a
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all transform relative
                      hover:text-[#1CD5F5] hover:font-semibold hover:scale-105
                      after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#1CD5F5] after:transition-all`}
                  >
                    {item.label}
                  </a>
                  {index < navItems.length - 1 && (
                    <div className="h-4 w-px bg-blue-200 dark:bg-blue-700 self-center mx-1"></div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/onboarding">
              <Button className="bg-[#003E5D] hover:bg-[#005F86] text-white font-medium px-4 py-2 sm:px-5 sm:py-2 rounded-lg font-montserrat text-sm sm:text-base">
                Essai Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-screen mx-3 px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Colonne de gauche : texte */}
            <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "0.002em",
                  }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter animate-fade-in-up"
                >
                  <span className="text-[#003E5D]">
                    Catchub.Connecter <br className="hidden sm:inline" />
                    <span className="inline-block mt-2">Évoluer.</span>
                  </span>
                </h1>

                <p
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="max-w-[600px] mx-auto lg:mx-0 text-base sm:text-lg md:text-xl animate-fade-in-up delay-100 text-[#8F9BA8]"
                >
                  <span className="inline-block mt-2">
                    {" "}
                    Catchub, c’est bien plus qu’une plateforme :
                    <br className="hidden sm:inline" /> c’est un catalyseur de
                    liens, de projets et de croissance partagée.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in-up delay-200 mx-auto lg:mx-0">
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className="gap-1.5 bg-[#003E5D] hover:bg-[#005F86] hover:shadow-blue-500/30 active:shadow-none active:translate-y-0 transition-all transform group w-full sm:w-auto"
                  >
                    Réservez votre place
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-1.5 border-[#003E5D] text-bg-[#003E5D] hover:bg-[#D9E7F0] hover:shadow-blue-500/30 active:shadow-none active:translate-y-0 transition-all transform group w-full sm:w-auto"
                  >
                    Découvrir
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center animate-fade-in delay-200">
              <div className="relative w-full h-[200px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl shadow-xl overflow-hidden group hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20 transition-shadow duration-500 bg-white">
                <video
                  ref={(el) => {
                    if (el) {
                      el.addEventListener("play", () => {
                        const overlay =
                          el.parentElement?.querySelector(".video-overlay");
                        if (overlay) {
                          overlay.classList.add("hidden");
                        }
                      });
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  controls
                  poster="/logo.png"
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div
                  className="video-overlay absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all cursor-pointer"
                  onClick={(e) => {
                    const video = e.currentTarget
                      .previousElementSibling as HTMLVideoElement;
                    if (video) {
                      video.play();
                    }
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-[#013959]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-screen mx-3 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className="inline-flex items-center rounded-full bg-white px-4 py-1 text-[16px] font-medium text-[#1CD5F5] border border-[#1CD5F5] animate-fade-in"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Fonctionnalités
            </div>
            <div className="space-y-2 max-w-5xl">
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-[#013959]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.002em",
                }}
              >
                Votre réseau, votre croissance
              </h3>
              <p
                className="text-[#7E8B93] mt-3 sm:text-[15px] md:text-lg"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "140%",
                  textAlign: "center",
                }}
              >
                Facilitez vos mises en relation, trouvez des partenaires clés,
                accédez à des offres d’emploi ciblées et faites grandir votre
                business grâce à un réseau intelligent et actif.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-8 sm:mt-10 max-w-7xl mx-auto px-4">
            {[
              {
                icon: UserSearchIcon,
                bg: "#DFFBFF",
                iconColor: "#00B3D6",
                title: "Matchmaking intelligent",
                desc: "Trouvez les bons profils ou partenaires grâce à notre système de matching avancé basé sur vos besoins réels.",
              },
              {
                icon: Target,
                bg: "#F4ECFF",
                iconColor: "#A960EE",
                title: "Visibilité & Opportunités",
                desc: "Valorisez votre activité pour attirer talents, renforcer votre réseau et créer des opportunités.",
              },
              {
                icon: Users,
                bg: "#F2466729",
                iconColor: "#F24667",
                title: "Réseau professionnel actif",
                desc: "Rejoignez une communauté active et échangez avec vos pairs et les experts de votre domaine en un clic.",
              },
              {
                icon: SearchCheck,
                bg: "#FFEFE5",
                iconColor: "#F97316",
                title: "Analytics avancés",
                desc: "Analysez vos interactions et performances pour mieux piloter votre activité et vos opportunités professionnelles.",
              },
              {
                icon: CalendarCheck2,
                bg: "#79359A30",
                iconColor: "#79359A",
                title: "Événements exclusifs",
                desc: "Participez à des webinaires, forums et ateliers conçus pour apprendre, réseauter et faire évoluer vos projets.",
              },
              {
                icon: HandshakeIcon,
                bg: "#6857FF30",
                iconColor: "#6857FF",
                title: "Mentorat",
                desc: "Bénéficiez d’un mentorat personnalisé pour accélérer votre parcours et gagner en expérience.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-start justify-start space-y-5 bg-white border border-[#B4B4B4] rounded-[23px] w-full max-w-sm h-auto px-6 py-8 mx-auto transform transition-transform duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(28,213,245,0.15)]"
                style={{ animationDelay: "0.1s" }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon
                    className="h-44px w-44px"
                    style={{ color: feature.iconColor }}
                    strokeWidth={2}
                  />
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-800"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "20px",
                    lineHeight: "100%",
                    letterSpacing: "0.3px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[#7E8B93] dark:text-gray-300 text-sm sm:text-base"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section and CTA */}
      <section
        id="benefits"
        className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white"
      >
        <div className="max-w-screen mx-3 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className="inline-flex items-center rounded-full bg-white px-4 py-1 text-[16px] font-medium text-[#1CD5F5] border border-[#1CD5F5] animate-fade-in"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span>Avantages</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#013959] dark:text-white mb-4"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "40px",
                  letterSpacing: "0.3px",
                  textAlign: "center",
                }}
              >
                Pourquoi nous choisir ?
              </h2>
              <p
                className="text-[#7E8B93] dark:text-gray-300 text-base sm:text-lg "
                style={{
                  fontFamily: "Poppins, sans-serif",
                  textAlign: "center",
                }}
              >
                Catchub est plus qu'une plateforme : c’est un catalyseur
                d’opportunités adaptées à chaque profil.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 mt-12 sm:mt-16 md:grid-cols-2 max-w-7xl mx-auto px-4">
            {/* Carte Professionnels */}
            <div className="flex flex-col justify-between bg-white dark:bg-gray-800 border shadow-lg rounded-[23px] p-4 sm:p-6 md:p-8 lg:p-10 h-full hover:-translate-y-1 transition-all">
              <div>
                <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-[#C063FB2B] dark:bg-purple-900/30 rounded-full mb-6">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#C063FB]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-7 text-[#013959] ">
                  Pour les Professionnels
                </h3>
                <div className="space-y-4">
                  {[
                    "Accédez à des opportunités d’emploi adaptées à votre profil",
                    "Développez un réseau professionnel dynamique",
                    "Bénéficiez d’opportunités de mentorat exclusives",
                    "Échangez avec une communauté professionnelle engagée",
                    "Enrichissez vos compétences grâce à un apprentissage continu",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#1cd5f5] mt-1" />
                      <p className="text-[#8C8C8C] dark:text-gray-300 text-sm sm:text-base mb-2">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6 sm:mt-8 md:mt-10">
                <Link href="/onboarding?profile=pro">
                  <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-blue-950 rounded-full hover:bg-[#005F86]">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Carte Entreprises */}
            <div className="flex flex-col justify-between bg-white dark:bg-gray-800 border shadow-lg rounded-[23px] p-4 sm:p-6 md:p-8 lg:p-10 h-full hover:-translate-y-1 transition-all">
              <div>
                <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-red-100 rounded-full mb-6">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#F24667]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-7 text-gray-800 dark:text-white">
                  Pour les Entreprises
                </h3>
                <div className="space-y-4">
                  {[
                    "Recrutez efficacement grâce au matching intelligent",
                    "Publiez des offres d’emploi illimitées et ciblées",
                    "Gagnez en visibilité auprès d’une audience qualifiée",
                    "Établissez des partenariats B2B pertinents",
                    "Analysez vos performances avec des insights sectoriels",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#1cd5f5] mt-1" />
                      <p className="text-[#8C8C8C] dark:text-gray-300 text-sm sm:text-base mb-2">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6 sm:mt-8 md:mt-10">
                <Link href="/onboarding?profile=entreprise">
                  <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-blue-950 rounded-full hover:bg-[#005F86]">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-screen mx-3 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className="inline-flex items-center rounded-full bg-white px-4 py-1 text-[16px] font-medium text-[#1CD5F5] border border-[#1CD5F5] animate-fade-in"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.002em",
              }}
            >
              <span>FAQ</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#013959] dark:text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.002em",
                }}
              >
                Questions fréquentes
              </h2>
              <p
                className="text-[#7E8B93] dark:text-gray-300 text-base sm:text-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Trouvez les réponses à vos interrogations avant de rejoindre
                l’aventure. 
              </p>
            </div>
          </div>

          <div className="container px-4 md:px-6 mt-8 sm:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              {[
                {
                  question: "Comment fonctionne l’inscription ?",
                  answer:
                    "Remplissez un formulaire rapide, choisissez votre profil (professionel ou entreprise) et rejoignez la liste d’attente. Vous serez notifié dès l’activation de votre accès.",
                },

                {
                  question: "Que se passe-t-il à la fin de l’essai gratuit ?",
                  answer:
                    "Connectez-vous avec des professionnels et des entreprises de votre secteur grâce à notre algorithme de matching avancé.",
                },

                {
                  question:
                    "Quels types d’abonnements seront proposés après la période d’essai ?",
                  answer: (
                    <>
                      <span>
                        {" "}
                        - Professionnels : accès de base toujours actif, options
                        avancées disponibles en supplément.
                      </span>
                      <br className="hidden sm:inline" />
                      <span>
                        {" "}
                        - Entreprises : Choisissez un abonnement adapté, ou
                        l’accès avancé sera désactivé sans engagement.
                      </span>
                    </>
                  ),
                },
                {
                  question: "Est-ce que c’est vraiment gratuit ?",
                  answer: (
                    <>
                      <span>
                        {" "}
                        - Professionnels : accès gratuit avec options avancées
                        payantes.
                      </span>
                      <br className="hidden sm:inline" />
                      <span>
                        {" "}
                        - Entreprises : 1 mois d’essai gratuit, puis abonnement
                        pour continuer à utiliser les services.
                      </span>
                    </>
                  ),
                },
                {
                  question: "Qui peut utiliser la plateforme ?",
                  answer:
                    "La plateforme s’adresse aux professionnels en quête d’opportunités, aux entreprises souhaitant recruter, collaborer ou renforcer en visibilité.",
                },
                {
                  question:
                    "Comment la confidentialité de mes données est-elle assurée ?",
                  answer:
                    "Nous assurons la sécurité de vos données conformément aux normes en vigueur. Consultez notre politique de confidentialité pour plus d’informations.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`w-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-100 dark:border-purple-900/30 transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-purple-500/30 ${
                    i % 2 === 0 ? "md:ml-8" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F4F9FF] flex items-center justify-center text-[#013959] text-lg font-semibold">
                      ?
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-[#7E8B93] dark:text-gray-300 text-sm sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}

      <footer className="w-full border-t border-blue-100 dark:border-gray-800 py-8 sm:py-12 bg-[#013959] dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          {/* Section principale avec logo et menus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo et description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logoFooter.png"
                  alt="Catchub Logo"
                  className="h-7 w-auto hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <p className="text-sm text-gray-200 dark:text-gray-200">
                Catchub, une plateforme innovante qui transforme vos relations
                en opportunités.
              </p>
            </div>

            {/* Section Home */}
            <div className="space-y-5">
              <h4 className="font-semibold text-sm text-white dark:text-white">
                Home
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="#benefits"
                    className="text-sm text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Avantages
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-sm text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Section Légal */}
            <div className="space-y-5">
              <h4 className="font-semibold text-sm text-white dark:text-white">
                Légal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/CGU"
                    className="text-sm text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-sm text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Section réseaux sociaux */}
          <div className="flex gap-4 mb-6">
            {[
              {
                name: "LinkedIn",
                href: "https://www.linkedin.com/showcase/catchub/",
                icon: "LinkedIn",
              },
              {
                name: "Facebook",
                href: "https://www.facebook.com/share/1BWU5gLuo7/",
                icon: "Facebook",
              },
              {
                name: "Instagram",
                href: "https://www.instagram.com/joincatchub?igsh=MW5rZ3hzMXQwNTBjYQ==",
                icon: "Instagram",
              },
              {
                name: "Twitter",
                href: "https://x.com/JoinCatchub?t=68YH3hKHnPHlHBhGbv têtes_4xw&s=09",
                icon: "Twitter",
              },
              {
                name: "TikTok",
                href: "https://www.tiktok.com/@catchub?_t=ZM-8wBW9gBF5FN&_r=1",
                icon: "TikTok",
              },
            ].map((social, i) => (
              <Link
                key={i}
                href={social.href}
                className="text-gray-300 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors hover:-translate-y-0.5 transform"
                aria-label={social.name}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {social.icon === "LinkedIn" && (
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  )}
                  {social.icon === "Facebook" && (
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  )}
                  {social.icon === "Instagram" && (
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.324a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm5.25-10.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z"
                      clipRule="evenodd"
                    />
                  )}
                  {social.icon === "Twitter" && (
                    <path
                      fillRule="evenodd"
                      d="M8.404 20.513c7.404 0 11.454-6.135 11.454-11.454 0-.174 0-.347-.01-.519A8.197 8.197 0 0022 4.39a8.073 8.073 0 01-2.318.635 4.043 4.043 0 001.772-2.23 8.097 8.097 0 01-2.565.982 4.026 4.026 0 00-6.856 3.672 11.427 11.427 0 01-8.3-4.204 4.026 4.026 0 001.247 5.375 4.003 4.003 0 01-1.823-.503v.05a4.026 4.026 0 003.23 3.948 4.02 4.02 0 01-1.818.069 4.027 4.027 0 003.758 2.794 8.077 8.077 0 01-5.007 1.727 8.14 8.14 0 01-.958-.058 11.392 11.392 0 006.174 1.807"
                      clipRule="evenodd"
                    />
                  )}
                  {social.icon === "TikTok" && (
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0z" />
                  )}
                </svg>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-100 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-300 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} Catchub. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      {/* Analytics */}
      <Analytics />
    </div>
  );
}
