"use client"

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin-top-nav.module.css";

export default function AdminTopNav() {
  const navRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to active link if present
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector(`.${styles.active}`) as HTMLElement | null;
    if (active) {
      // center active into view
      const rect = active.getBoundingClientRect();
      const parentRect = nav.getBoundingClientRect();
      const offset = rect.left - parentRect.left - parentRect.width / 2 + rect.width / 2;
      nav.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  const LINKS = [
    // { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/general", label: "General" },
    { href: "/admin/event-manager", label: "Events" },
    { href: "/admin/sermon-manager", label: "Sermons" },
    { href: "/admin/ministers-manager", label: "Ministers" },
    // { href: "/admin/donations", label: "Donations" },
    { href: "/admin/bulletin-manager", label: "Bulletins" },
    { href: "/admin/profile-manager", label: "Profile" },
    // { href: "/admin/settings", label: "Settings" },
  ];

  const [pathName, setPathName] = useState("");

  useEffect(() => {
    setPathName(location.pathname);
  }, [])

  return (
    <nav className={styles.topnav} aria-label="Admin navigation">
      <div className={styles.brand}>
        <span className={styles.logo}>⚑</span>
        <span className={styles.title}>Admin</span>
      </div>

      <div ref={navRef} className={styles.links} role="navigation">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`${styles.link} ${l.href === pathName ? styles.active : ""}`}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className={styles.actions}>
        {/* <button className={styles.iconBtn} title="Notifications">🔔</button> */}
        {/* <button className={styles.iconBtn} title="Profile">👤</button> */}
      </div>
    </nav>
  );
}
