"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";

export default function EditMinisterPage() {
    const router = useRouter();
    const params = useParams();
    const ministerId = params.id as string;

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
        bio: "",
        images: [] as string[],
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchMinister = async () => {
            try {
                const res: any = await request.get(`/ministers/${ministerId}`);
                const minister = res.data;

                if (!minister) {
                    setNotFound(true);
                    return;
                }

                // Resolve images: check both multi-photo `images` and legacy `image`
                let resolvedImages: string[] = [];
                if (Array.isArray(minister.images) && minister.images.length > 0) {
                    resolvedImages = minister.images;
                } else if (minister.image) {
                    resolvedImages = [minister.image];
                }

                setFormData({
                    name: minister.name,
                    position: minister.position,
                    department: minister.department,
                    email: minister.email || "",
                    phone: minister.phone || "",
                    bio: minister.bio || "",
                    images: resolvedImages,
                    displayOrder: minister.displayOrder || 0,
                    type: minister.type || "regular",
                    isVisible: minister.isVisible !== undefined ? minister.isVisible : true,
                    socialLinks: {
                        facebook: minister.socialLinks?.facebook || "",
                        twitter: minister.socialLinks?.twitter || "",
                        instagram: minister.socialLinks?.instagram || "",
                        linkedin: minister.socialLinks?.linkedin || "",
                    },
                });
            } catch (error) {
                console.error("Failed to fetch minister:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMinister();
    }, [ministerId]);

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
        const { name, value, type, files, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
            return;
        }

        if (type === "file" && files && files.length > 0) {
            const filesArray = Array.from(files);
            const promises = filesArray.map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(promises).then((base64Images) => {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images],
                }));
            });
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

        setSaving(true);

        try {
            const payload = {
                ...formData,
                image: formData.images[0] || "",
            };
            await request.put(`/ministers/${ministerId}`, payload);
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
                <div className={styles.header}>
                    <div className={styles.loadingSpinner}><LoadingSpinner size="medium" /></div>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.pageTitle}>Minister Not Found</h1>
                        <p className={styles.subtitle}>The minister you're looking for doesn't exist.</p>
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
            <div className={styles.container}>

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

                        {/* Images Upload */}
                        <div className={styles.formGroup}>
                            <label htmlFor="images" className={styles.label}>Profile Images (Multiple)</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                                className={styles.input}
                            />
                            <p className={styles.helperText}>Upload additional images for a slideshow effect.</p>

                            {formData.images.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '14px', marginTop: '16px' }}>
                                    {formData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'relative',
                                                background: 'rgba(255, 255, 255, 0.04)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                padding: '8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <div style={{ position: 'relative', width: '100%', height: '100px' }}>
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                                                />
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        left: '4px',
                                                        background: 'rgba(0, 0, 0, 0.75)',
                                                        color: index === 0 ? '#facc15' : '#ffffff',
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        padding: '2px 5px',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    {index === 0 ? '★ Primary' : `#${index + 1}`}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`Delete image #${index + 1}?`)) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== index)
                                                        }));
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    border: '1px solid rgba(239, 68, 68, 0.35)',
                                                    color: '#fca5a5',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <span>🗑️</span>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                value={formData.displayOrder}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                className={styles.input}
                                style={{ width: '120px' }}
                            />
                            <p className={styles.helperText}>Lower numbers display first. Use this to control the minister hierarchy.</p>
                        </div>
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
                        <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.primaryBtn} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
