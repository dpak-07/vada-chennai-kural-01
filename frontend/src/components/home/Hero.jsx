"use client";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { BookOpen, Archive } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { staggerContainer, staggerItem } from "@/lib/motion";

// Split text into grapheme clusters so script combining marks (Tamil vowel
// signs / virama, e.g. ச+ெ, க+ு) stay attached to their base letter.
function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

// Background watermark: letters smoothly appear one by one from the start of
// the word, playing once when the hero loads (no loop).
function LetterGlow({ text }) {
  const d = 0.14; // seconds between consecutive letters appearing
  const f = 0.6; // seconds for a single letter to fade in

  const letters = splitGraphemes(text);

  return (
    <span className="inline-block">
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * d, duration: f, ease: "easeInOut" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

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
      {/* Elegant vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#232323_0%,_#1B1B1B_55%,_#141414_100%)] z-0" />
      {/* Animated brand watermark: letters light up one by one into the full
          word, then go dark one by one, looping forever. */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
        <div
          className="text-center font-serif font-black uppercase leading-none text-secondary opacity-[0.07]"
          style={{
            fontSize: lang === "ta" ? "clamp(3.5rem, 13vw, 11rem)" : "clamp(2.6rem, 8.5vw, 7.5rem)",
            letterSpacing: lang === "ta" ? "0.14em" : "0.18em",
          }}
        >
          {lang === "ta" ? (
            <LetterGlow text="வடசென்னை குரல்" />
          ) : (
            <>
              <div className="block">
                <LetterGlow text="Vadachennai" />
              </div>
              <div className="block tracking-[0.42em]">
                <LetterGlow text="Kural" />
              </div>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.12, 0.1)}
        className="relative w-full px-4 sm:px-8 lg:px-12 z-10"
      >
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            {/* Lead Tag */}
            <motion.span
              variants={staggerItem({ y: 14, duration: 0.45 })}
              className="bg-secondary/25 border border-secondary text-secondary font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded inline-block"
            >
              {t.tag}
            </motion.span>
            
            {/* Article Headline */}
            <motion.h2
              variants={staggerItem({ y: 40, duration: 0.6 })}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-normal tracking-tight py-1.5"
            >
              {t.title}
            </motion.h2>
            <motion.p
              variants={staggerItem({ y: 26, duration: 0.55 })}
              className="font-serif italic text-secondary-hover text-base sm:text-lg"
            >
              {t.italic}
            </motion.p>
          </div>

          <motion.p
            variants={staggerItem({ y: 22, duration: 0.55 })}
            className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed max-w-2xl"
          >
            {t.desc}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={staggerItem({ y: 18, duration: 0.5 })}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
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
              className="!bg-white !text-charcoal !border-white hover:!bg-secondary hover:!text-charcoal flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Archive className="w-4 h-4" /> {t.archiveBtn}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Ribbon Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
    </section>
  );
}
