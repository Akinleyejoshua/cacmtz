"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopNav from "../../../components/admin-top-nav";
import styles from "./page.module.css";
import request from "@/app/utils/axios";

export default function CreateMinisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
        bio: "",
        image: "",
        displayOrder: 0,
        type: "regular",
        isVisible: true,
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
        }

        if (!formData.department.trim()) {
            newErrors.department = "Department is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, files, type, checked } = target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
            return;
        }

        if (type === "file" && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData((prev) => ({
                    ...prev,
                    image: base64,
                }));
            };
            reader.readAsDataURL(file);
            return;
        }
        if (name.startsWith("social_")) {
            const socialKey = name.replace("social_", "");
            setFormData((prev) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialKey]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
            await request.post("/ministers", formData);
            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/ministers-manager");
            }, 1000);
        } catch (error) {
            console.error("Error creating minister:", error);
            setErrors({ submit: "Failed to create minister. Please try again." });
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
            <div className={styles.container}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.pageTitle}>Add New Minister</h1>
                        <p className={styles.subtitle}>Add a new minister to the church leadership</p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className={styles.successMessage}>
                        <span className={styles.successIcon}>✓</span>
                        <span>Minister created successfully! Redirecting...</span>
                    </div>
                )}

                {/* Error Message */}
                {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Personal Information */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Personal Information</h2>

                        {/* Name */}
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

                        {/* Minister Type & Visibility */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="type" className={styles.label}>
                                    Minister Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={styles.input}
                                >
                                    <option value="regular">Regular Minister</option>
                                    <option value="guest">Guest Minister</option>
                                </select>
                            </div>

                            <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <label className={styles.label} style={{ marginBottom: '10px' }}>
                                    Visibility
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        id="isVisible"
                                        name="isVisible"
                                        checked={formData.isVisible}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="isVisible" style={{ cursor: 'pointer' }}>
                                        Show on Ministers Page
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Position & Department */}
                        <div className={styles.formRow}>
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

                            <div className={styles.formGroup}>
                                <label htmlFor="department" className={styles.label}>
                                    Department <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g., Pastoral Care"
                                    className={`${styles.input} ${errors.department ? styles.inputError : ""}`}
                                />
                                {errors.department && <span className={styles.errorText}>{errors.department}</span>}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g., john@cacmz.org"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g., +234 803 123 4567"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className={styles.formGroup}>
                            <label htmlFor="bio" className={styles.label}>
                                Biography
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Brief biography..."
                                className={styles.textarea}
                                rows={4}
                            />
                        </div>
                    </div>
                    {/* Image Upload */}
                    <div className={styles.formGroup}>
                        <label htmlFor="image" className={styles.label}>Profile Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    {/* Display Order */}
                    <div className={styles.formGroup}>
                        <label htmlFor="displayOrder" className={styles.label}>
                            Display Order
                        </label>
                        <input
                            type="number"
                            id="displayOrder"
                            name="displayOrder"
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className={styles.input}
                            style={{ width: '120px' }}
                        />
                        <p className={styles.helperText}>Lower numbers display first. Use this to control the minister hierarchy.</p>
                    </div>

                    {/* Social Media */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Social Media (Optional)</h2>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="social_facebook" className={styles.label}>Facebook URL</label>
                                <input
                                    type="url"
                                    id="social_facebook"
                                    name="social_facebook"
                                    value={formData.socialLinks.facebook}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/..."
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="social_twitter" className={styles.label}>Twitter URL</label>
                                <input
                                    type="url"
                                    id="social_twitter"
                                    name="social_twitter"
                                    value={formData.socialLinks.twitter}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/..."
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="social_instagram" className={styles.label}>Instagram URL</label>
                                <input
                                    type="url"
                                    id="social_instagram"
                                    name="social_instagram"
                                    value={formData.socialLinks.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/..."
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="social_linkedin" className={styles.label}>LinkedIn URL</label>
                                <input
                                    type="url"
                                    id="social_linkedin"
                                    name="social_linkedin"
                                    value={formData.socialLinks.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={styles.formActions}>
                        <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.primaryBtn} disabled={loading}>
                            {loading ? "Creating..." : "Create Minister"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
