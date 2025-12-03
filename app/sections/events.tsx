"use client"

import React from "react";
import Link from "next/link";
import styles from "./events.module.css";
import { useLandingPage } from "../hooks/use-landing-page";
import { formatRelativeTime } from "../utils/helpers";

interface EventsProps {
  events?: any;
  title?: string;
}

export default function Events({ events, title = "Upcoming Events" }: EventsProps) {

  const {formatDuration} = useLandingPage();
  const sortedEvents = [...events].sort((a:any, b:any) => a.date - b.date);

  return (
    <section id="events" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>Join us for worship, community, and growth</p>
        </div>

        {sortedEvents.length == 0 && <h1 style={{textAlign:"center"}}>No Upcoming Event</h1>}

        <div className={styles.grid}>
          {sortedEvents.map((event) => (
            <article key={event._id} className={`${styles.card} ${event.isLive ? styles.cardLive : ""}`}>
              <div className={styles.imageContainer}>
                <img src={event.image} alt={event.title} className={styles.image} />
                {event.isLive && <span className={styles.liveBadge}>🔴 LIVE</span>}
              </div>

              <div className={styles.content}>
                <h3 className={styles.name}>{event.title}</h3>
                {event.description && <p className={styles.description}>{event.description}</p>}

                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>📅 Date</span>
                    <span className={styles.metaValue}>{event.date}</span>
                    {/* <span className={styles.metaValue}>{event.date.toLocaleDateString()}</span> */}
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>🕐 Time</span>
                    <span className={styles.metaValue}>{(event.time)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>⏱️ Duration</span>
                    <span className={styles.metaValue}>{formatDuration(event.duration)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>📍 Location</span>
                    <span className={styles.metaValue}>{event.location}</span>
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.countdown}>{formatRelativeTime(event.date)}</div>
                  {event.liveLink && (
                    <Link href={event.liveLink} className={styles.liveBtn}>
                      {event.isLive ? "Join Live" : "Learn More"}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
