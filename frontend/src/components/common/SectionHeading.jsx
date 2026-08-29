"use client";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, lineGrow } from "@/lib/motion";

export default function SectionHeading({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.12, 0.05)}
      >
        {subtitle && (
          <motion.span
            variants={staggerItem({ y: 12, duration: 0.45 })}
            className="text-[#800020] font-sans font-black tracking-[0.2em] text-[11px] uppercase block mb-2"
          >
            ✦ {subtitle} ✦
          </motion.span>
        )}

        <div className={centered ? "flex flex-col items-center" : ""}>
          <div className="overflow-hidden pb-1.5">
            <motion.h2
              variants={staggerItem({ y: "105%", duration: 0.55 })}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#121216] tracking-tight relative inline-block"
            >
              {title}
            </motion.h2>
          </div>
          <div className={`flex items-center gap-1.5 mt-1 ${centered ? "justify-center" : ""}`}>
            <motion.span
              variants={lineGrow(0.45, 0.1)}
              className={`block h-1 bg-[#800020] rounded-full origin-left ${
                centered ? "w-16" : "w-14"
              }`}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
