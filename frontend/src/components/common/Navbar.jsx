"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, BookOpen, Languages, ShieldCheck } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const pathname = usePathname();
  const { lang, toggleLanguage } = useLanguage();

  // Detect scroll state (rAF-throttled with hysteresis to avoid threshold flutter)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(prev => (y > 60 ? true : y < 30 ? false : prev));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set Localized Date
  useEffect(() => {
    const d = new Date();
    if (lang === "ta") {
      const days = ["ஞாயிற்றுக்கிழமை", "திங்கட்கிழமை", "செவ்வாய்க்கிழமை", "புதன்கிழமை", "வியாழக்கிழமை", "வெள்ளிக்கிழமை", "சனிக்கிழமை"];
      const months = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];
      setDateStr(`${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`);
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDateStr(d.toLocaleDateString('en-US', options));
    }
  }, [lang]);

  // Dictionary for Header text
  const t = {
    ta: {
      slogan: "பகுத்தறிவும், மனிதநேயமும் வடசென்னையின் குரலும்",
      logoTitle: "வடசென்னை குரல்",
      logoSub: "VADACHENNAI KURAL TAMIL DIGITAL MAGAZINE",
      digitalEdition: "டிஜிட்டல் பதிப்பு",
      login: "உள்நுழைக",
      home: "முகப்பு",
      issues: "இதழ்கள்",
      about: "எங்களைப் பற்றி",
      editorial: "ஆசிரியர்க்குழு",
      contact: "தொடர்புக்கு",
      toggleMenu: "மொபைல் பட்டியை மாற்று",
      switchLang: "English-க்கு மாறுக"
    },
    en: {
      slogan: "Reason, humanity and the true voice of North Chennai",
      logoTitle: "Vadachennai Kural",
      logoSub: "VADACHENNAI KURAL TAMIL DIGITAL MAGAZINE",
      digitalEdition: "Digital Edition",
      login: "Login",
      home: "Home",
      issues: "Issues",
      about: "About Us",
      editorial: "Editorial Board",
      contact: "Contact",
      toggleMenu: "Toggle mobile menu",
      switchLang: "Switch to தமிழ்"
    }
  }[lang];

  const navLinks = [
    { name: t.home, path: "/" },
    { name: t.issues, path: "/issues" },
    { name: t.about, path: "/about" },
    { name: t.editorial, path: "/editorial" },
    { name: t.contact, path: "/contact" },
  ];

  return (
    <>
      {/* Top header (scrolls away naturally - no reflow animation) */}
      <div className="hidden md:block">
        {/* 1. Thin top date strip (Newspaper sub-bar style) */}
        <div className="bg-primary text-white py-1.5 border-b border-secondary/30">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between text-[10px] font-sans font-bold tracking-wider uppercase">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-secondary" /> {dateStr}</span>
            <span className="font-serif italic text-secondary-hover tracking-normal font-semibold normal-case text-xs">{t.slogan}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-secondary" /> {t.digitalEdition}</span>
          </div>
        </div>

        {/* 2. GRAND VINTAGE MASTHEAD LOGO */}
        <div className="bg-white py-8 border-b-4 border-double border-primary/25">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            {/* Left Vignette Illustration (Newspaper stamp style) */}
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex flex-col items-center justify-center text-primary text-[8px] font-bold text-center shrink-0">
              <span>ESTD</span>
              <span className="font-serif text-sm font-black">2026</span>
            </div>

            {/* Giant Centered Masthead Title */}
            <div className="text-center space-y-1">
              <h1 className="font-serif text-5xl font-black text-primary tracking-tight">
                {t.logoTitle}
              </h1>
              <p className="font-sans text-[9px] tracking-widest text-secondary font-bold uppercase">
                {t.logoSub}
              </p>
            </div>

            {/* Right Vignette Illustration */}
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex flex-col items-center justify-center text-primary text-[8px] font-bold text-center shrink-0">
              <span>ONLINE</span>
              <span className="font-serif text-sm font-black">EDITION</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Sticks cleanly) */}
      <header
        className={`sticky top-0 z-50 w-full py-4 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b border-primary/20"
            : "bg-white border-b border-border-subtle"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Logo (Always visible for smooth header feel) */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group shrink-0"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-serif text-sm sm:text-base font-bold shadow-sm shrink-0">
                வ
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-primary truncate">
                  {t.logoTitle}
                </span>
                <span className="font-sans text-[7px] sm:text-[8px] tracking-widest text-secondary font-bold uppercase -mt-1 truncate">
                  {t.logoSub}
                </span>
              </div>
            </Link>

            {/* Navigation links center */}
            <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`font-sans text-xs lg:text-sm font-bold uppercase tracking-wider transition-colors duration-200 relative py-1 ${
                      isActive ? "text-primary" : "text-charcoal/70 hover:text-primary"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side actions */}
            <div className="flex items-center space-x-4 shrink-0">
              {/* Language Toggle Selector */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-canvas hover:bg-gray-100 border border-border-subtle hover:border-primary px-3 py-2 rounded-lg text-xs font-bold text-charcoal/80 transition cursor-pointer"
                title="Switch Language / மொழியை மாற்றுக"
              >
                <Languages className="w-4 h-4 text-primary shrink-0" />
                <span className="hidden sm:inline">{lang === "ta" ? "English" : "தமிழ்"}</span>
              </button>

              <div className="hidden md:block">
                <Button href="/login" variant="outline" size="sm" className="font-bold border-primary text-primary hover:bg-primary hover:text-white">
                  {t.login}
                </Button>
              </div>

              {/* Mobile hamburger menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-charcoal hover:bg-black/5 rounded-md transition duration-200 cursor-pointer"
                aria-label={t.toggleMenu}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-charcoal md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-72 max-w-[80vw] bg-white shadow-2xl p-6 flex flex-col justify-between md:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-serif text-sm font-bold">
                      வ
                    </span>
                    <span className="font-serif text-lg font-bold text-primary">{t.logoTitle}</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6 pb-4 border-b border-border-subtle text-xs text-charcoal/50 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary shrink-0" />
                  <span>{dateStr}</span>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`font-sans text-sm font-medium py-2 px-3 rounded-md transition duration-200 block ${
                          isActive
                            ? "bg-primary/5 text-primary font-bold border-l-4 border-primary"
                            : "text-charcoal/70 hover:bg-gray-50 hover:text-primary"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-8 border-t border-border-subtle pt-6 space-y-3">
                <button
                  onClick={() => { toggleLanguage(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-canvas hover:bg-gray-100 border border-border-subtle py-3 rounded-lg text-xs font-bold text-charcoal/80 cursor-pointer"
                >
                  <Languages className="w-4 h-4 text-primary" /> {t.switchLang}
                </button>

                <Button
                  href="/login"
                  variant="primary"
                  className="w-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {t.login}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
