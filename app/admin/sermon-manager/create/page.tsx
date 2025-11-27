"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopNav from "../../../components/admin-top-nav";
import styles from "./page.module.css";

type Sermon = {
  id: string;
  name: string;
  ministerName: string;
  youtubeLink: string;
  timestamp: Date;
  duration: number;
  bulletinId: string;
};

function generateSermonId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5);
  return `s${timestamp}${randomStr}`.toUpperCase();
}

export default function CreateSermonPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    ministerName: "",
    youtubeLink: "",
    timestamp: new Date().toISOString().split("T")[0],
    time: "10:00",
    duration: 45,
    bulletinId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState(generateSermonId());

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Sermon name is required";
    }

    if (!formData.ministerName.trim()) {
      newErrors.ministerName = "Minister name is required";
    }

    if (!formData.youtubeLink.trim()) {
      newErrors.youtubeLink = "YouTube link is required";
    } else if (!isValidYouTubeLink(formData.youtubeLink)) {
      newErrors.youtubeLink = "Please enter a valid YouTube link";
    }

    if (!formData.timestamp) {
      newErrors.timestamp = "Date is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeLink = (url: string): boolean => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/sermon-manager");
      }, 1000);
    } catch (error) {
      console.error("Error creating sermon:", error);
      setErrors({ submit: "Failed to create sermon. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Create New Sermon</h1>
          <p className={styles.subtitle}>Add a new sermon recording</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Sermon created successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Sermon Information */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Sermon Information</h2>

          {/* Sermon ID */}
          <div className={styles.formGroup}>
            <label htmlFor="sermonId" className={styles.label}>
              Sermon ID <span className={styles.hint}>(Auto-generated)</span>
            </label>
            <div className={styles.idDisplay}>
              <input
                type="text"
                id="sermonId"
                value={generatedId}
                readOnly
                className={styles.idInput}
              />
              <button
                type="button"
                onClick={() => setGeneratedId(generateSermonId())}
                className={styles.regenerateBtn}
                title="Generate new ID"
              >
                🔄
              </button>
            </div>
            <p className={styles.helperText}>This unique ID will identify the sermon</p>
          </div>

          {/* Sermon Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Sermon Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., The Foundation of Faith"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Minister Name */}
          <div className={styles.formGroup}>
            <label htmlFor="ministerName" className={styles.label}>
              Minister Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="ministerName"
              name="ministerName"
              value={formData.ministerName}
              onChange={handleChange}
              placeholder="e.g., Pastor John Adekunle"
              className={`${styles.input} ${errors.ministerName ? styles.inputError : ""}`}
            />
            {errors.ministerName && <span className={styles.errorText}>{errors.ministerName}</span>}
          </div>

          {/* YouTube Link */}
          <div className={styles.formGroup}>
            <label htmlFor="youtubeLink" className={styles.label}>
              YouTube Link <span className={styles.required}>*</span>
            </label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`${styles.input} ${errors.youtubeLink ? styles.inputError : ""}`}
            />
            {errors.youtubeLink && <span className={styles.errorText}>{errors.youtubeLink}</span>}
          </div>

          {/* Date and Time Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="timestamp" className={styles.label}>
                Sermon Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                className={`${styles.input} ${errors.timestamp ? styles.inputError : ""}`}
              />
              {errors.timestamp && <span className={styles.errorText}>{errors.timestamp}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Duration */}
          <div className={styles.formGroup}>
            <label htmlFor="duration" className={styles.label}>
              Duration (minutes) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              max="600"
              className={`${styles.input} ${errors.duration ? styles.inputError : ""}`}
            />
            {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
          </div>

          {/* Bulletin ID */}
          <div className={styles.formGroup}>
            <label htmlFor="bulletinId" className={styles.label}>
              Bulletin ID
            </label>
            <input
              type="text"
              id="bulletinId"
              name="bulletinId"
              value={formData.bulletinId}
              onChange={handleChange}
              placeholder="e.g., b001"
              className={styles.input}
            />
            <p className={styles.helperText}>Link this sermon to a bulletin (optional)</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Sermon"}
          </button>
        </div>
      </form>
    </div>
  );
}
