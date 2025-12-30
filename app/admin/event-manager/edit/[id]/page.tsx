"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminTopNav from "../../../../components/admin-top-nav";
import styles from "./page.module.css";
import { useEventManager } from "@/app/hooks/use-event-manager";
import request from "@/app/utils/axios";
import RichTextEditor from "@/app/components/rich-text-editor";


interface PageProps {
  params: {
    id: string;
  };
}

export default function EditEventPage({ }: PageProps) {
  const {
    setFormData, formData, events,
    fileToBase64, ministers, bulletins
  } = useEventManager();
  const { id }: any = useParams();


  const router = useRouter();
  const eventData = events.find((item: any) => item._id == id);



  const get_events = async () => {
    const res: any = await request.post("/get-event", { id: id });
    let res_data = res.data;

    // Normalize eventMinisters to IDs if they are populated objects
    if (Array.isArray(res_data.eventMinisters) && res_data.eventMinisters.length > 0 && typeof res_data.eventMinisters[0] === 'object') {
      res_data.eventMinisters = res_data.eventMinisters.map((m: any) => m._id);
    }

    // Normalize bulletinId to ID if it is a populated object
    if (res_data.bulletinId && typeof res_data.bulletinId === 'object') {
      res_data.bulletinId = res_data.bulletinId._id;
    }

    setFormData(res_data)
  }

  useEffect(() => {
    get_events();
  }, [eventData])

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Event image URL is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (formData.date < new Date()) {
      newErrors.date = "Event date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else if (name === "date") {
      setFormData((prev: any) => ({
        ...prev,
        date: value,
        dateTime: new Date(value).getTime(),

      }));
    } else if (name === "time") {
      const [hours, minutes, type] = value.split(":");
      setFormData((prev: any) => ({
        ...prev,
        time: `${hours}:${minutes}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
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
      // Simulate API call
      await request.post("/update-event", { data: formData, id });

      router.push("/admin/event-manager");

      setSuccess(true);

    } catch (error) {
      console.error("Error updating event:", error);
      setErrors({ submit: "Failed to update event. Please try again." });
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

  const formatTimeForInput = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (!eventData) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Event Not Found</h1>
          <p className={styles.subtitle}>The event you're trying to edit doesn't exist.</p>
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
          <h1 className={styles.pageTitle}>Edit Event</h1>
          <p className={styles.subtitle}>Update event details</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Event updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>

          {/* Event Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Event Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="title"
              value={formData?.title}
              onChange={handleChange}
              placeholder="Enter event name"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <RichTextEditor
              content={formData.description || ""}
              onChange={(content: string) => setFormData((prev: any) => ({ ...prev, description: content }))}
              initialContent={formData.description || ""}
            />
          </div>

          {/* Event Image */}
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Event Image URL <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              // value={formData.image}
              onChange={async (e: any) => {
                const file = e.target.files[0];
                const base64DataURL = await fileToBase64(file);
                setFormData((prev: any) => ({
                  ...prev,
                  image: base64DataURL,
                }));

              }}
              // placeholder="https://example.com/image.jpg"
              className={`${styles.input} ${errors.image ? styles.inputError : ""}`}
            />
            {errors.image && <span className={styles.errorText}>{errors.image}</span>}
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Event preview" className={styles.previewImg} />
              </div>
            )}
          </div>
        </div>

        {/* Date & Time Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Date & Time</h2>

          <div className={styles.formRow}>
            {/* Date */}
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={(formData.date)}
                onChange={handleChange}
                className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
              />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>

            {/* Time */}
            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={(formData.time)}
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
              // min="1"
              // step="15"
              className={`${styles.input} ${errors.duration ? styles.inputError : ""}`}
            />
            {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
            <p className={styles.helperText}>
              Duration: {Math.floor(formData.duration / 60)}h {formData.duration % 60}m
            </p>
          </div>
        </div>

        {/* Location & Links Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Location & Links</h2>

          {/* Location */}
          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Hall, Virtual, Downtown Area"
              className={`${styles.input} ${errors.location ? styles.inputError : ""}`}
            />
            {errors.location && <span className={styles.errorText}>{errors.location}</span>}
          </div>

          {/* Live Link */}
          <div className={styles.formGroup}>
            <label htmlFor="liveLink" className={styles.label}>
              Live Stream/Details Link
            </label>
            <input
              type="url"
              id="liveLink"
              name="liveLink"
              value={formData.liveLink || ""}
              onChange={handleChange}
              placeholder="https://example.com/live"
              className={styles.input}
            />
          </div>

          {/* Is Live */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isLive"
              name="isLive"
              checked={formData.isLive}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isLive" className={styles.checkboxLabel}>
              Mark as Live Event
            </label>
          </div>
        </div>

        {/* Recurrence Configuration Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Recurrence Configuration</h2>

          {/* Is Recurring Toggle */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isRecurring"
              name="isRecurring"
              checked={formData.isRecurring || false}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isRecurring" className={styles.checkboxLabel}>
              This is a recurring event
            </label>
          </div>

          {formData.isRecurring && (
            <>
              {/* Recurrence Type */}
              <div className={styles.formGroup}>
                <label htmlFor="recurrenceType" className={styles.label}>
                  Repeat
                </label>
                <select
                  id="recurrenceType"
                  name="recurrenceType"
                  value={formData.recurrenceType || 'weekly'}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Recurrence Interval */}
              <div className={styles.formGroup}>
                <label htmlFor="recurrenceInterval" className={styles.label}>
                  Every
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    id="recurrenceInterval"
                    name="recurrenceInterval"
                    value={formData.recurrenceInterval || 1}
                    onChange={handleChange}
                    min="1"
                    className={styles.input}
                    style={{ width: '80px' }}
                  />
                  <span>
                    {formData.recurrenceType === 'daily' && 'day(s)'}
                    {formData.recurrenceType === 'weekly' && 'week(s)'}
                    {formData.recurrenceType === 'monthly' && 'month(s)'}
                    {formData.recurrenceType === 'yearly' && 'year(s)'}
                  </span>
                </div>
              </div>

              {/* Weekly Day Selection */}
              {formData.recurrenceType === 'weekly' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Repeat on</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={(formData.recurrenceDays || []).includes(index)}
                          onChange={(e) => {
                            const days = formData.recurrenceDays || [];
                            if (e.target.checked) {
                              setFormData((prev: any) => ({
                                ...prev,
                                recurrenceDays: [...days, index].sort()
                              }));
                            } else {
                              setFormData((prev: any) => ({
                                ...prev,
                                recurrenceDays: days.filter((d: number) => d !== index)
                              }));
                            }
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  <p className={styles.helperText}>Select which days of the week the event repeats</p>
                </div>
              )}

              {/* Recurrence End Date */}
              <div className={styles.formGroup}>
                <label htmlFor="recurrenceEndDate" className={styles.label}>
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="recurrenceEndDate"
                  name="recurrenceEndDate"
                  value={formData.recurrenceEndDate || ''}
                  onChange={handleChange}
                  className={styles.input}
                />
                <p className={styles.helperText}>Leave empty for no end date</p>
              </div>

              {/* Recurrence Count */}
              <div className={styles.formGroup}>
                <label htmlFor="recurrenceCount" className={styles.label}>
                  Number of Occurrences (Optional)
                </label>
                <input
                  type="number"
                  id="recurrenceCount"
                  name="recurrenceCount"
                  value={formData.recurrenceCount || ''}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 10"
                  className={styles.input}
                />
                <p className={styles.helperText}>Alternative to end date - stop after X occurrences</p>
              </div>
            </>
          )}
        </div>

        {/* Detailed View Settings */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Detailed View Settings</h2>

          {/* Public Detailed View Toggle */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isPublicDetailedView"
              name="isPublicDetailedView"
              checked={formData.isPublicDetailedView || false}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isPublicDetailedView" className={styles.checkboxLabel}>
              Enable Public Detailed Page
            </label>
            <p className={styles.helperText} style={{ marginLeft: '28px' }}>
              If enabled, a detailed page with ministers and bulletin info will be accessible publicly.
            </p>
          </div>

          {formData.isPublicDetailedView && (
            <>
              {/* Event Ministers */}
              <div className={styles.formGroup}>
                <label htmlFor="eventMinisters" className={styles.label}>
                  Select Ministers
                </label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                  {ministers.length > 0 ? (
                    ministers.map((minister: any) => (
                      <div key={minister._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          id={`minister-${minister._id}`}
                          value={minister._id}
                          checked={(formData.eventMinisters || []).includes(minister._id)}
                          onChange={(e) => {
                            const selected = formData.eventMinisters || [];
                            if (e.target.checked) {
                              setFormData((prev: any) => ({
                                ...prev,
                                eventMinisters: [...selected, minister._id]
                              }));
                            } else {
                              setFormData((prev: any) => ({
                                ...prev,
                                eventMinisters: selected.filter((id: string) => id !== minister._id)
                              }));
                            }
                          }}
                          style={{ marginRight: '10px' }}
                        />
                        <label htmlFor={`minister-${minister._id}`} style={{ cursor: 'pointer' }}>
                          {minister.name} ({minister.position})
                        </label>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No ministers available. Add ministers in Minister Manager.</p>
                  )}
                </div>
              </div>

              {/* Bulletin Selection */}
              <div className={styles.formGroup}>
                <label htmlFor="bulletinId" className={styles.label}>
                  Link Bulletin
                </label>
                <select
                  id="bulletinId"
                  name="bulletinId"
                  value={formData.bulletinId || ""}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">-- Select a Bulletin --</option>
                  {bulletins.map((bulletin: any) => (
                    <option key={bulletin._id} value={bulletin._id}>
                      {bulletin.title} ({new Date(bulletin.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                <p className={styles.helperText}>
                  Select a bulletin to display its description and download link on the event page.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
