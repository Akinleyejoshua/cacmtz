"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

import styles from "./page.module.css";
import { useChurchProfileManager } from "@/app/hooks/use-church-profile-manager";




export default function ProfileManagerPage() {
  const {
    profiles,
    filterActive, setFilterActive,
    filteredProfiles, handleDelete,
    searchQuery, setSearchQuery
  } = useChurchProfileManager();

  return (
    <div className={styles.page}>
      
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Profile Manager</h1>
          <p className={styles.subtitle}>Manage church profile tabs and content</p>
        </div>

        <div className={styles.actionButtons}>
          <Link href="/admin/profile-manager/create" className={styles.btn}>
            + Create Profile
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
            placeholder="Search profiles by title or description..."
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
            <option value="all">All Profiles</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          Showing <strong>{filteredProfiles.length}</strong> profile{filteredProfiles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className={styles.profilesGrid}>
          {filteredProfiles.map((profile, index) => (
            <div key={profile._id} className={`${styles.profileCard} ${profile.isActive ? styles.cardActive : styles.cardInactive}`}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <h3 className={styles.cardTitle}>{profile.title}</h3>
                  {profile.description && <p className={styles.cardDescription}>{profile.description}</p>}
                </div>
               
              </div>

              {/* Content Preview */}
              <div className={styles.contentPreview}>
                <p>{profile.content.substring(0, 100)}...</p>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>

                <div className={styles.actions}>
                
                  <Link
                    href={`/admin/profile-manager/edit/${profile._id}`}
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    title="Edit"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(profile._id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📭</p>
          <p className={styles.emptyText}>No profiles found</p>
          <p className={styles.emptySubtext}>
            {searchQuery ? "Try adjusting your search terms" : "Create a new profile to get started"}
          </p>
          <Link href="/admin/profile-manager/create" className={styles.emptyBtn}>
            Create First Profile
          </Link>
        </div>
      )}

      {/* Quick Info Section */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>📊</span>
          <div>
            <p className={styles.infoTitle}>Total Profiles</p>
            <p className={styles.infoValue}>{profiles.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
