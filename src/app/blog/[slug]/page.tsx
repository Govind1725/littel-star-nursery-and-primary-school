import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import { blogPosts, BlogPost } from '@/data/blog-posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Little Star School',
    };
  }

  return {
    title: `${post.title} | Little Star Nerkundram`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.littlestarnpschool.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Little Star School Nerkundram`,
      description: post.excerpt,
      url: `https://www.littlestarnpschool.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: SCHOOL_NAP,
    datePublished: post.date,
    mainEntityOfPage: `https://www.littlestarnpschool.com/blog/${post.slug}`,
  };

  const faqSchema = post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  } : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Breadcrumbs
        items={[
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '50px 0 60px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>{post.category}</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', margin: '16px 0', color: '#FFF', lineHeight: 1.3 }}>
            {post.title}
          </h1>
          <div style={{ fontSize: '0.95rem', opacity: 0.9, display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333' }}>
            {post.content.map((p, idx) => (
              <p key={idx} style={{ marginBottom: '20px' }}>
                {p}
              </p>
            ))}
          </div>

          {/* Key Takeaways */}
          {post.keyTakeaways.length > 0 && (
            <div style={{ background: '#FAF5FF', borderLeft: '4px solid #7C3AED', padding: '24px', borderRadius: '0 12px 12px 0', margin: '36px 0' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#4C1D95', marginBottom: '12px' }}>💡 Key Takeaways for Parents</h2>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#444', lineHeight: 1.7 }}>
                {post.keyTakeaways.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Post FAQ */}
          {post.faq.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 style={{ color: '#4C1D95', fontSize: '1.4rem', marginBottom: '16px' }}>Frequently Asked Question</h2>
              {post.faq.map((item, i) => (
                <div key={i} className="card" style={{ padding: '20px', borderRadius: '12px', background: '#FFF', marginBottom: '12px' }}>
                  <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '6px' }}>{item.q}</h3>
                  <p style={{ color: '#555', margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* Internal links CTA */}
          <div style={{ borderTop: '1px solid #EEE', marginTop: '50px', paddingTop: '30px', textAlign: 'center' }}>
            <h3 style={{ color: '#4C1D95', fontSize: '1.3rem', marginBottom: '12px' }}>Looking for Nursery or Primary School Admissions in Nerkundram?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Little Star Nursery &amp; Primary School is currently admitting students for 2026–27 academic sessions.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/admissions" className="btn-primary">Apply for Admission</Link>
              <Link href="/nursery-school" className="btn-outline">Explore Nursery Program</Link>
              <Link href="/primary-school" className="btn-outline">Explore Primary School</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
