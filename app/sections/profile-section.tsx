"use client"

import React, { useEffect, useRef, useState } from "react";
import styles from "./profile-section.module.css";
import { renderMarkdown } from "../utils/helpers";
import LoadingSpinner from "../components/loading-spinner";

type Tab = {
    id: string;
    title: string;
    content: React.ReactNode;
};

interface ProfileSectionProps {
    tabs?: Tab[];
    initialIndex?: number;
    title?: string;
    subtitle?: string;
    profiles: any;
}

export default function ProfileSection({
    tabs,
    initialIndex = 0,
    title = "Profile",
    subtitle = "Explore pages below",
    profiles,
}: ProfileSectionProps) {
    const defaultTabs = profiles
    const tabList = tabs && tabs.length ? tabs : defaultTabs;
    const [active, setActive] = useState(Math.min(Math.max(initialIndex, 0), tabList.length - 1));
    const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

    // keyboard navigation for accessibility
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                setActive((s) => (s + 1) % tabList.length);
                tabsRef.current[(active + 1) % tabList.length]?.focus();
            } else if (e.key === "ArrowLeft") {
                setActive((s) => (s - 1 + tabList.length) % tabList.length);
                tabsRef.current[(active - 1 + tabList.length) % tabList.length]?.focus();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [active, tabList.length]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <br></br>
                    {profiles.length == 0 && <LoadingSpinner size="medium" />}

                </div>

                {profiles.length > 0 &&

                    <>
                        <div className={styles.tabWrapper}>
                            <div role="tablist" aria-label="Profile tabs" className={styles.tabList}>
                                {tabList.map((t: any, i: any) => (
                                    <button
                                        key={t._id}
                                        // ref={(el) => (tabsRef.current[i] = el)}
                                        role="tab"
                                        id={`tab-${t.id}`}
                                        aria-controls={`panel-${t.id}`}
                                        aria-selected={active === i}
                                        tabIndex={active === i ? 0 : -1}
                                        className={`${styles.tab} ${active === i ? styles.active : ""}`}
                                        onClick={() => setActive(i)}
                                    >
                                        <span className={styles.tabTitle}>{t.title}</span>
                                        {/* <span className={styles.tabCount}>{i + 1}</span> */}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.panels}>
                                {tabList.map((t: any, i: any) => (
                                    <div
                                        key={t._id}
                                        id={`panel-${t.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`tab-${t.id}`}
                                        hidden={active !== i}
                                        className={styles.panel}
                                    >
                                        <div className={styles.preview} dangerouslySetInnerHTML={{ __html: renderMarkdown(t.content) }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </>


                }
            </div>
        </section>
    );
}
