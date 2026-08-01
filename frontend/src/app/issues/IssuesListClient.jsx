"use client";
import { useState, useMemo } from "react";
import SearchBar from "@/components/ui/SearchBar";
import IssueCard from "@/components/ui/IssueCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ITEMS_PER_PAGE = 6;

export default function IssuesListClient({ initialIssues }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { lang } = useLanguage();

  const t = {
    ta: {
      breadcrumb: "இதழ்கள்",
      title: "இதழ்கள் காப்பகம்",
      subtitle: "அனைத்து வெளியீடுகளும்",
      noIssuesTitle: "இதழ்கள் ஏதும் இல்லை",
      noIssuesText: "தங்கள் தேடலுக்குப் பொருத்தமான இதழ்கள் எதுவும் இல்லை. தயவுசெய்து வேறு வார்த்தைகளை உள்ளிடவும்.",
      prevPage: "முந்தைய பக்கம்",
      nextPage: "அடுத்த பக்கம்"
    },
    en: {
      breadcrumb: "Issues",
      title: "Magazine Archive",
      subtitle: "ALL ISSUES",
      noIssuesTitle: "No Issues Found",
      noIssuesText: "No issues match your search criteria. Please try using different keywords.",
      prevPage: "Previous Page",
      nextPage: "Next Page"
    }
  }[lang];

  // Filter issues based on search query
  const filteredIssues = useMemo(() => {
    setCurrentPage(1); // Reset page on search
    if (!searchQuery.trim()) return initialIssues;
    
    const query = searchQuery.toLowerCase();
    return initialIssues.filter((issue) => {
      const matchTitle = issue.title.toLowerCase().includes(query);
      const matchMonth = issue.month.toLowerCase().includes(query);
      const matchFeatures = issue.features?.some(f => f.toLowerCase().includes(query)) || false;
      return matchTitle || matchMonth || matchFeatures;
    });
  }, [searchQuery, initialIssues]);

  // Paginated issues
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ name: t.breadcrumb, path: "/issues" }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <SectionHeading
          title={t.title}
          subtitle={t.subtitle}
        />
        
        {/* Search Input */}
        <div className="w-full md:max-w-xs">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-subtle p-16 text-center space-y-4 max-w-md mx-auto">
          <Inbox className="w-12 h-16 text-gray-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">{t.noIssuesTitle}</h3>
          <p className="text-xs text-charcoal/60 leading-relaxed font-light">
            {t.noIssuesText}
          </p>
        </div>
      ) : (
        <>
          {/* Masonry grid: cards keep their cover's natural aspect ratio and
              auto-fill the columns so no empty gaps are left behind. */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {paginatedIssues.map((issue, i) => (
              <div key={issue.id} className="mb-6 break-inside-avoid">
                <IssueCard issue={issue} index={i} />
              </div>
            ))}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-md border border-border-subtle hover:border-primary text-charcoal/60 hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label={t.prevPage}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                const isActive = currentPage === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-md font-sans text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white"
                        : "border border-border-subtle hover:border-primary text-charcoal/60 hover:text-primary"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-md border border-border-subtle hover:border-primary text-charcoal/60 hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label={t.nextPage}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
