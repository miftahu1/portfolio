import { fetchPosts } from "@/lib/firestore";
import { Timestamp } from 'firebase/firestore';

export async function GET() {
  const posts = await fetchPosts();

  const body = `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://miftahul.in</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://miftahul.in/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://miftahul.in/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://miftahul.in/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${posts
    .map((post) => {
      const lastMod = post.updatedAt || post.createdAt;
      let lastModDate;

      if (lastMod && typeof lastMod.toDate === 'function') {
        lastModDate = lastMod.toDate();
      } else if (lastMod && lastMod.seconds !== undefined) {
        lastModDate = new Timestamp(lastMod.seconds, lastMod.nanoseconds).toDate();
      } else if (lastMod) {
        lastModDate = new Date(lastMod as any);
      } else {
        lastModDate = new Date();
      }

      if (isNaN(lastModDate.getTime())) {
        lastModDate = new Date();
      }

      return `
        <url>
          <loc>https://miftahul.in/blog/${post.slug}</loc>
          <lastmod>${lastModDate.toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `;
    })
    .join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
