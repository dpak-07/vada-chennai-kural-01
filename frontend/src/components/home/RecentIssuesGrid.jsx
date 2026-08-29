"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import { EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";

const resolveIssue = (issue, lang) => {
  const translation = issueTranslations[issue.id] || {};
  return {
    title: lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title,
    month: lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month,
  };
};

export default function RecentIssuesGrid({ issues }) {
  const { lang } = useLanguage();

  if (!issues || issues.length === 0) return null;

  const [lead, ...rest] = issues;
  const leadInfo = resolveIssue(lead, lang);
  const stack = rest.slice(0, 3);

  const t = {
    ta: {
      pagesUnit: "பக்கங்கள்",
      readBtn: "வாசிக்க",
      btnText: "அனைத்து இதழ்களையும் காண்க"
    },
    en: {
      pagesUnit: "Pages",
      readBtn: "Read",
      btnText: "View All Issues"
    }
  }[lang];

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Lead card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="lg:col-span-2"
        >
          <Link href={`/issues/${lead.id}`} className="group block h-full">
            <div className="relative flex min-h-[340px] h-full flex-col overflow-hidden rounded-2xl bg-black border-2 border-[#800020]/20 shadow-lg group-hover:shadow-2xl transition-all duration-300">
              <Image
                src={lead.coverImage}
                alt={leadInfo.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 mt-auto p-6 sm:p-8 text-left">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[11px] font-medium text-white/80">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  <span className="font-bold text-white">{leadInfo.month}</span>
                  <span aria-hidden className="text-white/40">•</span>
                  <span>
                    {lead.pages} {t.pagesUnit}
                  </span>
                </div>
                <h3 className="mt-2.5 max-w-xl font-serif text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl group-hover:text-secondary-light transition-colors">
                  {leadInfo.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-secondary group-hover:text-white transition-colors">
                  {t.readBtn}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Stacked compact cards */}
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-md">
          {stack.map((issue, i) => {
            const info = resolveIssue(issue, lang);
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE_OUT }}
              >
                <Link
                  href={`/issues/${issue.id}`}
                  className="group flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-[#800020]/5 sm:gap-5 sm:p-5 text-left"
                >
                  <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg bg-black border border-gray-100 sm:w-20 shadow-sm">
                    <Image
                      src={issue.coverImage}
                      alt={info.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-charcoal/50">
                      <span className="font-bold text-[#800020]">{info.month}</span>
                      <span aria-hidden className="text-gray-300">•</span>
                      <span>
                        {issue.pages} {t.pagesUnit}
                      </span>
                    </div>
                    <h4 className="mt-1.5 line-clamp-2 font-serif text-base font-bold leading-snug text-[#121216] transition-colors duration-200 group-hover:text-[#800020] sm:text-lg">
                      {info.title}
                    </h4>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-charcoal/30 transition-colors duration-200 group-hover:text-[#800020] group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Archive CTA */}
      <div className="mt-10 flex justify-center">
        <Button
          href="/issues"
          variant="outline"
          className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white font-bold cursor-pointer transition-all duration-300 shadow-xs"
        >
          {t.btnText}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
