"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopNav from "../../../components/admin-top-nav";
import styles from "./page.module.css";
import { useEventManager } from "@/app/hooks/use-event-manager";


export default function CreateEventPage() {
  const {
    formData, handleChange,
    handleSubmit,
    handleCancel,
    fileToBase64,
    errors,
    loading,
    success,
    setFormData,
    state,
  } = useEventManager()
  return (
    <div className={styles.page}>
      <AdminTopNav />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Create New Event</h1>
          <p className={styles.subtitle}>Add a new event to the calendar</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <span>Event created successfully! Redirecting...</span>
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
              id="title"
              name="title"

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
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              placeholder="Enter event description"
              rows={4}
              className={styles.textarea}
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
                // value={formData.date.toISOString().split("T")[0]}
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
              checked={formData.isLive || false}
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

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.secondaryBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {state.loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
