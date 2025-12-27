"use client"

import React from "react";
import styles from "./footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaSoundcloud, FaWhatsapp, FaTiktok, FaLinkedinIn } from "react-icons/fa6";

type SocialLink = {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
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
  generalSettings?: any;
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "fb", name: "Facebook", icon: <FaFacebookF />, url: "https://facebook.com/cacmountzion", color: "#1877F2" },
  { id: "ig", name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com/cacmountzion", color: "#E4405F" },
  { id: "tw", name: "Twitter", icon: <FaTwitter />, url: "https://twitter.com/cacmountzion", color: "#1DA1F2" },
  { id: "yt", name: "YouTube", icon: <FaYoutube />, url: "https://youtube.com/@cacmountzion", color: "#FF0000" },
  { id: "sc", name: "SoundCloud", icon: <FaSoundcloud />, url: "https://soundcloud.com/cacmountzion", color: "#FF5500" },
  { id: "wa", name: "WhatsApp", icon: <FaWhatsapp />, url: "https://wa.me/2348036138443", color: "#25D366" },
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
  generalSettings
}: FooterProps) {
  const linksColumn1 = exploreLinks.slice(0, 4);
  const linksColumn2 = exploreLinks.slice(4);

  const displayAddress = generalSettings?.churchAddress || address;
  const displayPhone = generalSettings?.contactDetails?.phone || phone;
  const displayEmail = generalSettings?.contactDetails?.email || email;

  const displaySocials = generalSettings ? [
    { id: "fb", name: "Facebook", icon: <FaFacebookF />, url: generalSettings.socialHandles?.facebook || DEFAULT_SOCIALS[0].url, color: "#1877F2" },
    { id: "ig", name: "Instagram", icon: <FaInstagram />, url: generalSettings.socialHandles?.instagram || DEFAULT_SOCIALS[1].url, color: "#E4405F" },
    { id: "tw", name: "Twitter", icon: <FaTwitter />, url: generalSettings.socialHandles?.twitter || DEFAULT_SOCIALS[2].url, color: "#1DA1F2" },
    { id: "yt", name: "YouTube", icon: <FaYoutube />, url: generalSettings.socialHandles?.youtube || DEFAULT_SOCIALS[3].url, color: "#FF0000" },
    ...(generalSettings.socialHandles?.soundCloud ? [{ id: "sc", name: "SoundCloud", icon: <FaSoundcloud />, url: generalSettings.socialHandles.soundCloud, color: "#FF5500" }] : []),
    // ...(generalSettings.socialHandles?.whatsapp ? [{ id: "wa", name: "WhatsApp", icon: <FaWhatsapp />, url: generalSettings.socialHandles.whatsapp, color: "#25D366" }] : []),
    ...(generalSettings.socialHandles?.tiktok ? [{ id: "tk", name: "TikTok", icon: <FaTiktok />, url: generalSettings.socialHandles.tiktok, color: "#000000" }] : []),
    ...(generalSettings.socialHandles?.linkedin ? [{ id: "li", name: "LinkedIn", icon: <FaLinkedinIn />, url: generalSettings.socialHandles.linkedin, color: "#0A66C2" }] : []),
  ] : socials;

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
            {generalSettings?.contactDetails ?
              <>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📍</span>
                    <div className={styles.contactText}>
                      <p className={styles.contactLabel}>Address</p>
                      <a
                        href={`https://www.google.com/maps?q=${displayAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactValue}
                      >
                        {displayAddress}
                      </a>
                    </div>
                  </div>

                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📞</span>
                    <div className={styles.contactText}>
                      <p className={styles.contactLabel}>Phone</p>
                      <a href={`tel:${displayPhone}`} className={styles.contactValue}>
                        {displayPhone}
                      </a>
                    </div>
                  </div>

                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>✉️</span>
                    <div className={styles.contactText}>
                      <p className={styles.contactLabel}>Email</p>
                      <a href={`mailto:${displayEmail}`} className={styles.contactValue}>
                        {displayEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Links */}

                <div className={styles.socialContainer}>
                  <p className={styles.followText}>Follow Us</p>
                  <div className={styles.socialLinks}>
                    {displaySocials.map((social: SocialLink) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <span className={styles.socialIcon} style={{ color: social.color }}>
                          {social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                  {/* Divider */}
                  <div className={styles.divider} />

                  {/* Copyright & Bottom Section */}

                </div>


              </>
              : null}
          </div>
        </div>
      </div>
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
