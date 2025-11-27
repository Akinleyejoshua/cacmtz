"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopNav from "../../../../components/admin-top-nav";
import Editor from "../../../../components/editor";
import styles from "./page.module.css";

type Bulletin = {
  id: string;
  title: string;
  date: Date;
  description?: string;
  content: string;
  isActive: boolean;
};

// Sample bulletins data
const SAMPLE_BULLETINS: Bulletin[] = [
  {
    id: "b001",
    title: "Sunday Service - Nov 30, 2025",
    date: new Date("2025-11-30"),
    description: "Weekly Sunday worship service",
    content: `# Order of Service

## Sunday, November 30, 2025

### Opening
- Welcome & Announcements
- Opening Hymn: "Great is Thy Faithfulness"
- Prayer of Invocation

### Worship
- Praise & Worship Songs
- Intercessory Prayer
- Special Music

### Word
- Scripture Reading: Psalm 119:1-8
- Sermon: "The Foundation of Faith"
- Altar Call

### Closing
- Closing Hymn: "Jesus Paid It All"
- Benediction

---
**Service Ends: 11:45 AM**
**Next Week: Christmas Celebration Service**`,
    isActive: true,
  },
  {
    id: "b002",
    title: "Midweek Prayer Meeting - Nov 26, 2025",
    date: new Date("2025-11-26"),
    description: "Prayer and Bible study session",
    content: `# Midweek Prayer Meeting

## Wednesday, November 26, 2025
**Time: 7:00 PM - 8:30 PM**

### Agenda
1. Welcome (7:00 - 7:05)
2. Opening Prayer (7:05 - 7:10)
3. Scripture Reading & Meditation (7:10 - 7:25)
4. Prayer Requests (7:25 - 7:50)
5. Group Prayer Session (7:50 - 8:20)
6. Closing Remarks (8:20 - 8:30)

### Focus Area
Prayers for:
- Nation & Leadership
- Church Growth
- Personal Requests
- Missionaries

**Location: Main Hall**`,
    isActive: true,
  },
  {
    id: "b003",
    title: "Youth Conference - Dec 15, 2025",
    date: new Date("2025-12-15"),
    description: "Annual youth conference and camp",
    content: `# Youth Conference 2025

## December 15-17, 2025

### Program Schedule

**Friday, Dec 15**
- 6:00 PM: Registration & Welcome Dinner
- 7:30 PM: Opening Session - "Purpose & Vision"

**Saturday, Dec 16**
- 8:00 AM: Breakfast & Icebreakers
- 9:00 AM: Workshops
- 12:00 PM: Lunch
- 2:00 PM: Sports & Recreation
- 6:00 PM: Dinner
- 7:30 PM: Evening Service

**Sunday, Dec 17**
- 8:00 AM: Prayer Breakfast
- 10:00 AM: Final Service
- 12:00 PM: Lunch & Departure

### Activities
- Skill-Building Workshops
- Sports Competitions
- Talent Show
- Team Building Games`,
    isActive: false,
  },
];

export default function EditBulletinPage() {
  const router = useRouter();
  const params = useParams();
  const bulletinId = params.id as string;

  const [formData, setFormData] = useState<Omit<Bulletin, "id"> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load bulletin data
  useEffect(() => {
    const bulletin = SAMPLE_BULLETINS.find((b) => b.id === bulletinId);

    if (!bulletin) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFormData({
      title: bulletin.title,
      date: bulletin.date,
      description: bulletin.description || "",
      content: bulletin.content,
      isActive: bulletin.isActive,
    });
    setLoading(false);
  }, [bulletinId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData?.title.trim()) {
      newErrors.title = "Bulletin title is required";
    }

    if (!formData?.content.trim()) {
      newErrors.content = "Bulletin content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === "date" ? new Date(value) : value,
      };
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content,
      };
    });
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/bulletin-manager");
      }, 1000);
    } catch (error) {
      console.error("Error updating bulletin:", error);
      setErrors({ submit: "Failed to update bulletin. Please try again." });
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className={styles.page}>
        <AdminTopNav />
        <div className={styles.header}>
          <div className={styles.loadingSpinner}>Loading bulletin...</div>
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
            <h1 className={styles.pageTitle}>Bulletin Not Found</h1>
            <p className={styles.subtitle}>The bulletin you're looking for doesn't exist.</p>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button onClick={handleCancel} className={styles.secondaryBtn} style={{ marginTop: "2rem" }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Edit Bulletin</h1>
          <p className={styles.subtitle}>
            Update bulletin: <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{bulletinId}</span>
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Bulletin updated successfully! Redirecting...</span>
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
              Bulletin ID <span className={styles.hint}>(Read-only)</span>
            </label>
            <input
              type="text"
              id="bulletinId"
              value={bulletinId}
              readOnly
              className={styles.idInput}
              style={{ fontFamily: "monospace" }}
            />
            <p className={styles.helperText}>This is the unique identifier for this bulletin</p>
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
                setFormData((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    isActive: e.target.checked,
                  };
                })
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
            Edit the order of service and bulletin content using markdown formatting.
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
