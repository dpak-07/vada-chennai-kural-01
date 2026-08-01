"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Download } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import { EASE_OUT, VIEWPORT_ONCE, springLift } from "@/lib/motion";

export default function IssueCard({ issue, index = 0 }) {
  const { id, title, month, coverImage, pages, downloadCount } = issue;
  const { lang } = useLanguage();

  // Retrieve translation dynamically
  const translation = issueTranslations[id] || {};
  const displayTitle = lang === "en" ? (issue.titleEn || translation.title || title) : title;
  const displayMonth = lang === "en" ? (issue.monthEn || translation.month || month) : month;

  // Localized texts
  const t = {
    ta: {
      readIssueHover: "இதழை வாசிக்க",
      pagesLabel: `${pages} பக்கங்கள்`,
      readBtn: "வாசிக்க",
      downloadTitle: "இதழைப் பதிவிறக்க"
    },
    en: {
      readIssueHover: "Read Issue",
      pagesLabel: `${pages} Pages`,
      readBtn: "Read",
      downloadTitle: "Download PDF"
    }
  }[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE_OUT }}
      whileHover={{ y: -10, transition: springLift(-10) }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-border-subtle flex flex-col h-full w-full max-w-md mx-auto group"
    >
      {/* Cover Image Container */}
      <Link href={`/issues/${id}`} className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-secondary font-serif text-sm font-semibold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> {t.readIssueHover}
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-charcoal/50">
            <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="font-semibold">{displayMonth}</span>
            <span className="text-gray-300">•</span>
            <span className="font-light">{t.pagesLabel}</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-charcoal line-clamp-2 group-hover:text-primary transition-colors duration-200">
            <Link href={`/issues/${id}`}>{displayTitle}</Link>
          </h3>
        </div>

        <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
          <Button href={`/issues/${id}`} variant="outline" size="sm" className="flex-1 text-center py-2 px-3">
            {t.readBtn}
          </Button>
          <a
            href={issue.pdfUrl}
            download
            className="w-10 h-10 rounded-md border border-border-subtle hover:border-primary flex items-center justify-center text-charcoal/60 hover:text-primary transition-all duration-300"
            title={t.downloadTitle}
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
