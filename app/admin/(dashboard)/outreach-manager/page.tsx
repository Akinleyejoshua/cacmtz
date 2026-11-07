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
  OutreachStatsData,
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
  FaImage as FaImageIcon,
  FaEye,
  FaCoins,
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
  const [stats, setStats] = useState<OutreachStatsData>({
    totalRevelations: 0,
    totalVideosStacked: 0,
    totalAccounts: 0,
    totalCategories: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTargetAmount: 0,
    totalProjectAssets: 0,
    donatePageViews: 0,
  });

  // Modals state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<OutreachVideoData | null>(null);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    description: string;
    youtubeUrls: string[];
    order: number;
  }>({
    title: "",
    description: "",
    youtubeUrls: [""],
    order: 0,
  });

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
    videoUrls: string[];
  }>({
    title: "",
    description: "",
    amount: "",
    currency: "NGN",
    status: "Active",
    images: [],
    videoUrls: [],
  });

  // Additional live URL inputs for projects
  const [liveImageUrlInput, setLiveImageUrlInput] = useState("");
  const [liveVideoUrlInput, setLiveVideoUrlInput] = useState("");

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
        if (res.data.stats) setStats(res.data.stats);
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

  // 2. Video (Revelation) CRUD with multi-video stack
  const handleOpenVideoModal = (video?: OutreachVideoData) => {
    if (video) {
      setEditingVideo(video);
      const urls =
        video.youtubeUrls && video.youtubeUrls.length > 0
          ? video.youtubeUrls
          : video.youtubeUrl
          ? [video.youtubeUrl]
          : [""];
      setVideoForm({
        title: video.title,
        description: video.description,
        youtubeUrls: urls,
        order: video.order || 0,
      });
    } else {
      setEditingVideo(null);
      setVideoForm({
        title: "",
        description: "",
        youtubeUrls: [""],
        order: 0,
      });
    }
    setVideoModalOpen(true);
  };

  const handleAddVideoUrlField = () => {
    setVideoForm((prev) => ({
      ...prev,
      youtubeUrls: [...prev.youtubeUrls, ""],
    }));
  };

  const handleVideoUrlChange = (index: number, val: string) => {
    setVideoForm((prev) => {
      const next = [...prev.youtubeUrls];
      next[index] = val;
      return { ...prev, youtubeUrls: next };
    });
  };

  const handleRemoveVideoUrlField = (index: number) => {
    setVideoForm((prev) => ({
      ...prev,
      youtubeUrls: prev.youtubeUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrls = videoForm.youtubeUrls.map((u) => u.trim()).filter(Boolean);

    if (!videoForm.title || cleanUrls.length === 0) {
      alert("Please enter a title and at least one valid YouTube URL.");
      return;
    }

    const payload = {
      title: videoForm.title,
      description: videoForm.description,
      youtubeUrl: cleanUrls[0],
      youtubeUrls: cleanUrls,
      order: videoForm.order,
    };

    try {
      if (editingVideo) {
        const res = await request.put(`/outreach/videos/${editingVideo._id}`, payload);
        setVideos((prev) => prev.map((v) => (v._id === editingVideo._id ? res.data : v)));
        showNotification("Revelation video(s) updated successfully!");
      } else {
        const res = await request.post("/outreach/videos", payload);
        setVideos((prev) => [res.data, ...prev]);
        showNotification("New Revelation video(s) added successfully!");
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

  // 4. Project CRUD (Multi-Image + Multi-Video URLs)
  const handleOpenProjectModal = (project?: ChurchProjectData) => {
    setLiveImageUrlInput("");
    setLiveVideoUrlInput("");
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        amount: project.amount !== null && project.amount !== undefined ? String(project.amount) : "",
        currency: project.currency || "NGN",
        status: project.status || "Active",
        images: project.images || [],
        videoUrls: project.videoUrls || [],
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
        videoUrls: [],
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

  const handleAddLiveImageUrl = () => {
    const trimmed = liveImageUrlInput.trim();
    if (!trimmed) return;
    setProjectForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setLiveImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProjectForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddLiveVideoUrl = () => {
    const trimmed = liveVideoUrlInput.trim();
    if (!trimmed) return;
    setProjectForm((prev) => ({
      ...prev,
      videoUrls: [...prev.videoUrls, trimmed],
    }));
    setLiveVideoUrlInput("");
  };

  const handleRemoveVideoUrl = (indexToRemove: number) => {
    setProjectForm((prev) => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, idx) => idx !== indexToRemove),
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
      videoUrls: projectForm.videoUrls,
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
            Manage outreach headlines, Revelation video stacks, church bank accounts, and live project assets
          </p>
        </div>

        {activeTab === "videos" && (
          <button type="button" className={styles.actionBtn} onClick={() => handleOpenVideoModal()}>
            <FaPlus />
            <span>Add Revelation Videos</span>
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

      {/* Metrics Dashboard Grid */}
      <div className={styles.metricsGrid}>
        {/* Metric 1: Traffic */}
        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrap} ${styles.iconPurple}`}>
            <FaEye />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Page Traffic</span>
            <span className={styles.metricValue}>{stats.donatePageViews.toLocaleString()}</span>
            <span className={styles.metricSubtext}>Visits to /donate page</span>
          </div>
        </div>

        {/* Metric 2: Revelation Videos */}
        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrap} ${styles.iconBlue}`}>
            <FaVideo />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Revelation Videos</span>
            <span className={styles.metricValue}>{stats.totalVideosStacked}</span>
            <span className={styles.metricSubtext}>Across {stats.totalRevelations} outreach stories</span>
          </div>
        </div>

        {/* Metric 3: Bank Accounts */}
        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrap} ${styles.iconGreen}`}>
            <FaCreditCard />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Giving Accounts</span>
            <span className={styles.metricValue}>{stats.totalAccounts}</span>
            <span className={styles.metricSubtext}>{stats.totalCategories} donation purposes</span>
          </div>
        </div>

        {/* Metric 4: Projects & Target Goal */}
        <div className={styles.metricCard}>
          <div className={`${styles.metricIconWrap} ${styles.iconAmber}`}>
            <FaCoins />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Projects & Goals</span>
            <span className={styles.metricValue}>
              {stats.totalTargetAmount > 0
                ? `₦${stats.totalTargetAmount.toLocaleString()}`
                : `${stats.totalProjects} Projects`}
            </span>
            <span className={styles.metricSubtext}>
              {stats.activeProjects} active ({stats.totalProjectAssets} media assets)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Public View Links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>
          Live Section Links:
        </span>
        <a
          href="/donate?section=revelation"
          target="_blank"
          rel="noreferrer"
          className={styles.secondaryBtn}
        >
          <span>Open Revelation</span>
          <FaExternalLinkAlt size={10} />
        </a>
        <a
          href="/donate?section=accounts"
          target="_blank"
          rel="noreferrer"
          className={styles.secondaryBtn}
        >
          <span>Open Account Details</span>
          <FaExternalLinkAlt size={10} />
        </a>
        <a
          href="/donate?section=projects"
          target="_blank"
          rel="noreferrer"
          className={styles.secondaryBtn}
        >
          <span>Open Projects</span>
          <FaExternalLinkAlt size={10} />
        </a>
      </div>

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
              <p>Add YouTube video stacks showcasing your church outreaches and community impact.</p>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ marginTop: 12 }}
                onClick={() => handleOpenVideoModal()}
              >
                + Add Revelation Video Stack
              </button>
            </div>
          ) : (
            videos.map((vid) => {
              const videoUrls =
                vid.youtubeUrls && vid.youtubeUrls.length > 0
                  ? vid.youtubeUrls
                  : vid.youtubeUrl
                  ? [vid.youtubeUrl]
                  : [];
              const primaryUrl = videoUrls[0] || "";
              const thumbUrl = getYouTubeThumbnailUrl(primaryUrl);

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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <h3 className={styles.cardTitle}>{vid.title}</h3>
                      {videoUrls.length > 1 && (
                        <span className={styles.badgeStacked}>
                          <FaVideo size={10} />
                          <span>{videoUrls.length} Videos</span>
                        </span>
                      )}
                    </div>

                    <p className={styles.cardDesc}>{vid.description}</p>

                    <div className={styles.cardMeta}>
                      {primaryUrl && (
                        <a
                          href={primaryUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          <span>Open Primary Video</span>
                          <FaExternalLinkAlt size={11} />
                        </a>
                      )}
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
              <p>Add fundraising campaigns with images and video walkthroughs.</p>
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
              const hasVideos = proj.videoUrls && proj.videoUrls.length > 0;
              const totalMedia = (proj.images?.length || 0) + (proj.videoUrls?.length || 0);

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
                    ) : hasVideos ? (
                      <iframe
                        src={getYouTubeEmbedUrl(proj.videoUrls![0])}
                        title={proj.title}
                        style={{ width: "100%", height: "100%", border: "none" }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666" }}>
                        No Media
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <h3 className={styles.cardTitle}>{proj.title}</h3>
                      {totalMedia > 1 && (
                        <span className={styles.badgeStacked}>
                          <span>{proj.images?.length || 0} 📷</span>
                          <span>{proj.videoUrls?.length || 0} 🎬</span>
                        </span>
                      )}
                    </div>

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
      {/* MODAL 1: ADD / EDIT VIDEO (MULTI-VIDEO STACK) */}
      {/* ========================================= */}
      {videoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setVideoModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingVideo ? "Edit Revelation Video Stack" : "Add Revelation Video Stack"}
            </h2>
            <form onSubmit={handleSaveVideo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Revelation Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. 2026 Kingdom Medical & Gospel Crusade"
                  required
                />
              </div>

              {/* Stacked YouTube URLs */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  YouTube Video Links * ({videoForm.youtubeUrls.length} stacked)
                </label>
                <span className={styles.hint} style={{ display: "block", marginBottom: 8 }}>
                  You can stack multiple video URLs for this revelation. Users will be able to slide through them on the donate page.
                </span>

                {videoForm.youtubeUrls.map((url, idx) => (
                  <div key={idx} className={styles.multiUrlRow}>
                    <input
                      type="text"
                      className={styles.input}
                      value={url}
                      onChange={(e) => handleVideoUrlChange(idx, e.target.value)}
                      placeholder={`Video Link #${idx + 1} (e.g. https://www.youtube.com/watch?v=...)`}
                      required={idx === 0}
                    />
                    {videoForm.youtubeUrls.length > 1 && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid rgba(239,68,68,0.3)" }}
                        onClick={() => handleRemoveVideoUrlField(idx)}
                        title="Remove Video"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleAddVideoUrlField}
                  style={{ marginTop: 6 }}
                >
                  <FaPlus size={10} />
                  <span>Add Another Video URL</span>
                </button>
              </div>

              {/* Live Preview for the first valid video URL */}
              {videoForm.youtubeUrls.some((u) => getYouTubeEmbedUrl(u)) && (
                <div style={{ marginTop: 14 }}>
                  <label className={styles.label}>Preview (First Video)</label>
                  <div className={styles.previewBox}>
                    <iframe
                      className={styles.previewIframe}
                      src={getYouTubeEmbedUrl(videoForm.youtubeUrls.find((u) => getYouTubeEmbedUrl(u)) || "")}
                      title="Live Preview"
                      allowFullScreen
                    />
                  </div>
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
                  {editingVideo ? "Update Video Stack" : "Create Video Stack"}
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
      {/* MODAL 3: ADD / EDIT PROJECT (MULTI-IMAGE + MULTI-VIDEO) */}
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

              {/* 1. PROJECT IMAGES SECTION */}
              <div className={styles.formGroup} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                <label className={styles.label}>Project Images (Upload or paste live URLs)</label>

                {/* Local file uploader */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className={styles.input}
                />

                {/* Paste Live Image URL */}
                <div className={styles.inputWithBtnRow}>
                  <input
                    type="text"
                    className={styles.input}
                    value={liveImageUrlInput}
                    onChange={(e) => setLiveImageUrlInput(e.target.value)}
                    placeholder="Or paste live image URL (https://...)"
                  />
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={handleAddLiveImageUrl}
                  >
                    + Add URL
                  </button>
                </div>

                {/* Image Previews */}
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

              {/* 2. PROJECT VIDEO URLS SECTION */}
              <div className={styles.formGroup} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                <label className={styles.label}>Project Video Walkthroughs (YouTube URLs)</label>
                <div className={styles.inputWithBtnRow}>
                  <input
                    type="text"
                    className={styles.input}
                    value={liveVideoUrlInput}
                    onChange={(e) => setLiveVideoUrlInput(e.target.value)}
                    placeholder="Paste YouTube video URL (https://www.youtube.com/...)"
                  />
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={handleAddLiveVideoUrl}
                  >
                    + Add Video
                  </button>
                </div>

                {projectForm.videoUrls.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {projectForm.videoUrls.map((url, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "85%" }}>
                          🎬 {url}
                        </span>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          style={{ padding: "3px 8px", borderRadius: 4, cursor: "pointer", border: "none" }}
                          onClick={() => handleRemoveVideoUrl(idx)}
                          title="Remove Video"
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
