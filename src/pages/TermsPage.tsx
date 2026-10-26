import React, { useState } from "react";
import { FileText, ChevronDown } from "lucide-react";

interface TermsSection {
  title: string;
  content?: string;
  bullets?: string[];
}

const SECTIONS: TermsSection[] = [
  {
    title: "1. General Rules",
    content: "Welcome to PaikarMart. By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. PaikarMart reserves the right to update these terms at any time.",
  },
  {
    title: "2. Customer Rules",
    bullets: [
      "Customers must provide accurate information during registration and checkout.",
      "Cash on Delivery orders must be paid in full upon receiving the items.",
      "Fake orders or repeated refusal to accept Cash on Delivery orders may result in account suspension.",
      "Customers must not attempt to circumvent platform fees or policies.",
    ],
  },
  {
    title: "3. Seller Rules",
    bullets: [
      "Sellers must provide valid business documents during registration.",
      "Listing counterfeit, prohibited, or misleading items is strictly forbidden.",
      "Sellers must fulfill confirmed orders within the stipulated timeframe.",
      "Sellers are responsible for the quality and accuracy of product descriptions.",
      "Sellers must not engage in price manipulation or deceptive trade practices.",
    ],
  },
  {
    title: "4. Platform Fees & Payments",
    content: "PaikarMart reserves the right to charge platform fees or commissions on successful sales. Payment terms for sellers will be outlined in the Seller Dashboard upon approval. PaikarMart acts only as an intermediary — funds flow directly between buyer and seller.",
  },
  {
    title: "5. Dispute Resolution",
    content: "In case of disputes between buyers and sellers, PaikarMart acts as a neutral intermediary. Our support team will investigate and make a decision based on available evidence. Both parties agree to cooperate fully in any investigation.",
  },
  {
    title: "6. Privacy & Data",
    content: "PaikarMart collects and uses personal data only as necessary for platform operation. We do not sell personal information to third parties. All data is stored with industry-standard encryption. Users may request data deletion by contacting support.",
  },
  {
    title: "7. Limitation of Liability",
    content: "PaikarMart is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability shall not exceed the value of the transaction in dispute. Users assume responsibility for their own actions on the platform.",
  },
];

interface SectionProps {
  title: string;
  content?: string;
  bullets?: string[];
}

const Section: React.FC<SectionProps> = ({ title, content, bullets }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b last:border-0 border-white/5">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}  />
      </button>
      {open && (
        <div className="px-5 pb-5">
          {content && <p className="text-sm text-white/50 leading-relaxed">{content}</p>}
          {bullets && (
            <ul className="space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <span className="text-orange-500 mt-1 shrink-0">•</span> {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="py-4">
      {/* Hero */}
      <div className="border-b border-white/5 mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl bg-gradient-to-r from-orange-500/10 to-transparent p-6 rounded-3xl border border-orange-500/15">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 uppercase">Terms & Conditions</h1>
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Last updated: {new Date().toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 max-w-3xl">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-sm">
          {SECTIONS.map((s) => (
            <Section 
              key={s.title} 
              title={s.title} 
              content={s.content} 
              bullets={s.bullets} 
            />
          ))}
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-white/35 leading-relaxed">
            These terms were last updated on {new Date().toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}.
            By using PaikarMart, you acknowledge that you have read, understood, and agreed to these terms.
            For questions, contact <span className="text-orange-500">support@paikarmart.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
