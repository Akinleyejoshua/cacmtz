"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/app/utils/axios";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/app/utils/youtube";
import {
  OutreachSettingsData,
  BankAccountData,
  OutreachVideoData,
  ChurchProjectData,
} from "@/app/types/outreach";
import {
  FaVideo,
  FaCreditCard,
  FaHandHoldingHeart,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styles from "./page.module.css";

// Common preset Nigerian banks
const PRESET_BANKS = [
  { bank: "Access Bank", logo: "/src/img/donations/abank.png" },
  { bank: "First Bank PLC", logo: "/src/img/donations/fbank.jpg" },
  { bank: "Guaranty Trust Bank", logo: "/src/img/donations/gtbank.jpg" },
  { bank: "UBA", logo: "/src/img/donations/uba.png" },
  { bank: "Zenith Bank", logo: "/src/img/donations/zbank.png" },
];

export default function OutreachManagerPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "videos" | "accounts" | "projects">("settings");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data states
  const [settings, setSettings] = useState<OutreachSettingsData>({
    heading: "CAC MOUNT ZION GLOBAL KINGDOM OUTREACH",
    subtitle: "Partnering together to impact lives, spread the Gospel, and build God's Kingdom.",
    verseText: "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.",
    verseRef: "2 Corinthians 9:7",
  });
  const [videos, setVideos] = useState<OutreachVideoData[]>([]);
  const [accounts, setAccounts] = useState<BankAccountData[]>([]);
  const [projects, setProjects] = useState<ChurchProjectData[]>([]);

  // Modals state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<OutreachVideoData | null>(null);
  const [videoForm, setVideoForm] = useState({ title: "", description: "", youtubeUrl: "", order: 0 });

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountData | null>(null);
  const [accountForm, setAccountForm] = useState({
    bank: "Access Bank",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "",
    type: "Current",
    logo: "/src/img/donations/abank.png",
    accepts: "Tithe, General offering",
    order: 0,
  });

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ChurchProjectData | null>(null);
  const [projectForm, setProjectForm] = useState<{
    title: string;
    description: string;
    amount: string;
    currency: string;
    status: "Active" | "Ongoing" | "Completed";
    images: string[];
  }>({
    title: "",
    description: "",
    amount: "",
    currency: "NGN",
    status: "Active",
    images: [],
  });

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Fetch all initial data
  const fetchAllData = async () => {
    try {
      const res = await request.get("/outreach");
      if (res.data) {
        if (res.data.settings) setSettings(res.data.settings);
        if (res.data.videos) setVideos(res.data.videos);
        if (res.data.accounts) setAccounts(res.data.accounts);
        if (res.data.projects) setProjects(res.data.projects);
      }
    } catch (err) {
      console.error("Failed to load outreach manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 1. Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await request.put("/outreach/settings", settings);
      showNotification("Outreach header and scripture settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // 2. Video CRUD
  const handleOpenVideoModal = (video?: OutreachVideoData) => {
    if (video) {
      setEditingVideo(video);
      setVideoForm({
        title: video.title,
        description: video.description,
        youtubeUrl: video.youtubeUrl,
        order: video.order || 0,
      });
    } else {
      setEditingVideo(null);
      setVideoForm({ title: "", description: "", youtubeUrl: "", order: 0 });
    }
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeUrl) {
      alert("Please enter a title and valid YouTube URL.");
      return;
    }

    try {
      if (editingVideo) {
        const res = await request.put(`/outreach/videos/${editingVideo._id}`, videoForm);
        setVideos((prev) => prev.map((v) => (v._id === editingVideo._id ? res.data : v)));
        showNotification("Video updated successfully!");
      } else {
        const res = await request.post("/outreach/videos", videoForm);
        setVideos((prev) => [res.data, ...prev]);
        showNotification("New Revelation video added successfully!");
      }
      setVideoModalOpen(false);
    } catch (err) {
      console.error("Failed to save video:", err);
      alert("Failed to save video.");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await request.delete(`/outreach/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      showNotification("Video deleted.");
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert("Failed to delete video.");
    }
  };

  // 3. Bank Account CRUD
  const handleOpenAccountModal = (account?: BankAccountData) => {
    if (account) {
      setEditingAccount(account);
      setAccountForm({
        bank: account.bank,
        name: account.name,
        accountNumber: account.accountNumber,
        type: account.type || "Current",
        logo: account.logo || "/src/img/donations/abank.png",
        accepts: (account.accepts || []).join(", "),
        order: account.order || 0,
      });
    } else {
      setEditingAccount(null);
      setAccountForm({
        bank: "Access Bank",
        name: "C.A.C Mount Zion Ojodu",
        accountNumber: "",
        type: "Current",
        logo: "/src/img/donations/abank.png",
        accepts: "Tithe, General offering",
        order: 0,
      });
    }
    setAccountModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.bank || !accountForm.name || !accountForm.accountNumber) {
      alert("Please provide the bank name, account name, and account number.");
      return;
    }

    const payload = {
      bank: accountForm.bank,
      name: accountForm.name,
      accountNumber: accountForm.accountNumber,
      type: accountForm.type,
      logo: accountForm.logo,
      accepts: accountForm.accepts.split(",").map((s) => s.trim()).filter(Boolean),
      order: accountForm.order,
    };

    try {
      if (editingAccount) {
        const res = await request.put(`/outreach/accounts/${editingAccount._id}`, payload);
        setAccounts((prev) => prev.map((a) => (a._id === editingAccount._id ? res.data : a)));
        showNotification("Bank account updated!");
      } else {
        const res = await request.post("/outreach/accounts", payload);
        setAccounts((prev) => [...prev, res.data]);
        showNotification("New bank account added!");
      }
      setAccountModalOpen(false);
    } catch (err) {
      console.error("Failed to save account:", err);
      alert("Failed to save bank account.");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;
    try {
      await request.delete(`/outreach/accounts/${id}`);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
      showNotification("Bank account deleted.");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete bank account.");
    }
  };

  // 4. Project CRUD
  const handleOpenProjectModal = (project?: ChurchProjectData) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        amount: project.amount !== null && project.amount !== undefined ? String(project.amount) : "",
        currency: project.currency || "NGN",
        status: project.status || "Active",
        images: project.images || [],
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        description: "",
        amount: "",
        currency: "NGN",
        status: "Active",
        images: [],
      });
    }
    setProjectModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProjectForm((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProjectForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      alert("Please provide a project title and description.");
      return;
    }

    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      amount: projectForm.amount ? Number(projectForm.amount) : null,
      currency: projectForm.currency,
      status: projectForm.status,
      images: projectForm.images,
    };

    try {
      if (editingProject) {
        const res = await request.put(`/outreach/projects/${editingProject._id}`, payload);
        setProjects((prev) => prev.map((p) => (p._id === editingProject._id ? res.data : p)));
        showNotification("Church project updated!");
      } else {
        const res = await request.post("/outreach/projects", payload);
        setProjects((prev) => [res.data, ...prev]);
        showNotification("New church project created!");
      }
      setProjectModalOpen(false);
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Failed to save project.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await request.delete(`/outreach/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      showNotification("Project deleted.");
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p>Loading Outreach Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Global Kingdom Outreach Manager</h1>
          <p className={styles.subtitle}>
            Manage outreach headlines, Revelation videos, church bank accounts, and fundraising projects
          </p>
        </div>

        {activeTab === "videos" && (
          <button type="button" className={styles.actionBtn} onClick={() => handleOpenVideoModal()}>
            <FaPlus />
            <span>Add Video</span>
          </button>
        )}

        {activeTab === "accounts" && (
          <button type="button" className={styles.actionBtn} onClick={() => handleOpenAccountModal()}>
            <FaPlus />
            <span>Add Bank Account</span>
          </button>
        )}

        {activeTab === "projects" && (
          <button type="button" className={styles.actionBtn} onClick={() => handleOpenProjectModal()}>
            <FaPlus />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {successMessage && <div className={styles.noticeSuccess}>{successMessage}</div>}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "settings" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog />
          <span>Page & Scripture Settings</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "videos" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          <FaVideo />
          <span>Revelation (Videos)</span>
          <span className={styles.badgeCount}>{videos.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "accounts" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("accounts")}
        >
          <FaCreditCard />
          <span>Account Details</span>
          <span className={styles.badgeCount}>{accounts.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "projects" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          <FaHandHoldingHeart />
          <span>Projects</span>
          <span className={styles.badgeCount}>{projects.length}</span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: SETTINGS */}
      {/* ========================================= */}
      {activeTab === "settings" && (
        <div className={styles.settingsCard}>
          <h2 className={styles.cardSectionTitle}>Outreach Page Header & Scripture</h2>
          <form onSubmit={handleSaveSettings}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Main Heading</label>
              <input
                type="text"
                className={styles.input}
                value={settings.heading}
                onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                required
              />
              <span className={styles.hint}>
                Appears as the top title on the public outreach & giving section.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subtitle / Tagline</label>
              <textarea
                className={styles.textarea}
                value={settings.subtitle}
                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Giving Scripture Verse Text</label>
              <textarea
                className={styles.textarea}
                value={settings.verseText}
                onChange={(e) => setSettings({ ...settings, verseText: e.target.value })}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Scripture Reference</label>
              <input
                type="text"
                className={styles.input}
                value={settings.verseRef}
                onChange={(e) => setSettings({ ...settings, verseRef: e.target.value })}
                placeholder="e.g. 2 Corinthians 9:7"
              />
            </div>

            <button type="submit" className={styles.saveBtn} disabled={savingSettings}>
              <FaSave />
              <span>{savingSettings ? "Saving..." : "Save Settings"}</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: REVELATION (VIDEOS) */}
      {/* ========================================= */}
      {activeTab === "videos" && (
        <div className={styles.grid}>
          {videos.length === 0 ? (
            <div className={styles.emptyState}>
              <FaVideo style={{ fontSize: 36, opacity: 0.4 }} />
              <h3 className={styles.emptyStateTitle}>No Revelation Videos Found</h3>
              <p>Add YouTube videos showcasing your church outreaches and community impact.</p>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ marginTop: 12 }}
                onClick={() => handleOpenVideoModal()}
              >
                + Add First Video
              </button>
            </div>
          ) : (
            videos.map((vid) => {
              const thumbUrl = getYouTubeThumbnailUrl(vid.youtubeUrl);
              return (
                <div key={vid._id} className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={vid.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.cardImage}
                      />
                    ) : (
                      <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                        No preview
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{vid.title}</h3>
                    <p className={styles.cardDesc}>{vid.description}</p>
                    <div className={styles.cardMeta}>
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        <span>Open YouTube</span>
                        <FaExternalLinkAlt size={11} />
                      </a>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleOpenVideoModal(vid)}
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteVideo(vid._id)}
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 3: ACCOUNT DETAILS */}
      {/* ========================================= */}
      {activeTab === "accounts" && (
        <div className={styles.grid}>
          {accounts.length === 0 ? (
            <div className={styles.emptyState}>
              <FaCreditCard style={{ fontSize: 36, opacity: 0.4 }} />
              <h3 className={styles.emptyStateTitle}>No Bank Accounts Found</h3>
              <p>Add the church bank accounts so partners and donors can contribute.</p>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ marginTop: 12 }}
                onClick={() => handleOpenAccountModal()}
              >
                + Add Bank Account
              </button>
            </div>
          ) : (
            accounts.map((acc) => (
              <div key={acc._id} className={styles.bankCardAdmin}>
                <div className={styles.bankHeaderAdmin}>
                  <div className={styles.bankLogoWrapAdmin}>
                    <Image
                      src={acc.logo || "/src/img/donations/abank.png"}
                      alt={acc.bank}
                      width={44}
                      height={44}
                      unoptimized
                      className={styles.bankLogoAdmin}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{acc.bank}</h3>
                    <span style={{ fontSize: 12, color: "#38bdf8" }}>{acc.type || "Current"}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Account Name:</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{acc.name}</div>
                  <div className={styles.bankNumAdmin}>{acc.accountNumber}</div>
                </div>

                {acc.accepts && acc.accepts.length > 0 && (
                  <div className={styles.badgeList}>
                    {acc.accepts.map((purpose) => (
                      <span key={purpose} className={styles.badgeSmall}>
                        {purpose}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleOpenAccountModal(acc)}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeleteAccount(acc._id)}
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 4: PROJECTS */}
      {/* ========================================= */}
      {activeTab === "projects" && (
        <div className={styles.grid}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <FaHandHoldingHeart style={{ fontSize: 36, opacity: 0.4 }} />
              <h3 className={styles.emptyStateTitle}>No Church Projects Found</h3>
              <p>Add fundraising campaigns like the Church Bus, sanctuary building, or outreach gear.</p>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ marginTop: 12 }}
                onClick={() => handleOpenProjectModal()}
              >
                + Create Church Project
              </button>
            </div>
          ) : (
            projects.map((proj) => {
              const hasImage = proj.images && proj.images.length > 0;
              return (
                <div key={proj._id} className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    {hasImage ? (
                      <Image
                        src={proj.images[0]}
                        alt={proj.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.cardImage}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666" }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{proj.title}</h3>
                    <p className={styles.cardDesc}>{proj.description}</p>
                    <div className={styles.cardMeta}>
                      <span>Status: <strong style={{ color: "#4ade80" }}>{proj.status}</strong></span>
                      {proj.amount && (
                        <span style={{ color: "#facc15", fontWeight: 700 }}>
                          Target: ₦{Number(proj.amount).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleOpenProjectModal(proj)}
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteProject(proj._id)}
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 1: ADD / EDIT VIDEO */}
      {/* ========================================= */}
      {videoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setVideoModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingVideo ? "Edit Revelation Video" : "Add Revelation Video"}
            </h2>
            <form onSubmit={handleSaveVideo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Video Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. 2026 Kingdom Medical & Gospel Crusade"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>YouTube URL *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  required
                />
                <span className={styles.hint}>Supports standard videos, shorts, live streams, or embed links.</span>
              </div>

              {/* Live Preview */}
              {getYouTubeEmbedUrl(videoForm.youtubeUrl) && (
                <div className={styles.previewBox}>
                  <iframe
                    className={styles.previewIframe}
                    src={getYouTubeEmbedUrl(videoForm.youtubeUrl)}
                    title="Live Preview"
                    allowFullScreen
                  />
                </div>
              )}

              <div className={styles.formGroup} style={{ marginTop: 14 }}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  rows={3}
                  placeholder="Summarize the outreach impact, location, and testimonies..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setVideoModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingVideo ? "Update Video" : "Create Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: ADD / EDIT BANK ACCOUNT */}
      {/* ========================================= */}
      {accountModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setAccountModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingAccount ? "Edit Bank Account" : "Add Bank Account"}
            </h2>
            <form onSubmit={handleSaveAccount}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bank Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={accountForm.bank}
                  onChange={(e) => setAccountForm({ ...accountForm, bank: e.target.value })}
                  required
                />
                <div className={styles.quickSelectRow}>
                  {PRESET_BANKS.map((p) => (
                    <button
                      key={p.bank}
                      type="button"
                      className={styles.quickSelectBtn}
                      onClick={() => setAccountForm({ ...accountForm, bank: p.bank, logo: p.logo })}
                    >
                      {p.bank}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Number *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Type</label>
                <select
                  className={styles.select}
                  value={accountForm.type}
                  onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })}
                >
                  <option value="Current">Current</option>
                  <option value="Savings">Savings</option>
                  <option value="Dollar Account">Dollar Account</option>
                  <option value="Domiciliary Account">Domiciliary Account</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Accepted Purposes (comma-separated)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={accountForm.accepts}
                  onChange={(e) => setAccountForm({ ...accountForm, accepts: e.target.value })}
                  placeholder="e.g. Tithe, Devine Partnership, Missions"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setAccountModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingAccount ? "Update Account" : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 3: ADD / EDIT PROJECT */}
      {/* ========================================= */}
      {projectModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setProjectModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingProject ? "Edit Church Project" : "Create Church Project"}
            </h2>
            <form onSubmit={handleSaveProject}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Church Bus Acquisition"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={4}
                  placeholder="Detail the project's purpose, why it's needed, and how members can help..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Target Amount (Optional)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={projectForm.amount}
                  onChange={(e) => setProjectForm({ ...projectForm, amount: e.target.value })}
                  placeholder="e.g. 15000000 (leave blank if not applicable)"
                />
                <span className={styles.hint}>Leave empty if there is no fixed financial goal.</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Status</label>
                <select
                  className={styles.select}
                  value={projectForm.status}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      status: e.target.value as "Active" | "Ongoing" | "Completed",
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className={styles.input}
                />

                {projectForm.images.length > 0 && (
                  <div className={styles.imagePreviewRow}>
                    {projectForm.images.map((img, idx) => (
                      <div key={idx} className={styles.imageThumbWrap}>
                        <Image src={img} alt={`Upload ${idx + 1}`} fill unoptimized className={styles.imageThumb} />
                        <button
                          type="button"
                          className={styles.imageRemoveBtn}
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setProjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
