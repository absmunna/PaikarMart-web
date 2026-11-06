import React, { useState } from 'react';
import { SmartSellerWizard } from '@/modules/registration';
import { PortalIconBar } from '@shared/PortalIconBar';
import { 
  ShieldCheck, HelpCircle, ChevronDown, ChevronUp,
  Percent, Users, Wallet, Award, Truck, Landmark
} from 'lucide-react';
import { useAppStore } from '@/modules/app';

interface FAQItem {
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
}

const SELLER_FAQS: FAQItem[] = [
  {
    question: "How much does it cost to register as a seller?",
    questionBn: "পাইকার মার্টে মার্চেন্ট হতে কোনো খরচ আছে কি?",
    answer: "Registration is 100% free with 0% hidden fees or monthly membership charges. You can start listing products and receiving orders immediately.",
    answerBn: "পাইকার মার্টে মার্চেন্ট রেজিস্ট্রেশন সম্পুর্ন ফ্রি! এখানে কোনো হিডেন চার্জ বা মাসিক মেম্বারশিপ ফি নেই। আপনি আজই আপনার পণ্য লিস্টিং করে বিক্রি শুরু করতে পারবেন।"
  },
  {
    question: "How and when do I get my payouts?",
    questionBn: "অর্ডারের টাকা আমি কীভাবে এবং কখন পাব?",
    answer: "As soon as the buyer receives and confirms the order, your earnings are credited to your PaikarMart Digital Wallet. From there, you can instantly withdraw via bKash, Nagad, or any direct Bank EFT.",
    answerBn: "গ্রাহক পণ্য বুঝে পেয়ে ডেলিভারি কনফার্ম করলেই অর্ডারের টাকা সাথে সাথে আপনার ডিজিটাল ওয়ালেটে যোগ হয়ে যাবে। ওয়ালেট থেকে আপনি যেকোনো সময় বিকাশ, নগদ অথবা যেকোনো ব্যাংক অ্যাকাউন্টে ইনস্ট্যান্ট ট্রান্সফার করে নিতে পারবেন।"
  },
  {
    question: "Who handles the product delivery and shipping?",
    questionBn: "পণ্য ডেলিভারি এবং কুরিয়ার সার্ভিস কে পরিচালনা করে?",
    answer: "You can choose between 'PaikarMart Fulfilled' where our partner courier picks up and delivers from your warehouse in record speed, or 'Self-Shipment' where you deliver via your own preferred couriers.",
    answerBn: "আপনি দুটি উপায়ে ডেলিভারি করতে পারবেন: 'PaikarMart Fulfilled' যাতে আমাদের নিজস্ব লজিস্টিকস পার্টনার আপনার আড়ত/গুদাম থেকে পণ্য নিয়ে অতি দ্রুত গ্রাহকের ঠিকানায় পৌঁছে দেবে, অথবা 'Self-Shipment' এর মাধ্যমে আপনার সুবিধাজনক যেকোনো কুরিয়ারে পাঠাতে পারবেন।"
  },
  {
    question: "Can I sell both wholesale (B2B) and retail (B2C)?",
    questionBn: "আমি কি পাইকারি (B2B) এবং খুচরা (B2C) উভয়ই বিক্রি করতে পারব?",
    answer: "Yes! Paikar Mart is a hybrid platform. By registering under 'Wholesale & B2B' and retail categories, you can list wholesale packs with Minimum Order Quantity (MOQ) and single units for general consumers.",
    answerBn: "হ্যাঁ! পাইকার মার্ট একটি হাইব্রিড প্ল্যাটফর্ম। আপনি রেজিস্ট্রেশন করার সময় 'Wholesale & B2B' এর পাশাপাশি অন্যান্য রিটেইল ক্যাটাগরি সিলেক্ট করে পাইকারি কার্টন (MOQ সহ) এবং খুচরা পিস হিসেবে সাধারণ ক্রেতা উভয়ের কাছেই বিক্রি করতে পারবেন।"
  }
];

