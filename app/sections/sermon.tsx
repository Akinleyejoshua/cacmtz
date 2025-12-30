"use client"

import React from "react";
import Link from "next/link";
import styles from "./sermon.module.css";

type Document = {
  id: string;
  title: string;
  type: "bulletin" | "notes" | "transcript" | "pdf";
  icon: string;
  url: string;
};

type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: Date;
  description: string;
  youtubeId: string;
  duration: number; // in minutes
  documents: Document[];
};

const DEFAULT_SERMON: Sermon = {
  id: "s1",
  title: "Faith in the Wilderness",
  speaker: "Pastor John",
  date: new Date(2025, 10, 23),
  description:
    "A powerful message on trusting God during difficult seasons. Learn how faith sustains us when we face the unknown and challenges that test our belief.",
  youtubeId: "dQw4w9WgXcQ",
  duration: 45,
  documents: [
    {
      id: "d1",
      title: "Sunday Bulletin",
      type: "bulletin",
      icon: "📄",
      url: "/documents/bulletin-nov-23.pdf",
    },
    {
      id: "d2",
      title: "Sermon Notes",
      type: "notes",
      icon: "📝",
      url: "/documents/sermon-notes-nov-23.pdf",
    },
    {
      id: "d3",
      title: "Sermon Transcript",
      type: "transcript",
      icon: "📖",
      url: "/documents/transcript-nov-23.pdf",
    },
  ],
};

interface SermonProps {
  sermon?: any; // Using any for now to match backend response structure
  title?: string;
}

export default function SermonSection({ sermon, title = "Latest Sermon" }: SermonProps) {
  // If no sermon is provided, don't render the section (or render default if desired, but user asked for DB data)
  // For now, let's fall back to default if not provided, OR we can map the DB sermon to the UI structure

  // Extract minister name helper
  const getMinisterName = (minister: any): string => {
    if (typeof minister === 'object' && minister?.name) {
      return minister.name;
    }
    if (typeof minister === 'string') {
      const isObjectId = /^[a-f\d]{24}$/i.test(minister);
      return isObjectId ? 'Minister' : minister;
    }
    return 'Unknown Minister';
  };

  const displaySermon = sermon ? {
    id: sermon._id,
    title: sermon.title,
    speaker: getMinisterName(sermon.minister), // Use helper function
    date: new Date(sermon.date),
    description: sermon.description,
    youtubeId: sermon.youtubeLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || "",
    duration: sermon.duration,
    documents: []
  } : DEFAULT_SERMON;

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${displaySermon.youtubeId}`;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>Listen to the latest message from our pulpit</p>
        </div>

        {sermon ? (
          <div className={styles.content}>
            {/* Video Container */}
            <div className={styles.videoWrapper}>
              <iframe
                className={styles.videoEmbed}
                src={youtubeEmbedUrl}
                title={displaySermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Sermon Details */}
            <div className={styles.details}>
              <div className={styles.sermonInfo}>
                <h3 className={styles.sermonTitle}>{displaySermon.title}</h3>
                <p className={styles.sermonSpeaker}>By {displaySermon.speaker}</p>

                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>📅</span>
                    <span className={styles.metaText}>{displaySermon.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>⏱️</span>
                    <span className={styles.metaText}>{displaySermon.duration} min</span>
                  </div>
                </div>

                <div className={styles.description} dangerouslySetInnerHTML={{ __html: displaySermon.description }} />
              </div>

              {/* Action Button */}
              <Link href={`/sermons/${displaySermon.id}`} className={styles.watchBtn}>
                🎬 View Sermon Details
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.details} style={{ width: '100%', textAlign: 'center' }}>
              <p>No sermon available at the moment.</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
