"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";

type Bulletin = {
    _id: string;
    title: string;
    date: string;
    description: string;
    file: string;
    fileName?: string;
};

export default function BulletinManagerPage() {
    const [bulletins, setBulletins] = useState<Bulletin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBulletins = async () => {
        try {
            const res = await request.get("/bulletins");
            setBulletins(res.data);
        } catch (error) {
            console.error("Failed to fetch bulletins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBulletins();
    }, []);

    const filteredBulletins = bulletins.filter((bulletin) =>
        bulletin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bulletin.description && bulletin.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        new Date(bulletin.date).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this bulletin?")) {
            try {
                await request.delete(`/bulletins/${id}`);
                setBulletins((prev) => prev.filter((b) => b._id !== id));
            } catch (error) {
                console.error("Failed to delete bulletin:", error);
                alert("Failed to delete bulletin");
            }
        }
    };

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        alert("ID copied to clipboard!");
    };

    const handleViewFile = (base64String: string) => {
        try {
            // Check if it's a valid base64 string (simple check)
            if (!base64String || !base64String.includes('base64,')) {
                window.open(base64String, '_blank');
                return;
            }

            const base64Data = base64String.split('base64,')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');

            // Clean up the URL object after a delay to allow the window to open
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (error) {
            console.error("Error opening file:", error);
            // Fallback to direct open if blob creation fails
            window.open(base64String, '_blank');
        }
    };

    return (
        <div className={styles.page}>
            <AdminTopNav />
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.pageTitle}>Bulletin Manager</h1>
                        <p className={styles.subtitle}>Manage church bulletins and announcements</p>
                    </div>
                    <Link href="/admin/bulletin-manager/create" className={styles.createBtn}>
                        + Add Bulletin
                    </Link>
                </div>

                {/* Search */}
                <div className={styles.searchContainer} style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search bulletins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#262626',
                            border: '1px solid #404040',
                            borderRadius: '0.5rem',
                            color: '#ffffff',
                        }}
                    />
                </div>

                {/* Bulletins Table */}
                {loading ? (
                    <div className={styles.loadingState}><LoadingSpinner size="medium" /></div>
                ) : filteredBulletins.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBulletins.map((bulletin) => (
                                    <tr key={bulletin._id}>
                                        <td
                                            style={{ fontFamily: 'monospace', color: '#a0a0a0', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => handleCopyId(bulletin._id)}
                                            title="Click to copy full ID"
                                        >
                                            {bulletin._id.substring(0, 6)}...
                                        </td>
                                        <td>{new Date(bulletin.date).toLocaleDateString()}</td>
                                        <td>{bulletin.title}</td>
                                        <td>
                                            {bulletin.description && bulletin.description.length > 50
                                                ? `${bulletin.description.substring(0, 50)}...`
                                                : bulletin.description || "-"}
                                        </td>
                                        <td>
                                            {bulletin.file ? (
                                                <button
                                                    onClick={() => handleViewFile(bulletin.file)}
                                                    style={{ color: '#3b82f6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                >
                                                    {bulletin.fileName || "View File"}
                                                </button>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <Link
                                                href={`/admin/bulletin-manager/edit/${bulletin._id}`}
                                                className={styles.editBtn}
                                                title="Edit bulletin"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(bulletin._id)}
                                                className={styles.deleteBtn}
                                                title="Delete bulletin"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📄</div>
                        <h3 className={styles.emptyTitle}>No Bulletins Found</h3>
                        <p className={styles.emptyMessage}>
                            {searchQuery ? "No bulletins match your search" : "Add your first bulletin to get started"}
                        </p>
                        {!searchQuery && (
                            <Link href="/admin/bulletin-manager/create" className={styles.createBtn}>
                                Add Bulletin
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
