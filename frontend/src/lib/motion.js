// Shared professional motion presets for framer-motion.
// All animations animate ONLY transform/opacity (GPU friendly - no layout jank).

// Confident, authoritative entrances (easeOutExpo)
export const EASE_OUT = [0.16, 1, 0.3, 1];

// Standard reveals (easeOutQuint)
export const EASE_STANDARD = [0.22, 1, 0.36, 1];

// Smooth settles for subtle elements
export const EASE_SOFT = [0.4, 0, 0.2, 1];

export const VIEWPORT_ONCE = { once: true, amount: 0.15, margin: "-40px" };

export const springLift = (distance = -8) => ({
  type: "spring",
  stiffness: 380,
  damping: 24,
});

// Stagger container for grids / grouped reveals
export const staggerContainer = (stagger = 0.12, delayChildren = 0.08) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Single stagger item
export const staggerItem = ({ y = 28, x = 0, duration = 0.65 } = {}) => ({
  hidden: { opacity: 0, y, x },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration, ease: EASE_OUT },
  },
});

// Masked text reveal (wrap in overflow-hidden container)
export const maskReveal = (duration = 0.8) => ({
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration, ease: EASE_OUT },
  },
});

// Growing accent line
export const lineGrow = (duration = 0.7, delay = 0) => ({
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration, delay, ease: EASE_OUT },
  },
});
