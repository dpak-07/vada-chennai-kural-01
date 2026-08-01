"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function GlobalLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide header and footer for admin pages and login screens to allow clean dashboards
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isDashboard) {
    return <div className="flex-1 flex flex-col">{children}</div>;
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
