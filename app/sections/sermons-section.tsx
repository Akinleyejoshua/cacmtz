"use client";

import React from "react";
import styles from "./sermons-section.module.css";
import { useSermons, TimeFilter, SortBy } from "../hooks/use-sermons";
import LoadingSpinner from "../components/loading-spinner";

interface SermonsSectionProps {
    showHeader?: boolean;
}

export default function SermonsSection({ showHeader = true }: SermonsSectionProps) {
    const {
        loading,
        searchQuery,
        setSearchQuery,
        timeFilter,
        setTimeFilter,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        paginatedSermons,
        totalPages,
        totalSermons,
        getYouTubeThumbnail,
        formatDuration,
        formatDate,
    } = useSermons();

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={styles.loadingContainer}>
                    <LoadingSpinner size="large" text="Loading sermons..." />
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            {showHeader && (
                <div className={styles.header}>
                    <h1 className={styles.title}>Sermons</h1>
                    <p className={styles.subtitle}>
                        Watch and listen to our collection of inspiring messages
                    </p>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchContainer}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by title or minister..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Time</label>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Time</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className={styles.filterSelect}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                            <option value="minister">Minister (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className={styles.resultsInfo}>
                <span>
                    {totalSermons === 0
                        ? "No sermons found"
                        : `Showing ${paginatedSermons.length} of ${totalSermons} sermon${totalSermons !== 1 ? "s" : ""}`}
                </span>
            </div>

            {/* Sermons Grid */}
            {paginatedSermons.length > 0 ? (
                <div className={styles.sermonsGrid}>
                    {paginatedSermons.map((sermon) => {
                        // Extract minister name - handle populated object, ObjectId string, or plain string
                        let ministerName = 'Unknown Minister';
                        if (sermon.minister) {
                            if (typeof sermon.minister === 'object' && sermon.minister.name) {
                                ministerName = sermon.minister.name;
                            } else if (typeof sermon.minister === 'string') {
                                // Check if it's an ObjectId (24 hex characters)
                                const isObjectId = /^[a-f\d]{24}$/i.test(sermon.minister);
                                ministerName = isObjectId ? 'Minister' : sermon.minister;
                            }
                        }

                        return (
                            <a
                                key={sermon._id}
                                href={`/sermons/${sermon._id}`}
                                className={styles.sermonCard}
                            >
                                <div className={styles.thumbnailContainer}>
                                    <img
                                        src={getYouTubeThumbnail(sermon.youtubeLink)}
                                        alt={sermon.title}
                                        className={styles.thumbnail}
                                    />
                                    <div className={styles.playOverlay}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <span className={styles.duration}>{formatDuration(sermon.duration)}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.sermonTitle}>{sermon.title}</h3>
                                    <p className={styles.minister}>{ministerName}</p>
                                    <p className={styles.date}>{formatDate(sermon.date)}</p>
                                    <span className={styles.seeMore}>See More →</span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎬</div>
                    <h3>No Sermons Found</h3>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                    <button
                        className={styles.resetBtn}
                        onClick={() => {
                            setSearchQuery("");
                            setTimeFilter("all");
                            setSortBy("newest");
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first, last, current, and adjacent pages
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ""}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className={styles.ellipsis}>...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
}
