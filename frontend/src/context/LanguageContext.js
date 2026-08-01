"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const COOKIE_NAME = "lang";

function readSavedLang() {
  try {
    const saved = localStorage.getItem(COOKIE_NAME);
    return saved === "en" || saved === "ta" ? saved : null;
  } catch {
    return null;
  }
}

function writeLangCookie(value) {
  try {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; SameSite=Lax; Max-Age=31536000`;
  } catch {
    // ignore
  }
}

export function LanguageProvider({ children, initialLang = "ta", hasLangCookie = false }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") {
      return initialLang;
    }
    if (hasLangCookie) {
      return initialLang;
    }
    return readSavedLang() || initialLang;
  });

  useEffect(() => {
    if (hasLangCookie) {
      return;
    }
    const saved = readSavedLang();
    if (saved) {
      writeLangCookie(saved);
    }
  }, [hasLangCookie]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    const newLang = lang === "ta" ? "en" : "ta";
    setLang(newLang);
    try {
      localStorage.setItem(COOKIE_NAME, newLang);
    } catch {
      // ignore
    }
    writeLangCookie(newLang);
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
