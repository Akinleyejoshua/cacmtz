"use client"

import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";
import { useLandingPage } from "../hooks/use-landing-page";
import { formatRelativeTime, convert24hrTo12hr } from "../utils/helpers";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaSoundcloud, FaWhatsapp, FaTiktok, FaLinkedinIn } from "react-icons/fa6";
// Removed redundant import

type Event = {
  id: string;
  name: string;
  date: Date;
  location: string;
  image: string;
  dateTime: string;
  time: string;
  isLive?: boolean;
  liveLink?: string;
};

type Watchword = {
  text: string;
  reference: string;
};

type NewsAlert = {
  id: string;
  title: string;
  icon?: string;
};

type Location = {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
};

type SocialMedia = {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
};

const DEFAULT_SOCIAL: SocialMedia[] = [
  {
    id: "fb",
    name: "Facebook",
    icon: <FaFacebookF />,
    url: "https://facebook.com/cacmountzion",
    color: "#1877F2",
  },
  {
    id: "ig",
    name: "Instagram",
    icon: <FaInstagram />,
    url: "https://instagram.com/cacmountzion",
    color: "#E4405F",
  },
  {
    id: "tw",
    name: "Twitter",
    icon: <FaTwitter />,
    url: "https://twitter.com/cacmountzion",
    color: "#1DA1F2",
  },
  {
    id: "yt",
    name: "YouTube",
    icon: <FaYoutube />,
    url: "https://youtube.com/@cacmountzion",
    color: "#FF0000",
  },
  {
    id: "sc",
    name: "SoundCloud",
    icon: <FaSoundcloud />,
    url: "https://soundcloud.com/cacmountzion",
    color: "#FF5500",
  },
];

const DEFAULT_WATCHWORD: Watchword = {
  text: "For to me, to live is Christ and to die is gain.",
  reference: "Philippians 1:21",
};

const DEFAULT_LOCATION: Location = {
  name: "C.A.C Mount Zion",
  address: "",
  city: "",
  country: "",
  coordinates: {
    lat: 6.652483,
    lng: 3.364273,
  },
  phone: "+234 08036138443",
};

const DEFAULT_NEWS: NewsAlert[] = [
];

// function formatRelativeTime(date: Date): string {
//   const now = new Date();
//   const diffMs = date.getTime() - now.getTime();
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMins / 60);
//   const diffDays = Math.floor(diffHours / 24);

//   if (diffMins < 0) return "Ended";
//   if (diffMins < 1) return "Starting now";
//   if (diffMins < 60) return `In ${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
//   if (diffHours < 24) return `In ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
//   if (diffDays < 7) return `In ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
//   return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
// }

// function formatEventTime(date: Date): string {
//   return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
// }

interface BannerProps {
  watchword?: Watchword;
  events?: Event[];
  news?: NewsAlert[];
  location?: Location;
  social?: SocialMedia[];
}

