import { MetadataRoute } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { BlogPost } from '@/lib/types';

const BASE_URL = 'https://miftahul.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch all blog posts from Firestore
  const postsQuery = query(collection(firestore, 'posts'), orderBy('publishedAt', 'desc'));
  const querySnapshot = await getDocs(postsQuery);
  const posts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));

  // Create sitemap entries for each blog post
  const postEntries: MetadataRoute.Sitemap = posts.map(({ slug, publishedAt }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: publishedAt ? new Date(publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Define static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
        url: `${BASE_URL}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
    },
    {
        url: `${BASE_URL}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
    {
        url: `${BASE_URL}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
  ];

  // Combine static pages and blog post entries
  return [
    ...staticPages,
    ...postEntries,
  ];
}
