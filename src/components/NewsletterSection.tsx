  import { useState } from "react";
  import { CheckCircle } from "lucide-react";
  import Link from "next/link"; // Import Link for navigation

  const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [needsRegistration, setNeedsRegistration] = useState(false); // New state to track registration requirement

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage("");
      setSuccessMessage("");
      setNeedsRegistration(false); // Reset registration prompt
      console.log("Submitting email:", email);

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        console.log("API Response:", response);

        const data = await response.json();
        if (response.ok) {
          setIsSubscribed(true);
          setSuccessMessage(
            data.message || "Merci de vous être abonné à notre newsletter. Vous recevrez bientôt nos dernières mises à jour."
          );
          setEmail("");
        } else if (response.status === 403 && data.redirectToRegister) {
          // User needs to register first
          setNeedsRegistration(true);
        } else {
          setErrorMessage(data.message || "Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    };

    return (
    <section className="w-full bg-[#1CD5F529] py-4 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-[180px]">
      <div className="max-w-[1440px] mx-auto h-auto md:h-[298px] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-[60px]">
        {/* Texte */}
        <div className="text-left w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#013959] dark:text-white">
            S’abonner à notre newsletter
          </h2>
          <p
            className="text-xs sm:text-sm md:text-base text-[#013959] dark:text-gray-300 mt-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Abonnez-vous pour recevoir les mises à jour : Restez informé des
            dernières actualités pour les investisseurs, des résultats financiers
            et des annonces en vous abonnant à notre newsletter.
          </p>
        </div>

        {/* Formulaire ou Messages */}
        <div className="w-full sm:w-auto">
          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center bg-white dark:bg-gray-700 p-3 sm:p-4 rounded-lg shadow-md">
              <div className="p-2 bg-blue-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-6 dark:text-purple-400" />
              </div>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base">{successMessage}</p>
              <button
                onClick={() => setIsSubscribed(false)}
                className="bg-[#013959] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm sm:text-base"
              >
                S'abonner à nouveau
              </button>
            </div>
          ) : needsRegistration ? (
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center bg-white dark:bg-yellow-900/30 p-3 sm:p-4 rounded-lg shadow-md">
              <p className="text-[#013959] dark:text-yellow-400 text-sm sm:text-base">
                Vous devez vous inscrire avant de pouvoir vous abonner à la newsletter.
              </p>
              <Link href="/register">
                <button className="bg-[#013959] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm sm:text-base">
                  S'inscrire maintenant
                </button>
              </Link>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center bg-red-100 dark:bg-red-900/30 p-3 sm:p-4 rounded-lg shadow-md">
              <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="bg-[#013959] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm sm:text-base"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row w-full sm:w-[400px] md:w-[450px] lg:w-[510px] h-auto sm:h-[50px] md:h-[63.5px] rounded-[15px] overflow-hidden"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-grow px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600 bg-[#F4FEFF] outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 sm:px-6 sm:py-3 text-white font-semibold bg-[#013959] sm:rounded-none sm:rounded-r-[15px] rounded-b-[15px] sm:rounded-b-none text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );

  };

  export default NewsletterSection;