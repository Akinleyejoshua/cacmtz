"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";

import RichTextEditor from "@/app/components/rich-text-editor";

export default function EditBulletinPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    file: "",
    fileName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBulletin = async () => {
      try {
        const res = await request.get(`/bulletins/${id}`);
        const bulletin = res.data;
        setFormData({
          title: bulletin.title,
          date: new Date(bulletin.date).toISOString().split("T")[0],
          description: bulletin.description || "",
          file: bulletin.file || "",
          fileName: bulletin.fileName || "",
        });
      } catch (error) {
        console.error("Failed to fetch bulletin:", error);
        alert("Failed to fetch bulletin details");
        router.push("/admin/bulletin-manager");
      } finally {
        setLoading(false);
      }
    };

    fetchBulletin();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          file: reader.result as string,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await request.put(`/bulletins/${id}`, formData);
      router.push("/admin/bulletin-manager");
    } catch (error) {
      console.error("Failed to update bulletin:", error);
      alert("Failed to update bulletin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}><LoadingSpinner size="medium" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>Edit Bulletin</h1>
            <p className={styles.subtitle}>Update bulletin information</p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bulletin File (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <RichTextEditor
                content={formData.description}
                onChange={handleEditorChange}
                initialContent={formData.description}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={styles.submitBtn}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
