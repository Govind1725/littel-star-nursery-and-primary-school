import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.littlestarnpschool.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/nursery-school', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/primary-school', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/play-school', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/daycare', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/tuition-centre', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/admissions', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/activities', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/gallery', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/announcements', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/child-care', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
