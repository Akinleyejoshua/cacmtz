"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "../page.module.css";
import request from "@/app/utils/axios";

import RichTextEditor from "../../../components/rich-text-editor";

export default function CreateBulletinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    file: "",
    fileName: "",
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      await request.post("/bulletins", formData);
      router.push("/admin/bulletin-manager");
    } catch (error) {
      console.error("Failed to create bulletin:", error);
      alert("Failed to create bulletin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>Create Bulletin</h1>
            <p className={styles.subtitle}>Add a new bulletin or announcement</p>
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
                placeholder="e.g., Sunday Service Bulletin"
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
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Creating..." : "Create Bulletin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
