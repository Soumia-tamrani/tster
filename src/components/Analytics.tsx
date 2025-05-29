'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Script from 'next/script'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export default function Analytics() {
  const [consent, setConsent] = useState<'accepted' | 'refused' | undefined>()

  useEffect(() => {
    const consentCookie = Cookies.get('cookie_consent')
    const preferences = Cookies.get('cookie_preferences')

    if (consentCookie === 'accepted' && preferences) {
      const parsed = JSON.parse(preferences)

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push([
        'consent',
        'update',
        {
          ad_storage: parsed.marketing ? 'granted' : 'denied',
          analytics_storage: parsed.statistics ? 'granted' : 'denied',
        },
      ])

      setConsent('accepted')
    } else {
      setConsent('refused')
    }
  }, [])

if (consent === undefined) return null
if (consent !== 'accepted') return null
return (
  <>
    {/* Google Analytics script chargé UNIQUEMENT après acceptation */}
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-3X0YNSLF83"
      strategy="afterInteractive"
    />
    <Script
      id="ga-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3X0YNSLF83', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `,
      }}
    />
  </>
)

  return null // Pas besoin de JSX ici
}
