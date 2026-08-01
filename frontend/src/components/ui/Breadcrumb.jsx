"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Breadcrumb({ items }) {
  const { lang } = useLanguage();
  const home = lang === "ta" ? "முகப்பு" : "Home";

  return (
    <nav className="flex mb-8" aria-label={lang === "ta" ? "முகப்புப் பாதை" : "Breadcrumb"}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-xs md:text-sm font-sans font-medium text-charcoal/50">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center hover:text-primary transition-colors">
            <Home className="w-4 h-4 mr-2" />
            {home}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path || index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-charcoal/30 mx-1 shrink-0" />
              {isLast ? (
                <span className="text-charcoal font-semibold max-w-[200px] md:max-w-xs truncate" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-primary transition-colors max-w-[150px] md:max-w-xs truncate">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
