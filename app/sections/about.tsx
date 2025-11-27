"use client"

import React from "react";
import styles from "./about.module.css";

type Value = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type AboutSectionProps = {
  title?: string;
  subtitle?: string;
  vision?: string;
  mission?: string;
  motto?: string;
  about?: string;
  values?: Value[];
};

const DEFAULT_VALUES: Value[] = [
  {
    id: "faith",
    title: "Faith",
    description: "Unwavering trust in God's word and promises",
    icon: "✨",
  },
  {
    id: "integrity",
    title: "Integrity",
    description: "Living with honesty and moral uprightness",
    icon: "⚖️",
  },
  {
    id: "service",
    title: "Service",
    description: "Committed to serving others with humility",
    icon: "🤝",
  },
  {
    id: "love",
    title: "Love",
    description: "Demonstrating Christ-like love in all dealings",
    icon: "❤️",
  },
  {
    id: "excellence",
    title: "Excellence",
    description: "Striving for the highest standards in all we do",
    icon: "🏆",
  },
  {
    id: "unity",
    title: "Unity",
    description: "Standing together as one body in Christ",
    icon: "🕊️",
  },
];

export default function AboutSection({
  title = "About C.A.C Mount Zion",
  subtitle = "Know Our Purpose and Direction",
  vision = "To be a beacon of hope and transformation, spreading the gospel of Jesus Christ and impacting lives across generations",
  mission = "To glorify God through passionate worship, comprehensive discipleship, and servant-hearted ministry that transforms individuals and communities",
  motto = "A Kingdom of God on Earth",
  about = "C.A.C Mount Zion is a vibrant community of believers dedicated to advancing God's kingdom. We are committed to creating an environment where people encounter God's transformative power, grow in their faith journey, and become agents of positive change in their communities.",
  values = DEFAULT_VALUES,
}: AboutSectionProps) {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* About Overview */}
        <div className={styles.overview}>
          <p className={styles.aboutText}>{about}</p>
        </div>

        {/* Core Cards Section */}
        <div className={styles.cardsGrid}>
          {/* Vision Card */}
          <div className={styles.coreCard}>
            <div className={styles.cardIcon}>👁️</div>
            <h3 className={styles.cardTitle}>Our Vision</h3>
            <p className={styles.cardContent}>{vision}</p>
          </div>

          {/* Mission Card */}
          <div className={styles.coreCard}>
            <div className={styles.cardIcon}>🎯</div>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <p className={styles.cardContent}>{mission}</p>
          </div>

          {/* Motto Card */}
          <div className={styles.coreCard}>
            <div className={styles.cardIcon}>🔥</div>
            <h3 className={styles.cardTitle}>Our Motto</h3>
            <p className={styles.cardContent}>{motto}</p>
          </div>
        </div>

        {/* Values Section */}
        <div className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>Our Core Values</h2>
          <p className={styles.valuesSubtitle}>The principles that guide our actions and decisions</p>

          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
