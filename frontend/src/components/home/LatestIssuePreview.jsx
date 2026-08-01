"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Download, BookOpen, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import { EASE_OUT, VIEWPORT_ONCE, staggerContainer, staggerItem } from "@/lib/motion";

export default function LatestIssuePreview({ issue }) {
  const { lang } = useLanguage();
  if (!issue) return null;

  // Retrieve translation dynamically
  const translation = issueTranslations[issue.id] || {};
  const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
  const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;
  const displayDesc = lang === "en" ? (issue.descriptionEn || translation.description || issue.description) : issue.description;
  const displayFeatures = lang === "en" ? (issue.featuresEn || translation.features || issue.features) : issue.features;

  // Localized texts
  const t = {
    ta: {
      latestTag: "புதிய இதழ்",
      pagesLabel: `${issue.pages} பக்கங்கள்`,
      highlights: "இதழின் முக்கிய அம்சங்கள்",
      readOnline: "ஆன்லைனில் வாசிக்க",
      download: "இதழைப் பதிவிறக்க"
    },
    en: {
      latestTag: "Latest Release",
      pagesLabel: `${issue.pages} Pages`,
      highlights: "Highlights of this Issue",
      readOnline: "Read Online",
      download: "Download PDF"
    }
  }[lang];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border-subtle p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Cover Preview (LHS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative aspect-[3/4] w-full max-w-[320px] rounded-xl overflow-hidden shadow-2xl border border-gray-100 group">
            <Image
              src={issue.coverImage}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 320px, 400px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              priority
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
          </div>
        </motion.div>

        {/* Text/Article List Details (RHS) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerContainer(0.1, 0.12)}
          className="lg:col-span-7 space-y-6"
        >
          <motion.div variants={staggerItem({ y: 22, duration: 0.5 })} className="space-y-3">
            <span className="bg-primary/10 text-primary font-sans font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              {t.latestTag}
            </span>
            
            <div className="flex items-center gap-2 text-xs text-charcoal/50">
              <Calendar className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-semibold">{displayMonth}</span>
              <span className="text-gray-300">•</span>
              <span className="font-light">{t.pagesLabel}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal leading-normal py-1.5">
              {displayTitle}
            </h3>
          </motion.div>

          <motion.p
            variants={staggerItem({ y: 20, duration: 0.5 })}
            className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light"
          >
            {displayDesc}
          </motion.p>

          {/* Issue Highlights */}
          {displayFeatures && displayFeatures.length > 0 && (
            <motion.div variants={staggerItem({ y: 18, duration: 0.5 })} className="space-y-3 pt-2">
              <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider border-b border-border-subtle pb-2">
                {t.highlights}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80 font-medium">
                {displayFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2.5">
                    <ChevronRight className="w-4 h-4 text-secondary shrink-0" />
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            variants={staggerItem({ y: 18, duration: 0.5 })}
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border-subtle"
          >
            <Button
              href={`/issues/${issue.id}`}
              variant="primary"
              size="md"
              className="flex items-center justify-center gap-2 py-3 px-6 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> {t.readOnline}
            </Button>
            <a
              href={issue.pdfUrl}
              download
              className="inline-flex items-center justify-center font-sans font-semibold tracking-wide border-2 border-border-subtle text-charcoal/80 hover:text-primary hover:border-primary px-6 py-3 text-sm rounded-md transition-all duration-300 bg-transparent cursor-pointer hover:bg-primary/5"
            >
              <Download className="w-4 h-4 mr-2" /> {t.download}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
