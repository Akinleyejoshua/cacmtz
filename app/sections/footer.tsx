"use client"

import React from "react";
import Image from "next/image";
import styles from "./footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaSoundcloud, FaWhatsapp, FaTiktok, FaLinkedinIn } from "react-icons/fa6";
import { HiMapPin, HiPhone, HiEnvelope } from "react-icons/hi2";

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
  about = "We are a vibrant community of believers committed to spreading the gospel of Jesus Christ and making disciples of all nations.",
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
    ...(generalSettings.socialHandles?.tiktok ? [{ id: "tk", name: "TikTok", icon: <FaTiktok />, url: generalSettings.socialHandles.tiktok, color: "#000000" }] : []),
    ...(generalSettings.socialHandles?.linkedin ? [{ id: "li", name: "LinkedIn", icon: <FaLinkedinIn />, url: generalSettings.socialHandles.linkedin, color: "#0A66C2" }] : []),
  ] : socials;

  return (
    <footer className={styles.footer}>
      {/* Decorative Top Border */}
      <div className={styles.topBorder} />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              <Image
                src="/src/img/brand/logo.jpg"
                alt="CAC Logo"
                width={60}
                height={60}
                className={styles.logo}
              />
              <div className={styles.brandText}>
                <h3 className={styles.churchName}>{churchName}</h3>
                <p className={styles.slogan}>{churchSlogan}</p>
              </div>
            </div>
            <p className={styles.aboutText}>{about}</p>

            <div className={styles.socialWrapper}>
              {displaySocials.map((social: SocialLink) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <div className={styles.linksGrid}>
              <ul className={styles.linksList}>
                {linksColumn1.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className={styles.link}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
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
          </div>

          {/* Contact Column */}
          <div className={styles.contactColumn}>
            <h4 className={styles.columnTitle}>Get in Touch</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <HiMapPin className={styles.contactIcon} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.label}>Visit Us</span>
                  <a
                    href={`https://www.google.com/maps?q=${displayAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.value}
                  >
                    {displayAddress}
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <HiPhone className={styles.contactIcon} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.label}>Call Us</span>
                  <a href={`tel:${displayPhone}`} className={styles.value}>
                    {displayPhone}
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <HiEnvelope className={styles.contactIcon} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.label}>Email Us</span>
                  <a href={`mailto:${displayEmail}`} className={styles.value}>
                    {displayEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>{copyright}</p>
          <div className={styles.bottomLinks}>
            <a href="/privacy">Privacy Policy</a>
            <span className={styles.dot}>•</span>
            <a href="/terms">Terms of Service</a>
            <span className={styles.dot}>•</span>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
