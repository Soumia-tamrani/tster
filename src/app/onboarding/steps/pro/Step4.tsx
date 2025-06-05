import { CheckCircle } from "lucide-react";

export default function ProStep4() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] py-16">
      <CheckCircle className="text-green-500 mb-6" size={100} />
      <h2 className="text-2xl md:text-3xl font-bold text-[#013959] mb-2 text-center">
        Merci pour votre inscription !
      </h2>
      <p className="text-[#7E8B93] text-base text-center mb-8">
        Vous êtes parmi les pionniers à découvrir Catchhub.
        <br />
        Le lancement officiel arrive cet été.
      </p>
      <div className="w-full max-w-2xl bg-[#F7F9FA] rounded-xl p-6 mb-8">
        <div className="text-xs font-semibold text-[#013959] mb-2">
          Invitez Des Contacts À Rejoindre Catchhub Et Développez Votre Réseau,
        </div>
        <a
          href="#"
          className="block text-[#1CD5F5] underline text-base font-medium break-words"
        >
          Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut
          Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud
        </a>
      </div>
      <button
        className="w-full max-w-xl h-14 bg-[#1CD5F5] text-white rounded-[11px] text-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#00b8e6] transition"
        onClick={() =>
          navigator.clipboard.writeText("https://catchhub.com/invite/123456")
        }
      >
        Copier le lien
      </button>
    </div>
  );
}
