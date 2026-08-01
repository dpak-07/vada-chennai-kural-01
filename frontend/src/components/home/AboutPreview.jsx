"use client";
import { motion } from "framer-motion";
import Button from "../common/Button";
import aboutData from "@/data/about.json";
import { Award, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { EASE_OUT, VIEWPORT_ONCE, staggerContainer, staggerItem } from "@/lib/motion";

export default function AboutPreview() {
  const { lang } = useLanguage();

  const t = {
    ta: {
      heading: "ஊடகங்களால் மறக்கப்பட்ட வடசென்னையின் உண்மையான வரலாற்றை ஆவணப்படுத்துகிறோம்.",
      story: aboutData.story,
      readMore: "மேலும் அறிய",
      missionTitle: "எமது நோக்கம்",
      missionDesc: "வடசென்னை மக்களின் உண்மையான வாழ்வியல், பண்பாடு, மற்றும் கலைகளை உலகிற்கு எடுத்துரைத்தல்.",
      visionTitle: "எமது பார்வை",
      visionDesc: "வடசென்னை குறித்த நேர்மறையான கண்ணோட்டத்தை உலகளாவிய அளவில் உருவாக்குதல்."
    },
    en: {
      heading: "We document the true history of North Chennai, forgotten by mainstream media.",
      story: "Vadachennai Kural is a digital magazine amplifying the art, literature, lifestyle, and social issues of North Chennai. Started to dismantle media stereotypes, we celebrate the talents and achievements of local working-class heroes while archiving our rich historic legacy and cultural heritage.",
      readMore: "Read Full Story",
      missionTitle: "Our Mission",
      missionDesc: "To project the true life, culture, and arts of North Chennai to the world and serve as their authentic voice.",
      visionTitle: "Our Vision",
      visionDesc: "To build a positive narrative of North Chennai through digital media and support the upliftment of local communities."
    }
  }[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Narrative Preview (LHS) */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        className="lg:col-span-7 space-y-6"
      >
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal leading-normal py-1.5">
          {t.heading}
        </h3>
        <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
          {t.story.substring(0, 240)}...
        </p>
        <div className="pt-4">
          <Button href="/about" variant="primary" size="md" className="cursor-pointer">
            {t.readMore}
          </Button>
        </div>
      </motion.div>

      {/* Structured Core Values Cards (RHS) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.14, 0.08)}
        className="lg:col-span-5 grid grid-cols-1 gap-6"
      >
        {/* Mission Card */}
        <motion.div
          variants={staggerItem({ x: 24, duration: 0.55 })}
          className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <motion.div
            whileHover={{ scale: 1.12, rotate: 6, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            className="p-3 bg-primary/10 rounded-lg text-primary shrink-0"
          >
            <Heart className="w-5 h-5" />
          </motion.div>
          <div className="space-y-1">
            <h4 className="font-serif text-sm font-bold text-charcoal">{t.missionTitle}</h4>
            <p className="font-sans text-xs text-charcoal/65 leading-relaxed font-light">
              {t.missionDesc}
            </p>
          </div>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          variants={staggerItem({ x: 24, duration: 0.55 })}
          className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <motion.div
            whileHover={{ scale: 1.12, rotate: -6, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0"
          >
            <Eye className="w-5 h-5" />
          </motion.div>
          <div className="space-y-1">
            <h4 className="font-serif text-sm font-bold text-charcoal">{t.visionTitle}</h4>
            <p className="font-sans text-xs text-charcoal/65 leading-relaxed font-light">
              {t.visionDesc}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
