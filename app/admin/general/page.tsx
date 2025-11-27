"use client";

import { useState, useEffect } from "react";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";
import { IEvent } from "../../api/models/event";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [formData, setFormData] = useState({
    marqueeAlert: "",
    watchword: "",
    latestEvent: "",
    socialHandles: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    churchAddress: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, eventsRes] = await Promise.all([
        fetch("/api/general"),
        fetch("/api/get-events"),
      ]);

      const settings = await settingsRes.json();
      const eventsData = await eventsRes.json();

      setEvents(eventsData);
      if (settings) {
        setFormData({
          marqueeAlert: settings.marqueeAlert || "",
          watchword: settings.watchword || "",
          latestEvent: settings.latestEvent || "",
          socialHandles: {
            facebook: settings.socialHandles?.facebook || "",
            twitter: settings.socialHandles?.twitter || "",
            instagram: settings.socialHandles?.instagram || "",
            youtube: settings.socialHandles?.youtube || "",
          },
          churchAddress: settings.churchAddress || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialHandles: {
          ...prev.socialHandles,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/general", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <AdminTopNav />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>General</h1>
            <p className={styles.subtitle}>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <AdminTopNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>General</h1>
          <p className={styles.subtitle}>Manage general website settings</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Marquee Alert</label>
            <input
              type="text"
              name="marqueeAlert"
              value={formData.marqueeAlert}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter marquee alert text"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Watchword</label>
            <textarea
              name="watchword"
              value={formData.watchword}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter watchword"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Latest Event</label>
            <select
              name="latestEvent"
              value={formData.latestEvent}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select an event</option>
              {events.map((event: any) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Church Address</label>
            <textarea
              name="churchAddress"
              value={formData.churchAddress}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter church address"
            />
          </div>

          <h3 className={styles.sectionTitle}>Social Handles</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Facebook</label>
            <input
              type="text"
              name="social.facebook"
              value={formData.socialHandles.facebook}
              onChange={handleChange}
              className={styles.input}
              placeholder="Facebook URL"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Twitter</label>
            <input
              type="text"
              name="social.twitter"
              value={formData.socialHandles.twitter}
              onChange={handleChange}
              className={styles.input}
              placeholder="Twitter URL"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Instagram</label>
            <input
              type="text"
              name="social.instagram"
              value={formData.socialHandles.instagram}
              onChange={handleChange}
              className={styles.input}
              placeholder="Instagram URL"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>YouTube</label>
            <input
              type="text"
              name="social.youtube"
              value={formData.socialHandles.youtube}
              onChange={handleChange}
              className={styles.input}
              placeholder="YouTube URL"
            />
          </div>

          <button type="submit" className={styles.button} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
