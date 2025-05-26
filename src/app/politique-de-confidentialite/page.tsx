'use client'

import Link from 'next/link'

export default function PolitiqueDeConfidentialite() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-700" id="top">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de confidentialité</h1>

      <p className="mb-4">Dernière mise à jour : 25 avril 2025</p>

      <p className="mb-4">
        La présente politique de confidentialité couvre les activités de Catchub.
      </p>

      <p className="mb-4">
        Catchub est un produit de Services Conseils KnovaDev. (15661668 CANADA INC.)
      </p>

      <p className="mb-4">
        Catchub (« nous », « notre » ou « nos ») décrit comment et pourquoi nous pouvons accéder à vos informations personnelles, les collecter, les stocker, les utiliser et/ou les partager (« traiter ») lorsque vous utilisez nos services (« Services »), notamment lorsque vous :
      </p>

      <ul className="list-disc list-inside mb-4">
        <li>Visitez notre site web à l’adresse <a href="http://www.catchub.com" className="text-indigo-600 underline">http://www.catchub.com</a>, ou tout autre site qui renvoie à cette Politique de Confidentialité</li>
        <li>Interagissez avec nous par d'autres moyens connexes, y compris les ventes, le marketing ou les événements</li>
      </ul>

      <p className="mb-4 font-semibold">Des questions ou des préoccupations ?</p>

      <p className="mb-4">
        La lecture de cette politique de confidentialité vous aidera à comprendre vos droits et choix en matière de confidentialité. Nous sommes responsables des décisions concernant la manière dont vos informations personnelles sont traitées. Si vous n’êtes pas d’accord avec nos politiques et pratiques, veuillez ne pas utiliser nos Services.
      </p>

      <p className="mb-4 font-semibold">RÉSUMÉ DES POINTS CLÉS</p>

      <p className="mb-4">
        Ce résumé présente les points essentiels de notre politique de confidentialité. Vous pouvez consulter les détails de chaque sujet en cliquant sur les liens ou en vous reportant à la table des matières ci-dessous.
      </p>

      <p className="mb-4">Quelles informations personnelles traitons-nous ?</p>

      <p className="mb-4">Lorsque vous visitez, utilisez ou naviguez sur nos Services, nous pouvons traiter des informations personnelles selon la façon dont vous interagissez avec nous, les Services, les choix que vous faites et les fonctionnalités que vous utilisez.</p>

      <p className="mb-4">Traiterons-nous des informations personnelles sensibles ?</p>

      <p className="mb-4">Certaines informations peuvent être considérées comme « sensibles » dans certaines juridictions (origine raciale ou ethnique, orientation sexuelle, croyances religieuses, etc.). Nous ne traitons pas de telles informations sensibles.</p>

      <p className="mb-4">Collectons-nous des informations de la part de tiers ?</p>

      <p className="mb-4">Non, nous ne collectons pas d’informations provenant de tiers.</p>

      <p className="mb-4">Comment traitons-nous vos informations ?</p>

      <p className="mb-4">Nous les utilisons pour fournir, améliorer et gérer nos Services, communiquer avec vous, assurer la sécurité et prévenir les fraudes, et nous conformer à la loi. D’autres traitements peuvent être effectués avec votre consentement. Nous ne traitons vos données que si nous avons une base légale valable.</p>

      <p className="mb-4">Dans quelles situations et avec quels types de tiers partageons-nous vos données personnelles ?</p>

      <p className="mb-4">Nous pouvons partager vos informations dans des situations précises et avec certaines catégories de tiers.</p>

      <p className="mb-4">Comment protégeons-nous vos informations ?</p>

      <p className="mb-4">Nous avons mis en place des mesures organisationnelles et techniques adéquates. Toutefois, aucune technologie de transmission ou de stockage sur internet n’est sécurisée à 100 %, nous ne pouvons donc pas garantir une sécurité absolue contre les pirates ou autres tiers non autorisés.</p>

      <p className="mb-4">Quels sont vos droits ?</p>

      <p className="mb-4">Selon votre pays ou région, la loi applicable peut vous accorder certains droits concernant vos informations personnelles.</p>

      <p className="mb-4">Comment exercer vos droits ?</p>

      <p className="mb-4">Le moyen le plus simple est de soumettre une demande d’accès aux données ou de nous contacter. Nous traiterons votre demande conformément aux lois sur la protection des données.</p>

      <p className="mb-4 font-semibold">Envie d’en savoir plus sur l’usage de vos informations ?</p>

      <p className="mb-4">Veuillez lire la Politique de Confidentialité complète ci-dessous.</p>

      <p className="mb-4 font-semibold">TABLE DES MATIÈRES</p>

      <ul className="list-disc list-inside mb-4">
        <li>QUELLES INFORMATIONS COLLECTONS-NOUS ?</li>
        <li>COMMENT TRAITONS-NOUS VOS INFORMATIONS ?</li>
        <li>AVEC QUI PARTAGEONS-NOUS VOS INFORMATIONS PERSONNELLES ?</li>
        <li>UTILISONS-NOUS DES COOKIES ET AUTRES TECHNOLOGIES DE SUIVI ?</li>
        <li>PROPOSONS-NOUS DES PRODUITS FONDÉS SUR L’INTELLIGENCE ARTIFICIELLE ?</li>
        <li>COMMENT GÉRONS-NOUS VOS CONNEXIONS SOCIALES ?</li>
        <li>COMBIEN DE TEMPS CONSERVONS-NOUS VOS INFORMATIONS ?</li>
        <li>COMMENT PROTÉGEONS-NOUS VOS INFORMATIONS ?</li>
        <li>COLLECTONS-NOUS DES INFORMATIONS SUR LES MINEURS ?</li>
        <li>QUELS SONT VOS DROITS EN MATIÈRE DE CONFIDENTIALITÉ ?</li>
        <li>CONTRÔLES DES FONCTIONNALITÉS DO-NOT-TRACK</li>
        <li>METTONS-NOUS À JOUR CETTE POLITIQUE ?</li>
        <li>COMMENT NOUS CONTACTER AU SUJET DE CETTE POLITIQUE ?</li>
        <li>COMMENT CONSULTER, METTRE À JOUR OU SUPPRIMER LES DONNÉES COLLECTÉES ?</li>
      </ul>
      

      <div className="mt-12 pt-6 border-t border-indigo-100 flex justify-between items-center">
        <p className="text-sm text-gray-500">Dernière mise à jour : 25 avril 2025</p>
        <Link href="/" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
