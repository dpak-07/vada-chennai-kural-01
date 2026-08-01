"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Download, Eye, Share2, Copy, Check, ChevronRight, 
  BookOpen, FileText, ChevronLeft, ChevronRight as RightIcon,
  ChevronsLeft, ChevronsRight, ZoomIn, ZoomOut, Play, Volume2
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import IssueCard from "@/components/ui/IssueCard";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import CommentsSection from "@/components/ui/CommentsSection";

export default function IssueDetailsClient({ issue, relatedIssues }) {
  const [activeTab, setActiveTab] = useState("flipbook"); // flipbook, pdf
  const [copied, setCopied] = useState(false);
  const [rawShareUrl, setRawShareUrl] = useState("");
  const [flipPage, setFlipPage] = useState(1); // Active left page (desktop) or active single page (mobile)
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageImages, setPageImages] = useState([]); // Pre-rendered Blob URLs for pages
  const [totalPages, setTotalPages] = useState(6);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [isFlipping, setIsFlipping] = useState(null); // 'next', 'prev', or null
  const [isMobile, setIsMobile] = useState(false);
  const { lang } = useLanguage();

  // Retrieve translation for dynamic issue items
  const translation = issueTranslations[issue.id] || {};
  const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
  const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;
  const displayDesc = lang === "en" ? (issue.descriptionEn || translation.description || issue.description) : issue.description;
  const displayFeatures = lang === "en" ? (issue.featuresEn || translation.features || issue.features) : issue.features;

  useEffect(() => {
    setRawShareUrl(window.location.href);
  }, []);

  // Detect mobile width on resize to toggle single/double page flipbook views
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page counter if mobile view toggles
  useEffect(() => {
    setFlipPage(1);
  }, [isMobile]);

  // Dynamically load PDF.js and pre-render PDF pages to high-performance Blob URLs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadPdfAndRenderBlobUrls = async () => {
      setLoadingPdf(true);
      
      const getPdfJs = () => {
        if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
          script.onload = () => {
            try {
              const workerCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js");`;
              const blob = new Blob([workerCode], { type: "application/javascript" });
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
            } catch (workerErr) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
            }
            resolve(window.pdfjsLib);
          };
          document.body.appendChild(script);
        });
      };

      try {
        const pdfjs = await getPdfJs();
        const url = issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf";
        
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        const total = pdf.numPages;
        setTotalPages(total);
        
        // Pre-render all pages to Blob URLs once for seamless zero-flicker display
        const renderedUrls = [];
        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: context, viewport }).promise;
          
          // Generate GPU-cacheable blob URL
          const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.95));
          const blobUrl = URL.createObjectURL(blob);
          renderedUrls.push(blobUrl);
        }
        setPageImages(renderedUrls);
      } catch (err) {
        console.error("PDF pre-rendering failed: ", err);
      } finally {
        setLoadingPdf(false);
      }
    };

    loadPdfAndRenderBlobUrls();
    
    // Cleanup generated blob URLs on unmount to free browser memory
    return () => {
      pageImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [issue.pdfUrl]);

  // Autoplay page turner (PubHTML5 slideshow mode)
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        handleNextPage();
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, flipPage, totalPages, isMobile, isFlipping]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(rawShareUrl);
  const shareText = encodeURIComponent(`வடசென்னை குரல் - ${displayTitle}`);

  // Localized general texts
  const t = {
    ta: {
      share: "பகிர்க",
      copied: "நகலெடுக்கப்பட்டது!",
      copyLink: "இணைப்பை நகலெடு",
      details: "இதழ் விபரங்கள்",
      pages: "பக்கங்கள்",
      date: "வெளியீட்டு தேதி",
      featured: "இதழின் முக்கிய கட்டுரைகள்",
      flipView: "3D ஃபிளிப்புக் காட்சி",
      pdfView: "PDF ஆவணம்",
      flipbookTitle: "3D இதழ் ஃபிளிப்பர்",
      downloadPdf: "இதழை பதிவிறக்குக",
      openPdf: "புதிய விண்டோவில் திறக்க",
      related: "தொடர்புடைய இதழ்கள்",
      relatedSub: "மேலும் இதழ்கள்",
      pageLabel: "பக்கம்",
      loading: "இதழ் பக்கங்களை ஏற்றுகிறது...",
      officialSocials: "அதிகாரப்பூர்வ பக்கங்கள்",
      references: "ஆவணக் குறிப்புகள் & தகவல்கள்",
      readReference: "குறிப்புத் தரவை வாசிக்க",
      pdfReaderTitle: "நிலையான PDF வாசிப்பான்",
      pdfReaderDesc: "எமது பிரசுர இதழின் அசல் PDF கோப்பினை உங்கள் உலாவியில் நேரடியாக வாசிக்கலாம்.",
      pdfLoadError: "PDF-ஐ ஏற்ற முடியவில்லை. தயவுசெய்து கீழே பதிவிறக்கவும்.",
      zoomIn: "பெரிதாக்கு",
      zoomOut: "சுருக்கு",
      slideshow: "தானியங்கி காட்சி",
      firstPage: "முதல் பக்கம்",
      prevPage: "முந்தைய பக்கம்",
      nextPage: "அடுத்த பக்கம்",
      lastPage: "கடைசி பக்கம்",
      facebookPage: "பேஸ்புக் பக்கம்",
      twitterProfile: "ட்விட்டர் / எக்ஸ் சுயவிவரம்",
      instagramFeed: "இன்ஸ்டாகிராம் ஃபீட்",
      youtubeChannel: "யூடியூப் சேனல்",
      viduthalaiArchive: "விடுதலை ஆவணக்காப்பகம்",
      pubhtml5Guide: "PubHTML5 ஃபிளிப்புக் வழிகாட்டி"
    },
    en: {
      share: "Share This Issue",
      copied: "Copied!",
      copyLink: "Copy Link",
      details: "Issue Details",
      pages: "Pages",
      date: "Release Date",
      featured: "Featured Articles",
      flipView: "Interactive Flipbook",
      pdfView: "PDF Document",
      flipbookTitle: "Interactive HTML5 Flipbook",
      downloadPdf: "Download PDF",
      openPdf: "Open PDF in New Window",
      related: "Related Issues",
      relatedSub: "RELATED ISSUES",
      pageLabel: "Page",
      loading: "Loading magazine pages...",
      officialSocials: "Official Handles",
      references: "References & Resources",
      readReference: "Read Reference Source",
      pdfReaderTitle: "Standard PDF Reader",
      pdfReaderDesc: "Read the original PDF file of this issue directly in your browser.",
      pdfLoadError: "PDF could not be loaded. Please download it below.",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      slideshow: "Slideshow Mode",
      firstPage: "First Page",
      prevPage: "Previous Page",
      nextPage: "Next Page",
      lastPage: "Last Page",
      facebookPage: "Facebook Page",
      twitterProfile: "Twitter / X Profile",
      instagramFeed: "Instagram Feed",
      youtubeChannel: "YouTube Channel",
      viduthalaiArchive: "Viduthalai Archive",
      pubhtml5Guide: "PubHTML5 Flipbook Guide"
    }
  }[lang];

  const handleNextPage = () => {
    if (isFlipping || loadingPdf) return;
    if (isMobile) {
      if (flipPage < totalPages) {
        setIsFlipping("next");
        setFlipPage(prev => prev + 1);
        setTimeout(() => setIsFlipping(null), 300);
      }
    } else {
      if (flipPage < totalPages - 1) {
        setIsFlipping("next");
        setTimeout(() => {
          setFlipPage(prev => prev + 2);
          setTimeout(() => {
            setIsFlipping(null);
          }, 80); // 80ms buffer allows browser paint of static canvases before unmounting sheet
        }, 700);
      }
    }
  };

  const handlePrevPage = () => {
    if (isFlipping || loadingPdf) return;
    if (isMobile) {
      if (flipPage > 1) {
        setIsFlipping("prev");
        setFlipPage(prev => prev - 1);
        setTimeout(() => setIsFlipping(null), 300);
      }
    } else {
      if (flipPage > 1) {
        setIsFlipping("prev");
        setTimeout(() => {
          setFlipPage(prev => prev - 2);
          setTimeout(() => {
            setIsFlipping(null);
          }, 80);
        }, 700);
      }
    }
  };

  // Safe page resolver with boundary protections
  const getPageUrl = (num) => {
    if (num < 1 || num > totalPages) return null;
    return pageImages[num - 1] || null;
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { name: lang === "ta" ? "இதழ்கள்" : "Issues", path: "/issues" },
          { name: displayTitle, path: `/issues/${issue.id}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Side: Cover Image */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
            <Image
              src={issue.coverImage}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-xl border border-border-subtle p-5 space-y-4">
            <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" /> {t.share}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center py-2 px-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-md font-semibold transition"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center py-2 px-3 bg-black/10 hover:bg-black/20 text-charcoal rounded-md font-semibold transition"
              >
                Twitter / X
              </a>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center py-2 px-3 border border-border-subtle hover:border-primary rounded-md text-xs font-semibold text-charcoal/80 transition gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" /> {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> {t.copyLink}
                </>
              )}
            </button>
          </div>

          {/* Social Media Handles & References Card */}
          <div className="bg-white rounded-xl border border-border-subtle p-5 space-y-5 shadow-sm">
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-charcoal border-b border-border-subtle pb-2">
                {t.officialSocials}
              </h4>
              <div className="flex flex-col space-y-2 text-xs">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-charcoal/70 hover:text-primary transition font-sans font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1877F2]"></span>
                  {t.facebookPage}
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-charcoal/70 hover:text-primary transition font-sans font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  {t.twitterProfile}
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-charcoal/70 hover:text-primary transition font-sans font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#E1306C]"></span>
                  {t.instagramFeed}
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 text-charcoal/70 hover:text-primary transition font-sans font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF0000]"></span>
                  {t.youtubeChannel}
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <h4 className="font-serif text-sm font-bold text-charcoal border-b border-border-subtle pb-2">
                {t.references}
              </h4>
              <div className="flex flex-col space-y-2.5 text-xs text-charcoal/70">
                <div className="space-y-1">
                  <span className="font-bold block text-primary font-serif">{t.viduthalaiArchive}</span>
                  <p className="text-[10px] text-charcoal/50 leading-relaxed font-light">
                    {lang === "ta" 
                      ? "வடசென்னையின் பகுத்தறிவு இயக்கங்கள் மற்றும் வரலாற்று குறிப்புகளுக்கான அசல் தரவுகள்."
                      : "Original rationalist reference archives and historic files of the Dravidian movement."}
                  </p>
                  <a 
                    href="https://viduthalai.in" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-secondary font-bold hover:underline block text-[10px]"
                  >
                    → {t.readReference}
                  </a>
                </div>
                <div className="space-y-1 pt-1.5 border-t border-border-subtle/50">
                  <span className="font-bold block text-primary font-serif">{t.pubhtml5Guide}</span>
                  <p className="text-[10px] text-charcoal/50 leading-relaxed font-light">
                    {lang === "ta"
                      ? "3D புத்தக பிரசுர வடிவமைப்பு மற்றும் இணைய வாசிப்புத் தொழில்நுட்ப விளக்கக்குறிப்பு."
                      : "Technical specs and reference implementations for digital 3D book publications."}
                  </p>
                  <a 
                    href="https://pubhtml5.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-secondary font-bold hover:underline block text-[10px]"
                  >
                    → {t.readReference}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-charcoal/50">
              <Calendar className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-semibold">{displayMonth}</span>
              <span className="text-gray-300">•</span>
              <span className="font-light">{t.date}: {issue.date}</span>
              <span className="text-gray-300">•</span>
              <span className="font-light">{issue.pages} {t.pages}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal leading-normal py-1.5">
              {displayTitle}
            </h1>
          </div>

          <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
            {displayDesc}
          </p>

          {/* Highlights */}
          {displayFeatures && displayFeatures.length > 0 && (
            <div className="bg-white rounded-xl border border-border-subtle p-6 space-y-3 shadow-sm">
              <h3 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-border-subtle">
                {t.featured}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-charcoal/80 font-medium pt-1">
                {displayFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2.5">
                    <ChevronRight className="w-4 h-4 text-secondary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Viewer Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-border-subtle">
              <button
                onClick={() => setActiveTab("flipbook")}
                className={`py-3 px-6 font-serif text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "flipbook"
                    ? "border-primary text-primary"
                    : "border-transparent text-charcoal/60 hover:text-primary"
                }`}
              >
                <BookOpen className="w-4 h-4" /> {t.flipView}
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`py-3 px-6 font-serif text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "pdf"
                    ? "border-primary text-primary"
                    : "border-transparent text-charcoal/60 hover:text-primary"
                }`}
              >
                <FileText className="w-4 h-4" /> {t.pdfView}
              </button>
            </div>

            {/* Viewer Screen Container */}
            {activeTab === "flipbook" ? (
              /* Real 3D Page-Flip CSS Book layout */
              <div className="w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-border-subtle flex flex-col items-center justify-between min-h-[520px] shadow-2xl relative select-none">
                
                {/* 1. Top Header bar */}
                <div className="w-full bg-[#2a2a2a] px-4 py-2 border-b border-white/5 flex items-center justify-between text-white/80 text-[10px] sm:text-xs z-10">
                  <span className="font-serif truncate font-bold text-secondary max-w-[200px] sm:max-w-none">
                    {displayTitle} - {displayMonth}
                  </span>
                  <div className="flex items-center space-x-3 text-white/70">
                    <button onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))} className="hover:text-white cursor-pointer" title={t.zoomOut}><ZoomOut className="w-3.5 h-3.5" /></button>
                    <span className="text-[9px] font-sans font-bold">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))} className="hover:text-white cursor-pointer" title={t.zoomIn}><ZoomIn className="w-3.5 h-3.5" /></button>
                    <span className="text-white/10">|</span>
                    <button onClick={() => setIsPlaying(!isPlaying)} className={`hover:text-white cursor-pointer ${isPlaying ? "text-primary animate-pulse" : ""}`} title={t.slideshow}><Play className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* 2. Real 3D Book Page Flip Area */}
                <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#2c2c2c,_#1a1a1a)] min-h-[380px]">
                  
                  {loadingPdf ? (
                    <div className="flex flex-col items-center justify-center text-white space-y-4 text-xs">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-medium animate-pulse">{t.loading}</p>
                    </div>
                  ) : pageImages.length > 0 ? (
                    /* The 3D Book Component wrapper */
                    <div 
                      className={`relative flex items-center justify-center w-full transition-transform duration-300 ${
                        isMobile ? "max-w-[280px] aspect-[0.7/1]" : "max-w-2xl aspect-[1.4/1] bg-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5"
                      }`}
                      style={{ 
                        transform: `scale(${zoom}) translateZ(0)`,
                        WebkitTransform: `scale(${zoom}) translateZ(0)`,
                        perspective: isMobile ? undefined : "2000px",
                        willChange: "transform"
                      }}
                    >
                      {isMobile ? (
                        /* Mobile View: Render active single page directly to local canvas */
                        <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-white/5 overflow-hidden">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.img 
                              key={`page-${flipPage}`}
                              initial={{ x: isFlipping === "next" ? 80 : -80, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: isFlipping === "next" ? -80 : 80, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              style={{ willChange: "transform", transform: "translateZ(0)" }}
                              src={getPageUrl(flipPage)}
                              className="w-full h-full object-contain"
                              alt={`Page ${flipPage}`}
                            />
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* Desktop Double Page View: Draw pages to canvases directly */
                        <div className="w-full h-full relative preserve-3d">
                          {/* Spine Crease Line overlays */}
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/50 z-30 pointer-events-none" />
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-20 pointer-events-none" />

                          {/* LAYER 1: STATIC LEFT UNDERLAY PAGE */}
                          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-white rounded-l-lg border-r border-black/25 overflow-hidden shadow-inner"
                            style={{ transform: "translateZ(0)", willChange: "transform" }}>
                            {getPageUrl(isFlipping === "prev" ? flipPage - 2 : flipPage) ? (
                              <img src={getPageUrl(isFlipping === "prev" ? flipPage - 2 : flipPage)} className="w-full h-full object-contain" alt="" />
                            ) : (
                              <div className="w-full h-full bg-white" />
                            )}
                            <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
                            <span className="absolute bottom-2 left-3 text-[9px] text-charcoal/40 font-bold font-sans">
                              {isFlipping === "prev" ? flipPage - 2 : flipPage}
                            </span>
                          </div>

                          {/* LAYER 2: STATIC RIGHT UNDERLAY PAGE */}
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white rounded-r-lg border-l border-black/25 overflow-hidden shadow-inner"
                            style={{ transform: "translateZ(0)", willChange: "transform" }}>
                            {getPageUrl(isFlipping === "next" ? flipPage + 3 : flipPage + 1) ? (
                              <img src={getPageUrl(isFlipping === "next" ? flipPage + 3 : flipPage + 1)} className="w-full h-full object-contain" alt="" />
                            ) : (
                              <div className="w-full h-full bg-white" />
                            )}
                            <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                            <span className="absolute bottom-2 right-3 text-[9px] text-charcoal/40 font-bold font-sans">
                              {isFlipping === "next" ? flipPage + 3 : flipPage + 1}
                            </span>
                          </div>

                          {/* LAYER 3: DYNAMIC 3D ANIMATED FLIPPING SHEET (Next turning) */}
                          {isFlipping === "next" && (
                            <div 
                              className="absolute right-0 top-0 bottom-0 w-1/2 origin-left z-40"
                              style={{
                                transformStyle: "preserve-3d",
                                WebkitTransformStyle: "preserve-3d",
                                willChange: "transform",
                                animation: "flipNextPage 0.7s forwards",
                                WebkitAnimation: "flipNextPage 0.7s forwards"
                              }}
                            >
                              {/* Front Side */}
                              <div 
                                className="absolute inset-0 bg-white border-l border-black/25 overflow-hidden backface-hidden"
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden"
                                }}
                              >
                                {getPageUrl(flipPage + 1) && (
                                  <img src={getPageUrl(flipPage + 1)} className="w-full h-full object-contain" alt="" />
                                )}
                                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 right-3 text-[9px] text-charcoal/40 font-bold font-sans">{flipPage + 1}</span>
                              </div>

                              {/* Back Side */}
                              <div 
                                className="absolute inset-0 bg-white border-r border-black/25 overflow-hidden"
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(180deg)",
                                  WebkitTransform: "rotateY(180deg)"
                                }}
                              >
                                {getPageUrl(flipPage + 2) && (
                                  <img src={getPageUrl(flipPage + 2)} className="w-full h-full object-contain" alt="" />
                                )}
                                <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 left-3 text-[9px] text-charcoal/40 font-bold font-sans">{flipPage + 2}</span>
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC 3D ANIMATED FLIPPING SHEET (Prev turning) */}
                          {isFlipping === "prev" && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1/2 origin-right z-40"
                              style={{
                                transformStyle: "preserve-3d",
                                WebkitTransformStyle: "preserve-3d",
                                willChange: "transform",
                                animation: "flipPrevPage 0.7s forwards",
                                WebkitAnimation: "flipPrevPage 0.7s forwards"
                              }}
                            >
                              {/* Front Side */}
                              <div 
                                className="absolute inset-0 bg-white border-r border-black/25 overflow-hidden backface-hidden"
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden"
                                }}
                              >
                                {getPageUrl(flipPage) && (
                                  <img src={getPageUrl(flipPage)} className="w-full h-full object-contain" alt="" />
                                )}
                                <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 left-3 text-[9px] text-charcoal/40 font-bold font-sans">{flipPage}</span>
                              </div>

                              {/* Back Side */}
                              <div 
                                className="absolute inset-0 bg-white border-l border-black/25 overflow-hidden"
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(-180deg)",
                                  WebkitTransform: "rotateY(-180deg)"
                                }}
                              >
                                {getPageUrl(flipPage - 1) && (
                                  <img src={getPageUrl(flipPage - 1)} className="w-full h-full object-contain" alt="" />
                                )}
                                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 right-3 text-[9px] text-charcoal/40 font-bold font-sans">{flipPage - 1}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white text-xs text-center">{t.pdfLoadError}</div>
                  )}

                </div>

                {/* 3. PubHTML5 Bottom Control Toolbar */}
                <div className="w-full bg-[#202020] px-4 py-3 border-t border-white/5 flex items-center justify-between text-white/80 z-10">
                  <div className="flex items-center space-x-2 text-xs">
                    <button 
                      onClick={() => !isFlipping && setFlipPage(1)} 
                      disabled={flipPage === 1 || isFlipping || loadingPdf}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.firstPage}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handlePrevPage} 
                      disabled={flipPage === 1 || isFlipping || loadingPdf}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.prevPage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] sm:text-xs font-sans text-white/70 font-bold bg-[#141414] border border-white/10 px-3 py-1 rounded">
                      {isMobile ? `${flipPage} / ${totalPages}` : `${flipPage} - ${flipPage + 1} / ${totalPages}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <button 
                      onClick={handleNextPage} 
                      disabled={((isMobile ? flipPage >= totalPages : flipPage >= totalPages - 1) || isFlipping || loadingPdf)}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.nextPage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => !isFlipping && setFlipPage(isMobile ? totalPages : totalPages - 1)} 
                      disabled={((isMobile ? flipPage >= totalPages : flipPage >= totalPages - 1) || isFlipping || loadingPdf)}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.lastPage}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline CSS styling inject */}
                <style jsx global>{`
                  @keyframes flipNextPage {
                    0% { transform: rotateY(0deg); -webkit-transform: rotateY(0deg); }
                    100% { transform: rotateY(-180deg); -webkit-transform: rotateY(-180deg); }
                  }
                  @-webkit-keyframes flipNextPage {
                    0% { -webkit-transform: rotateY(0deg); }
                    100% { -webkit-transform: rotateY(-180deg); }
                  }
                  @keyframes flipPrevPage {
                    0% { transform: rotateY(0deg); -webkit-transform: rotateY(0deg); }
                    100% { transform: rotateY(180deg); -webkit-transform: rotateY(180deg); }
                  }
                  @-webkit-keyframes flipPrevPage {
                    0% { -webkit-transform: rotateY(0deg); }
                    100% { -webkit-transform: rotateY(180deg); }
                  }
                  .perspective-2000 { 
                    perspective: 2000px; 
                    -webkit-perspective: 2000px;
                  }
                  .preserve-3d { 
                    transform-style: preserve-3d; 
                    -webkit-transform-style: preserve-3d;
                  }
                  .backface-hidden { 
                    backface-visibility: hidden; 
                    -webkit-backface-visibility: hidden;
                  }
                `}</style>

              </div>
            ) : (
              /* Standard PDF View */
              <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-border-subtle p-8 flex flex-col items-center justify-center text-center text-white space-y-6 min-h-[500px]">
                <FileText className="w-16 h-16 text-primary" />
                <div className="space-y-2">
                  <h4 className="font-serif text-base font-bold">{t.pdfReaderTitle}</h4>
                  <p className="text-[11px] text-white/60 font-light leading-relaxed">
                    {t.pdfReaderDesc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center font-sans font-semibold bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-xs text-white transition cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4 mr-2" /> {t.openPdf}
                  </a>
                  <Button href={issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf"} download variant="secondary" size="md" className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> {t.downloadPdf}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <CommentsSection issueId={issue.id} />
      </div>

      {/* Related Issues Section */}
      {relatedIssues && relatedIssues.length > 0 && (
        <div className="border-t border-border-subtle pt-16 mt-16 space-y-8">
          <SectionHeading title={t.related} subtitle={t.relatedSub} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
