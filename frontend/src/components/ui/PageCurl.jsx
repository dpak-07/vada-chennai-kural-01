"use client";
import { motion, useTransform } from "framer-motion";

// Number of vertical slices used to simulate the curved page, and the total
// bow (degrees) the sheet gains mid-turn before flattening again.
export const CURL_STRIPS = 36;
export const CURL_MAX_DEG = 70;

// Bend profile: instead of each slice bending by the same amount (a perfect
// circular arc), the rotation is weighted so the curvature concentrates near
// the free (leading) edge of the sheet and stays nearly flat by the spine.
// This reproduces the "paper curl" look of a page being lifted and turned:
// `t = (i+1)/N` ranges 0..1 across the sheet and the weight is `t^2`, so the
// last slice carries most of the bend while the first slices barely move.
const CURL_WEIGHTS = (() => {
  const w = [];
  let sum = 0;
  for (let i = 0; i < CURL_STRIPS; i++) {
    const t = (i + 1) / CURL_STRIPS;
    const wt = t * t;
    w.push(wt);
    sum += wt;
  }
  return { w, sum };
})();

// One segment of the turning page. Segments are NESTED so each shares an edge
// with its neighbour, which keeps the curved surface continuous (no gaps, no
// visible "grid" of strip seams). Each segment only covers its own vertical
// band; nesting one inside another at the shared edge builds the smooth curled
// arc. A soft inset shadow at each band edge hides the creases so the sheet
// reads as one continuous curved surface.
function CurlStrip({ index, side, sliceCenter, frontUrl, backUrl, bow, isNext, children }) {
  const isRoot = index === 0;
  const origin = `${side === "left" ? "left" : "right"} center`;
  const edgeShadow = "inset -3px 0 4px -3px rgba(0,0,0,0.45), inset 3px 0 4px -3px rgba(0,0,0,0.45)";
  const rot = useTransform(bow, (v) => {
    const deg = ((v * CURL_MAX_DEG) / CURL_WEIGHTS.sum) * CURL_WEIGHTS.w[index];
    return `rotateY(${isNext ? -deg : deg}deg)`;
  });
  return (
    <div
      className="absolute top-0 bottom-0"
      style={{
        [side === "left" ? "left" : "right"]: isRoot ? 0 : "100%",
        width: isRoot ? `${100 / CURL_STRIPS}%` : "100%",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transformOrigin: origin,
        transform: rot,
      }}
    >
      {/* Front slice */}
      <div
        className="absolute inset-0 backface-hidden"
        style={{
          backgroundColor: "#f6f1e6",
          backgroundImage: frontUrl ? `url(${frontUrl})` : undefined,
          backgroundSize: `${CURL_STRIPS * 100}% 100%`,
          backgroundPosition: `${sliceCenter * 100}% 0`,
          backgroundRepeat: "no-repeat",
          boxShadow: edgeShadow,
        }}
      />
      {/* Back slice (mirrored so it reads normally after the fold) */}
      <div
        className="absolute inset-0 backface-hidden"
        style={{
          transform: "rotateY(180deg)",
          backgroundColor: "#f6f1e6",
          backgroundImage: backUrl ? `url(${backUrl})` : undefined,
          backgroundSize: `${CURL_STRIPS * 100}% 100%`,
          backgroundPosition: `${(1 - sliceCenter) * 100}% 0`,
          backgroundRepeat: "no-repeat",
          boxShadow: edgeShadow,
        }}
      />
      {children}
    </div>
  );
}

// A single book page that turns over the spine. `progress` is a motion value in
// 0..1 owned by the parent (0 = flat on the book, 1 = fully turned over). While
// the user drags, the parent writes the cursor position straight into it so the
// page locks to the mouse; on release the parent animates it to either 1 or 0.
// The sheet bows out mid-turn (peak at progress 0.5) with the bend concentrated
// at the leading edge (paper-curl profile) and flattens as the turn completes.
// On the desktop two-page spread (`half`) the sheet only covers the flipping
// half and pivots around the center spine.
export function TurningPage({ dir, frontUrl, backUrl, progress, half = false }) {
  const isNext = dir === "next";
  const side = isNext ? "left" : "right";
  const bow = useTransform(progress, (v) => Math.sin(v * Math.PI));
  const containerRotate = useTransform(progress, (v) => (isNext ? -v * 180 : v * 180));

  const buildChain = (index) => {
    if (index >= CURL_STRIPS) return null;
    const slice = isNext ? index : CURL_STRIPS - 1 - index;
    const sliceCenter = (slice + 0.5) / CURL_STRIPS;
    return (
      <CurlStrip
        key={index}
        index={index}
        side={side}
        sliceCenter={sliceCenter}
        frontUrl={frontUrl}
        backUrl={backUrl}
        bow={bow}
        isNext={isNext}
      >
        {buildChain(index + 1)}
      </CurlStrip>
    );
  };

  return (
    <motion.div
      className="absolute top-0 bottom-0 z-20 pointer-events-none"
      style={{
        ...(half
          ? { width: "50%", [isNext ? "left" : "right"]: "50%" }
          : { left: 0, right: 0 }),
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transformOrigin: `${side} center`,
        rotateY: containerRotate,
        willChange: "transform",
      }}
    >
      {buildChain(0)}

      {/* Page lighting: dim near the spine, brighten toward the free edge so
          the sheet reads as a sheet catching light while it lifts */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "translateZ(2px)",
          background: `linear-gradient(${isNext ? "to right" : "to left"}, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 20%, rgba(255,255,255,0.05) 72%, rgba(255,255,255,0.2) 100%)`,
        }}
      />

      {/* Fold shading along the leading edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "translateZ(3px)",
          background: `linear-gradient(${isNext ? "to right" : "to left"}, rgba(0,0,0,0) 30%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0.42) 86%, rgba(0,0,0,0.5) 100%)`,
        }}
      />

      {/* Bright paper edge highlight on the free edge */}
      <div
        className="absolute top-0 bottom-0 w-[3px] pointer-events-none"
        style={{
          transform: "translateZ(4px)",
          [isNext ? "right" : "left"]: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0) 100%)",
          filter: "blur(0.5px)",
        }}
      />

      {/* Lift shadow pooling near the spine while the sheet is in the air */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "translateZ(1px)",
          background: `linear-gradient(${isNext ? "to right" : "to left"}, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 20%)`,
        }}
      />
    </motion.div>
  );
}

// Moving shadow: while the sheet turns, a soft arc sweeps across the page
// underneath, travelling from the spine to the outer edge and fading back out
// as the turn completes.
export function UnderlayShade({ progress, dir }) {
  const shadeOpacity = useTransform(progress, (v) => Math.sin(Math.max(0, Math.min(v, 1)) * Math.PI) * 0.6);
  const shadeArc = useTransform(progress, (v) => {
    const t = Math.max(0, Math.min(v, 1));
    const pos = dir === "next" ? 50 + t * 50 : 50 - t * 50;
    return `radial-gradient(ellipse at ${pos}% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0) 55%)`;
  });
  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ opacity: shadeOpacity, background: shadeArc }}
    />
  );
}
