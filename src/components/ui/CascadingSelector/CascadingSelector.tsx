// (new add) - CascadingSelector.tsx
import React, { useState, useEffect, useMemo } from "react";
import { 
  MapPin, 
  Map, 
  Navigation, 
  Check, 
  ChevronDown, 
  Search, 
  Globe, 
  Building,
  HelpCircle
} from "lucide-react";

export interface GeoLocation {
  id: string;
  bnName: string;
  enName: string;
}

export interface DistrictData extends GeoLocation {
  upazilas: GeoLocation[];
}

export interface DivisionData extends GeoLocation {
  districts: Record<string, DistrictData>;
}

// 100% Real Geographical Mapping of Bangladesh Division -> District -> Upazila
export const BANGLADESH_GEOGRAPHY: Record<string, DivisionData> = {
  dhaka: {
    id: "dhaka",
    bnName: "ঢাকা",
    enName: "Dhaka",
    districts: {
      dhaka: {
        id: "dhaka",
        bnName: "ঢাকা",
        enName: "Dhaka",
        upazilas: [
          { id: "dhanmondi", bnName: "ধানমন্ডি", enName: "Dhanmondi" },
          { id: "mirpur", bnName: "মিরপুর", enName: "Mirpur" },
          { id: "gulshan", bnName: "গুলশান", enName: "Gulshan" },
          { id: "savar", bnName: "সাভার", enName: "Savar" },
          { id: "uttara", bnName: "উত্তরা", enName: "Uttara" },
          { id: "keraniganj", bnName: "কেরানীগঞ্জ", enName: "Keraniganj" },
          { id: "tejgaon", bnName: "তেজগাঁও", enName: "Tejgaon" },
          { id: "motijheel", bnName: "মতিঝিল", enName: "Motijheel" }
        ]
      },
      gazipur: {
        id: "gazipur",
        bnName: "গাজীপুর",
        enName: "Gazipur",
        upazilas: [
          { id: "gazipur_sadar", bnName: "গাজীপুর সদর", enName: "Gazipur Sadar" },
          { id: "kaliakair", bnName: "কালিয়াকৈর", enName: "Kaliakair" },
          { id: "sreepur", bnName: "শ্রীপুর", enName: "Sreepur" },
          { id: "kapasia", bnName: "কাপাসিয়া", enName: "Kapasia" },
          { id: "kaliganj", bnName: "কালীগঞ্জ", enName: "Kaliganj" }
        ]
      },
      narayanganj: {
        id: "narayanganj",
        bnName: "নারায়ণগঞ্জ",
        enName: "Narayanganj",
        upazilas: [
          { id: "narayanganj_sadar", bnName: "নারায়ণগঞ্জ সদর", enName: "Narayanganj Sadar" },
          { id: "araihazar", bnName: "আড়াইহাজার", enName: "Araihazar" },
          { id: "bandar", bnName: "বন্দর", enName: "Bandar" },
          { id: "rupganj", bnName: "রূপগঞ্জ", enName: "Rupganj" },
          { id: "sonargaon", bnName: "সোনারগাঁও", enName: "Sonargaon" }
        ]
      },
      tangail: {
        id: "tangail",
        bnName: "টাঙ্গাইল",
        enName: "Tangail",
        upazilas: [
          { id: "tangail_sadar", bnName: "টাঙ্গাইল সদর", enName: "Tangail Sadar" },
          { id: "mirzapur", bnName: "মির্জাপুর", enName: "Mirzapur" },
          { id: "madhupur", bnName: "মধুপুর", enName: "Madhupur" },
          { id: "gopalpur", bnName: "গোপালপুর", enName: "Gopalpur" },
          { id: "kalihati", bnName: "কালিহাতী", enName: "Kalihati" }
        ]
      }
    }
  },
  chattogram: {
    id: "chattogram",
    bnName: "চট্টগ্রাম",
    enName: "Chattogram",
    districts: {
      chattogram: {
        id: "chattogram",
        bnName: "চট্টগ্রাম",
        enName: "Chattogram",
        upazilas: [
          { id: "kotwali", bnName: "কোতোয়ালী", enName: "Kotwali" },
          { id: "double_mooring", bnName: "ডবলমুরিং", enName: "Double Mooring" },
          { id: "hathazari", bnName: "হাটহাজারী", enName: "Hathazari" },
          { id: "patenga", bnName: "পতেঙ্গা", enName: "Patenga" },
          { id: "potiya", bnName: "পটিয়া", enName: "Potiya" },
          { id: "sandwip", bnName: "সন্দ্বীপ", enName: "Sandwip" }
        ]
      },
      cox_bazar: {
        id: "cox_bazar",
        bnName: "কক্সবাজার",
        enName: "Cox's Bazar",
        upazilas: [
          { id: "cox_sadar", bnName: "কক্সবাজার সদর", enName: "Cox's Bazar Sadar" },
          { id: "ukhiya", bnName: "উখিয়া", enName: "Ukhiya" },
          { id: "teknaf", bnName: "টেকনাফ", enName: "Teknaf" },
          { id: "ramu", bnName: "রামু", enName: "Ramu" },
          { id: "chakaria", bnName: "চকরিয়া", enName: "Chakaria" }
        ]
      },
      cumilla: {
        id: "cumilla",
        bnName: "কুমিল্লা",
        enName: "Cumilla",
        upazilas: [
          { id: "cumilla_sadar", bnName: "কুমিল্লা সদর", enName: "Cumilla Sadar" },
          { id: "laksam", bnName: "লাকসাম", enName: "Laksam" },
          { id: "daudkandi", bnName: "দাউদকান্দি", enName: "Daudkandi" },
          { id: "chauddagram", bnName: "চৌদ্দগ্রাম", enName: "Chauddagram" }
        ]
      }
    }
  },
  sylhet: {
    id: "sylhet",
    bnName: "সিলেট",
    enName: "Sylhet",
    districts: {
      sylhet: {
        id: "sylhet",
        bnName: "সিলেট",
        enName: "Sylhet",
        upazilas: [
          { id: "sylhet_sadar", bnName: "সিলেট সদর", enName: "Sylhet Sadar" },
          { id: "beanibazar", bnName: "বিয়ানীবাজার", enName: "Beanibazar" },
          { id: "golapganj", bnName: "গোলাপগঞ্জ", enName: "Golapganj" },
          { id: "balaganj", bnName: "বালাগঞ্জ", enName: "Balaganj" },
          { id: "jaintiapur", bnName: "জৈন্তাপুর", enName: "Jaintiapur" }
        ]
      },
      moulvibazar: {
        id: "moulvibazar",
        bnName: "মৌলভীবাজার",
        enName: "Moulvibazar",
        upazilas: [
          { id: "moulvibazar_sadar", bnName: "মৌলভীবাজার সদর", enName: "Moulvibazar Sadar" },
          { id: "sreemangal", bnName: "শ্রীমঙ্গল", enName: "Sreemangal" },
          { id: "kulaura", bnName: "কুলাউড়া", enName: "Kulaura" },
          { id: "kamalganj", bnName: "কমলগঞ্জ", enName: "Kamalganj" }
        ]
      }
    }
  },
  khulna: {
    id: "khulna",
    bnName: "খুলনা",
    enName: "Khulna",
    districts: {
      khulna: {
        id: "khulna",
        bnName: "খুলনা",
        enName: "Khulna",
        upazilas: [
          { id: "khulna_sadar", bnName: "খুলনা সদর", enName: "Khulna Sadar" },
          { id: "daulatpur", bnName: "দৌলতপুর", enName: "Daulatpur" },
          { id: "rupsha", bnName: "রূপসা", enName: "Rupsha" },
          { id: "dumuria", bnName: "ডুমুরিয়া", enName: "Dumuria" }
        ]
      },
      jashore: {
        id: "jashore",
        bnName: "যশোর",
        enName: "Jashore",
        upazilas: [
          { id: "jashore_sadar", bnName: "যশোর সদর", enName: "Jashore Sadar" },
          { id: "jhikargachha", bnName: "ঝিকরগাছা", enName: "Jhikargachha" },
          { id: "keshabpur", bnName: "কেশবপুর", enName: "Keshabpur" }
        ]
      }
    }
  },
  rajshahi: {
    id: "rajshahi",
    bnName: "রাজশাহী",
    enName: "Rajshahi",
    districts: {
      rajshahi: {
        id: "rajshahi",
        bnName: "রাজশাহী",
        enName: "Rajshahi",
        upazilas: [
          { id: "boalia", bnName: "বোয়ালিয়া", enName: "Boalia" },
          { id: "motihar", bnName: "মতিহার", enName: "Motihar" },
          { id: "paba", bnName: "পবা", enName: "Paba" },
          { id: "bagha", bnName: "বাঘা", enName: "Bagha" }
        ]
      },
      bogura: {
        id: "bogura",
        bnName: "বগুড়া",
        enName: "Bogura",
        upazilas: [
          { id: "bogura_sadar", bnName: "বগুড়া সদর", enName: "Bogura Sadar" },
          { id: "sherpur", bnName: "শেরপুর", enName: "Sherpur" },
          { id: "shajahanpur", bnName: "শাহজাহানপুর", enName: "Shajahanpur" },
          { id: "kahaloo", bnName: "কাহালু", enName: "Kahaloo" }
        ]
      }
    }
  }
};

