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
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-shadow duration-300 hover:shadow-xl hover:shadow-charcoal/[0.07]"
    >
      {/* Cover (natural aspect ratio so masonry cards vary by image) */}
      <Link
        href={`/issues/${id}`}
        aria-label={displayTitle}
        className="relative block overflow-hidden bg-gray-100"
      >
        <Image
          src={coverImage}
          alt={displayTitle}
          width={600}
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-110"
          priority={false}
        />
        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-charcoal/5" />

        {/* Volume / Issue badge */}
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur">
          <Layers className="h-3 w-3" />
          {issueLabel}
        </span>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-sans font-medium text-charcoal/50">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-secondary" />
          <span className="font-semibold text-charcoal/70">{displayMonth}</span>
          <span aria-hidden className="text-gray-300">•</span>
          <span>{t.pagesLabel}</span>
        </div>

        <h3 className="mt-3 font-serif text-lg sm:text-xl font-bold leading-snug text-charcoal transition-colors duration-200 group-hover:text-primary">
          <Link href={`/issues/${id}`} className="line-clamp-2">
            {displayTitle}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Button
            href={`/issues/${id}`}
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 py-2.5"
          >
            {t.readBtn}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <a
            href={issue.pdfUrl}
            download
            title={t.downloadTitle}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle text-charcoal/55 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
