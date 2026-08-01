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
            className="text-secondary font-sans font-semibold tracking-wider text-xs uppercase block mb-3"
          >
            {subtitle}
          </motion.span>
        )}

        <div className={centered ? "flex flex-col items-center" : ""}>
          <div className="overflow-hidden pb-1">
            <motion.h2
              variants={staggerItem({ y: "105%", duration: 0.55 })}
              className="text-3xl md:text-4xl font-serif font-bold text-charcoal tracking-tight relative inline-block"
            >
              {title}
            </motion.h2>
          </div>
          <motion.span
            variants={lineGrow(0.45, 0.1)}
            className={`block h-1 bg-primary rounded origin-left ${
              centered ? "mx-auto w-16" : "w-12"
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
}
