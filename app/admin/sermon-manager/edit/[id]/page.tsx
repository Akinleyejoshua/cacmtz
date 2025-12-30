"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopNav from "../../../../components/admin-top-nav";
import styles from "./page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";
import RichTextEditor from "@/app/components/rich-text-editor";

export default function EditSermonPage() {
  const router = useRouter();
  const params = useParams();
  const sermonId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    minister: "",
    youtubeLink: "",
    date: "",
    time: "",
    duration: 45,
    bulletinId: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const res: any = await request.get(`/sermon/${sermonId}`, { params: { id: sermonId } });
        const sermon = res.data;

        if (!sermon) {
          setNotFound(true);
          return;
        }

        const timestamp = new Date(sermon.date);
        setFormData({
          title: sermon.title,
          minister: sermon.minister,
          youtubeLink: sermon.youtubeLink,
          date: timestamp.toISOString().split("T")[0],
          time: timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          duration: sermon.duration,
          bulletinId: sermon.bulletinId || "",
          description: sermon.description || "",
        });
      } catch (error) {
        console.error("Failed to fetch sermon:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [sermonId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Sermon title is required";
    }

    if (!formData.minister.trim()) {
      newErrors.minister = "Minister name is required";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    setSaving(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        ...formData,
        date: dateTime,
      };

      await request.put(`/sermon/${sermonId}`, payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/sermon-manager");
      }, 1000);
    } catch (error) {
      console.error("Error updating sermon:", error);
      setErrors({ submit: "Failed to update sermon. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <AdminTopNav />
        <div className={styles.header}>
          <div className={styles.loadingSpinner}><LoadingSpinner size="medium" /></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <AdminTopNav />
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>Sermon Not Found</h1>
            <p className={styles.subtitle}>The sermon you're looking for doesn't exist.</p>
            <button style={{ width: "max-content", marginTop: "1rem" }} onClick={handleCancel} className={styles.secondaryBtn}>
              Go Back
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Edit Sermon</h1>
          <p className={styles.subtitle}>
            Update sermon: <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{sermonId}</span>
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Sermon updated successfully! Redirecting...</span>
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
              Sermon ID <span className={styles.hint}>(Read-only)</span>
            </label>
            <input
              type="text"
              id="sermonId"
              value={sermonId}
              readOnly
              className={styles.idInput}
              style={{ fontFamily: "monospace" }}
            />
            <p className={styles.helperText}>This is the unique identifier for this sermon</p>
          </div>

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

          {/* Minister Name */}
          <div className={styles.formGroup}>
            <label htmlFor="minister" className={styles.label}>
              Minister Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="minister"
              name="minister"
              value={formData.minister}
              onChange={handleChange}
              placeholder="e.g., Pastor John Adekunle"
              className={`${styles.input} ${errors.minister ? styles.inputError : ""}`}
            />
            {errors.minister && <span className={styles.errorText}>{errors.minister}</span>}
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
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
