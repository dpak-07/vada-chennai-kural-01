"use client";
import Button from "../common/Button";
import { BookOpen, Archive } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero({ latestIssueId }) {
  const { lang } = useLanguage();

  const t = {
    ta: {
      tag: "சிறப்புக் கட்டுரை",
      title: "கானா இசை மரபு: வடசென்னையின் ஆன்மாவைத் தேடி ஒரு பயணம்",
      italic: "“ராயபுரத்தின் கானா பாடகர்கள் மற்றும் பாரம்பரிய இசை வடிவங்கள் பற்றிய விரிவான ஆவணப் பகிர்வு”",
      desc: "எமது புதிய இதழில் வடசென்னையின் ஆதி இசை மரபான கானாவின் வரலாறு, அதன் தற்காலத் தாக்கம் மற்றும் மண்ணின் மைந்தர்களான கலைஞர்களின் அரிய நேர்காணல்கள் பிரசுரிக்கப்பட்டுள்ளன.",
      readBtn: "புதிய இதழை வாசிக்க",
      archiveBtn: "இதழ்கள் காப்பகம்"
    },
    en: {
      tag: "FEATURED COVER STORY",
      title: "Gana Music Heritage: A Journey to Find the Soul of North Chennai",
      italic: "\"An in-depth documentary sharing of Royapuram's Gana singers and traditional music forms\"",
      desc: "In our latest issue, we explore the origins of Gana music, its contemporary impact, and include exclusive interviews with veteran local artists.",
      readBtn: "Read Featured Issue",
      archiveBtn: "Explore Archive"
    }
  }[lang];

  return (
    <section className="relative bg-charcoal min-h-[60vh] flex items-center justify-center py-16 px-4 overflow-hidden border-b border-border-subtle">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-charcoal/95 to-charcoal z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black text-white/[0.01] tracking-widest uppercase select-none pointer-events-none z-0">
        {lang === "ta" ? "ஆசிரியர் குறிப்பு" : "EDITORIAL"}
      </div>

      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 z-10 animate-fade-in">
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            {/* Lead Tag */}
            <span className="bg-secondary/25 border border-secondary text-secondary font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded inline-block">
              {t.tag}
            </span>
            
            {/* Article Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-normal tracking-tight py-1.5">
              {t.title}
            </h2>
            <p className="font-serif italic text-secondary-hover text-base sm:text-lg">
              {t.italic}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed max-w-2xl">
            {t.desc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              href={`/issues/${latestIssueId}`}
              variant="primary"
              size="md"
              className="flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <BookOpen className="w-4 h-4" /> {t.readBtn}
            </Button>
            <Button
              href="/issues"
              variant="outline"
              size="md"
              className="border-white text-white hover:bg-white hover:text-charcoal flex items-center justify-center gap-2 cursor-pointer"
            >
              <Archive className="w-4 h-4" /> {t.archiveBtn}
            </Button>
          </div>
        </div>
      </div>

      {/* Ribbon Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
    </section>
  );
}
