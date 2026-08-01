"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Download, Share2, Copy, Check, ChevronRight, 
  BookOpen, FileText, ChevronLeft, ChevronRight as RightIcon,
  ChevronsLeft, ChevronsRight, ZoomIn, ZoomOut, Play, Volume2
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import IssueCard from "@/components/ui/IssueCard";
import { motion, useMotionValue, animate } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { issueTranslations } from "@/data/translations";
import CommentsSection from "@/components/ui/CommentsSection";
import { TurningPage, UnderlayShade } from "@/components/ui/PageCurl";

// Brand logo paths (24x24 viewBox) for the share sheet
const SOCIAL_PATHS = {
  facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  x: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  threads: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z",
  instagram: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  telegram: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
};

function BrandIcon({ path, className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

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
  const [pageAspect, setPageAspect] = useState(0.707);
  const flipProgress = useMotionValue(0); // 0..1 page-turn progress; follows the cursor on drag, animated to 0/1 on release
  const { lang } = useLanguage();

  // Retrieve translation for dynamic issue items
  const translation = issueTranslations[issue.id] || {};
  const displayTitle = lang === "en" ? (issue.titleEn || translation.title || issue.title) : issue.title;
  const displayMonth = lang === "en" ? (issue.monthEn || translation.month || issue.month) : issue.month;
  const displayDesc = lang === "en" ? (issue.descriptionEn || translation.description || issue.description) : issue.description;

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
        const rawUrl = issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf";
        const url = encodeURI(rawUrl);
        
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
          
          if (i === 1) setPageAspect(viewport.width / viewport.height);
          
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

  const socialShares = [
    { key: "facebook", label: "Facebook", color: "#1877F2", path: SOCIAL_PATHS.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { key: "whatsapp", label: "WhatsApp", color: "#25D366", path: SOCIAL_PATHS.whatsapp, href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
    { key: "instagram", label: "Instagram", color: "#E4405F", path: SOCIAL_PATHS.instagram, href: `https://www.instagram.com/?url=${shareUrl}` },
    { key: "x", label: "X", color: "#000000", path: SOCIAL_PATHS.x, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
    { key: "threads", label: "Threads", color: "#000000", path: SOCIAL_PATHS.threads, href: `https://www.threads.net/intent/post?text=${shareText}%20${shareUrl}` },
    { key: "telegram", label: "Telegram", color: "#229ED9", path: SOCIAL_PATHS.telegram, href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}` },
  ];

  // Localized general texts
  const t = {
    ta: {
      share: "பகிர்க",
      copied: "நகலெடுக்கப்பட்டது!",
      copyLink: "இணைப்பை நகலெடு",
      details: "இதழ் விபரங்கள்",
      pages: "பக்கங்கள்",
      date: "வெளியீட்டு தேதி",
      flipView: "புத்தக வாசிப்பான்",
      pdfView: "PDF ஆவணம்",
      flipbookTitle: "புத்தக வாசிப்பு காட்சி",
      downloadPdf: "இதழை பதிவிறக்குக",
      openPdf: "புதிய விண்டோவில் திறக்க",
      related: "தொடர்புடைய இதழ்கள்",
      relatedSub: "மேலும் இதழ்கள்",
      pageLabel: "பக்கம்",
      loading: "இதழ் பக்கங்களை ஏற்றுகிறது...",
      pdfReaderTitle: "நிலையான PDF வாசிப்பான்",
      pdfReaderDesc: "எமது பிரசுர இதழின் அசல் PDF கோப்பினை உங்கள் உலாவியில் நேரடியாக வாசிக்கலாம்.",
      pdfLoadError: "PDF-ஐ ஏற்ற முடியவில்லை. தயவுசெய்து கீழே பதிவிறக்கவும்.",
      zoomIn: "பெரிதாக்கு",
      zoomOut: "சுருக்கு",
      slideshow: "தானியங்கி காட்சி",
      firstPage: "முதல் பக்கம்",
      prevPage: "முந்தைய பக்கம்",
      nextPage: "அடுத்த பக்கம்",
      lastPage: "கடைசி பக்கம்"
    },
    en: {
      share: "Share This Issue",
      copied: "Copied!",
      copyLink: "Copy Link",
      details: "Issue Details",
      pages: "Pages",
      date: "Release Date",
      flipView: "Book Reader",
      pdfView: "PDF Document",
      flipbookTitle: "Book Reader View",
      downloadPdf: "Download PDF",
      openPdf: "Open PDF in New Window",
      related: "Related Issues",
      relatedSub: "MORE TO READ",
      pageLabel: "Page",
      loading: "Loading magazine pages...",
      pdfReaderTitle: "Standard PDF Reader",
      pdfReaderDesc: "Read the original PDF file of this issue directly in your browser.",
      pdfLoadError: "PDF could not be loaded. Please download it below.",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      slideshow: "Slideshow Mode",
      firstPage: "First Page",
      prevPage: "Previous Page",
      nextPage: "Next Page",
      lastPage: "Last Page"
    }
  }[lang];

  // Desktop shows a two-page spread (advance by 2); mobile shows a single page.
  const isDesktop = !isMobile;
  const step = isMobile ? 1 : 2;
  const maxLeft = isMobile ? totalPages : totalPages - 1;

  const TURN_DURATION = 1.8; // seconds for a full slow, smooth turn

  const completePageFlip = (dir) => {
    if (dir === "next") {
      setFlipPage(prev => Math.min(prev + step, maxLeft));
    } else if (dir === "prev") {
      setFlipPage(prev => Math.max(prev - step, 1));
    }
    setIsFlipping(null);
  };

  // Start a programmatic turn (toolbar / tap): animate the sheet from its
  // current position to fully turned over.
  const animateTurn = (dir) => {
    if (isFlipping || loadingPdf) return;
    setIsFlipping(dir);
    animate(flipProgress, 1, {
      duration: TURN_DURATION,
      ease: [0.45, 0.05, 0.15, 0.9],
      onComplete: () => completePageFlip(dir),
    });
  };

  const handleNextPage = () => {
    if (flipPage < maxLeft) animateTurn("next");
  };

  const handlePrevPage = () => {
    if (flipPage > 1) animateTurn("prev");
  };

  // Safe page resolver with boundary protections
  const getPageUrl = (num) => {
    if (num < 1 || num > totalPages) return null;
    return pageImages[num - 1] || null;
  };

  // Which page(s) the book shows during a turn, so the underlay reveals the
  // next spread while the active sheet curls over.
  const flippingNext = isFlipping === "next";
  const flippingPrev = isFlipping === "prev";
  const underlayLeft = flippingNext ? flipPage + step : flippingPrev ? flipPage - step : flipPage;
  const underlayRight = isDesktop ? underlayLeft + 1 : null;
  const sheetFront = isDesktop && flippingNext ? flipPage + 1 : flipPage;
  const sheetBack = flippingNext ? flipPage + step : flipPage - 1;

  // Mouse / touch page turning: the sheet locks to the cursor while dragging,
  // then completes (or cancels) with a slow, smooth animation on release.
  const dragStart = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handlePagePointerDown = (e) => {
    if (isFlipping || loadingPdf) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dir = e.clientX - rect.left > rect.width * 0.5 ? "next" : "prev";
    if (dir === "next" && flipPage >= maxLeft) return;
    if (dir === "prev" && flipPage <= 1) return;
    dragStart.current = { x: e.clientX, dir };
    setDragging(true);
    setIsFlipping(dir);
    flipProgress.set(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePagePointerMove = (e) => {
    if (!dragStart.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - dragStart.current.x;
    // A page-width drag (half the book on desktop, whole book on mobile) = full turn.
    const dragSpan = rect.width * (isMobile ? 1 : 0.5);
    const raw = dragStart.current.dir === "next" ? -dx / dragSpan : dx / dragSpan;
    flipProgress.set(Math.max(0, Math.min(1, raw)));
  };

  const handlePagePointerUp = (e) => {
    const start = dragStart.current;
    dragStart.current = null;
    setDragging(false);
    if (!start || loadingPdf) return;
    const v = flipProgress.get();
    const dx = e.clientX - start.x;
    const isTap = Math.abs(dx) < 14;
    const commit = isTap || v > 0.3;
    animate(flipProgress, commit ? 1 : 0, {
      duration: commit ? TURN_DURATION : 0.9,
      ease: [0.45, 0.05, 0.15, 0.9],
      onComplete: () => {
        if (commit) completePageFlip(start.dir);
        else setIsFlipping(null);
      },
    });
  };

  const handlePagePointerCancel = () => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setDragging(false);
    animate(flipProgress, 0, {
      duration: 0.9,
      ease: "easeOut",
      onComplete: () => setIsFlipping(null),
    });
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
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
            <div className="flex flex-wrap items-center justify-center gap-2">
              {socialShares.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share on ${s.label}`}
                  title={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition duration-200 hover:scale-110 hover:shadow-md"
                  style={{ backgroundColor: `${s.color}1A`, color: s.color }}
                >
                  <BrandIcon path={s.path} className="w-4 h-4" />
                </a>
              ))}
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
              <span className="font-light">{loadingPdf ? issue.pages : totalPages} {t.pages}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal leading-normal py-1.5">
              {displayTitle}
            </h1>
          </div>

          <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
            {displayDesc}
          </p>

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
              /* Kindle-style Book Reader */
              <div className="w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-border-subtle flex flex-col items-center justify-between min-h-[720px] shadow-2xl relative select-none">
                
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

                {/* 2. Kindle Book Reading Area */}
                <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#2c2c2c,_#1a1a1a)] min-h-[520px]">

                  {loadingPdf ? (
                    <div className="flex flex-col items-center justify-center text-white space-y-4 text-xs">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-medium animate-pulse">{t.loading}</p>
                    </div>
                  ) : pageImages.length > 0 ? (
                    /* The Book */
                    <div
                      className="relative"
                      style={{
                        width: isDesktop ? "min(88vw, 820px)" : "min(88vw, 540px)",
                        aspectRatio: isDesktop ? String(pageAspect * 2) : String(pageAspect),
                        transform: `scale(${zoom})`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* Device bezel */}
                      <div className="absolute -inset-4 sm:-inset-6 rounded-2xl bg-gradient-to-br from-[#3c3c3c] via-[#1d1d1d] to-[#0a0a0a] shadow-[0_30px_70px_-18px_rgba(0,0,0,0.9)] ring-1 ring-white/10" />
                      {/* Book cover body */}
                      <div className="absolute inset-0 rounded-md bg-[#0d0d0d] p-2 sm:p-3 shadow-inner">
                        {/* Page block */}
                        <div className="relative w-full h-full rounded-[3px] bg-[#f6f1e6] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.5)]">
                          {/* Paper texture wash */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.5), rgba(0,0,0,0) 65%), linear-gradient(180deg, rgba(0,0,0,0.05), rgba(255,255,255,0.28) 50%, rgba(0,0,0,0.06))" }}
                          />
                          {/* Binding / spine shadows */}
                          {isDesktop ? (
                            <>
                              <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/25 via-black/5 to-transparent z-10 pointer-events-none" />
                              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 z-10 pointer-events-none" />
                              <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/25 via-black/5 to-transparent z-10 pointer-events-none" />
                            </>
                          ) : (
                            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/25 via-black/5 to-transparent z-10 pointer-events-none" />
                          )}

                          {/* Page stack: two-page spread on desktop, single page on mobile */}
                          <div
                            className={`relative w-full h-full preserve-3d ${dragging ? "cursor-grabbing" : "cursor-pointer"}`}
                            style={{ perspective: "2600px", touchAction: "pan-y" }}
                            onPointerDown={handlePagePointerDown}
                            onPointerMove={handlePagePointerMove}
                            onPointerUp={handlePagePointerUp}
                            onPointerCancel={handlePagePointerCancel}
                          >
                            {isDesktop ? (
                              <>
                                <div className="absolute top-0 bottom-0 left-0 w-1/2">
                                  {getPageUrl(underlayLeft) && (
                                    <img src={getPageUrl(underlayLeft)} draggable={false} className="absolute inset-0 w-full h-full object-contain select-none" alt={`Page ${underlayLeft}`} />
                                  )}
                                </div>
                                <div className="absolute top-0 bottom-0 right-0 w-1/2">
                                  {getPageUrl(underlayRight) && (
                                    <img src={getPageUrl(underlayRight)} draggable={false} className="absolute inset-0 w-full h-full object-contain select-none" alt={`Page ${underlayRight}`} />
                                  )}
                                </div>
                              </>
                            ) : (
                              getPageUrl(underlayLeft) && (
                                <img src={getPageUrl(underlayLeft)} draggable={false} className="absolute inset-0 w-full h-full object-contain select-none" alt={`Page ${underlayLeft}`} />
                              )
                            )}

                            {/* Turning sheet + sweeping underlay shadow */}
                            {isFlipping && (
                              <>
                                <UnderlayShade progress={flipProgress} dir={isFlipping} />
                                <TurningPage
                                  dir={isFlipping}
                                  frontUrl={getPageUrl(sheetFront)}
                                  backUrl={getPageUrl(sheetBack)}
                                  progress={flipProgress}
                                  half={isDesktop}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
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
                      {isDesktop ? `${underlayLeft} - ${underlayRight} / ${totalPages}` : `${underlayLeft} / ${totalPages}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <button 
                      onClick={handleNextPage} 
                      disabled={(flipPage >= maxLeft || isFlipping || loadingPdf)}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.nextPage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => !isFlipping && setFlipPage(maxLeft)} 
                      disabled={(flipPage >= maxLeft || isFlipping || loadingPdf)}
                      className="p-1.5 rounded hover:bg-white/10 hover:text-white disabled:opacity-20 cursor-pointer"
                      title={t.lastPage}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline CSS styling inject */}
                <style jsx global>{`
                  img {
                    -webkit-user-drag: none;
                    -khtml-user-drag: none;
                    user-drag: none;
                    user-select: none;
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
              /* Standard PDF View - opens directly as a scrollable document */
              <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-border-subtle flex flex-col min-h-[500px]">
                {/* Top bar: document title with the download button on the side */}
                <div className="w-full bg-[#2a2a2a] px-4 py-2.5 border-b border-white/5 flex items-center justify-between gap-3 text-white/80 text-xs">
                  <span className="font-serif truncate font-bold text-secondary">
                    {t.pdfReaderTitle}
                  </span>
                  <a
                    href={issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf"}
                    download
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs font-semibold text-white transition cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> {t.downloadPdf}
                  </a>
                </div>

                {/* Scrollable document body */}
                <div className="flex-1 max-h-[70vh] overflow-y-auto p-6 sm:p-10 bg-[radial-gradient(ellipse_at_center,_#2c2c2c,_#1a1a1a)]">
                  {loadingPdf ? (
                    <div className="flex flex-col items-center justify-center text-white space-y-4 text-xs min-h-[400px]">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-medium animate-pulse">{t.loading}</p>
                    </div>
                  ) : pageImages.length > 0 ? (
                    <div className="flex flex-col items-center gap-6">
                      {pageImages.map((_, i) => (
                        <div key={i} className="relative w-full max-w-2xl">
                          <img
                            src={getPageUrl(i + 1)}
                            alt={`Page ${i + 1}`}
                            draggable={false}
                            className="w-full h-auto rounded shadow-2xl select-none"
                          />
                          <span className="absolute bottom-2.5 right-3 bg-white/80 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-sans font-bold text-charcoal/60">
                            {i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white text-center space-y-4 min-h-[400px]">
                      <FileText className="w-12 h-12 text-primary" />
                      <p className="text-xs font-light">{t.pdfLoadError}</p>
                      <a
                        href={issue.pdfUrl && issue.pdfUrl.includes(".pdf") ? issue.pdfUrl : "/sample pdf.pdf"}
                        download
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" /> {t.downloadPdf}
                      </a>
                    </div>
                  )}
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
        <div className="border-t border-border-subtle pt-10 mt-10 space-y-6">
          <SectionHeading title={t.related} subtitle={t.relatedSub} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
