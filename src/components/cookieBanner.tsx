"use client";
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import CookieModal from "./cookieModal";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (!consent || (consent !== "accepted" && consent !== "refused")) {
      setShowBanner(true);
      setTimeout(() => setVisible(true), 100);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("cookie_consent", "accepted", {
      expires: 365,
      sameSite: "Lax",
    });
    Cookies.set(
      "cookie_preferences",
      JSON.stringify({
        functional: true,
        statistics: true,
        marketing: true,
      }),
      { expires: 365, sameSite: "Lax" }
    );

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }

    closeBanner();
  };

  const refuseCookies = () => {
    Cookies.set("cookie_consent", "refused", { expires: 365, sameSite: "Lax" });
    Cookies.set(
      "cookie_preferences",
      JSON.stringify({
        functional: true,
        statistics: false,
        marketing: false,
      }),
      { expires: 365, sameSite: "Lax" }
    );

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    }

    closeBanner();
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const handlePreferencesSaved = () => {
    setShowPreferences(false);
    closeBanner();
  };

  const closeBanner = () => {
    setVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <>
      {showPreferences && <CookieModal onClose={handlePreferencesSaved} />}

      <div className="fixed bottom-6 left-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            🍪 Our website uses cookies
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Our website use cookies. By continuing, we assume your permission to
            deploy cookies as detailed in our{" "}
            <Link
              href="/privacy-policy"
              className="text-sky-400 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={acceptCookies}
              className="bg-sky-400 hover:bg-sky-500 text-white px-8 py-3 rounded-full font-semibold text-base shadow transition-colors duration-200 w-1/2"
            >
              Accept all
            </button>
            <button
              onClick={openPreferences}
              className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-base transition-colors duration-200 w-1/2"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
