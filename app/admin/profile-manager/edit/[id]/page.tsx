"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminTopNav from "../../../../components/admin-top-nav";
import Editor from "../../../../components/editor";
import styles from "./page.module.css";
import { useChurchProfileManager } from "@/app/hooks/use-church-profile-manager";
import request from "@/app/utils/axios";

type Profile = {
  _id: string;
  title: string;
  content: string;
  description?: string;
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProfilePage({  }: PageProps) {
  const router = useRouter();
  const {id} = useParams();
  const {profiles} = useChurchProfileManager();
  const profileData:any = profiles.find((item:any) => item._id == id)

  

  const [formData, setFormData] = useState<Profile>(
    profileData || {
      _id: "",
      title: "",
      description: "",
      content: "",
    }
  );

  useEffect(() => {
    setFormData(profileData)
}, [profiles])

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Profile title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Profile content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 1 : value,
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
      await request.post("/update-church-profile", {id, data: formData})

      setSuccess(true);
             router.push("/admin/profile-manager");

    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!profileData) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Profile Not Found</h1>
          <p className={styles.subtitle}>The profile you're trying to edit doesn't exist.</p>
        </div>
        <button onClick={handleCancel} className={styles.secondaryBtn}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <AdminTopNav />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Edit Profile</h1>
          <p className={styles.subtitle}>Update profile content and settings</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Profile updated successfully! Redirecting...</span>
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
              value={profileData?.title}
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
              value={profileData?.description || ""}
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
            <Editor
              placeholder="Write your profile content using markdown..."
              defaultValue={profileData?.content}
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
