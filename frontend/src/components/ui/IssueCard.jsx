"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Download, Layers } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import { EASE_OUT, VIEWPORT_ONCE, springLift } from "@/lib/motion";

export default function IssueCard({ issue, index = 0 }) {
  const { id, title, month, coverImage, pages } = issue;
  const { lang } = useLanguage();

  const translation = issueTranslations[id] || {};
  const displayTitle = lang === "en" ? (issue.titleEn || translation.title || title) : title;
  const displayMonth = lang === "en" ? (issue.monthEn || translation.month || month) : month;

  const issueNumber = id.split("-").pop();
  const issueLabel = `${lang === "ta" ? "இதழ்" : "Issue"} ${String(issueNumber).padStart(2, "0")}`;

  const t = {
    ta: {
      pagesLabel: `${pages} பக்கங்கள்`,
      readBtn: "வாசிக்க",
      downloadTitle: "இதழைப் பதிவிறக்க"
    },
    en: {
      pagesLabel: `${pages} Pages`,
      readBtn: "Read",
      downloadTitle: "Download PDF"
    }
  }[lang];

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_OUT }}
      whileHover={{ y: -8, transition: springLift(-8) }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 hover:border-[#800020]/40 bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
    >
      {/* Cover (natural aspect ratio so masonry cards vary by image) */}
      <Link
        href={`/issues/${id}`}
        aria-label={displayTitle}
        className="relative block overflow-hidden bg-black"
      >
        <Image
          src={coverImage}
          alt={displayTitle}
          width={600}
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-108"
          priority={false}
        />
        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Volume / Issue badge */}
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#800020] text-white px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest shadow-md border border-[#B31336]/40">
          <Layers className="h-3 w-3" />
          {issueLabel}
        </span>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 text-left">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-sans font-medium text-charcoal/60">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#800020]" />
          <span className="font-bold text-[#800020]">{displayMonth}</span>
          <span aria-hidden className="text-gray-300">•</span>
          <span>{issue.comingSoon ? (lang === "ta" ? "விரைவில்" : "Pre-launch") : t.pagesLabel}</span>
        </div>

        <h3 className="mt-3 font-serif text-lg sm:text-xl font-bold leading-snug text-[#121216] transition-colors duration-200 group-hover:text-[#800020]">
          <Link href={`/issues/${id}`} className="line-clamp-2">
            {displayTitle}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Button
            href={`/issues/${id}`}
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 py-2.5 border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white font-bold"
          >
            {issue.comingSoon ? (lang === "ta" ? "விபரங்கள்" : "Preview") : t.readBtn}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          {!issue.comingSoon && (
            <a
              href={issue.pdfUrl}
              download
              title={t.downloadTitle}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-charcoal/70 transition-all duration-300 hover:border-[#800020] hover:bg-[#800020]/10 hover:text-[#800020]"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
