"use client"

import React from "react";
import Link from "next/link";
import styles from "./events.module.css";
import { useLandingPage } from "../hooks/use-landing-page";
import { formatRelativeTime, getNextOccurrence } from "../utils/helpers";

interface EventsProps {
  events?: any;
  title?: string;
}

// Helper function to format recurrence schedule
function formatRecurrence(event: any): string {
  if (!event.isRecurring) return "";

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const interval = event.recurrenceInterval || 1;

  switch (event.recurrenceType) {
    case 'daily':
      return interval === 1 ? 'Every day' : `Every ${interval} days`;
    case 'weekly':
      if (event.recurrenceDays && event.recurrenceDays.length > 0) {
        const days = event.recurrenceDays.map((d: number) => dayNames[d]).join(', ');
        return interval === 1 ? `Every ${days}` : `Every ${interval} weeks on ${days}`;
      }
      return interval === 1 ? 'Every week' : `Every ${interval} weeks`;
    case 'monthly':
      return interval === 1 ? 'Every month' : `Every ${interval} months`;
    case 'yearly':
      return interval === 1 ? 'Every year' : `Every ${interval} years`;
    default:
      return 'Recurring';
  }
}

export default function Events({ events, title = "Upcoming Events" }: EventsProps) {

  const { formatDuration } = useLandingPage();
  const sortedEvents = [...events].sort((a: any, b: any) => a.date - b.date);

  return (
    <section id="events" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>Join us for worship, community, and growth</p>
        </div>

        {events.length > 0 &&
          <>

            {sortedEvents.length == 0 && <h1 style={{ textAlign: "center" }}>No Upcoming Event</h1>}

            <div className={styles.grid}>
              {sortedEvents.map((event) => (
                <article key={event._id} className={`${styles.card} ${event.isLive ? styles.cardLive : ""}`}>
                  <div className={styles.imageContainer}>
                    <img src={event.image} alt={event.title} className={styles.image} />
                    {event.isLive && <span className={styles.liveBadge}>🔴 LIVE</span>}
                    {event.isRecurring && <span className={styles.liveBadge} style={{ background: '#6366f1', top: event.isLive ? '50px' : '10px' }}>🔄 Recurring</span>}
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.name}>{event.title}</h3>
                    {event.description && <p className={styles.description}>{event.description}</p>}

                    <div className={styles.meta}>
                      {/* Show recurrence schedule for recurring events, otherwise show date */}
                      {event.isRecurring ? (
                        <>
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>🔄 Schedule</span>
                            <span className={styles.metaValue}>{formatRecurrence(event)}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>📅 Next</span>
                            <span className={styles.metaValue}>
                              {(() => {
                                const nextDate = getNextOccurrence(event);
                                const today = new Date();
                                const isToday = nextDate.getDate() === today.getDate() &&
                                  nextDate.getMonth() === today.getMonth() &&
                                  nextDate.getFullYear() === today.getFullYear();
                                return isToday ? "Today" : nextDate.toLocaleDateString();
                              })()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>📅 Date</span>
                          <span className={styles.metaValue}>{event.date.split("T")[0]}</span>
                        </div>
                      )}
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
                      <div className={styles.countdown}>
                        {(() => {
                          const targetDate = event.isRecurring ? getNextOccurrence(event) : new Date(event.date);
                          const today = new Date();
                          const isToday = targetDate.getDate() === today.getDate() &&
                            targetDate.getMonth() === today.getMonth() &&
                            targetDate.getFullYear() === today.getFullYear();

                          return isToday ? "Happening Today" : formatRelativeTime(targetDate);
                        })()}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {event.isPublicDetailedView && (
                          <Link href={`/event/${event._id}`} className={styles.liveBtn}>
                            See More
                          </Link>
                        )}
                        {event.liveLink && (
                          <Link href={event.liveLink} className={styles.liveBtn}>
                            {event.isLive ? "Join Live" : "Learn More"}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        }


      </div>
    </section >
  );
}
