import issuesData from "@/data/issues.json";

export default async function sitemap() {
  const baseUrl = "https://vadachennaikural.com";

  // Base pages
  const routes = ["", "/issues", "/about", "/contact", "/editorial"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Issue dynamic details pages
  const issueRoutes = issuesData.map((issue) => ({
    url: `${baseUrl}/issues/${issue.id}`,
    lastModified: issue.date,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...routes, ...issueRoutes];
}
