"use client";

import React from "react";
import styles from "./admin-header.module.css";
import { useRouter } from "next/navigation";
import { save } from "../utils/helpers";

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const router = useRouter();

    const handleLogout = () => {
        save("admin-auth", false);
        router.push("/admin");
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuBtn}
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                >
                    <span className={styles.menuIcon}>☰</span>
                </button>
                <span className={styles.pageIndicator}>Admin Panel</span>
            </div>

            <div className={styles.right}>
                <div className={styles.avatar}>
                    <span className={styles.avatarIcon}>👤</span>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <span className={styles.logoutIcon}>🚪</span>
                    <span className={styles.logoutText}>Logout</span>
                </button>
            </div>
        </header>
    );
}
