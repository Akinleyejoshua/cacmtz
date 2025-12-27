"use client"

import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";
import { formatRelativeTime, convert24hrTo12hr, getNextOccurrence } from "../utils/helpers";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaSoundcloud, FaWhatsapp, FaTiktok, FaLinkedinIn } from "react-icons/fa6";

type SocialMedia = {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
};

interface BannerProps {
  generalSettings: any;
}

// Helper to map social handles to SocialMedia array
const mapSocialHandles = (handles: any): SocialMedia[] => {
  if (!handles) return [];
  const mapped: SocialMedia[] = [];
  if (handles.facebook) mapped.push({ id: 'fb', name: 'Facebook', icon: <FaFacebookF />, url: handles.facebook, color: '#1877F2' });
  if (handles.instagram) mapped.push({ id: 'ig', name: 'Instagram', icon: <FaInstagram />, url: handles.instagram, color: '#E4405F' });
  if (handles.twitter) mapped.push({ id: 'tw', name: 'Twitter', icon: <FaTwitter />, url: handles.twitter, color: '#1DA1F2' });
  if (handles.youtube) mapped.push({ id: 'yt', name: 'YouTube', icon: <FaYoutube />, url: handles.youtube, color: '#FF0000' });
  if (handles.soundCloud) mapped.push({ id: 'sc', name: 'SoundCloud', icon: <FaSoundcloud />, url: handles.soundCloud, color: '#FF5500' });
  if (handles.whatsapp) mapped.push({ id: 'wa', name: 'WhatsApp', icon: <FaWhatsapp />, url: handles.whatsapp, color: '#25D366' });
  if (handles.tiktok) mapped.push({ id: 'tt', name: 'TikTok', icon: <FaTiktok />, url: handles.tiktok, color: '#000000' });
  if (handles.linkedin) mapped.push({ id: 'li', name: 'LinkedIn', icon: <FaLinkedinIn />, url: handles.linkedin, color: '#0A66C2' });
  return mapped;
};

