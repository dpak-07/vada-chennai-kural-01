"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TeamCard({ member }) {
  const { name, role, description, photo } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md border border-border-subtle flex flex-col items-center text-center p-6 w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg"
    >
      {/* Portrait Wrap */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-secondary/20 bg-gray-50 shrink-0">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

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
