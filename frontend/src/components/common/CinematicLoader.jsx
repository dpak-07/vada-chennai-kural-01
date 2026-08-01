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

  const words = ["VADACHENNAI", "KURAL"];

  // Column transition settings (No borders to prevent vertical lines)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* 3 Staggered Sliding Columns (Borders removed to fix thin vertical lines) */}
      <div className="absolute inset-0 grid grid-cols-3 w-full h-full z-0">
        <motion.div 
          variants={columnVariants(0)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
        <motion.div 
          variants={columnVariants(0.1)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
        <motion.div 
          variants={columnVariants(0.2)}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          className="bg-canvas w-full h-full"
        />
      </div>

      {/* Masked Text overlay in center */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center select-none">
        <div className="overflow-hidden flex flex-col md:flex-row md:space-x-4 items-center">
          {words.map((word, wordIndex) => (
            <div key={wordIndex} className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={isExiting 
                  ? { y: "-100%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
                  : { y: "0%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
                }
                className="inline-block font-serif text-3xl md:text-5xl lg:text-6xl text-charcoal font-light tracking-[0.2em] md:tracking-[0.3em] uppercase italic"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Small subtle visual indicator line expanding */}
        <div className="overflow-hidden mt-4 h-[1px] w-20 relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isExiting 
              ? { opacity: 0 }
              : { scaleX: 1, transition: { duration: 1, ease: "easeOut", delay: 0.3 } }
            }
            className="absolute inset-0 bg-primary origin-center"
          />
        </div>
      </div>
      
    </div>
  );
}
