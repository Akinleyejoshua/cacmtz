"use client";

import React from "react";

import styles from "./page.module.css";

export default function NotificationsPage() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Coming soon...</p>
        </div>
        <p className={styles.message}>This feature is currently under development.</p>
      </div>
    </div>
  );
}
