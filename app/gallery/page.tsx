"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MainHeader from "../components/main-header";
import Footer from "../sections/footer";
import styles from './gallery.module.css';
import { GalleryItem } from '../types/gallery';
import request from '../utils/axios';
import { useLandingPage } from '../hooks/use-landing-page';
import { SplashScreen } from '../components/splash-screen';

export default function GalleryPage() {
  const { generalSettings, loading:generalLoading } = useLandingPage();

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await request.get('/gallery');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching gallery items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);
  if (generalLoading) return SplashScreen();

    return (
        <div className={styles.pageWrapper}>
            <MainHeader />

            <main className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Our Gallery</h1>
                        <p className={styles.subtitle}>
                            Capturing moments of grace, community, and worship.
                        </p>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading gallery...</div>
                    ) : items.length > 0 ? (
                        <div className={styles.grid} id='gallery'>
                            {items.map((item) => (
                                <div key={item._id} className={styles.card}>
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className={styles.overlay}>
                                        <div className={styles.info}>
                                            <h3 className={styles.cardTitle}>{item.title}</h3>
                                            {item.category && (
                                                <span className={styles.category}>{item.category}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>No photos found in the gallery yet.</p>
                        </div>
                    )}
                </div>
            </main>

      <Footer generalSettings={generalSettings} />
        </div>
    );
}
