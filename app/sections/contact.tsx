"use client"

import React from "react";
import styles from "./contact.module.css";

type ContactInfo = {
  id: string;
  label: string;
  icon: string;
  value: string;
  href?: string;
};

type SocialLink = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

const DEFAULT_CONTACTS: ContactInfo[] = [
  {
    id: "phone1",
    label: "Main Line",
    icon: "📞",
    value: "+234 (0) 123 456 7890",
    href: "tel:+2341234567890",
  },
  {
    id: "phone2",
    label: "Prayer Line",
    icon: "🙏",
    value: "+234 (0) 987 654 3210",
    href: "tel:+2349876543210",
  },
  {
    id: "email",
    label: "Email",
    icon: "✉️",
    value: "info@cacmountzion.org",
    href: "mailto:info@cacmountzion.org",
  },
  {
    id: "address",
    label: "Address",
    icon: "📍",
    value: "123 Faith Street, Mount Zion City, Nigeria",
    href: "https://www.google.com/maps?q=6.5244,3.3792",
  },
  {
    id: "hours",
    label: "Service Time",
    icon: "🕐",
    value: "Sundays 9:30 AM - 11:30 AM",
  },
  {
    id: "office",
    label: "Office Hours",
    icon: "🏢",
    value: "Monday - Friday 9:00 AM - 5:00 PM",
  },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "fb", name: "Facebook", icon: "f", url: "https://facebook.com/cacmountzion" },
  { id: "ig", name: "Instagram", icon: "📷", url: "https://instagram.com/cacmountzion" },
  { id: "tw", name: "Twitter", icon: "𝕏", url: "https://twitter.com/cacmountzion" },
  { id: "yt", name: "YouTube", icon: "▶", url: "https://youtube.com/@cacmountzion" },
];

interface ContactSectionProps {
  contacts?: ContactInfo[];
  socials?: SocialLink[];
  title?: string;
  subtitle?: string;
}

export default function ContactSection({ contacts = DEFAULT_CONTACTS, socials = DEFAULT_SOCIALS, title = "Get In Touch", subtitle = "Have questions? Reach out to us", generalSettings }: any) {

  const displayContacts = generalSettings ? [
    {
      id: "phone1",
      label: "Main Line",
      icon: "📞",
      value: generalSettings.contactDetails?.mainLine || DEFAULT_CONTACTS[0].value,
      href: generalSettings.contactDetails?.mainLine ? `tel:${generalSettings.contactDetails.mainLine.replace(/\D/g, '')}` : DEFAULT_CONTACTS[0].href,
    },
    {
      id: "phone2",
      label: "Prayer Line",
      icon: "🙏",
      value: generalSettings.contactDetails?.prayerLine || DEFAULT_CONTACTS[1].value,
      href: generalSettings.contactDetails?.prayerLine ? `tel:${generalSettings.contactDetails.prayerLine.replace(/\D/g, '')}` : DEFAULT_CONTACTS[1].href,
    },
    {
      id: "email",
      label: "Email",
      icon: "✉️",
      value: generalSettings.contactDetails?.email || DEFAULT_CONTACTS[2].value,
      href: generalSettings.contactDetails?.email ? `mailto:${generalSettings.contactDetails.email}` : DEFAULT_CONTACTS[2].href,
    },
    {
      id: "address",
      label: "Address",
      icon: "📍",
      value: generalSettings.churchAddress || DEFAULT_CONTACTS[3].value,
      href: "https://www.google.com/maps?q=" + (generalSettings.churchAddress || "6.5244,3.3792"),
    },
    {
      id: "hours",
      label: "Service Time",
      icon: "🕐",
      value: generalSettings.serviceTime || DEFAULT_CONTACTS[4].value,
    },
    {
      id: "office",
      label: "Office Hours",
      icon: "🏢",
      value: generalSettings.officeHours || DEFAULT_CONTACTS[5].value,
    },
  ] : contacts;

  const displaySocials = generalSettings ? [
    { id: "fb", name: "Facebook", icon: "f", url: generalSettings.socialHandles?.facebook || DEFAULT_SOCIALS[0].url },
    { id: "ig", name: "Instagram", icon: "📷", url: generalSettings.socialHandles?.instagram || DEFAULT_SOCIALS[1].url },
    { id: "tw", name: "Twitter", icon: "𝕏", url: generalSettings.socialHandles?.twitter || DEFAULT_SOCIALS[2].url },
    { id: "yt", name: "YouTube", icon: "▶", url: generalSettings.socialHandles?.youtube || DEFAULT_SOCIALS[3].url },
    ...(generalSettings.socialHandles?.tiktok ? [{ id: "tk", name: "TikTok", icon: "🎵", url: generalSettings.socialHandles.tiktok }] : []),
    ...(generalSettings.socialHandles?.linkedin ? [{ id: "li", name: "LinkedIn", icon: "in", url: generalSettings.socialHandles.linkedin }] : []),
  ] : socials;

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.mainContent}>
          {/* Contact Info Cards */}
          <div className={styles.contactGrid}>
            {displayContacts.map((contact: ContactInfo) => (
              <div key={contact.id} className={styles.contactCard}>
                <div className={styles.contactIcon}>{contact.icon}</div>
                <div className={styles.contactBody}>
                  <h4 className={styles.contactLabel}>{contact.label}</h4>
                  {contact.href ? (
                    <a href={contact.href} className={styles.contactValue} target={contact.id === "address" ? "_blank" : undefined} rel={contact.id === "address" ? "noopener noreferrer" : undefined}>
                      {contact.value}
                    </a>
                  ) : (
                    <p className={styles.contactValue}>{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className={styles.socialSection}>
            <h3 className={styles.socialTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              {displaySocials.map((social: SocialLink) => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title={social.name} aria-label={`Follow us on ${social.name}`}>
                  <span className={styles.socialIcon}>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