export default function Banner({ watchword: propWatchword, events: propEvents, news: propNews, location: propLocation, social: propSocial }: BannerProps) {
  const { generalSettings, } = useLandingPage();
  const [mounted, setMounted] = useState(false);
  const [relativeTime, setRelativeTime] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const [watchword, setWatchword] = useState<Watchword>(propWatchword || DEFAULT_WATCHWORD);
  const [news, setNews] = useState<NewsAlert[]>(propNews || DEFAULT_NEWS);
  const [location, setLocation] = useState<Location>(propLocation || DEFAULT_LOCATION);
  const [social, setSocial] = useState<SocialMedia[]>(propSocial || DEFAULT_SOCIAL);
  const [socialsLoading, setSocialsLoading] = useState<boolean>(false);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch socials from API if not provided via props
  useEffect(() => {
    if (propSocial) return; // skip if socials passed as prop
    setSocialsLoading(true);
    fetch('/api/general')
      .then((res) => res.json())
      .then((data) => {
        if (data?.socialHandles) {
          const handles = data.socialHandles;
          const mapped: SocialMedia[] = [];
          if (handles.facebook) {
            mapped.push({ id: 'fb', name: 'Facebook', icon: <FaFacebookF />, url: handles.facebook, color: '#1877F2' });
          }
          if (handles.instagram) {
            mapped.push({ id: 'ig', name: 'Instagram', icon: <FaInstagram />, url: handles.instagram, color: '#E4405F' });
          }
          if (handles.twitter) {
            mapped.push({ id: 'tw', name: 'Twitter', icon: <FaTwitter />, url: handles.twitter, color: '#1DA1F2' });
          }
          if (handles.youtube) {
            mapped.push({ id: 'yt', name: 'YouTube', icon: <FaYoutube />, url: handles.youtube, color: '#FF0000' });
          }
          if (handles.soundCloud) {
            mapped.push({ id: 'sc', name: 'SoundCloud', icon: <FaSoundcloud />, url: handles.soundCloud, color: '#FF5500' });
          }
          if (handles.whatsapp) {
            mapped.push({ id: 'wa', name: 'WhatsApp', icon: <FaWhatsapp />, url: handles.whatsapp, color: '#25D366' });
          }
          if (handles.tiktok) {
            mapped.push({ id: 'tt', name: 'TikTok', icon: <FaTiktok />, url: handles.tiktok, color: '#000000' });
          }
          if (handles.linkedin) {
            mapped.push({ id: 'li', name: 'LinkedIn', icon: <FaLinkedinIn />, url: handles.linkedin, color: '#0A66C2' });
          }
          setSocial(mapped);
        }
      })
      .catch(() => {
        // keep default socials on error
      })
      .finally(() => setSocialsLoading(false));
  }, []);

  useEffect(() => {
    if (generalSettings) {
      if (generalSettings.watchword) {
        setWatchword({
          text: generalSettings.watchword,
          reference: "", // You might want to split the string if it contains reference or update model
        });
      }

      if (generalSettings.marqueeAlert) {
        setNews([{
          id: "g1",
          title: generalSettings.marqueeAlert,
          icon: "📢",
        }]);
      }

      if (generalSettings.churchAddress) {
        setLocation(prev => ({
          ...prev,
          address: generalSettings.churchAddress,
          phone: generalSettings.contactDetails?.phone || prev.phone,
        }));
      }

      if (generalSettings.socialHandles) {
        const evt = generalSettings.latestEvent;
        // Check if dateTime exists (added by user in previous turn), otherwise fallback to date/time fields
        let eventDate = new Date();
        if (evt.dateTime) {
          eventDate = new Date(parseInt(evt.dateTime));
        } else if (evt.date && evt.time) {
          // Try to parse date and time strings
          // This is a fallback and might need adjustment based on exact string format
          eventDate = new Date(`${evt.date}T${evt.time}`);
        }

        setNextEvent({
          id: evt._id,
          name: evt.title,
          date: eventDate,
          location: evt.location,
          image: evt.image || "src/img/hero/bg_1.jpg",
          dateTime: evt.dateTime,
          time: evt.time,
          isLive: evt.isLive,
          liveLink: evt.liveLink,
        });
      }
    }
  }, [generalSettings]);

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

  useEffect(() => {
    if (!nextEvent) return;

    // Update relative time immediately and every minute
    const updateTime = () => {
      formatRelativeTime(nextEvent.dateTime)
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!mounted) return null;

  return (
    <section id="banner" className={styles.section}>
      {/* News Alert Marquee */}
      <div className={styles.newsMarquee}>
        <div className={styles.marqueeContent}>
          {news.map((item, idx) => (
            <span key={item.id} className={styles.newsItem}>
              {item.title}
              {idx < news.length - 1 && <span className={styles.separator}>•</span>}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Watchword Section */}
          <div className={styles.watchword}>
            <div className={styles.watchwordIcon}>✨</div>
            <div className={styles.watchwordContent}>
              <h2 className={styles.watchwordLabel}>Yearly Watchword</h2>
              <small className={styles.watchwordText}>"{watchword.text}"</small>
              <p className={styles.watchwordReference}>{watchword.reference}</p>

              {/* Social Media Links */}
              <div className={styles.socialLinks}>
                {socialsLoading ? (
                  <span>Loading socials...</span>
                ) : (
                  social.map((link) => (
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
                )}
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
                    <span className={styles.detailText}>{new Date(nextEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>📍</span>
                    <span className={styles.detailText}>{nextEvent.location}</span>
                  </div>
                </div>

                <div className={styles.countdownWrapper}>
                  <div className={styles.countdownLabel}>Next event</div>
                  <div className={styles.countdown}>{formatRelativeTime(nextEvent.dateTime)}</div>
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
                {/* <p className={styles.addressLine}>{location.city}, {location.country}</p> */}
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
