"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CinematicLoader({ onComplete }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Listen to the browser's window load event to verify everything is rendered/downloaded
    const handlePageLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === "complete") {
      setIsPageLoaded(true);
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    // 2. Minimum screen display duration of 1.8 seconds for smooth typewriter effect
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1800);

    return () => {
      window.removeEventListener("load", handlePageLoad);
      clearTimeout(minTimer);
    };
  }, []);

  // 3. Trigger the panel exit animations once BOTH page is loaded and min time has passed
  useEffect(() => {
    if (isPageLoaded && minTimeElapsed) {
      setIsExiting(true);
      
      // Complete transition after panels slide up (700ms)
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 700);

      return () => clearTimeout(completeTimer);
    }
  }, [isPageLoaded, minTimeElapsed, onComplete]);

  if (!isMounted) return null;

  const columnVariants = (delay) => ({
    initial: { y: "0%" },
    exit: { 
      y: "-100%",
      transition: { 
        duration: 0.7, 
        ease: [0.76, 0, 0.24, 1],
        delay: delay 
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none bg-canvas">
      
      {/* Staggered Sliding Columns for exit transition */}
      <div className="absolute inset-0 grid grid-cols-3 w-full h-full z-0">
        <motion.div 
          variants={columnVariants(0)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
        <motion.div 
          variants={columnVariants(0.08)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
        <motion.div 
          variants={columnVariants(0.16)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
      </div>

      {/* Brand Logo & Spinner Masked Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center select-none">
        
        {/* Animated Brand Crest Container */}
        <div className="relative flex items-center justify-center">
          {/* Rotating dashed border ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={isExiting 
              ? { opacity: 0, scale: 0.8, rotate: 0, transition: { duration: 0.3 } }
              : { opacity: 1, scale: [1, 1.04, 1], rotate: 360 }
            }
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.8, ease: "easeOut" }
            }}
            className="absolute w-[180px] h-[180px] md:w-[230px] md:h-[230px] rounded-full border border-dashed border-primary/30 z-0"
            style={{ borderDasharray: "4 4" }}
          />

          {/* Actual brand logo crest */}
          <motion.img
            src="/logo/vadachennai%20kural%20logo.jpg"
            alt="Vadachennai Kural Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isExiting
              ? { scale: 0.8, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
              : { scale: [1, 1.06, 1], opacity: 1 }
            }
            transition={{
              scale: isExiting 
                ? { duration: 0.4, ease: "easeIn" } 
                : { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.1 },
              opacity: { duration: 0.8, ease: "easeOut", delay: 0.1 }
            }}
            className="w-36 h-36 md:w-48 md:h-48 object-contain rounded-full shadow-lg bg-white border border-primary/10 z-10"
          />
        </div>

        {/* Text Fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isExiting
            ? { opacity: 0, y: -15, transition: { duration: 0.4 } }
            : { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } }
          }
          className="mt-6 space-y-1"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-black text-primary tracking-wide">
            வடசென்னை குரல்
          </h2>
          <p className="font-sans text-[8px] md:text-[9px] tracking-widest text-secondary font-bold uppercase">
            VADACHENNAI KURAL TAMIL DIGITAL MAGAZINE
          </p>
        </motion.div>

        {/* Elegant loading progress indicator line */}
        <div className="overflow-hidden mt-4 h-[1px] w-24 relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isExiting 
              ? { opacity: 0 }
              : { scaleX: 1, transition: { duration: 1.2, ease: "easeInOut", delay: 0.3 } }
            }
            className="absolute inset-0 bg-primary origin-center"
          />
        </div>
      </div>
      
    </div>
  );
}
