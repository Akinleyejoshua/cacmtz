"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEventManager } from "@/app/hooks/use-event-manager";
import { convert24hrTo12hr, formatRelativeTime } from "@/app/utils/helpers";

import LoadingSpinner from "@/app/components/loading-spinner";

export default function EventManagerPage() {
  const {
    events, formatDuration,
    getEventStatus, searchQuery, filterStatus, sortBy, setSearchQuery, setFilterStatus, setSortBy,
    del_event,
    fetchingEvents,
  } = useEventManager();

  return (
    <div className={styles.page}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Event Manager</h1>
          <p className={styles.subtitle}>Manage all church events and gatherings</p>
        </div>

        <div className={styles.actionButtons}>
          <Link href="/admin/event-manager/create" className={styles.btn}>
            + Create Event
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
            placeholder="Search events by name, description, or location..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className={styles.filterSelect}
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live Now</option>
            <option value="past">Past</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className={styles.filterSelect}>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          Showing <strong>{events.length}</strong> event{events.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table Section */}
      <div className={styles.tableWrapper}>
        {fetchingEvents ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <LoadingSpinner size="medium" />
          </div>
        ) : events.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any, i: any) => {
                const status = getEventStatus(event.dateTime, event.isLive);
                return (
                  <tr key={i} className={styles.tableRow}>
                    <td className={styles.nameCell}>
                      <div className={styles.eventName}>
                        <img src={event.image} alt={event.name} className={styles.thumbnail} />
                        <div>
                          <p className={styles.eventTitle}>{event.title}</p>
                          {event.description && <p className={styles.eventDesc}>{event.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateTime}>
                        <span className={styles.date}>{formatRelativeTime(new Date(event.date))}</span>
                        <span className={styles.time}>{convert24hrTo12hr(event.time)}</span>
                      </div>
                    </td>
                    <td>{formatDuration(event.duration)}</td>
                    <td>{event.location}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                        {status === "live" && "🔴 LIVE"}
                        {status === "upcoming" && "📅 Upcoming"}
                        {status === "past" && "✓ Past"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/event-manager/edit/${event._id}`} className={styles.actionBtn} title="Edit">
                          ✏️
                        </Link>
                        <button className={styles.actionBtn} onClick={() => del_event(event._id)} title="Delete">
                          🗑️
                        </button>
                        {/* <button
                          className={styles.actionBtn}
                          onClick={() => alert("View details for " + event.name)}
                          title="View Details"
                        >
                          👁️
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>📭</p>
            <p className={styles.emptyText}>No events found</p>
            <p className={styles.emptySubtext}>
              {searchQuery ? "Try adjusting your search terms" : "Create a new event to get started"}
            </p>
            <Link href="/admin/event-manager/create" className={styles.emptyBtn}>
              Create First Event
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className={styles.quickNavSection}>
        <h3 className={styles.quickNavTitle}>Quick Actions</h3>
        <div className={styles.cardGrid}>
          <Link href="/admin/event-manager/create" className={styles.navCard}>
            <span className={styles.navCardIcon}>➕</span>
            <span className={styles.navCardTitle}>Create Event</span>
            <span className={styles.navCardDesc}>Add a new event</span>
          </Link>
          <div className={styles.navCard} onClick={() => setFilterStatus("live")}>
            <span className={styles.navCardIcon}>🔴</span>
            <span className={styles.navCardTitle}>Live Events</span>
            <span className={styles.navCardDesc}>{events.filter((e: any) => e?.isLive).length} active</span>
          </div>
          <div className={styles.navCard} onClick={() => setFilterStatus("upcoming")}>
            <span className={styles.navCardIcon}>📅</span>
            <span className={styles.navCardTitle}>Upcoming</span>
            <span className={styles.navCardDesc}>{events.filter((e: any) => getEventStatus(e.date, e.isLive) === "upcoming").length} events</span>
          </div>
          <div className={styles.navCard} onClick={() => setFilterStatus("past")}>
            <span className={styles.navCardIcon}>✅</span>
            <span className={styles.navCardTitle}>Past Events</span>
            <span className={styles.navCardDesc}>{events.filter((e: any) => getEventStatus(e.date, e.isLive) === "past").length} archived</span>
          </div>
        </div>
      </div>
    </div>
  );
}
