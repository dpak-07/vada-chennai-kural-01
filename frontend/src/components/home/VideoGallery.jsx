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
      subtitle: "காணொளி காட்சியகம்",
      subscribe: "எமது யூடியூப் சேனல்",
      play: "காணொளியைக் காண்க"
    },
    en: {
      heading: "Media Gallery",
      subtitle: "VIDEO GALLERY",
      subscribe: "Subscribe to our YouTube Channel",
      play: "Play Video"
    }
  }[lang];

  return (
    <section className="py-20 bg-white border-t border-border-subtle">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <SectionHeading
            title={t.heading}
            subtitle={t.subtitle}
          />
          <a
            href="https://youtube.com/c/vadachennaikural"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition font-sans shrink-0 uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" />
            </svg>
            {t.subscribe}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-canvas rounded-xl overflow-hidden border border-border-subtle shadow-sm flex flex-col group hover:shadow-md transition duration-300"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-charcoal cursor-pointer overflow-hidden flex items-center justify-center"
                onClick={() => setActiveVideo(video.youtubeId)}
              >
                <img
                  src={video.thumbnail}
                  alt={lang === "ta" ? video.titleTa : video.titleEn}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-103 group-hover:opacity-60 transition duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute p-4 rounded-full bg-primary text-secondary shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-6 h-6 fill-secondary" />
                </div>
                {/* Duration Tag */}
                <span className="absolute bottom-3 right-3 bg-black/75 px-2.5 py-1 text-[10px] text-white font-sans font-bold rounded">
                  {video.duration}
                </span>
              </div>

              {/* Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal leading-snug group-hover:text-primary transition-colors">
                  {lang === "ta" ? video.titleTa : video.titleEn}
                </h4>
                <button
                  onClick={() => setActiveVideo(video.youtubeId)}
                  className="mt-4 inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover gap-1 hover:underline cursor-pointer"
                >
                  {t.play}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Iframe Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
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
