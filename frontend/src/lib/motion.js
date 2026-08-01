// Shared professional motion presets for framer-motion.
// All animations animate ONLY transform/opacity (GPU friendly - no layout jank).

// Smooth, balanced deceleration (easeOutCubic) - the default for reveals
export const EASE_OUT = [0.33, 1, 0.68, 1];

// Material "standard" easing - buttery in-and-out for panels/overlays
export const EASE_STANDARD = [0.4, 0, 0.2, 1];

// Gentle settle for subtle elements
export const EASE_SOFT = [0.4, 0, 0.2, 1];

export const VIEWPORT_ONCE = { once: true, amount: 0.15, margin: "-40px" };

export const springLift = (distance = -8) => ({
  type: "spring",
  stiffness: 300,
  damping: 26,
});

// Stagger container for grids / grouped reveals
export const staggerContainer = (stagger = 0.1, delayChildren = 0.06) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Single stagger item
export const staggerItem = ({ y = 26, x = 0, duration = 0.55 } = {}) => ({
  hidden: { opacity: 0, y, x },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration, ease: EASE_OUT },
  },
});

// Masked text reveal (wrap in overflow-hidden container)
export const maskReveal = (duration = 0.6) => ({
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration, ease: EASE_OUT },
  },
});

// Growing accent line
export const lineGrow = (duration = 0.5, delay = 0.1) => ({
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration, delay, ease: EASE_OUT },
  },
});
