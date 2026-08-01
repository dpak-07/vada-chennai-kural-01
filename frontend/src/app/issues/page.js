import IssuesListClient from "./IssuesListClient";
import issuesData from "@/data/issues.json";

export const metadata = {
  title: "இதழ்கள் காப்பகம் | Issues Archive",
  description: "வடசென்னை குரல் இதழின் முந்தைய வெளியீடுகள் மற்றும் ஆவணக் காப்பகம். அனைத்து இதழ்களையும் ஆன்லைனில் வாசிக்கலாம் மற்றும் பதிவிறக்கம் செய்யலாம்.",
  keywords: ["Vadachennai Kural Issues", "வடசென்னை குரல் இதழ்கள்", "Tamil Magazine PDF", "Tamil digital magazine download"],
  alternates: {
    canonical: "/issues",
  },
};

export default function IssuesPage() {
  return (
    <IssuesListClient initialIssues={issuesData} />
  );
}
