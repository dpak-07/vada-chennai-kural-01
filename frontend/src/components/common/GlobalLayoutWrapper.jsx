"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CinematicLoader from "./CinematicLoader";

export default function GlobalLayoutWrapper({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <CinematicLoader onComplete={() => setLoading(false)} />;
  }

  // Hide header and footer for admin pages and login screens to allow clean dashboards
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isDashboard) {
    return (
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        {children}
      </main>
      <Footer />
    </div>
  );
}

