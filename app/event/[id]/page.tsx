import React from "react";
import EventService from "@/app/api/services/event";
import GeneralService from "@/app/api/services/general";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import MainHeader from "../../components/main-header";
import Footer from "../../sections/footer";
import { renderMarkdown } from "../../utils/helpers";

/* eslint-disable @next/next/no-img-element */

export const revalidate = 0; // Ensure fresh data on every request

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventService = new EventService();
    const generalService = new GeneralService();

    let event: any = null;
    let generalSettings: any = null;

    try {
        const [eventData, generalData] = await Promise.all([
            eventService.get_event(id),
            generalService.get_general()
        ]);
        event = JSON.parse(JSON.stringify(eventData));
        generalSettings = JSON.parse(JSON.stringify(generalData));

    } catch (error) {
        console.error("Error fetching data:", error);
        notFound();
    }

    if (!event) {
        notFound();
    }

    // Check if detailed view is public
    if (!event.isPublicDetailedView) {
        return (
            <div className={styles.page}>
                <MainHeader />
                <div className={styles.privateMessage}>
                    <h1 className={styles.privateTitle}>Event Details Not Available</h1>
                    <p style={{ color: '#666' }}>The detailed view for this event is currently not public.</p>
                    <Link href="/" className={styles.backLink}>
                        ← Back to Home
                    </Link>
                </div>
                <Footer generalSettings={generalSettings} />
            </div>
        );
    }

    // Helper to format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className={styles.page}>
            <MainHeader />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className={styles.heroImage}
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", backgroundColor: "#333" }}></div>
                    )}
                </div>

                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{event.title}</h1>
                    <div className={styles.meta}>
                        <span>{formatDate(event.date)} at {event.time}</span>
                        <span>{event.location}</span>
                    </div>

                    {event.isLive && event.liveLink && (
                        <a
                            href={event.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.liveButton}
                        >
                            Watch Live
                        </a>
                    )}
                </div>
            </section>

            <div className={styles.contentContainer}>

                {/* Description */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>About the Event</h2>
                    <div className={styles.description}>
                        {event.description}
                    </div>
                </section>

                {/* Ministers */}
                {event.eventMinisters && event.eventMinisters.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ministers</h2>
                        <div className={styles.ministersGrid}>
                            {event.eventMinisters.map((minister: any) => (
                                <div key={minister._id} className={styles.ministerCard}>
                                    <div className={styles.ministerImageWrapper}>
                                        {minister.image ? (
                                            <img
                                                src={minister.image}
                                                alt={minister.name}
                                                className={styles.ministerImage}
                                            />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={styles.ministerName}>{minister.name}</h3>
                                    <p className={styles.ministerRole}>{minister.position}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Bulletin / Order of Service */}
                {event.bulletinId && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Bulletin & Order of Service</h2>

                        <div className={styles.bulletinCard}>
                            <div className={styles.bulletinHeader}>
                                <div className={styles.bulletinInfo}>
                                    <h3>{event.bulletinId.title}</h3>
                                    <div className={styles.bulletinDate}>{new Date(event.bulletinId.date).toLocaleDateString()}</div>
                                </div>

                                {/* Download Button */}
                                {event.bulletinId.file && (
                                    <a
                                        href={event.bulletinId.file}
                                        download={event.bulletinId.fileName || "bulletin.pdf"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.downloadButton}
                                    >
                                        <span>Download Bulletin</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 16L7 11H10V4H14V11H17L12 16ZM12 18C16.4183 18 20 18 20 18V20H4V18C4 18 7.58172 18 12 18Z" fill="white" />
                                        </svg>
                                    </a>
                                )}
                            </div>

                            {/* Bulletin HTML Content */}
                            {event.bulletinId.description && (
                                <div
                                    className={styles.richTextContent}
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(event.bulletinId.description) }}
                                />
                            )}
                        </div>
                    </section>
                )}
            </div>

            <Footer generalSettings={generalSettings} />
        </div>
    );
}
