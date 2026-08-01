"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";

export default function LatestIssuePreview({ issues = [] }) {
  const { lang } = useLanguage();

  if (!issues || issues.length === 0) return null;

  // Quadruple the issues to ensure there's enough horizontal width for continuous loop marquee
  const marqueeIssues = [...issues, ...issues, ...issues, ...issues];

  return (
    <div className="w-full overflow-hidden relative py-2 select-none">
      {/* Left/Right fading gradients to blend the marquee edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

      {/* Scrolling train row */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 py-2">
          {marqueeIssues.map((issue, index) => {
            // Retrieve translation dynamically
            const translation = issueTranslations[issue.id] || {};
            const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
            const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;

            return (
              <div
                key={`${issue.id}-${index}`}
                className="shrink-0 w-[270px] sm:w-[320px] bg-white p-4 rounded-xl border border-border-subtle shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex items-center gap-4 group"
              >
                {/* Cover Image (LHS) */}
                <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-md border border-gray-100 shrink-0">
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
                    <div className="flex items-center gap-1 text-[9px] text-secondary font-bold font-sans uppercase tracking-wider">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{displayMonth}</span>
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-primary transition-colors duration-200 line-clamp-2 whitespace-normal leading-snug">
                      {displayTitle}
                    </h4>
                  </div>

                  <Link
                    href={`/issues/${issue.id}`}
                    className="inline-flex items-center gap-1 text-xs font-sans font-bold text-primary hover:text-primary-dark transition-colors duration-200"
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
