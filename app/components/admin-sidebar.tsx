"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin-sidebar.module.css";

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        title: "Overview",
        items: [
            { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        ],
    },
    {
        title: "Content",
        items: [
            { href: "/admin/general", label: "General", icon: "⚙️" },
            { href: "/admin/outreach-manager", label: "Outreach & Giving", icon: "🌍" },
            { href: "/admin/event-manager", label: "Events", icon: "📅" },
            { href: "/admin/sermon-manager", label: "Sermons", icon: "🎬" },
            { href: "/admin/ministers-manager", label: "Ministers", icon: "👥" },
            { href: "/admin/bulletin-manager", label: "Bulletins", icon: "📰" },
        ],
    },
    {
        title: "Media",
        items: [
            { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
        ],
    },
    {
        title: "Account",
        items: [
            { href: "/admin/profile-manager", label: "Profile", icon: "👤" },
        ],
    },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") {
            return pathname === href || pathname === "/admin/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className={styles.overlay} onClick={onClose} />}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                {/* Brand */}
                <div className={styles.brand}>
                    <span className={styles.logo}>⚑</span>
                    <span className={styles.brandTitle}>Admin Panel</span>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {NAV_GROUPS.map((group) => (
                        <div key={group.title} className={styles.navGroup}>
                            <span className={styles.groupTitle}>{group.title}</span>
                            <ul className={styles.navList}>
                                {group.items.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}
                                            onClick={onClose}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            <span className={styles.navLabel}>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.viewSiteLink}>
                        <span>🌐</span>
                        <span>View Website</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