export interface CascadingSelectorProps {
  initialDivision?: string;
  initialDistrict?: string;
  initialUpazila?: string;
  onChange?: (division: GeoLocation | null, district: GeoLocation | null, upazila: GeoLocation | null) => void;
  lang?: "bn" | "en";
  className?: string;
}

export const CascadingSelector: React.FC<CascadingSelectorProps> = ({
  initialDivision = "",
  initialDistrict = "",
  initialUpazila = "",
  onChange,
  lang = "bn",
  className = ""
}) => {
  // Navigation states mapped strictly to local variables
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(initialDivision);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrict);
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string>(initialUpazila);

  // Active custom dropdown list expansion states
  const [isDivisionOpen, setIsDivisionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isUpazilaOpen, setIsUpazilaOpen] = useState(false);

  // Search filter query string parameters
  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  // Setup dynamic references
  const divisions = useMemo(() => Object.values(BANGLADESH_GEOGRAPHY), []);
  
  const currentDivision = useMemo(() => {
    return BANGLADESH_GEOGRAPHY[selectedDivisionId] || null;
  }, [selectedDivisionId]);

  const currentDistrict = useMemo(() => {
    if (!currentDivision) return null;
    return currentDivision.districts[selectedDistrictId] || null;
  }, [currentDivision, selectedDistrictId]);

  const currentUpazila = useMemo(() => {
    if (!currentDistrict) return null;
    return currentDistrict.upazilas.find(u => u.id === selectedUpazilaId) || null;
  }, [currentDistrict, selectedUpazilaId]);

  // Handle updates to parents
  useEffect(() => {
    if (onChange) {
      onChange(
        currentDivision ? { id: currentDivision.id, bnName: currentDivision.bnName, enName: currentDivision.enName } : null,
        currentDistrict ? { id: currentDistrict.id, bnName: currentDistrict.bnName, enName: currentDistrict.enName } : null,
        currentUpazila ? { id: currentUpazila.id, bnName: currentUpazila.bnName, enName: currentUpazila.enName } : null
      );
    }
  }, [selectedDivisionId, selectedDistrictId, selectedUpazilaId, onChange, currentDivision, currentDistrict, currentUpazila]);

  // Clean filters when selection cascades
  const handleDivisionSelect = (id: string) => {
    setSelectedDivisionId(id);
    setSelectedDistrictId("");
    setSelectedUpazilaId("");
    setIsDivisionOpen(false);
    setIsDistrictOpen(true); // Auto-open next level for swift checkout flow
    setDistrictSearch("");
    setUpazilaSearch("");
  };

  const handleDistrictSelect = (id: string) => {
    setSelectedDistrictId(id);
    setSelectedUpazilaId("");
    setIsDistrictOpen(false);
    setIsUpazilaOpen(true); // Auto-open next level for swift validation
    setUpazilaSearch("");
  };

  const handleUpazilaSelect = (id: string) => {
    setSelectedUpazilaId(id);
    setIsUpazilaOpen(false);
  };

  // Filter lists based on localized query string
  const filteredDistricts = useMemo(() => {
    if (!currentDivision) return [];
    const list = Object.values(currentDivision.districts);
    if (!districtSearch) return list;
    const cleanSearch = districtSearch.toLowerCase();
    return list.filter(d => 
      d.bnName.toLowerCase().includes(cleanSearch) || 
      d.enName.toLowerCase().includes(cleanSearch)
    );
  }, [currentDivision, districtSearch]);

  const filteredUpazilas = useMemo(() => {
    if (!currentDistrict) return [];
    const list = currentDistrict.upazilas;
    if (!upazilaSearch) return list;
    const cleanSearch = upazilaSearch.toLowerCase();
    return list.filter(u => 
      u.bnName.toLowerCase().includes(cleanSearch) || 
      u.enName.toLowerCase().includes(cleanSearch)
    );
  }, [currentDistrict, upazilaSearch]);

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* 1. VISUAL PROGRESS PIPELINE TRACKER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <label className="text-xs font-black text-white/80 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <MapPin className="h-4 w-4 text-[var(--pm-accent)] animate-pulse" />
          {lang === "bn" ? "ডেলিভারি ঠিকানা বিন্যাস" : "Delivery Destination Pipeline"}
        </label>
        
        {/* Verification Status Banner */}
        <div className="flex items-center gap-1 text-[9px] font-black uppercase text-[var(--pm-text-secondary)] tracking-widest">
          <span className={`inline-block w-2 h-2 rounded-full ${currentUpazila ? "bg-cyan-500" : "bg-orange-500 animate-ping"}`} />
          {currentUpazila 
            ? (lang === "bn" ? "ভেরিফাইড ঠিকানা" : "Verified address")
            : (lang === "bn" ? "অসম্পূর্ণ ঠিকানা" : "Pending Selection")}
        </div>
      </div>

      {/* Grid wrapper supporting both Mobile Stack layout and standard Desktop width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ==================== DIVISION SELECTOR ==================== */}
        <div className="relative">
          <label className="block text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest mb-1.5">
            {lang === "bn" ? "১. বিভাগ নির্বাচন করুণ" : "1. Select Division"} <span className="text-[var(--pm-accent)]">*</span>
          </label>
          
          <button
            type="button"
            onClick={() => {
              setIsDivisionOpen(!isDivisionOpen);
              setIsDistrictOpen(false);
              setIsUpazilaOpen(false);
            }}
            className="w-full h-11 px-3 bg-white/[0.03] border border-white/10 hover:border-[var(--pm-accent)]/40 rounded-xl flex items-center justify-between text-xs text-white uppercase font-bold tracking-wide transition-all duration-150 active:scale-[0.98] outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="h-3.5 w-3.5 text-[var(--pm-accent)]" />
              <span className="truncate">
                {currentDivision 
                  ? (lang === "bn" ? currentDivision.bnName : currentDivision.enName)
                  : (lang === "bn" ? "বিভাগ খুঁজুন..." : "Find Division...")}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${isDivisionOpen ? "rotate-180" : ""}`} />
          </button>

          {isDivisionOpen && (
            <div className="absolute top-[62px] left-0 right-0 max-h-56 bg-[var(--pm-surface)] border border-white/10 rounded-2xl overflow-y-auto shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {divisions.map((div) => {
                const isSelected = div.id === selectedDivisionId;
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => handleDivisionSelect(div.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected 
                        ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] font-extrabold" 
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Map className="h-3.5 w-3.5 text-white/40" />
                      <span>{lang === "bn" ? div.bnName : div.enName}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[var(--pm-accent)]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== DISTRICT SELECTOR ==================== */}
        <div className="relative">
          <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${currentDivision ? "text-[var(--pm-text-secondary)]" : "text-white/20"}`}>
            {lang === "bn" ? "২. জেলা নির্বাচন করুন" : "2. Select District"} <span className="text-[var(--pm-accent)]">*</span>
          </label>
          
          <button
            type="button"
            disabled={!currentDivision}
            onClick={() => {
              setIsDistrictOpen(!isDistrictOpen);
              setIsDivisionOpen(false);
              setIsUpazilaOpen(false);
            }}
            className="w-full h-11 px-3 bg-white/[0.03] disabled:opacity-40 border border-white/10 disabled:border-white/5 hover:border-[var(--pm-accent)]/40 rounded-xl flex items-center justify-between text-xs text-white uppercase font-bold tracking-wide transition-all duration-150 active:scale-[0.98] outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Building className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate">
                {currentDistrict 
                  ? (lang === "bn" ? currentDistrict.bnName : currentDistrict.enName)
                  : (lang === "bn" ? "জেলা খুঁজুন..." : "Find District...")}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${isDistrictOpen ? "rotate-180" : ""}`} />
          </button>

          {isDistrictOpen && currentDivision && (
            <div className="absolute top-[62px] left-0 right-0 max-h-56 bg-[var(--pm-surface)] border border-white/10 rounded-2xl overflow-y-auto shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Local Search input within District Dropdown */}
              <div className="relative p-1 mb-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder={lang === "bn" ? "জেলা সার্চ করুন..." : "Search District..."}
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-[11px] bg-black/40 border border-white/10 hover:border-white/20 rounded-lg text-white font-bold outline-none focus:border-[var(--pm-accent)]/40"
                />
              </div>

              {filteredDistricts.length === 0 ? (
                <div className="py-4 text-center text-[10px] text-white/40 font-bold uppercase">
                  {lang === "bn" ? "কোনো জেলা মেলেনি" : "No districts match"}
                </div>
              ) : (
                filteredDistricts.map((dist) => {
                  const isSelected = dist.id === selectedDistrictId;
                  return (
                    <button
                      key={dist.id}
                      type="button"
                      onClick={() => handleDistrictSelect(dist.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected 
                          ? "bg-cyan-500/15 text-cyan-300 font-extrabold" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{lang === "bn" ? dist.bnName : dist.enName}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ==================== UPAZILA SELECTOR ==================== */}
        <div className="relative">
          <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${currentDistrict ? "text-[var(--pm-text-secondary)]" : "text-white/20"}`}>
            {lang === "bn" ? "৩. থানা / উপজেলা" : "3. Select Upazila"} <span className="text-[var(--pm-accent)]">*</span>
          </label>
          
          <button
            type="button"
            disabled={!currentDistrict}
            onClick={() => {
              setIsUpazilaOpen(!isUpazilaOpen);
              setIsDivisionOpen(false);
              setIsDistrictOpen(false);
            }}
            className="w-full h-11 px-3 bg-white/[0.03] disabled:opacity-40 border border-white/10 disabled:border-white/5 hover:border-[var(--pm-accent)]/40 rounded-xl flex items-center justify-between text-xs text-white uppercase font-bold tracking-wide transition-all duration-150 active:scale-[0.98] outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Navigation className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate">
                {currentUpazila 
                  ? (lang === "bn" ? currentUpazila.bnName : currentUpazila.enName)
                  : (lang === "bn" ? "উপজেলা খুঁজুন..." : "Find Upazila...")}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${isUpazilaOpen ? "rotate-180" : ""}`} />
          </button>

          {isUpazilaOpen && currentDistrict && (
            <div className="absolute top-[62px] left-0 right-0 max-h-56 bg-[var(--pm-surface)] border border-white/10 rounded-2xl overflow-y-auto shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Local Search input within Upazila Dropdown */}
              <div className="relative p-1 mb-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder={lang === "bn" ? "উপজেলা সার্চ করুন..." : "Search Upazila..."}
                  value={upazilaSearch}
                  onChange={(e) => setUpazilaSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-[11px] bg-black/40 border border-white/10 hover:border-white/20 rounded-lg text-white font-bold outline-none focus:border-[var(--pm-accent)]/40"
                />
              </div>

              {filteredUpazilas.length === 0 ? (
                <div className="py-4 text-center text-[10px] text-white/40 font-bold uppercase">
                  {lang === "bn" ? "কোনো উপজেলা মেলেনি" : "No upazilas match"}
                </div>
              ) : (
                filteredUpazilas.map((upz) => {
                  const isSelected = upz.id === selectedUpazilaId;
                  return (
                    <button
                      key={upz.id}
                      type="button"
                      onClick={() => handleUpazilaSelect(upz.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected 
                          ? "bg-cyan-500/15 text-cyan-300 font-extrabold" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{lang === "bn" ? upz.bnName : upz.enName}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>

      {/* 2. DYNAMIC MAP SUMMARY DESCRIPTION OR LOGISTICS HIGHLIGHTS */}
      {currentUpazila && (
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl transition-all flex items-start gap-2.5 text-xs">
          <div className="h-7 w-7 rounded-lg bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-[11px] uppercase tracking-wider">
              {lang === "bn" ? "শিপিং ও লজিস্টিকস হিসাব" : "Shipping & Logistics Information"}
            </div>
            <p className="text-white/60 text-[10px] mt-0.5 leading-relaxed">
              {lang === "bn" ? (
                <>
                  আপনার নির্বাচিত ঠিকানা: <span className="text-white font-extrabold">{currentDivision?.bnName} বিভাগ</span> &gt; <span className="text-white font-extrabold">{currentDistrict?.bnName} জেলা</span> &gt; <span className="text-white font-extrabold">{currentUpazila?.bnName} উপজেলা</span>। এই রুটে আমাদের স্ট্যান্ডার্ড কুরিয়ার ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করে থাকে।
                </>
              ) : (
                <>
                  Selected: <span className="text-white font-extrabold">{currentDivision?.enName} Division</span> &gt; <span className="text-white font-extrabold">{currentDistrict?.enName} District</span> &gt; <span className="text-white font-extrabold">{currentUpazila?.enName} Upazila</span>. Standard dispatch via path partner takes 3-5 business days.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
