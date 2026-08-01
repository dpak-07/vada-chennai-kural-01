"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, BookOpen, Languages, ShieldCheck } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";
import contactData from "@/data/contact.json";

// Split into safe display units. For Tamil, use grapheme clusters so combining
// vowel marks stay attached to their base consonant (avoids dotted-circle artifacts).
const segmentLetters = (str, isTamil) => {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(isTamil ? "ta" : "en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (s) => s.segment);
  }
  return isTamil ? [str] : Array.from(str);
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
        setScrolled(prev => (y > 150 ? true : y < 90 ? false : prev));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect mobile viewport (masthead is hidden on mobile, so the logo stays visible)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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
      logoSub: "தமிழ் டிஜிட்டல் இதழ்",
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

  // Letter-by-letter reveal config for the scroll logo
  // (smaller step = faster reveal; English has longer strings, so it gets a quicker step)
  const LETTER_STEP = lang === "ta" ? 0.02 : 0.012;
  const titleChars = segmentLetters(t.logoTitle, lang === "ta");
  const subChars = segmentLetters(t.logoSub, lang === "ta");
  const logoVisible = isMobile || scrolled;

  const navLinks = [
    { name: t.home, path: "/" },
    { name: t.issues, path: "/issues" },
    { name: t.about, path: "/about" },
    { name: t.editorial, path: "/editorial" },
    { name: t.contact, path: "/contact" },
  ];

  return (
    <>
      {/* 1. Thin top date/social strip (Newspaper sub-bar style) - Visible on ALL screens */}
      <div className="bg-primary text-white py-1.5 border-b border-secondary/30">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between text-[10px] font-sans font-bold tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-secondary" /> {dateStr}</span>
            <div className="flex sm:hidden items-center gap-2.5">
              <a href={contactData.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-secondary transition" aria-label="Facebook">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href={contactData.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-white hover:text-secondary transition" aria-label="Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href={contactData.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-secondary transition" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href={contactData.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-secondary transition" aria-label="YouTube">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          <span className="hidden sm:inline font-serif italic text-secondary-hover tracking-normal font-semibold normal-case text-xs">{t.slogan}</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-secondary" /> {lang === "ta" ? "டிஜிட்டல் இதழ்" : "Digital Edition"}</span>
        </div>
      </div>

      {/* Top header (scrolls away naturally - no reflow animation) */}
      <div className="hidden md:block">
        {/* 2. GRAND VINTAGE MASTHEAD LOGO */}
        <div className="bg-white py-8 border-b-4 border-double border-primary/25">
          <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            {/* Left side: Social Media Links */}
            <div className="flex items-center gap-2.5 w-1/4 min-w-[150px]">
              <a
                href={contactData.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border-subtle hover:border-primary flex items-center justify-center transition-all duration-300 text-charcoal hover:bg-primary hover:text-white"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border-subtle hover:border-primary flex items-center justify-center transition-all duration-300 text-charcoal hover:bg-primary hover:text-white"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border-subtle hover:border-primary flex items-center justify-center transition-all duration-300 text-charcoal hover:bg-primary hover:text-white"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border-subtle hover:border-primary flex items-center justify-center transition-all duration-300 text-charcoal hover:bg-primary hover:text-white"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Center: Main Brand Logo Crest & Text Title */}
            <div className="flex items-center justify-center gap-4 flex-1">
              <img
                src="/logo/vadachennai%20kural%20logo.jpg"
                alt="Vadachennai Kural Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full shadow-sm bg-white border border-border-subtle shrink-0"
              />
              <div className="text-left space-y-1">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tight leading-none">
                  {t.logoTitle}
                </h1>
                <p className="font-sans text-[8px] md:text-[9px] tracking-widest text-secondary font-bold uppercase">
                  {t.logoSub}
                </p>
              </div>
            </div>

            {/* Right side: Localized Date & Slogan */}
            <div className="hidden md:flex flex-col items-end text-right space-y-1 w-1/4 min-w-[150px] shrink-0">
              <span className="font-sans text-[10px] font-bold text-primary tracking-wider uppercase">{dateStr}</span>
              <span className="font-serif italic text-xs text-secondary-hover font-semibold">{t.slogan}</span>
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
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Logo (reveals letter by letter on scroll) */}
            <div className="shrink-0">
              <Link 
                href="/" 
                className="flex items-center space-x-2 group shrink-0"
              >
                <motion.img
                  src="/logo/vadachennai%20kural%20logo.jpg"
                  alt="Vadachennai Kural Logo"
                  initial={false}
                  animate={{ opacity: logoVisible ? 1 : 0, x: logoVisible ? 0 : -12 }}
                  transition={{ duration: 0.15, ease: "easeOut", delay: 0.02 }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-sm shrink-0"
                />
                <div key={lang} className="flex flex-col min-w-0">
                  <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-primary truncate">
                    {titleChars.map((ch, i) => (
                      <motion.span
                        key={i}
                        initial={false}
                        animate={{ opacity: logoVisible ? 1 : 0, x: logoVisible ? 0 : -10 }}
                        transition={{
                          duration: 0.15,
                          ease: "easeOut",
                          delay: logoVisible
                            ? 0.07 + i * LETTER_STEP
                            : 0.07 + (titleChars.length - 1 - i) * LETTER_STEP,
                        }}
                        className="inline-block"
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    ))}
                  </span>
                  <span className="font-sans text-[7px] sm:text-[8px] tracking-widest text-secondary font-bold uppercase -mt-1 truncate">
                    {subChars.map((ch, i) => (
                      <motion.span
                        key={i}
                        initial={false}
                        animate={{ opacity: logoVisible ? 1 : 0, x: logoVisible ? 0 : -10 }}
                        transition={{
                          duration: 0.15,
                          ease: "easeOut",
                          delay: logoVisible
                            ? 0.07 + i * LETTER_STEP
                            : 0.07 + (subChars.length - 1 - i) * LETTER_STEP,
                        }}
                        className="inline-block"
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    ))}
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation links center */}
            <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`group font-sans text-xs lg:text-sm font-bold uppercase tracking-wider transition-colors duration-200 relative py-1 ${
                      isActive ? "text-primary" : "text-charcoal/70 hover:text-primary"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Side actions */}
            <div className="flex items-center space-x-4 shrink-0">

              {/* Language Toggle Selector */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-canvas hover:bg-gray-100 border border-border-subtle hover:border-primary px-2.5 py-1.5 rounded-lg text-xs font-bold text-charcoal/80 transition cursor-pointer"
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
                    <img
                      src="/logo/vadachennai%20kural%20logo.jpg"
                      alt="Vadachennai Kural Logo"
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
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

              <div className="mt-8 border-t border-border-subtle pt-6 space-y-4">
                {/* Social media links row for Mobile */}
                <div className="flex items-center justify-center gap-4 pb-2">
                  <a
                    href={contactData.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href={contactData.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={contactData.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href={contactData.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-border-subtle flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>

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