export default function BecomeSellerPage() {
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string || 'bn').toLowerCase();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] flex flex-col transition-colors duration-300">
      
      {/* 1. HEADER STORY BAR */}
      <section className="pt-2 px-3 sm:px-6">
      </section>

      {/* 2. STICKY PORTAL/CATEGORY BAR */}
      <div className="sticky top-[60px] md:top-[64px] z-40 bg-[var(--pm-bg)]/95 backdrop-blur-md border-b border-[var(--pm-border)] px-3 sm:px-6 transition-all duration-300">
        <PortalIconBar context="seller" />
      </div>

      {/* 3. HERO LANDING SECTION (WHY SELL ON PAIKAR MART) */}
      <section className="relative px-4 md:px-8 py-10 md:py-16 bg-gradient-to-b from-[var(--pm-surface)] via-[var(--pm-bg)] to-[var(--pm-bg)] border-b border-[var(--pm-border)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[var(--pm-accent)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/25 rounded-full">
            <Award className="w-4 h-4 text-[var(--pm-accent)]" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-[var(--pm-accent)]">
              {lang === 'bn' ? 'বাংলাদেশ ১ম সোশ্যাল কমার্স সুপার অ্যাপ' : 'Bangladesh #1 Social Commerce Super App'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[var(--pm-text)] tracking-tight leading-tight md:leading-none text-balance">
            {lang === 'bn' ? (
              <>
                পাইকার মার্টে <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)]">সেলার অ্যাকাউন্ট</span> খুলুন, ব্যবসা বড় করুন!
              </>
            ) : (
              <>
                Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)]">Digital Store</span> on PaikarMart Today
              </>
            )}
          </h1>

          <p className="text-[var(--pm-muted)] text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn' 
              ? 'সরাসরি যুক্ত হোন লক্ষাধিক বিশ্বস্ত পাইকারি ও খুচরা ক্রেতাদের সাথে। কোনো অগ্রিম ফি ছাড়া জিরো কমিশন স্টার্ট আপ সুবিধার মাধ্যমে আজই প্রোডাক্ট বিক্রি শুরু করুন।' 
              : 'Directly reach lakhs of verified retail & wholesale buyers across Bangladesh. Leverage our zero commission merchant features to double your sales.'}
          </p>

          {/* Core Metrics Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto pt-6 text-center select-none">
            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] backdrop-blur-xs">
              <p className="text-lg md:text-2xl font-black text-[var(--pm-text)] tracking-tight">০%</p>
              <p className="text-[9px] md:text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-widest mt-1">
                {lang === 'bn' ? 'হিডেন চার্জ' : 'Hidden Fees'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] backdrop-blur-xs">
              <p className="text-lg md:text-2xl font-black text-[var(--pm-text)] tracking-tight">১ লাখ+</p>
              <p className="text-[9px] md:text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-widest mt-1">
                {lang === 'bn' ? 'সক্রিয় ক্রেতা' : 'Active Buyers'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] backdrop-blur-xs">
              <p className="text-lg md:text-2xl font-black text-[var(--pm-text)] tracking-tight">ইনস্ট্যান্ট</p>
              <p className="text-[9px] md:text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-widest mt-1">
                {lang === 'bn' ? 'পেমেন্ট উইথড্র' : 'Fast Payouts'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN REGISTRATION WIZARD */}
      <div className="flex-1 w-full bg-gradient-to-b from-[var(--pm-bg)] to-[var(--pm-surface)]">
        <SmartSellerWizard />
      </div>

      {/* 5. SELLER TRUST BENEFIT CARDS SECTION */}
      <section className="px-4 md:px-8 py-12 bg-[var(--pm-surface)] border-t border-[var(--pm-border)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-[var(--pm-text)] tracking-tight">
              {lang === 'bn' ? 'সেলার হিসেবে আপনার দুর্দান্ত সুবিধাসমূহ' : 'Exclusive Merchant Privileges'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)] mt-1">
              {lang === 'bn' ? 'সবচেয়ে সহজ প্রযুক্তির সাহায্যে আপনার ব্যবসার গতি বাড়ান' : 'Powering your trade with cutting-edge social commerce features'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--pm-accent)]/10 flex items-center justify-center text-[var(--pm-accent)]">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">{lang === 'bn' ? '০% মেম্বারশিপ কমিশন' : '0% Sales Commission'}</h3>
              <p className="text-[11px] text-[var(--pm-muted)] leading-relaxed">
                {lang === 'bn' ? 'কোনো লুকানো বা সাবস্ক্রিপশন চার্জ ছাড়াই সম্পূর্ণ ফ্রিতে আপনার লিস্টিং চালিয়ে যান।' : 'Keep 100% of your retail and wholesale margins with zero listing or commission fees.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">{lang === 'bn' ? 'সরাসরি বায়ার ডিমান্ড অ্যাক্সেস' : 'Direct Buyer Demand'}</h3>
              <p className="text-[11px] text-[var(--pm-muted)] leading-relaxed">
                {lang === 'bn' ? 'ক্রেতারা তাদের প্রয়োজনীয় চাহিদার জন্য যে ডিমান্ড পোস্ট করে, সেখানে সরাসরি বিড বা অফার পাঠান।' : 'Instantly access verified buyer queries on the Demand board and propose direct offers.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">{lang === 'bn' ? 'সুরক্ষিত এসক্রো পেমেন্ট' : 'Escrow Secured'}</h3>
              <p className="text-[11px] text-[var(--pm-muted)] leading-relaxed">
                {lang === 'bn' ? 'গ্রাহক পণ্য বুঝে পেলেই তাৎক্ষণিক পেমেন্ট রিলিজ হয়। টাকা উত্তোলনের ঝামেলা এড়াতে রয়েছে ওয়ালেট সিস্টেম।' : 'Fully protected escrow guarantees prompt wallet releases immediately after successful delivery.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SELLER INTERACTIVE FAQ SECTION */}
      <section className="px-4 md:px-8 py-12 bg-[var(--pm-surface)] border-t border-[var(--pm-border)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-[var(--pm-text)] tracking-tight flex items-center justify-center md:justify-start gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলি' : 'Frequently Asked Questions'}</span>
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {lang === 'bn' ? 'মার্চেন্ট যাত্রা শুরুর পূর্বে সাধারণ কিছু তথ্য ও উত্তরমালা:' : 'Essential info regarding our seller fee structures and logistics:'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {SELLER_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-border)]/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <span className="text-xs md:text-sm font-bold text-[var(--pm-text)] transition-colors">
                      {lang === 'bn' ? faq.questionBn : faq.question}
                    </span>
                    <span className="text-[var(--pm-muted)] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--pm-accent)]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[var(--pm-muted)] leading-relaxed border-t border-[var(--pm-border)] bg-[var(--pm-bg)]/40">
                      {lang === 'bn' ? faq.answerBn : faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. TRUST & SAFETY HELPLINE BANNER / FOOTER */}
      <footer className="mt-auto bg-[var(--pm-bg)] border-t border-[var(--pm-border)] py-12 px-4 md:px-8 select-none">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          
          <div className="space-y-3 col-span-1">
            <div className="text-lg font-black tracking-tight text-[var(--pm-text)]">
              <span className="text-[var(--pm-accent)]">Paikar</span>Mart
            </div>
            <p className="text-[10px] text-[var(--pm-muted)] leading-relaxed uppercase tracking-wider">
              {lang === 'bn' ? 'বাংলাদেশের বৃহত্তম কমার্স এবং লজিস্টিকস হাব আড়ত' : 'The Largest Commerce & Logistics Hub of Bangladesh'}
            </p>
            <p className="text-[10px] text-[var(--pm-muted)]/60 font-bold mt-1">
              © {new Date().getFullYear()} Paikar Mart. e-CAB Member Verified.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-[var(--pm-muted)] tracking-widest">{lang === 'bn' ? 'নিরাপত্তা ও ট্রাস্ট' : 'Trust & Verification'}</h4>
            <div className="space-y-2 text-[11px] text-[var(--pm-muted)]">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'bn' ? 'BSTI ও ক্যাটাগরি কমপ্লায়েন্স' : 'BSTI Compliance Checked'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Landmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'bn' ? '১০০% সুরক্ষিত এসক্রো পেমেন্ট' : 'Secure Escrow Gateways'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Truck className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span>{lang === 'bn' ? 'লাইভ কুরিয়ার ট্র্যাক সুবিধা' : 'Fulfilled Delivery Networks'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-[var(--pm-muted)] tracking-widest">{lang === 'bn' ? 'মার্চেন্ট সাপোর্ট সেন্টার' : 'Merchant Support'}</h4>
            <p className="text-[11px] text-[var(--pm-muted)] leading-relaxed">
              {lang === 'bn' ? 'রেজিস্ট্রেশন বা ভেরিফিকেশনে যেকোনো প্রয়োজনে আমাদের ২৪/৭ হেল্পলাইনে কল করুন:' : 'If you face any issue during business documentation upload:'}
            </p>
            <div className="pt-1">
              <a 
                href="tel:09638022222" 
                className="text-sm font-black text-[var(--pm-accent)] hover:underline flex items-center justify-center sm:justify-start gap-1"
              >
                ০৯৬-৩৮০২২২২২ (Helpline)
              </a>
              <span className="text-[9px] text-[var(--pm-muted)]/60 block mt-1 uppercase tracking-widest">or email: support@paikarmart.com</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
