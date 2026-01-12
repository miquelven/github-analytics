"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/lib/i18n/en";
import { pt } from "@/lib/i18n/pt";

type Language = "en" | "pt";
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("github-analytics-lang") as Language;
    const browserLang = navigator.language.startsWith("pt") ? "pt" : "en";
    const targetLang =
      savedLang === "en" || savedLang === "pt" ? savedLang : browserLang;

    if (targetLang !== "en") {
      setLanguageState(targetLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("github-analytics-lang", lang);
  };

  const t = language === "pt" ? pt : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
