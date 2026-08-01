"use client";

import Hero from "@/components/home/Hero";
import LatestIssuePreview from "@/components/home/LatestIssuePreview";
import RecentIssuesGrid from "@/components/home/RecentIssuesGrid";
import AboutPreview from "@/components/home/AboutPreview";
import EditorialPreview from "@/components/home/EditorialPreview";
import Newsletter from "@/components/ui/Newsletter";
import SectionHeading from "@/components/common/SectionHeading";
import VideoGallery from "@/components/home/VideoGallery";
import { useLanguage } from "@/context/LanguageContext";
import issuesData from "@/data/issues.json";

export default function Home() {
  const { lang } = useLanguage();
  const latestIssue = issuesData.find((issue) => issue.isLatest) || issuesData[0];
  const recentIssues = issuesData.filter((issue) => issue.id !== latestIssue.id);

  const t = {
    ta: {
      thoughtTag: "இன்றைய சிந்தனை",
      thoughtQuote: "“மனிதனுக்கு அழகு அறிவே தவிர ஆடம்பரம் அல்ல! தன்மானமே மனிதனுக்கு உயிர்; பகுத்தறிவே மனிதனின் ஆயுதம்.” — தந்தை பெரியார்",
      thoughtBrand: "வடசென்னை குரல் • தினசரி சிந்தனை",
      latestHeading: "புதிய இதழ் வெளியீடு",
      latestSub: "LATEST RELEASE",
      recentHeading: "சமீபத்திய இதழ்கள்",
      recentSub: "RECENT ISSUES",
      aboutHeading: "எங்கள் இதழின் குரல்",
      aboutSub: "ABOUT OUR VISION",
      editorialHeading: "ஆசிரியர்க்குழு",
      editorialSub: "EDITORIAL BOARD"
    },
    en: {
      thoughtTag: "Thought of the Day",
      thoughtQuote: "\"Beauty of a man lies in his knowledge and wisdom, not in luxury. Self-respect is life; reason is his weapon.\" — Thanthai Periyar",
      thoughtBrand: "Vadachennai Kural • Daily Thought",
      latestHeading: "Latest Release",
      latestSub: "LATEST RELEASE",
      recentHeading: "Recent Issues",
      recentSub: "RECENT ISSUES",
      aboutHeading: "Our Vision",
      aboutSub: "ABOUT OUR VISION",
      editorialHeading: "Editorial Board",
      editorialSub: "EDITORIAL BOARD"
    }
  }[lang];

  return (
    <>
      {/* Newspaper Scrolling Marquee Ticker (Viduthalai style) */}
      <div className="bg-amber-400 text-charcoal py-2 border-b border-primary/20 overflow-hidden font-sans font-bold text-xs uppercase tracking-wider select-none">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center">
          <span className="bg-primary text-white text-[9px] font-sans font-black px-2.5 py-1 rounded mr-3 shrink-0 uppercase tracking-widest">
            {lang === "ta" ? "முக்கிய செய்திகள்" : "Breaking News"}
          </span>
          <marquee className="cursor-pointer font-sans font-semibold" scrollamount="4">
            {lang === "ta" 
              ? "வடசென்னை குரல் புதிய இதழ் வெளியீடு! • வடசென்னையின் ஆதி இசை மரபான கானா வரலாறு ஆவணப்படுத்தப்பட்டுள்ளது! • மெட்ராஸ் குத்துச்சண்டை: சார்பட்டா பரம்பரையின் நிஜக் கதையை வாசிக்கவும்! • எண்ணூர் கழிமுகச் சூழலியல் பற்றிய மீனவர்களின் நேர்காணல்!"
              : "Vadachennai Kural New Issue Released! • The Gana Music Heritage of North Chennai documented! • Madras Boxing: Read the real story of Sarbhatta Paramparai! • Ennore estuary ecology interview with local fishermen!"
            }
          </marquee>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <Hero latestIssueId={latestIssue.id} />

        {/* Thought of the Day Ribbon */}
        <section className="bg-secondary/10 py-4 border-b border-secondary/20">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="bg-primary text-white text-[10px] font-sans font-bold px-3 py-1.5 rounded uppercase tracking-wider shrink-0">
              {t.thoughtTag}
            </span>
            <p className="font-serif italic text-charcoal text-xs sm:text-sm font-semibold text-center md:text-left flex-1 md:px-6">
              {t.thoughtQuote}
            </p>
            <span className="text-[10px] font-sans text-charcoal/40 font-bold shrink-0 hidden md:inline">
              {t.thoughtBrand}
            </span>
          </div>
        </section>

        {/* Latest Issue Spotlight */}
        <section className="py-20 bg-canvas">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <SectionHeading
              title={t.latestHeading}
              subtitle={t.latestSub}
            />
            <LatestIssuePreview issue={latestIssue} />
          </div>
        </section>

        {/* Recent Issues Archive Grid */}
        <section className="py-20 bg-white border-y border-border-subtle">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <SectionHeading
              title={t.recentHeading}
              subtitle={t.recentSub}
              centered
            />
            <RecentIssuesGrid issues={recentIssues} />
          </div>
        </section>

        {/* About Preview Section */}
        <section className="py-20 bg-canvas">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <SectionHeading
              title={t.aboutHeading}
              subtitle={t.aboutSub}
            />
            <AboutPreview />
          </div>
        </section>

        {/* Editorial Board Showcase */}
        <section className="py-20 bg-white border-t border-border-subtle">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <SectionHeading
              title={t.editorialHeading}
              subtitle={t.editorialSub}
              centered
            />
            <EditorialPreview />
          </div>
        </section>

        {/* Video Gallery Section */}
        <VideoGallery />

        {/* Newsletter Section */}
        <section className="py-20 bg-canvas">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <Newsletter />
          </div>
        </section>
      </main>

    </>
  );
}
