"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";

type Minister = {
  _id: string;
  name: string;
  position?: string;
};

type Sermon = {
  _id: string;
  title: string;
  minister: Minister | string;
  youtubeLink: string;
  date: string;
  duration: number;
  bulletinId: any;
};

// Helper to extract minister name
const getMinisterName = (minister: Minister | string): string => {
  if (typeof minister === 'object' && minister?.name) {
    return minister.name;
  }
  if (typeof minister === 'string') {
    // Check if it's an ObjectId (24 hex characters)
    const isObjectId = /^[a-f\d]{24}$/i.test(minister);
    return isObjectId ? 'Minister' : minister;
  }
  return 'Unknown Minister';
};

export default function SermonManagerPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSermons = async () => {
    try {
      const res = await request.get("/sermon");
      setSermons(res.data);
    } catch (error) {
      console.error("Failed to fetch sermons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const filteredSermons = useMemo(() => {
    return sermons
      .filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getMinisterName(sermon.minister).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sermons, searchQuery]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sermon?")) {
      try {
        await request.delete(`/sermon/${id}`);
        setSermons((prev) => prev.filter((s) => s._id !== id));
      } catch (error) {
        console.error("Failed to delete sermon:", error);
        alert("Failed to delete sermon");
      }
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Sermon Manager</h1>
          <p className={styles.subtitle}>Manage church sermons and recordings</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by sermon name or minister..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* Create Button */}
        <Link href="/admin/sermon-manager/create" className={styles.createBtn}>
          + Create Sermon
        </Link>
      </div>

      {/* Sermons Grid */}
      {loading ? (
        <div className={styles.loadingState}><LoadingSpinner size="medium" /></div>
      ) : filteredSermons.length > 0 ? (
        <div className={styles.sermonsGrid}>
          {filteredSermons.map((sermon) => {
            const videoId = getYouTubeVideoId(sermon.youtubeLink);
            return (
              <div key={sermon._id} className={styles.sermonCard}>
                {/* Thumbnail */}
                {videoId && (
                  <div className={styles.thumbnail}>
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={sermon.title}
                      className={styles.thumbnailImg}
                    />
                    <div className={styles.playOverlay}>▶</div>
                    <div className={styles.durationBadge}>{sermon.duration} min</div>
                  </div>
                )}

                {/* Content */}
                <div className={styles.cardContent}>
                  {/* Title */}
                  <h3 className={styles.sermonTitle}>{sermon.title}</h3>

                  {/* Minister */}
                  <p className={styles.ministerName}>{getMinisterName(sermon.minister)}</p>

                  {/* Meta Info */}
                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Date:</span>
                      <span className={styles.metaValue}>{formatDate(sermon.date)}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Time:</span>
                      <span className={styles.metaValue}>{formatTime(sermon.date)}</span>
                    </div>
                    {sermon.bulletinId && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Bulletin:</span>
                        <span className={styles.metaValue}>{sermon.bulletinId}</span>
                      </div>
                    )}
                  </div>

                  {/* Link Preview */}
                  <div className={styles.linkPreview}>
                    <a
                      href={sermon.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                      title="Open on YouTube"
                    >
                      Watch on YouTube →
                    </a>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <Link
                      href={`/admin/sermon-manager/edit/${sermon._id}`}
                      className={styles.editBtn}
                      title="Edit sermon"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(sermon._id)}
                      className={styles.deleteBtn}
                      title="Delete sermon"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎬</div>
          <h3 className={styles.emptyTitle}>No Sermons Found</h3>
          <p className={styles.emptyMessage}>
            {searchQuery
              ? "Try a different search query"
              : "Create your first sermon to get started"}
          </p>
          <Link href="/admin/sermon-manager/create" className={styles.emptyBtn}>
            Create Sermon
          </Link>
        </div>
      )}

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{sermons.length}</div>
          <div className={styles.statLabel}>Total Sermons</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{filteredSermons.length}</div>
          <div className={styles.statLabel}>Displayed</div>
        </div>
      </div>
    </div>
  );
}
