"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import request from "@/app/utils/axios";
import RichTextEditor from "@/app/components/rich-text-editor";
import LoadingSpinner from "@/app/components/loading-spinner";

interface Minister {
  _id: string;
  name: string;
  position: string;
}

interface Bulletin {
  _id: string;
  title: string;
  date: string;
}

export default function CreateSermonPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    minister: "",
    youtubeLink: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    duration: 45,
    bulletinId: "",
    description: "",
  });

  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch ministers and bulletins
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [ministersRes, bulletinsRes] = await Promise.all([
          request.get("/ministers"),
          request.get("/bulletins"),
        ]);
        setMinisters(ministersRes.data || []);
        setBulletins(bulletinsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dependencies:", error);
      } finally {
        setLoadingDeps(false);
      }
    };

    fetchDependencies();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Sermon title is required";
    }

    if (!formData.minister) {
      newErrors.minister = "Please select a minister";
    }

    if (!formData.youtubeLink.trim()) {
      newErrors.youtubeLink = "YouTube link is required";
    } else if (!isValidYouTubeLink(formData.youtubeLink)) {
      newErrors.youtubeLink = "Please enter a valid YouTube link";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeLink = (url: string): boolean => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        ...formData,
        date: dateTime,
      };

      await request.post("/sermon", payload);
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

  if (loadingDeps) {
    return (
      <div className={styles.page}>
        
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      

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

          {/* Sermon Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Sermon Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., The Foundation of Faith"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          {/* Minister Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="minister" className={styles.label}>
              Minister <span className={styles.required}>*</span>
            </label>
            <select
              id="minister"
              name="minister"
              value={formData.minister}
              onChange={handleChange}
              className={`${styles.input} ${errors.minister ? styles.inputError : ""}`}
            >
              <option value="">-- Select a Minister --</option>
              {ministers.map((minister) => (
                <option key={minister._id} value={minister._id}>
                  {minister.name} ({minister.position})
                </option>
              ))}
            </select>
            {errors.minister && <span className={styles.errorText}>{errors.minister}</span>}
            {ministers.length === 0 && (
              <p className={styles.helperText}>No ministers available. Add ministers in Minister Manager first.</p>
            )}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={(content: string) => setFormData((prev: any) => ({ ...prev, description: content }))}
              initialContent={formData.description}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
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
              <label htmlFor="date" className={styles.label}>
                Sermon Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
              />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
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

          {/* Bulletin Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="bulletinId" className={styles.label}>
              Link Bulletin (Optional)
            </label>
            <select
              id="bulletinId"
              name="bulletinId"
              value={formData.bulletinId}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">-- No Bulletin --</option>
              {bulletins.map((bulletin) => (
                <option key={bulletin._id} value={bulletin._id}>
                  {bulletin.title} ({new Date(bulletin.date).toLocaleDateString()})
                </option>
              ))}
            </select>
            <p className={styles.helperText}>Link this sermon to a bulletin for additional resources.</p>
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
