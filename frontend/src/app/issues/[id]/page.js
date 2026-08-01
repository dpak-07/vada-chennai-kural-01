import IssueDetailsClient from "./IssueDetailsClient";
import issuesData from "@/data/issues.json";
import { notFound } from "next/navigation";

// Generate Static Params for SSR Pre-rendering
export async function generateStaticParams() {
  return issuesData.map((issue) => ({
    id: issue.id,
  }));
}

// Generate SEO Metadata for dynamic issue details pages
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const issue = issuesData.find((i) => i.id === resolvedParams.id);
  
  if (!issue) {
    return {
      title: "இதழ் காணப்படவில்லை | Issue Not Found",
    };
  }

  return {
    title: `${issue.title} - ${issue.month}`,
    description: issue.description,
    keywords: [issue.title, issue.month, "Vadachennai Kural Magazine", "வடசென்னை குரல்"],
    alternates: {
      canonical: `/issues/${issue.id}`,
    },
    openGraph: {
      title: `${issue.title} - ${issue.month}`,
      description: issue.description,
      images: [
        {
          url: issue.coverImage,
          alt: issue.title,
        },
      ],
    },
    twitter: {
      title: `${issue.title} - ${issue.month}`,
      description: issue.description,
      images: [issue.coverImage],
    },
  };
}

export default async function IssueDetailsPage({ params }) {
  const resolvedParams = await params;
  const issue = issuesData.find((i) => i.id === resolvedParams.id);

  if (!issue) {
    notFound();
  }

  // Get related issues (excluding the current one)
  const relatedIssues = issuesData
    .filter((i) => i.id !== issue.id)
    .slice(0, 3);

  return (
    <IssueDetailsClient issue={issue} relatedIssues={relatedIssues} />
  );
}
