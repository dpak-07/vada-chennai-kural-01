"use client";
import { motion } from "framer-motion";
import Button from "../common/Button";
import aboutData from "@/data/about.json";
import { Heart, Eye, ArrowRight, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { EASE_OUT, VIEWPORT_ONCE, staggerContainer, staggerItem } from "@/lib/motion";

export default function AboutPreview() {
  const { lang } = useLanguage();

  const t = {
    ta: {
      heading: "ஊடகங்களால் மறக்கப்பட்ட வடசென்னையின் உண்மையான வரலாற்றை ஆவணப்படுத்துகிறோம்.",
      story: aboutData.story,
      readMore: "எங்களைப் பற்றி மேலும் அறிய",
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
        className="lg:col-span-7 space-y-6 text-left"
      >
        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#121216] leading-snug">
          {t.heading}
        </h3>
        
        {/* Quote Pull-out */}
        <div className="border-l-4 border-[#800020] bg-white p-5 rounded-r-xl border border-gray-100 shadow-sm">
          <p className="font-serif italic text-charcoal/90 text-sm sm:text-base leading-relaxed">
            “வடசென்னை என்பது வெறும் உழைப்பின் அடையாளம் மட்டுமல்ல; அது கலையும், பண்பாடும், மனிதநேயமும் சங்கமிக்கும் தொட்டில்.”
          </p>
        </div>

        <p className="font-sans text-xs sm:text-sm text-charcoal/70 leading-relaxed font-normal">
          {t.story.substring(0, 260)}...
        </p>

        <div className="pt-2">
          <Button href="/about" variant="primary" size="md" className="bg-[#800020] hover:bg-[#9B1130] text-white font-bold cursor-pointer shadow-md flex items-center gap-2">
            <span>{t.readMore}</span>
            <ArrowRight className="w-4 h-4" />
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
          className="bg-white p-7 rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-xl hover:border-[#800020]/40 flex items-start gap-4 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            className="p-3.5 bg-[#800020]/10 rounded-xl text-[#800020] shrink-0 border border-[#800020]/20 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-300"
          >
            <Heart className="w-6 h-6" />
          </motion.div>
          <div className="space-y-1.5 text-left">
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#121216] group-hover:text-[#800020] transition-colors">{t.missionTitle}</h4>
            <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-normal">
              {t.missionDesc}
            </p>
          </div>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          variants={staggerItem({ x: 24, duration: 0.55 })}
          className="bg-white p-7 rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-xl hover:border-[#800020]/40 flex items-start gap-4 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: -6 }}
            className="p-3.5 bg-secondary/15 rounded-xl text-secondary-hover shrink-0 border border-secondary/30 group-hover:bg-secondary group-hover:text-charcoal transition-colors duration-300"
          >
            <Eye className="w-6 h-6" />
          </motion.div>
          <div className="space-y-1.5 text-left">
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#121216] group-hover:text-[#800020] transition-colors">{t.visionTitle}</h4>
            <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-normal">
              {t.visionDesc}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
