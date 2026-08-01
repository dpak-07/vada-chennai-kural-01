"use client";
import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {subtitle && (
          <span className="text-secondary font-sans font-semibold tracking-wider text-xs uppercase block mb-2">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal tracking-tight relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded"></span>
          {centered && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded"></span>
          )}
        </h2>
      </motion.div>
    </div>
  );
}
