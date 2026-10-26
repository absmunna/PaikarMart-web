import { Globe } from "lucide-react";

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];
