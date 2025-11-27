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
  sermon?: Sermon;
  title?: string;
}

export default function SermonSection({ sermon = DEFAULT_SERMON, title = "Latest Sermon" }: SermonProps) {
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${sermon.youtubeId}`;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>Listen to the latest message from our pulpit</p>
        </div>

        <div className={styles.content}>
          {/* Video Container */}
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.videoEmbed}
              src={youtubeEmbedUrl}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Sermon Details */}
          <div className={styles.details}>
            <div className={styles.sermonInfo}>
              <h3 className={styles.sermonTitle}>{sermon.title}</h3>
              <p className={styles.sermonSpeaker}>By {sermon.speaker}</p>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📅</span>
                  <span className={styles.metaText}>{sermon.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⏱️</span>
                  <span className={styles.metaText}>{sermon.duration} min</span>
                </div>
              </div>

              <p className={styles.description}>{sermon.description}</p>
            </div>

            {/* Document Links */}
            <div className={styles.documents}>
              <h4 className={styles.documentsTitle}>📚 Resources</h4>
              <div className={styles.documentLinks}>
                {sermon.documents.map((doc) => (
                  <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className={`${styles.docLink} ${styles[doc.type]}`}>
                    <span className={styles.docIcon}>{doc.icon}</span>
                    <span className={styles.docTitle}>{doc.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Link href={youtubeEmbedUrl} target="_blank" className={styles.watchBtn}>
              🎬 Watch Full Video
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
