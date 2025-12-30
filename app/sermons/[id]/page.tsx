"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainHeader from "../../components/main-header";
import Footer from "../../sections/footer";
import { useLandingPage } from "../../hooks/use-landing-page";
import LoadingSpinner from "../../components/loading-spinner";
import request from "../../utils/axios";
import styles from "./page.module.css";

interface Minister {
    _id: string;
    name: string;
    position: string;
    department: string;
    image?: string;
    bio?: string;
}

interface Bulletin {
    _id: string;
    title: string;
    date: string;
    description?: string;
    file?: string;
    fileName?: string;
}

interface Sermon {
    _id: string;
    title: string;
    minister: Minister;
    date: string;
    description: string;
    youtubeLink: string;
    duration: number;
    bulletinId?: Bulletin;
    createdAt: string;
}

export default function SermonDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { generalSettings } = useLandingPage();
    const [sermon, setSermon] = useState<Sermon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSermon = async () => {
            try {
                const response = await request.get(`/sermon/${id}`);
                if (response.data) {
                    setSermon(response.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch sermon:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSermon();
        }
    }, [id]);

    const getYouTubeEmbedUrl = (url: string): string => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return "";
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
        return `${mins} minutes`;
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <MainHeader />
                <div className={styles.loadingContainer}>
                    <LoadingSpinner size="large" text="Loading sermon..." />
                </div>
                <Footer generalSettings={generalSettings} />
            </div>
        );
    }

    if (error || !sermon) {
        return (
            <div className={styles.page}>
                <MainHeader />
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>🎬</div>
                    <h1>Sermon Not Found</h1>
                    <p>The sermon you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => router.push("/sermons")} className={styles.backBtn}>
                        ← Back to Sermons
                    </button>
                </div>
                <Footer generalSettings={generalSettings} />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <MainHeader />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Back Button */}
                    <button onClick={() => router.push("/sermons")} className={styles.backLink}>
                        ← Back to all sermons
                    </button>

                    {/* Video Section */}
                    <div className={styles.videoSection}>
                        <div className={styles.videoWrapper}>
                            <iframe
                                src={getYouTubeEmbedUrl(sermon.youtubeLink)}
                                title={sermon.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className={styles.video}
                            />
                        </div>
                    </div>

                    {/* Sermon Info */}
                    <div className={styles.sermonInfo}>
                        <h1 className={styles.title}>{sermon.title}</h1>

                        <div className={styles.metaInfo}>
                            <span className={styles.metaItem}>
                                📅 {formatDate(sermon.date)}
                            </span>
                            <span className={styles.metaItem}>
                                🕐 {formatTime(sermon.date)}
                            </span>
                            <span className={styles.metaItem}>
                                ⏱️ {formatDuration(sermon.duration)}
                            </span>
                        </div>

                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: sermon.description }}
                        />
                    </div>

                    {/* Minister Section */}
                    {sermon.minister && typeof sermon.minister === 'object' && sermon.minister.name && (
                        <div className={styles.ministerSection}>
                            <h2 className={styles.sectionTitle}>Minister</h2>
                            <div className={styles.ministerCard}>
                                <div className={styles.ministerImageWrapper}>
                                    {sermon.minister.image ? (
                                        <img
                                            src={sermon.minister.image}
                                            alt={sermon.minister.name}
                                            className={styles.ministerImage}
                                        />
                                    ) : (
                                        <div className={styles.ministerPlaceholder}>
                                            {sermon.minister.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.ministerInfo}>
                                    <h3 className={styles.ministerName}>{sermon.minister.name}</h3>
                                    <p className={styles.ministerPosition}>
                                        {sermon.minister.position}
                                        {sermon.minister.department && ` • ${sermon.minister.department}`}
                                    </p>
                                    {sermon.minister.bio && (
                                        <p className={styles.ministerBio}>{sermon.minister.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bulletin Section */}
                    {sermon.bulletinId && (
                        <div className={styles.bulletinSection}>
                            <h2 className={styles.sectionTitle}>Related Bulletin</h2>
                            <div className={styles.bulletinCard}>
                                <div className={styles.bulletinIcon}>📋</div>
                                <div className={styles.bulletinInfo}>
                                    <h3 className={styles.bulletinTitle}>{sermon.bulletinId.title}</h3>
                                    <p className={styles.bulletinDate}>
                                        {formatDate(sermon.bulletinId.date)}
                                    </p>
                                    {sermon.bulletinId.description && (
                                        <div
                                            className={styles.bulletinDesc}
                                            dangerouslySetInnerHTML={{ __html: sermon.bulletinId.description }}
                                        />
                                    )}
                                    {sermon.bulletinId.file && (
                                        <a
                                            href={sermon.bulletinId.file}
                                            download={sermon.bulletinId.fileName || "bulletin.pdf"}
                                            className={styles.downloadBtn}
                                        >
                                            📥 Download Bulletin
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Watch on YouTube Link */}
                    <div className={styles.youtubeLink}>
                        <a
                            href={sermon.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.youtubeBtn}
                        >
                            ▶️ Watch on YouTube
                        </a>
                    </div>
                </div>
            </main>
            <Footer generalSettings={generalSettings} />
        </div>
    );
}
