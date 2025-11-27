"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopNav from "../../../../components/admin-top-nav";
import styles from "./page.module.css";
type Minister = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
};

const SAMPLE_MINISTERS: Minister[] = [
  {
    id: "m001",
    name: "Pastor John Adekunle",
    position: "Senior Pastor",
    department: "Pastoral Care",
    email: "john.adekunle@cacmz.org",
    phone: "+234 803 123 4567",
    bio: "Over 20 years of pastoral ministry experience. Specializes in biblical teaching and community outreach.",
  },
  {
    id: "m002",
    name: "Bishop Samuel Okafor",
    position: "Overseer",
    department: "Administration",
    email: "samuel.okafor@cacmz.org",
    phone: "+234 703 234 5678",
    bio: "Bishop Samuel oversees all church operations and provides spiritual guidance to the congregation.",
  },
  {
    id: "m003",
    name: "Pastor Amara Emeka",
    position: "Pastoral Assistant",
    department: "Youth Ministry",
    email: "amara.emeka@cacmz.org",
    phone: "+234 802 345 6789",
    bio: "Dedicated to youth development and Christian education. Passionate about mentoring young believers.",
  },
  {
    id: "m004",
    name: "Deacon Michael Obi",
    position: "Deacon",
    department: "Ushering",
    email: "michael.obi@cacmz.org",
    phone: "+234 701 456 7890",
    bio: "Serves as head deacon with focus on welcoming and organizing church services.",
  },
];

const DEPARTMENTS = [
  "Pastoral Care",
  "Administration",
  "Youth Ministry",
  "Ushering",
  "Music Ministry",
  "Prayer Ministry",
  "Outreach",
  "Education",
];

export default function EditMinisterPage() {
  const router = useRouter();
  const params = useParams();
  const ministerId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: DEPARTMENTS[0],
    email: "",
    phone: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const minister = SAMPLE_MINISTERS.find((m) => m.id === ministerId);

    if (!minister) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFormData({
      name: minister.name,
      position: minister.position,
      department: minister.department,
      email: minister.email,
      phone: minister.phone,
      bio: minister.bio,
    });
    setLoading(false);
  }, [ministerId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Minister name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/ministers-manager");
      }, 1000);
    } catch (error) {
      console.error("Error updating minister:", error);
      setErrors({ submit: "Failed to update minister. Please try again." });
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
          <div className={styles.loadingSpinner}>Loading minister...</div>
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
            <h1 className={styles.pageTitle}>Minister Not Found</h1>
            <p className={styles.subtitle}>The minister you're looking for doesn't exist.</p>
          </div>
        </div>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <button onClick={handleCancel} className={styles.secondaryBtn} style={{ marginTop: "2rem" }}>
            Go Back
          </button>
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
          <h1 className={styles.pageTitle}>Edit Minister</h1>
          <p className={styles.subtitle}>
            Update minister: <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{ministerId}</span>
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Minister updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Minister Information */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Minister Information</h2>

          {/* Minister ID */}
          <div className={styles.formGroup}>
            <label htmlFor="ministerId" className={styles.label}>
              Minister ID <span className={styles.hint}>(Read-only)</span>
            </label>
            <input
              type="text"
              id="ministerId"
              value={ministerId}
              readOnly
              className={styles.idInput}
              style={{ fontFamily: "monospace" }}
            />
            <p className={styles.helperText}>This is the unique identifier for this minister</p>
          </div>

          {/* Name and Position */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Pastor John Adekunle"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="position" className={styles.label}>
                Position <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Senior Pastor"
                className={`${styles.input} ${errors.position ? styles.inputError : ""}`}
              />
              {errors.position && <span className={styles.errorText}>{errors.position}</span>}
            </div>
          </div>

          {/* Department */}
          <div className={styles.formGroup}>
            <label htmlFor="department" className={styles.label}>
              Department <span className={styles.required}>*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={styles.input}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Email and Phone */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john@cacmz.org"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +234 803 123 4567"
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>

          {/* Bio */}
          <div className={styles.formGroup}>
            <label htmlFor="bio" className={styles.label}>
              Bio <span className={styles.required}>*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about this minister..."
              className={`${styles.input} ${errors.bio ? styles.inputError : ""}`}
              rows={5}
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
            {errors.bio && <span className={styles.errorText}>{errors.bio}</span>}
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
