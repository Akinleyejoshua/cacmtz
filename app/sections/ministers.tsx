"use client"

import React from "react";
import styles from "./ministers.module.css";

type Minister = {
  id: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  image: string;
};

const DEFAULT_MINISTERS: Minister[] = [
  {
    id: "pastor1",
    name: "Rev. Dr. Samuel Oluwade",
    position: "Senior Pastor",
    department: "Leadership",
    contact: "+234 (0) 701 234 5678",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "pastor2",
    name: "Rev. Timothy Awosika",
    position: "Associate Pastor",
    department: "Worship & Praise",
    contact: "+234 (0) 702 234 5678",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "pastor3",
    name: "Deaconess Mary Adeyemi",
    position: "Children's Pastor",
    department: "Sunday School",
    contact: "+234 (0) 703 234 5678",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "pastor4",
    name: "Pastor Grace Okafor",
    position: "Women's Pastor",
    department: "Women Ministry",
    contact: "+234 (0) 704 234 5678",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    id: "pastor5",
    name: "Pastor Emmanuel Nwosu",
    position: "Youth Pastor",
    department: "Youth Ministry",
    contact: "+234 (0) 705 234 5678",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c006ae3e?w=400&h=400&fit=crop",
  },
  {
    id: "pastor6",
    name: "Bishop Ismail Adamu",
    position: "Overseer",
    department: "Administration",
    contact: "+234 (0) 706 234 5678",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
];

interface MinistersSectionProps {
  ministers?: Minister[];
  title?: string;
  subtitle?: string;
}

export default function MinistersSection({
  ministers = DEFAULT_MINISTERS,
  title = "Our Ministers",
  subtitle = "Dedicated servants of Christ leading our church community",
}: MinistersSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Ministers Grid */}
        <div className={styles.grid}>
          {ministers.map((minister) => (
            <div key={minister.id} className={styles.card}>
              {/* Image Container */}
              <div className={styles.imageWrapper}>
                <img src={minister.image} alt={minister.name} className={styles.image} />
                <div className={styles.imageOverlay}>
                  <a href={`tel:${minister.contact}`} className={styles.callBtn} title="Call">
                    📞
                  </a>
                </div>
              </div>

              {/* Info Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.name}>{minister.name}</h3>
                <p className={styles.position}>{minister.position}</p>
                <div className={styles.badge}>{minister.department}</div>
                <a href={`tel:${minister.contact}`} className={styles.contact}>
                  {minister.contact}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
