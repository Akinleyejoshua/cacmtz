"use client";

import React, { useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";
import AdminHeader from "../../components/admin-header";
import styles from "./layout.module.css";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.adminLayout}>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
