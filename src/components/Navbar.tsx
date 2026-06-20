'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/admission', label: 'Admission' },
  { href: '/child-care', label: 'Child Care' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>⭐</span>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>Little Star</span>
            <span className={styles.logoSub}>Nursery & Primary School</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
                <span className={styles.linkUnderline} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-hamburger"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
