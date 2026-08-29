"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_OUT, VIEWPORT_ONCE, springLift } from "@/lib/motion";

export default function TeamCard({ member, index = 0 }) {
  const { name, role, description, photo } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_OUT }}
      whileHover={{ y: -6, transition: springLift(-6) }}
      className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-100 hover:border-[#800020]/40 flex flex-col items-center text-center p-7 w-full transition-all duration-300 hover:shadow-xl group"
    >
      {/* Portrait Wrap */}
      <motion.div
        whileHover={{ scale: 1.05, transition: springLift(0) }}
        className="relative w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-[#800020]/20 group-hover:border-[#800020] bg-gray-50 shrink-0 transition-colors duration-300 shadow-md"
      >
        <Image
          src={photo}
          alt={name}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </motion.div>

      {/* Profile Info */}
      <h3 className="font-serif text-lg font-bold text-[#121216] group-hover:text-[#800020] transition-colors mb-1">
        {name}
      </h3>
      <span className="font-sans text-[11px] font-bold text-[#800020] bg-[#800020]/10 px-3 py-1 rounded-full uppercase tracking-wider block mb-3 border border-[#800020]/20">
        {role}
      </span>
      <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-normal flex-1">
        {description}
      </p>
    </motion.div>
  );
}
