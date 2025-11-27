"use client"

import React from "react";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./dashboard.module.css";

type Metric = {
  id: string;
  title: string;
  value: string | number;
  change?: string; // e.g. +4.2%
  spark?: number[];
};

const MOCK_METRICS: Metric[] = [
  { id: "visitors", title: "Visitors (30d)", value: 12458, change: "+6.2%", spark: [30,40,38,55,70,66,80,95,120,110,130,125,140] },
  { id: "new_members", title: "New Members", value: 34, change: "+11%", spark: [1,0,2,1,3,2,4,1,3,2,4,5,6] },
  { id: "attendance", title: "Avg Attendance", value: 420, change: "-2.1%", spark: [380,400,420,430,410,420,410,415,420,425,418,422,420] },
  { id: "donations", title: "Donations (30d)", value: "₦1,234,560", change: "+3.8%", spark: [50,60,55,70,90,88,120,110,140,135,150,160,170] },
];

function Sparkline({ points = [] }: { points?: number[] }) {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points);
  const scaled = points.map((p) => (p / max) * 100);
  return (
    <svg className={styles.spark} viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#b794f4"
        strokeWidth={2}
        points={scaled.map((s, i) => `${(i / (scaled.length - 1)) * 100},${30 - (s / 100) * 28}`).join(" ")}
      />
    </svg>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className={styles.page}>
      <AdminTopNav />
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview of visitors, attendance and finances</p>
      </div>

      <section className={styles.metricsGrid}>
        {MOCK_METRICS.map((m) => (
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
          <h3 className={styles.panelTitle}>Recent Visitors</h3>
          <p className={styles.panelNote}>Last 10 visits summary — quick snapshot.</p>
          <ul className={styles.smallList}>
            <li>Web: 8,560</li>
            <li>Mobile: 3,250</li>
            <li>Referrals: 648</li>
            <li>Direct: 1,500</li>
          </ul>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Quick Actions</h3>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>Create Event</button>
            <button className={styles.actionBtn}>Add Sermon</button>
            <button className={styles.actionBtn}>Export Reports</button>
          </div>
        </div>
      </section>
    </main>
  );
}
