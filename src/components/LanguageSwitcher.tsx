"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group"
    >
      <span className="text-lg leading-none group-hover:scale-110 transition-transform duration-300">
        {lang === 'id' ? '🇮🇩' : '🇺🇸'}
      </span>
      <span className="font-mono text-[0.85rem] font-bold text-[#94a3b8] group-hover:text-[#f1f5f9] tracking-wider uppercase">
        {lang}
      </span>
    </button>
  );
}
