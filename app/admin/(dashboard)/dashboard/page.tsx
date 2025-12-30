"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import LoadingSpinner from "@/app/components/loading-spinner";

interface TimeSeriesData {
  date: string;
  count: number;
}

interface AnalyticsStats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  uniqueVisitors: number;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  timeSeries: TimeSeriesData[];
  recentVisits: { timestamp: string; pageUrl: string; deviceType: string }[];
}

type Metric = {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  spark?: number[];
};

function Sparkline({ points = [] }: { points?: number[] }) {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points, 1); // Avoid division by zero
  const scaled = points.map((p) => (p / max) * 100);
  return (
    <svg className={styles.spark} viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#b794f4"
        strokeWidth={2}
        points={scaled.map((s, i) => `${(i / (scaled.length - 1 || 1)) * 100},${30 - (s / 100) * 28}`).join(" ")}
      />
    </svg>
  );
}

// Calculate percentage change
function calcChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "—";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Format relative time
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/stats?days=30");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics. Make sure the database is connected.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Build metrics from stats
  const metrics: Metric[] = stats ? [
    {
      id: "total_views",
      title: "Total Page Views",
      value: formatNumber(stats.totalViews),
      change: "All time",
      spark: stats.timeSeries.slice(-14).map(d => d.count),
    },
    {
      id: "today",
      title: "Today",
      value: stats.todayViews,
      change: "Live",
      spark: stats.timeSeries.slice(-7).map(d => d.count),
    },
    {
      id: "week",
      title: "Last 7 Days",
      value: formatNumber(stats.weekViews),
      change: calcChange(
        stats.timeSeries.slice(-7).reduce((a, b) => a + b.count, 0),
        stats.timeSeries.slice(-14, -7).reduce((a, b) => a + b.count, 0)
      ),
      spark: stats.timeSeries.slice(-7).map(d => d.count),
    },
    {
      id: "month",
      title: "Last 30 Days",
      value: formatNumber(stats.monthViews),
      change: `${stats.uniqueVisitors} unique`,
      spark: stats.timeSeries.map(d => d.count),
    },
  ] : [];

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Real-time analytics and website performance</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.7)" }}>
          <p>{error}</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Visit the landing page first to generate some analytics data.
          </p>
        </div>
      ) : (
        <>
          <section className={styles.metricsGrid}>
            {metrics.map((m) => (
              <article key={m.id} className={styles.card} aria-labelledby={`m-${m.id}`}>
                <div className={styles.cardTop}>
                  <h3 id={`m-${m.id}`} className={styles.metricTitle}>{m.title}</h3>
                  <div className={styles.metricChange}>{m.change}</div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metricValue}>{m.value}</div>
                  <Sparkline points={m.spark} />
                </div>
              </article>
            ))}
          </section>

          <section className={styles.detailsGrid}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Device Breakdown</h3>
              <p className={styles.panelNote}>Visitor devices over the last 30 days</p>
              {stats && (
                <ul className={styles.smallList}>
                  <li>🖥️ Desktop: {stats.deviceBreakdown.desktop}</li>
                  <li>📱 Mobile: {stats.deviceBreakdown.mobile}</li>
                  <li>📋 Tablet: {stats.deviceBreakdown.tablet}</li>
                </ul>
              )}
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Quick Actions</h3>
              <div className={styles.actions}>
                <Link href="/admin/event-manager/create" className={styles.actionBtn}>Create Event</Link>
                <Link href="/admin/sermon-manager/create" className={styles.actionBtn}>Add Sermon</Link>
                <Link href="/admin/general" className={styles.actionBtn}>Settings</Link>
              </div>
            </div>
          </section>

          {/* Recent Visits */}
          {stats && stats.recentVisits.length > 0 && (
            <section className={styles.panel} style={{ marginTop: "20px" }}>
              <h3 className={styles.panelTitle}>Recent Visits</h3>
              <p className={styles.panelNote}>Last 10 page views</p>
              <ul className={styles.smallList} style={{ flexDirection: "column", gap: "8px" }}>
                {stats.recentVisits.map((visit, idx) => (
                  <li key={idx} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>
                      {visit.deviceType === "mobile" ? "📱" : visit.deviceType === "tablet" ? "📋" : "🖥️"}{" "}
                      {visit.pageUrl}
                    </span>
                    <span style={{ opacity: 0.7 }}>{formatTimeAgo(visit.timestamp)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
