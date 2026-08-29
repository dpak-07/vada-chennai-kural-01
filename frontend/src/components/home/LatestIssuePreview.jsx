"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";

export default function LatestIssuePreview({ issues = [] }) {
  const { lang } = useLanguage();

  if (!issues || issues.length === 0) return null;

  if (issues.length === 1) {
    const issue = issues[0];
    const translation = issueTranslations[issue.id] || {};
    const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
    const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;
    const displayDesc = lang === "en" ? (issue.descriptionEn || translation.description || issue.description) : issue.description;
    const featuresList = lang === "en" ? (issue.featuresEn || translation.features || issue.features) : issue.features;

    return (
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border-2 border-[#800020]/20 shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative group">
        
        {/* Decorative corner aura */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#800020]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Cover Preview (LHS) */}
        <div className="relative w-52 sm:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-100 bg-black shrink-0">
          <Image
            src={issue.coverImage}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 208px, 256px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
          <span className="absolute top-3 left-3 bg-[#800020] text-white text-[9px] font-sans font-black tracking-widest px-2.5 py-1 rounded shadow uppercase border border-[#B31336]/40">
            {lang === "ta" ? "சிறப்பு வெளியீடு" : "SPECIAL ISSUE"}
          </span>
        </div>

        {/* Info & Details (RHS) */}
        <div className="flex-1 text-left space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs text-[#800020] font-black font-sans uppercase tracking-widest bg-[#800020]/10 px-3 py-1 rounded-md border border-[#800020]/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>{displayMonth}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#121216] leading-tight">
              {displayTitle}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-normal">
            {displayDesc}
          </p>

          {/* Featured highlights pills */}
          {featuresList && featuresList.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal/60 block">
                {lang === "ta" ? "இதழின் முக்கிய பகுதிகள்:" : "Featured Highlights:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featuresList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-sans text-charcoal bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#800020] text-white font-bold text-[10px] rounded-full shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 flex flex-wrap gap-4">
            <Link
              href={`/issues/${issue.id}`}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-[#800020] hover:bg-[#9B1130] text-white text-xs font-sans font-bold transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>{lang === "en" ? "Explore Full Issue" : "இதழின் விபரங்களைக் காண்க"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quadruple the issues to ensure continuous loop marquee
  const marqueeIssues = [...issues, ...issues, ...issues, ...issues];

  return (
    <div className="w-full overflow-hidden relative py-2 select-none">
      {/* Left/Right fading gradients to blend the marquee edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none" />

      {/* Scrolling train row */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 py-2">
          {marqueeIssues.map((issue, index) => {
            const translation = issueTranslations[issue.id] || {};
            const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
            const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;

            return (
              <div
                key={`${issue.id}-${index}`}
                className="shrink-0 w-[280px] sm:w-[340px] bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#800020]/40 transition-all duration-300 flex items-center gap-4 group"
              >
                {/* Cover Image (LHS) */}
                <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-md border border-gray-100 bg-black shrink-0">
                  <Image
                    src={issue.coverImage}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Info & Action Box (RHS) */}
                <div className="flex-1 min-w-0 space-y-2 text-left">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] text-[#800020] font-black font-sans uppercase tracking-wider">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{displayMonth}</span>
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#121216] group-hover:text-[#800020] transition-colors duration-200 line-clamp-2 whitespace-normal leading-snug">
                      {displayTitle}
                    </h4>
                  </div>

                  <Link
                    href={`/issues/${issue.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#800020] hover:text-[#9B1130] transition-colors duration-200"
                  >
                    <span>{lang === "en" ? "Read Issue" : "வாசிக்க"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
