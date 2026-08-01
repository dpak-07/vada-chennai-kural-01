"use client";
import IssueCard from "../ui/IssueCard";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RecentIssuesGrid({ issues }) {
  const { lang } = useLanguage();
  
  // Limit to first 3 issues
  const displayIssues = issues.slice(0, 3);

  const t = {
    ta: {
      btnText: "அனைத்து இதழ்களையும் காண்க"
    },
    en: {
      btnText: "View All Issues"
    }
  }[lang];

  return (
    <div className="space-y-12">
      {/* Issues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {/* Archive CTA */}
      <div className="text-center pt-4">
        <Button href="/issues" variant="outline" className="group flex items-center justify-center gap-2 mx-auto cursor-pointer">
          {t.btnText}{" "}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
