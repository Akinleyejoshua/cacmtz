"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './image-slideshow.module.css';

interface ImageSlideshowProps {
    images: string[];
    alt: string;
    interval?: number; // milliseconds
}

export default function ImageSlideshow({
    images,
    alt,
    interval = 4000
}: ImageSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance slideshow
    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    // Handle empty or single image cases
    if (!images || images.length === 0) {
        return (
            <Image
                src="/img/brand/logo.jpg"
                alt={alt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        );
    }

    if (images.length === 1) {
        return (
            <Image
                src={images[0]}
                alt={alt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        );
    }

    // Slideshow for multiple images
    return (
        <div className={styles.slideshow}>
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                >
                    <Image
                        src={src}
                        alt={`${alt} - ${index + 1}`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ))}

            {/* Slide indicators */}
            <div className={styles.indicators}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
