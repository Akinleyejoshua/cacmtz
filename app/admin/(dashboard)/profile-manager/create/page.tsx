"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import { useChurchProfileManager } from "@/app/hooks/use-church-profile-manager";
import RichTextEditor from "@/app/components/rich-text-editor";

type Profile = {
  id: string;
  title: string;
  content: string;
  description?: string;
  order: number;
  isActive: boolean;
};

export default function CreateProfilePage() {
  const {

    formData,
    errors,
    loading,
    success,
    handleChange,

    handleContentChange,
    handleSubmit,
    handleCancel,
  } = useChurchProfileManager()

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Create New Profile</h1>
          <p className={styles.subtitle}>Add a new church profile tab</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Profile created successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>

          {/* Profile Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Profile Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Overview, Leadership, Ministries"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          {/* Profile Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Short Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="A brief description for this profile tab"
              className={styles.input}
            />
          </div>
        </div>

        {/* Content Editor Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Profile Content</h2>
          <p className={styles.sectionSubtitle}>
            Use markdown formatting to style your content. The content will be displayed as a tab on the landing page.
          </p>

          {errors.content && <span className={styles.errorText}>{errors.content}</span>}

          <div style={{ marginTop: "1rem" }}>
            {/* <Editor
              placeholder="Write your profile content using markdown..."
              defaultValue={formData.content}
              onContentChange={handleContentChange}
              height="1000px"
            /> */}
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
