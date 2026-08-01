"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_OUT, VIEWPORT_ONCE, springLift } from "@/lib/motion";

export default function TeamCard({ member, index = 0 }) {
  const { name, role, description, photo } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE_OUT }}
      whileHover={{ y: -6, transition: springLift(-6) }}
      className="bg-white rounded-xl overflow-hidden shadow-md border border-border-subtle flex flex-col items-center text-center p-6 w-full max-w-md mx-auto transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Portrait Wrap */}
      <motion.div
        whileHover={{ scale: 1.05, transition: springLift(0) }}
        className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-secondary/20 bg-gray-50 shrink-0"
      >
        <Image
          src={photo}
          alt={name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </motion.div>

      {/* Profile Info */}
      <h3 className="font-serif text-lg font-bold text-charcoal mb-1">
        {name}
      </h3>
      <span className="font-sans text-xs font-semibold text-secondary uppercase tracking-widest block mb-4">
        {role}
      </span>
      <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-light flex-1">
        {description}
      </p>
    </motion.div>
  );
}
