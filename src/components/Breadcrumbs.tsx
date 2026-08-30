import Link from 'next/link';
import JsonLd from './JsonLd';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems = [
    { name: 'Home', url: 'https://www.littlestarnpschool.com/' },
    ...items.map(item => ({
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `https://www.littlestarnpschool.com${item.url}`,
    })),
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav" style={{ padding: '12px 0', fontSize: '0.9rem', color: '#666' }}>
        <div className="container">
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <li>
              <Link href="/" style={{ color: '#6D28D9', textDecoration: 'none', fontWeight: 600 }}>
                Home
              </Link>
            </li>
            {items.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#999' }}>/</span>
                {idx === items.length - 1 ? (
                  <span style={{ color: '#4C1D95', fontWeight: 700 }}>{item.name}</span>
                ) : (
                  <Link href={item.url} style={{ color: '#6D28D9', textDecoration: 'none', fontWeight: 600 }}>
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
