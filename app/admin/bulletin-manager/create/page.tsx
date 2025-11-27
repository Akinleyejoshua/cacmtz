"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopNav from "../../../components/admin-top-nav";
import Editor from "../../../components/editor";
import styles from "./page.module.css";

type Bulletin = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  content: string;
  isActive: boolean;
};

function generateBulletinId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5);
  return `b${timestamp}${randomStr}`.toUpperCase();
}

export default function CreateBulletinPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<Bulletin, "id">>({
    title: "",
    date: new Date(),
    description: "",
    content: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState(generateBulletinId());

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Bulletin title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Bulletin content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/bulletin-manager");
      }, 1000);
    } catch (error) {
      console.error("Error creating bulletin:", error);
      setErrors({ submit: "Failed to create bulletin. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Create New Bulletin</h1>
          <p className={styles.subtitle}>Add a new church bulletin</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Bulletin created successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Bulletin Information</h2>

          {/* Bulletin ID (Read-only) */}
          <div className={styles.formGroup}>
            <label htmlFor="bulletinId" className={styles.label}>
              Bulletin ID <span className={styles.hint}>(Auto-generated)</span>
            </label>
            <div className={styles.idDisplay}>
              <input
                type="text"
                id="bulletinId"
                value={generatedId}
                readOnly
                className={styles.idInput}
              />
              <button
                type="button"
                onClick={() => setGeneratedId(generateBulletinId())}
                className={styles.regenerateBtn}
                title="Generate new ID"
              >
                🔄
              </button>
            </div>
            <p className={styles.helperText}>This unique ID will identify the bulletin</p>
          </div>

          {/* Bulletin Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Bulletin Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Sunday Service - Nov 30, 2025"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          {/* Bulletin Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief description (optional)"
              className={styles.input}
            />
          </div>

          {/* Bulletin Date */}
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Bulletin Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formatDateForInput(formData.date)}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {/* Active Status */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className={styles.checkbox}
            />
            <label htmlFor="isActive" className={styles.checkboxLabel}>
              Make this bulletin active
            </label>
          </div>
        </div>

        {/* Content Editor Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Bulletin Content</h2>
          <p className={styles.sectionSubtitle}>
            Write the order of service and bulletin content using markdown formatting.
          </p>

          {errors.content && <span className={styles.errorText}>{errors.content}</span>}

          <div style={{ marginTop: "1rem" }}>
            <Editor
              placeholder="Write your bulletin content here (e.g., Order of Service, Announcements, etc.)..."
              defaultValue={formData.content}
              onContentChange={handleContentChange}
              height="500px"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Bulletin"}
          </button>
        </div>
      </form>
    </div>
  );
}
