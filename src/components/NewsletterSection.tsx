import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setIsSubscribed(true);
        setSuccessMessage('Merci de vous être abonné à notre newsletter. Vous recevrez bientôt nos dernières mises à jour.');
        setEmail('');
      }
    } catch (error) {
      setSuccessMessage('Une erreur s\'est produite. Veuillez réessayer.');    
    }
  };

  return (
  <section className="w-full bg-[#1CD5F529] py-4 px-4 sm:px-8 md:px-16 lg:px-[100px] xl:px-[180px]">
    <div className="max-w-[1440px] mx-auto h-auto md:h-[298px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-[60px]">
      
      {/* Texte */}
      <div className="text-left max-w-full md:max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#013959] dark:text-white">
          S’abonner à notre newsletter
        </h2>
        <p
          className="text-sm sm:text-base text-[#013959] dark:text-gray-300 mt-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Abonnez-vous pour recevoir les mises à jour : Restez informé des
          dernières actualités pour les investisseurs, des résultats financiers
          et des annonces en vous abonnant à notre newsletter.
        </p>
      </div>

      {/* Formulaire ou Message de succès */}
      <div className="w-full md:w-auto">
        {isSubscribed ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="p-2 bg-blue-100 dark:bg-purple-900/30 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-900 dark:text-white">{successMessage}</p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="bg-[#013959] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              S'abonner à nouveau
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row w-full sm:w-[510px] h-auto sm:h-[63.5px] rounded-[15px] overflow-hidden"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 text-sm text-gray-600 bg-[#F4FEFF] outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 text-white font-semibold bg-[#013959] sm:rounded-none sm:rounded-r-[15px] rounded-b-[15px] sm:rounded-b-none"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  </section>
);

}

export default NewsletterSection;