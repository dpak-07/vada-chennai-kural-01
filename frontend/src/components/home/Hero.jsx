"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Archive, ArrowRight } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function Hero({ latestIssueId }) {
  const { lang } = useLanguage();

  const t = {
    ta: {
      brandTitle: "வடசென்னை குரல்",
      brandSub: "மண்ணின் மக்களின் புதிய ஒலி!",
      desc: "வடசென்னையின் பெருமைமிகு வரலாற்றையும், கானா இசை மரபு, பாரம்பரிய குத்துச்சண்டை மற்றும் உழைக்கும் மக்களின் நெகிழ்வான வாழ்வியலையும் உலகிற்கு கம்பீரமாகப் பறைசாற்றும் பிரீமியம் டிஜிட்டல் இதழ்.",
      readBtn: "இதழை வாசிக்க",
      archiveBtn: "இதழ்கள் காப்பகம்",
      coverTitle: "அறிமுக இதழ் - 2026",
      exploreNow: "இதழைத் திறக்க"
    },
    en: {
      brandTitle: "Vadachennai Kural",
      brandSub: "The Sovereign Voice of Our People!",
      desc: "An authentic editorial journey bringing the rich heritage of North Chennai to the global stage — archiving Gana musical roots, boxing traditions, and working-class resilience.",
      readBtn: "Read Latest Issue",
      archiveBtn: "Explore Archive",
      coverTitle: "Launch Issue - 2026",
      exploreNow: "Read Issue"
    }
  }[lang];

  return (
    <section className="relative bg-[#08080A] text-white min-h-[75vh] flex items-center justify-center py-16 sm:py-20 px-4 overflow-hidden border-b-2 border-[#800020]/30">
      {/* 1. Cinematic Ambient Maroon & Obsidian Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,_rgba(128,0,32,0.38)_0%,_rgba(20,4,8,0.7)_50%,_#08080A_100%)] z-0" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#B31336]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 2. Hero Content Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.12, 0.08)}
        className="relative w-full max-w-7xl px-4 sm:px-8 lg:px-12 z-10 mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Clean, Authoritative & Prestigious Typography */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Grand Artistic "Vadachennai Kural" Main Heading */}
            <motion.div variants={staggerItem({ y: 24, duration: 0.6 })} className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#F5E6C8]">
                  {t.brandTitle}
                </span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#D4AF37] font-bold tracking-wide">
                {t.brandSub}
              </p>
            </motion.div>

            {/* Editorial Description */}
            <motion.p
              variants={staggerItem({ y: 18, duration: 0.5 })}
              className="text-sm sm:text-base text-gray-300 font-sans font-normal leading-relaxed max-w-xl"
            >
              {t.desc}
            </motion.p>

            {/* High-Fashion Action Buttons */}
            <motion.div
              variants={staggerItem({ y: 18, duration: 0.5 })}
              className="flex flex-col sm:flex-row gap-4 pt-3"
            >
              <Button
                href={`/issues/${latestIssueId}`}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-[#800020] to-[#9B1130] hover:from-[#9B1130] hover:to-[#B31336] text-white font-bold border border-[#B31336]/60 shadow-glow-maroon flex items-center justify-center gap-2.5 px-8 py-4 cursor-pointer rounded-xl transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" /> {t.readBtn}
              </Button>
              <Button
                href="/issues"
                variant="outline"
                size="md"
                className="bg-white hover:bg-gray-100 text-[#121216] font-bold border border-white shadow-md flex items-center justify-center gap-2.5 px-8 py-4 cursor-pointer rounded-xl transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <Archive className="w-4 h-4 text-[#800020]" /> {t.archiveBtn}
              </Button>
            </motion.div>
          </div>

          {/* Right Column: 3D Luxury Magazine Showcase */}
          <motion.div
            variants={staggerItem({ y: 30, duration: 0.65 })}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              
              {/* Backlight Aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#800020] via-[#D4AF37]/30 to-[#800020] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />

              {/* 3D Magazine Cover Card */}
              <div className="relative bg-[#14141A] border-2 border-[#800020]/50 rounded-3xl p-4 sm:p-5 shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:-translate-y-1">
                
                {/* Magazine Cover Image */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <Image
                    src="/coming_soon_cover.jpg"
                    alt="Vadachennai Kural Cover"
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* High-Gloss Sheen Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/15 pointer-events-none" />

                  {/* Hover Quick Read Bar */}
                  <Link
                    href={`/issues/${latestIssueId}`}
                    className="absolute inset-x-3 bottom-3 bg-black/85 hover:bg-[#800020] backdrop-blur-md border border-white/20 text-white py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-bold font-sans transition-all duration-300 cursor-pointer shadow-lg"
                  >
                    <span>{t.exploreNow}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Triple Layer Regal Maroon & White Hairline Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#800020] to-transparent" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
}