export default function Banner({ generalSettings }: BannerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Digital clock update every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  if (!mounted || !generalSettings) return null;

  // Extract data from generalSettings
  const watchword = generalSettings.watchword || "For to me, to live is Christ and to die is gain.";
  const news = generalSettings.marqueeAlert ? [{ id: "g1", title: generalSettings.marqueeAlert, icon: "📢" }] : [];
  const socialLinks = mapSocialHandles(generalSettings.socialHandles);

  const location = {
    name: "C.A.C Mount Zion",
    address: generalSettings.churchAddress || "41, Igbehinadun Street, Off Saabo, Ojodu, Lagos State, Nigeria",
    coordinates: { lat: 6.652483, lng: 3.364273 },
    phone: generalSettings.contactDetails?.phone || "+23408036138443",
  };

  // Process next event from generalSettings
  const latestEvent = generalSettings.latestEvent;
  let nextEvent = null;
  if (latestEvent) {
    let eventDate = new Date();
    if (latestEvent.dateTime) {
      eventDate = new Date(parseInt(latestEvent.dateTime));
    } else if (latestEvent.date && latestEvent.time) {
      eventDate = new Date(`${latestEvent.date}T${latestEvent.time}`);
    }
    nextEvent = {
      id: latestEvent._id,
      name: latestEvent.title,
      date: eventDate,
      location: latestEvent.location,
      image: latestEvent.image || "/src/img/hero/bg_1.jpg",
      dateTime: latestEvent.dateTime,
      time: latestEvent.time,
      isLive: latestEvent.isLive,
      liveLink: latestEvent.liveLink,
      // Recurrence data
      isRecurring: latestEvent.isRecurring,
      recurrenceType: latestEvent.recurrenceType,
      recurrenceInterval: latestEvent.recurrenceInterval,
      recurrenceDays: latestEvent.recurrenceDays,
      recurrenceEndDate: latestEvent.recurrenceEndDate,
    };
  }

  return (
    <section id="banner" className={styles.section}>
      {/* News Alert Marquee */}
      <div className={styles.newsMarquee}>
        <div className={styles.marqueeContent}>
          {news.length > 0 ? (
            news.map((item: any, idx: any) => (
              <span key={item.id} className={styles.newsItem}>
                {item.title}
                {idx < news.length - 1 && <span className={styles.separator}>•</span>}
              </span>
            ))
          ) : (
            <span className={styles.newsItem}>Welcome to C.A.C Mount Zion Kingdom Zone</span>
          )}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Watchword Section */}
          <div className={styles.watchword}>
            <div className={styles.watchwordIcon}>✨</div>
            <div className={styles.watchwordContent}>
              <h2 className={styles.watchwordLabel}>Yearly Watchword</h2>
              <small className={styles.watchwordText}>"{watchword}"</small>

              {/* Social Media Links */}
              <div className={styles.socialLinks}>
                {socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      title={link.name}
                      aria-label={`Follow us on ${link.name}`}
                      style={{ color: link.color }}
                    >
                      <span className={styles.socialIcon}>{link.icon}</span>
                    </a>
                  ))
                ) : null}
              </div>
            </div>
          </div>

          {/* Next Event Section */}
          {nextEvent && (
            <div className={`${styles.eventCard} ${nextEvent.isLive ? styles.liveEvent : ''}`}>
              <div className={styles.eventImageWrapper}>
                <img src={nextEvent.image} alt={nextEvent.name} className={styles.eventImage} />
                {nextEvent.isLive && (
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot}></span>
                    LIVE NOW
                  </div>
                )}
              </div>

              <div className={styles.eventContent}>
                <div className={styles.eventHeader}>
                  <h3 className={styles.eventTitle}>{nextEvent.name}</h3>
                  <span className={styles.upcomingBadge}>Latest</span>
                </div>

                <div className={styles.eventDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>🕐</span>
                    <span className={styles.detailText}>{convert24hrTo12hr(nextEvent.time)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>📅</span>
                    <span className={styles.detailText}>
                      {nextEvent.isRecurring
                        ? getNextOccurrence(nextEvent).toLocaleDateString()
                        : new Date(nextEvent.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>📍</span>
                    <span className={styles.detailText}>{nextEvent.location}</span>
                  </div>
                </div>

                <div className={styles.countdownWrapper}>
                  <div className={styles.countdownLabel}>
                    {nextEvent.isRecurring ? 'Next occurrence' : 'Next event'}
                  </div>
                  <div className={styles.countdown}>
                    {nextEvent.isRecurring
                      ? formatRelativeTime(getNextOccurrence(nextEvent))
                      : formatRelativeTime(nextEvent.dateTime)}
                  </div>
                  {nextEvent.isLive && (
                    <a href={nextEvent.liveLink} target="_blank" rel="noopener noreferrer" className={styles.liveButton}>
                      Join Live Stream
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Card */}
        <div className={styles.locationSection}>
          <div className={styles.locationCard}>
            <div className={styles.locationHeader}>
              <h3 className={styles.locationTitle}>📍 {location.name}</h3>
              {mounted && (
                <div className={styles.clockBox}>
                  <div className={styles.digitalClock}>{currentTime}</div>
                  <div className={styles.currentDate}>{currentDate}</div>
                </div>
              )}
            </div>

            <div className={styles.locationDetails}>
              <div className={styles.locationAddress}>
                <p className={styles.addressLine}>{location.address}</p>
              </div>

              {location.phone && (
                <div className={styles.locationPhone}>
                  <span className={styles.phoneIcon}>📞</span>
                  <a href={`tel:${location.phone}`} className={styles.phoneLink}>
                    {location.phone}
                  </a>
                </div>
              )}

              <a
                href={`https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapsBtn}
              >
                🗺️ View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
