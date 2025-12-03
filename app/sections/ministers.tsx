"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Minister } from '../types/minister';
import styles from './ministers.module.css';
import { FaSearch, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';

interface MinistersSectionProps {
    ministers: Minister[];
    showSearch?: boolean;
    title?: string;
    subtitle?: string;
}

export default function MinistersSection({
    ministers,
    showSearch = true,
    title = "Our Ministers",
    subtitle = "Meet the dedicated leaders serving our community with passion and grace."
}: MinistersSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMinisters = useMemo(() => {
        if (!showSearch) return ministers;
        return ministers.filter(minister =>
            minister.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            minister.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            minister.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [ministers, searchTerm, showSearch]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    <br></br>
                    {ministers.length == 0 && <small>Loading....</small>}
                </div>

                {ministers.length > 0 &&
                    <>

                        {showSearch && (
                            <div className={styles.searchContainer}>
                                <div className={styles.searchInputWrapper}>
                                    <FaSearch className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Search ministers by name, role, or department..."
                                        className={styles.searchInput}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.grid}>
                            {filteredMinisters.length > 0 ? (
                                filteredMinisters.map((minister) => (
                                    <div key={minister._id} className={styles.card}>
                                        <div className={styles.imageContainer}>
                                            <Image
                                                src={minister.image || '/src/img/brand/logo.jpg'}
                                                alt={minister.name}
                                                fill
                                                className={styles.image}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className={styles.overlay} />
                                        </div>
                                        <div className={styles.content}>
                                            <div className={styles.headerInfo}>
                                                <div className={styles.roleBadge}>
                                                    <span className={styles.role}>{minister.position}</span>
                                                </div>
                                                <h3 className={styles.name}>{minister.name}</h3>
                                                <p className={styles.department}>{minister.department}</p>
                                            </div>

                                            {minister.bio && <p className={styles.bio}>{minister.bio}</p>}

                                            <div className={styles.actions}>
                                                {minister.phone ? (
                                                    <a href={`tel:${minister.phone}`} className={`${styles.actionButton} ${styles.primaryAction}`}>
                                                        <FaPhone size={14} /> Call
                                                    </a>
                                                ) : (
                                                    <span className={`${styles.actionButton} ${styles.secondaryAction}`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                        <FaPhone size={14} /> Call
                                                    </span>
                                                )}
                                                {minister.email ? (
                                                    <a href={`mailto:${minister.email}`} className={`${styles.actionButton} ${styles.secondaryAction}`}>
                                                        <FaEnvelope size={14} /> Email
                                                    </a>
                                                ) : (
                                                    <span className={`${styles.actionButton} ${styles.secondaryAction}`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                        <FaEnvelope size={14} /> Email
                                                    </span>
                                                )}
                                            </div>

                                            <div className={styles.socials}>
                                                {minister.socialLinks?.facebook && (
                                                    <a href={minister.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                                        <FaFacebook size={18} />
                                                    </a>
                                                )}
                                                {minister.socialLinks?.twitter && (
                                                    <a href={minister.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                                        <FaTwitter size={18} />
                                                    </a>
                                                )}
                                                {minister.socialLinks?.instagram && (
                                                    <a href={minister.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                                        <FaInstagram size={18} />
                                                    </a>
                                                )}
                                                {minister.socialLinks?.linkedin && (
                                                    <a href={minister.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                                        <FaLinkedin size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>No ministers found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </>}


            </div>
        </section>
    );
}
