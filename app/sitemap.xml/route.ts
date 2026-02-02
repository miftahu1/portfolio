import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const URL = "https://www.miftahul.in";

export async function GET() {
  const postsCollection = collection(db, "posts");
  const projectsCollection = collection(db, "projects");
  
  const postsSnapshot = await getDocs(postsCollection);
  const projectsSnapshot = await getDocs(projectsCollection);
  
  const postSlugs = postsSnapshot.docs.map((doc) => doc.data().slug);
  const projectSlugs = projectsSnapshot.docs.map((doc) => doc.data().slug);

  const generateUrl = (path: string, lastmod: string, priority: number) => `
    <url>
      <loc>${URL}${path}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority}</priority>
    </url>
  `;

  const today = new Date().toISOString().split('T')[0];

  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${generateUrl("/", today, 1.0)}
      ${generateUrl("/blog", today, 0.8)}
      ${generateUrl("/projects", today, 0.7)}
      ${generateUrl("/contact", today, 0.5)}
      ${postSlugs.map((slug) => generateUrl(`/blog/${slug}`, today, 0.9)).join("")}
      ${projectSlugs.map((slug) => generateUrl(`/projects/${slug}`, today, 0.6)).join("")}
    </urlset>
  `;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
