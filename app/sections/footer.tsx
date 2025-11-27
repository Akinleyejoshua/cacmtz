"use client"

import React from "react";
import styles from "./footer.module.css";

type SocialLink = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

type ExploreLink = {
  id: string;
  label: string;
  href: string;
};

type FooterProps = {
  churchName?: string;
  churchSlogan?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  socials?: SocialLink[];
  exploreLinks?: ExploreLink[];
  copyright?: string;
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "fb", name: "Facebook", icon: "f", url: "https://facebook.com/cacmountzion" },
  { id: "ig", name: "Instagram", icon: "📷", url: "https://instagram.com/cacmountzion" },
  { id: "tw", name: "Twitter", icon: "𝕏", url: "https://twitter.com/cacmountzion" },
  { id: "yt", name: "YouTube", icon: "▶", url: "https://youtube.com/@cacmountzion" },
];

const DEFAULT_EXPLORE_LINKS: ExploreLink[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About Us", href: "/#about" },
  { id: "ministers", label: "Ministers", href: "/ministers" },
  { id: "events", label: "Events", href: "/#events" },
  { id: "give", label: "Give", href: "/donate" },
  { id: "connect", label: "Connect", href: "/#contact" },
  { id: "profile", label: "Profile", href: "/profile" },
];

export default function Footer({
  churchName = "C.A.C Mount Zion",
  churchSlogan = "A Kingdom of God on Earth",
  about = "We are a vibrant community of believers committed to spreading the gospel of Jesus Christ and making disciples of all nations. Our mission is to glorify God through worship, discipleship, and service.",
  address = "123 Faith Street, Mount Zion City, Nigeria",
  phone = "+234 (0) 701 234 5678",
  email = "info@cacmountzion.org",
  socials = DEFAULT_SOCIALS,
  exploreLinks = DEFAULT_EXPLORE_LINKS,
  copyright = `© ${new Date().getFullYear()} ${churchName}. All rights reserved.`,
}: FooterProps) {
  const linksColumn1 = exploreLinks.slice(0, 4);
  const linksColumn2 = exploreLinks.slice(4);

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* About Section */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{churchName}</h3>
            <p className={styles.slogan}>{churchSlogan}</p>
            <p className={styles.aboutText}>{about}</p>
          </div>

          {/* Explore Links - Column 1 */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Explore</h4>
            <ul className={styles.linksList}>
              {linksColumn1.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links - Column 2 */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              {linksColumn2.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Connect</h4>
            
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <div className={styles.contactText}>
                  <p className={styles.contactLabel}>Address</p>
                  <a
                    href={`https://www.google.com/maps?q=${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactValue}
                  >
                    {address}
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <div className={styles.contactText}>
                  <p className={styles.contactLabel}>Phone</p>
                  <a href={`tel:${phone}`} className={styles.contactValue}>
                    {phone}
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <div className={styles.contactText}>
                  <p className={styles.contactLabel}>Email</p>
                  <a href={`mailto:${email}`} className={styles.contactValue}>
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.socialContainer}>
              <p className={styles.followText}>Follow Us</p>
              <div className={styles.socialLinks}>
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title={social.name}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Copyright & Bottom Section */}
      <div className={styles.bottomSection}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>{copyright}</p>
            <div className={styles.bottomLinks}>
              <a href="/privacy" className={styles.bottomLink}>
                Privacy Policy
              </a>
              <span className={styles.separator}>•</span>
              <a href="/terms" className={styles.bottomLink}>
                Terms of Service
              </a>
              <span className={styles.separator}>•</span>
              <a href="/sitemap" className={styles.bottomLink}>
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
