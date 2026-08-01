"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { EASE_OUT } from "@/lib/motion";

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-charcoal hover:bg-secondary-hover shadow-sm hover:shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <motion.span
          whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.2, ease: EASE_OUT } }}
          whileTap={{ scale: 0.96, transition: { duration: 0.1, ease: EASE_OUT } }}
          className={buttonClasses}
          {...props}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.2, ease: EASE_OUT } }}
      whileTap={{ scale: 0.96, transition: { duration: 0.1, ease: EASE_OUT } }}
      className={buttonClasses}
      {...props}
    >
      {children}
    </motion.button>
  );
}
