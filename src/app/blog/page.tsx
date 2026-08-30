import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Parent Resources & Blog | Little Star Nursery & Primary School Nerkundram',
  description:
    'Educational insights, parenting tips & preschool advice for parents in Nerkundram, Kodambakkam, Koyambedu & Chennai. Read articles on choosing nursery schools, daycare & early learning.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/blog',
  },
  openGraph: {
    title: 'Parent Resources & Blog | Little Star Nursery & Primary School Nerkundram',
    description:
      'Explore expert early childhood guidance, parenting tips, preschool checklists, and education articles for parents in Chennai.',
    url: 'https://www.littlestarnpschool.com/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <Breadcrumbs items={[{ name: 'Parent Resources & Blog', url: '/blog' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Parenting &amp; Education Guides</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Parent Resources &amp; Education Blog
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Helpful guides, expert advice, preschool selection checklists, and parenting tips to support your child&apos;s educational journey in Nerkundram, Chennai.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {blogPosts.map((post) => (
              <article key={post.slug} className="card" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.85rem' }}>
                    <span style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>{post.category}</span>
                    <span style={{ color: '#888' }}>{post.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', color: '#4C1D95', marginBottom: '10px', lineHeight: 1.4 }}>
                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: '#4C1D95' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #EEE', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>By {post.author}</span>
                  <Link href={`/blog/${post.slug}`} style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                    Read Article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
