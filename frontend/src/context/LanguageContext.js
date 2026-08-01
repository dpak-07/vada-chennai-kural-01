"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggleLanguage = () => {
    const newLang = lang === "ta" ? "en" : "ta";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    // Dispatch a custom event to notify components that might not be in the context tree
    window.dispatchEvent(new Event("languageChange"));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a fallback if used outside provider
    return { lang: "ta", toggleLanguage: () => {} };
  }
  return context;
}
