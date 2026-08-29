"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null);
  const { lang } = useLanguage();

  const videos = [
    {
      id: "1",
      titleTa: "வடசென்னை கானா பாடல்களின் தோற்றமும் வரலாறும்",
      titleEn: "The Origins and History of Gana Music in North Chennai",
      duration: "12:45",
      youtubeId: "W-P3_S8rE1Q",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=350&fit=crop",
    },
    {
      id: "2",
      titleTa: "மெட்ராஸ் குத்துச்சண்டை: சார்பட்டா பரம்பரையின் நிஜக் கதை",
      titleEn: "Madras Boxing: The Real Story of the Sarbhatta Paramparai",
      duration: "18:20",
      youtubeId: "vB3P8_y3Goo",
      thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=350&fit=crop",
    },
    {
      id: "3",
      titleTa: "எண்ணூர் கழிமுகச் சூழலியலும் மீனவர் வாழ்வாதாரமும்",
      titleEn: "Ennore Estuary Ecology and the Livelihood of Fishermen",
      duration: "15:10",
      youtubeId: "M1gP86y0oD8",
      thumbnail: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=600&h=350&fit=crop",
    }
  ];

  const t = {
    ta: {
      heading: "ஊடகக் காட்சியகம்",
      subtitle: "காணொளி ஆவணங்கள்",
      subscribe: "எமது யூடியூப் சேனல்",
      play: "காணொளியைக் காண்க"
    },
    en: {
      heading: "Media & Documentaries",
      subtitle: "VIDEO ARCHIVE",
      subscribe: "Subscribe to our YouTube Channel",
      play: "Play Video"
    }
  }[lang];

  return (
    <section className="py-20 bg-[#0B0B0E] text-white border-y-2 border-[#800020]/30 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#800020]/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-[#D4AF37] font-sans font-black tracking-[0.2em] text-[11px] uppercase block mb-2">
              ✦ {t.subtitle} ✦
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
              {t.heading}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="block h-1 w-14 bg-[#800020] rounded-full" />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
          </div>

          <a
            href="https://youtube.com/c/vadachennaikural"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#9B1130] px-4 py-2.5 rounded-lg transition font-sans shrink-0 uppercase tracking-wider shadow-glow-maroon border border-[#B31336]/40"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" />
            </svg>
            {t.subscribe}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-[#14141A] rounded-2xl overflow-hidden border border-white/10 shadow-lg flex flex-col group hover:border-[#800020]/60 hover:shadow-glow-maroon transition-all duration-300"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-black cursor-pointer overflow-hidden flex items-center justify-center"
                onClick={() => setActiveVideo(video.youtubeId)}
              >
                <img
                  src={video.thumbnail}
                  alt={lang === "ta" ? video.titleTa : video.titleEn}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute p-4 rounded-full bg-[#800020] text-white shadow-glow-maroon transition-transform duration-300 group-hover:scale-115 border border-[#B31336]">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                {/* Duration Tag */}
                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[10px] text-white font-sans font-bold rounded border border-white/10">
                  {video.duration}
                </span>
              </div>

              {/* Description */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug group-hover:text-secondary transition-colors">
                  {lang === "ta" ? video.titleTa : video.titleEn}
                </h4>
                <button
                  onClick={() => setActiveVideo(video.youtubeId)}
                  className="mt-4 inline-flex items-center text-xs font-bold text-secondary hover:text-white gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-secondary" /> {t.play}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Iframe Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-[#800020]/60 aspect-video">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-[#800020] transition cursor-pointer border border-white/20"
              aria-label={lang === "ta" ? "வீடியோவை மூடு" : "Close video player"}
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={lang === "ta" ? "YouTube வீடியோ" : "YouTube Video Player"}
              className="border-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
