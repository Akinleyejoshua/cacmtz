"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";

type Bulletin = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  content: string;
  isActive: boolean;
};

const SAMPLE_BULLETINS: Bulletin[] = [
  {
    id: "b001",
    title: "Sunday Service - Nov 30, 2025",
    date: new Date(2025, 10, 30),
    description: "Weekly worship service bulletin",
    content: "# Order of Service\n\n## Sunday Service - November 30, 2025\n\n### Praise & Worship\n- Opening Song: Amazing Grace\n- Prayer of Adoration\n\n### Announcements\n- Church picnic next month\n- Upcoming revival crusade\n\n### Main Message\n- Topic: Faith in Action\n- Scripture: Hebrews 11:1-3",
    isActive: true,
  },
  {
    id: "b002",
    title: "Midweek Prayer - Nov 26, 2025",
    date: new Date(2025, 10, 26),
    description: "Prayer meeting bulletin",
    content: "# Prayer Meeting Bulletin\n\n## November 26, 2025\n\n### Opening Prayer\n- Led by Pastor James\n\n### Prayer Points\n1. For the sick and those in need\n2. For the nation and its leaders\n3. For the church and its vision",
    isActive: true,
  },
  {
    id: "b003",
    title: "Youth Conference - Dec 15, 2025",
    date: new Date(2025, 11, 15),
    description: "Annual youth conference program",
    content: "# Youth Conference Program\n\n## December 15-17, 2025\n\n### Schedule\n- **Day 1**: Registration & Welcome\n- **Day 2**: Keynote Addresses\n- **Day 3**: Workshops & Closing Ceremony",
    isActive: true,
  },
];

export default function BulletinManagerPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>(SAMPLE_BULLETINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const filteredBulletins = useMemo(() => {
    let filtered = [...bulletins];

    if (filterActive !== "all") {
      filtered = filtered.filter((b) => b.isActive === (filterActive === "active"));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.title.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [bulletins, searchQuery, filterActive]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bulletin?")) {
      setBulletins((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setBulletins((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Bulletin Manager</h1>
          <p className={styles.subtitle}>Create and manage church bulletins</p>
        </div>

        <div className={styles.actionButtons}>
          <Link href="/admin/bulletin-manager/create" className={styles.btn}>
            + Create Bulletin
          </Link>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controls}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search bulletins by ID, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className={styles.filterGroup}>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as typeof filterActive)}
            className={styles.filterSelect}
          >
            <option value="all">All Bulletins</option>
            <option value="active">Active Only</option>
            <option value="inactive">Archived</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          Showing <strong>{filteredBulletins.length}</strong> bulletin{filteredBulletins.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Bulletins Grid */}
      {filteredBulletins.length > 0 ? (
        <div className={styles.bulletinsGrid}>
          {filteredBulletins.map((bulletin) => (
            <div key={bulletin.id} className={`${styles.bulletinCard} ${bulletin.isActive ? styles.cardActive : styles.cardInactive}`}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <div className={styles.idBadge}>{bulletin.id}</div>
                  <h3 className={styles.cardTitle}>{bulletin.title}</h3>
                  {bulletin.description && <p className={styles.cardDescription}>{bulletin.description}</p>}
                </div>
                <span className={`${styles.statusBadge} ${bulletin.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                  {bulletin.isActive ? "✓ Active" : "📦 Archived"}
                </span>
              </div>

              {/* Date */}
              <div className={styles.dateInfo}>
                <span className={styles.dateLabel}>📅</span>
                <span className={styles.dateValue}>{bulletin.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              {/* Content Preview */}
              <div className={styles.contentPreview}>
                <p>{bulletin.content.substring(0, 120)}...</p>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <button
                  onClick={() => handleToggleActive(bulletin.id)}
                  className={`${styles.actionBtn} ${styles.toggleBtn}`}
                  title={bulletin.isActive ? "Archive" : "Activate"}
                >
                  {bulletin.isActive ? "📦" : "✓"}
                </button>
                <Link
                  href={`/admin/bulletin-manager/edit/${bulletin.id}`}
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  title="Edit"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(bulletin.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📭</p>
          <p className={styles.emptyText}>No bulletins found</p>
          <p className={styles.emptySubtext}>
            {searchQuery ? "Try adjusting your search terms" : "Create your first bulletin to get started"}
          </p>
          <Link href="/admin/bulletin-manager/create" className={styles.emptyBtn}>
            Create First Bulletin
          </Link>
        </div>
      )}

      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📄</span>
          <div>
            <p className={styles.statLabel}>Total Bulletins</p>
            <p className={styles.statValue}>{bulletins.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>✓</span>
          <div>
            <p className={styles.statLabel}>Active</p>
            <p className={styles.statValue}>{bulletins.filter((b) => b.isActive).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📦</span>
          <div>
            <p className={styles.statLabel}>Archived</p>
            <p className={styles.statValue}>{bulletins.filter((b) => !b.isActive).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
