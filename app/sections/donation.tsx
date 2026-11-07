"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./donation.module.css";
import request from "../utils/axios";
import { getYouTubeEmbedUrl } from "../utils/youtube";
import LoadingSpinner from "../components/loading-spinner";
import {
  OutreachSettingsData,
  BankAccountData,
  DonationTypeData,
  OutreachVideoData,
  ChurchProjectData,
} from "../types/outreach";
import {
  FaVideo,
  FaCreditCard,
  FaHandHoldingHeart,
  FaCopy,
  FaCheck,
  FaYoutube,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaShareAlt,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";

interface DonationSectionProps {
  initialData?: {
    settings?: OutreachSettingsData;
    accounts?: BankAccountData[];
    types?: DonationTypeData[];
    videos?: OutreachVideoData[];
    projects?: ChurchProjectData[];
  };
}

// Fallback bank logo resolver
const resolveLogo = (logo?: string) => {
  if (!logo) return "/src/img/donations/abank.png";
  if (logo.startsWith("/") || logo.startsWith("http") || logo.startsWith("data:")) {
    return logo;
  }
  return `/src/img/donations/${logo}`;
};

// 1. REVELATION MULTI-VIDEO CARD COMPONENT
function RevelationVideoCard({
  video,
  onShare,
  isHighlighted,
}: {
  video: OutreachVideoData;
  onShare: () => void;
  isHighlighted?: boolean;
}) {
  const videoUrls =
    video.youtubeUrls && video.youtubeUrls.length > 0
      ? video.youtubeUrls
      : video.youtubeUrl
      ? [video.youtubeUrl]
      : [];

  const [activeIdx, setActiveIdx] = useState(0);

  const totalVideos = videoUrls.length;
  const currentUrl = videoUrls[activeIdx] || "";
  const embedUrl = getYouTubeEmbedUrl(currentUrl);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : totalVideos - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev < totalVideos - 1 ? prev + 1 : 0));
  };

  return (
    <article
      id={`item-${video._id}`}
      className={`${styles.videoCard} ${isHighlighted ? styles.highlightCard : ""}`}
    >
      {/* Header bar if multiple videos stacked */}
      {totalVideos > 1 && (
        <div className={styles.sliderControls}>
          <button
            type="button"
            className={styles.sliderArrowBtn}
            onClick={handlePrev}
            aria-label="Previous video"
            title="Previous Video"
          >
            <FaChevronLeft size={11} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={styles.sliderBadge}>
              <FaVideo size={11} />
              <span>
                Video {activeIdx + 1} of {totalVideos}
              </span>
            </span>

            <div className={styles.sliderDots}>
              {videoUrls.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.sliderDot} ${
                    idx === activeIdx ? styles.sliderDotActive : ""
                  }`}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Jump to video ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.sliderArrowBtn}
            onClick={handleNext}
            aria-label="Next video"
            title="Next Video"
          >
            <FaChevronRight size={11} />
          </button>
        </div>
      )}

      {/* Video Container */}
      <div className={styles.videoWrapper}>
        {embedUrl ? (
          <iframe
            key={embedUrl}
            className={styles.videoEmbed}
            src={embedUrl}
            title={`${video.title} - Video ${activeIdx + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles.projectPlaceholderImage}>
            <FaVideo className={styles.projectPlaceholderIcon} />
            <span>Invalid or Missing Video Link</span>
          </div>
        )}
      </div>

      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description}</p>
        <div className={styles.videoFooter}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              className={styles.cardShareBtn}
              onClick={onShare}
              title="Share this revelation video"
            >
              <FaShareAlt size={11} />
              <span>Share</span>
            </button>

            {currentUrl && (
              <Link
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.youtubeLink}
              >
                <FaYoutube />
                <span>Watch Video {totalVideos > 1 ? `#${activeIdx + 1}` : ""} on YouTube</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// 2. PROJECT MULTI-ASSET CARD COMPONENT (Images + Videos)
function ProjectCardItem({
  project,
  onSupport,
  onShare,
  formatAmount,
  isHighlighted,
}: {
  project: ChurchProjectData;
  onSupport: () => void;
  onShare: () => void;
  formatAmount: (amount?: number | null, currency?: string) => string | null;
  isHighlighted?: boolean;
}) {
  const imageAssets = (project.images || []).map((url) => ({
    type: "image" as const,
    url,
  }));
  const videoAssets = (project.videoUrls || []).map((url) => ({
    type: "video" as const,
    url,
  }));
  const allAssets = [...imageAssets, ...videoAssets];

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const totalAssets = allAssets.length;
  const currentAsset = allAssets[activeMediaIdx];

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev > 0 ? prev - 1 : totalAssets - 1));
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev < totalAssets - 1 ? prev + 1 : 0));
  };

  const formattedTarget = formatAmount(project.amount, project.currency);

  return (
    <article
      id={`item-${project._id}`}
      className={`${styles.projectCard} ${isHighlighted ? styles.highlightCard : ""}`}
    >
      <div className={styles.projectMediaWrapper}>
        {totalAssets === 0 ? (
          <div className={styles.projectPlaceholderImage}>
            <span className={styles.projectPlaceholderIcon}>🏗️</span>
            <span>Church Project</span>
          </div>
        ) : currentAsset.type === "video" ? (
          <iframe
            key={currentAsset.url}
            src={getYouTubeEmbedUrl(currentAsset.url)}
            title={`${project.title} - Video`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={currentAsset.url}
            alt={`${project.title} - Asset ${activeMediaIdx + 1}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.projectImage}
          />
        )}

        {/* Status Badge */}
        <span
          className={`${styles.projectStatusBadge} ${
            project.status === "Active"
              ? styles.statusActive
              : project.status === "Ongoing"
              ? styles.statusOngoing
              : styles.statusCompleted
          }`}
        >
          {project.status || "Active"}
        </span>

        {/* Media counter indicator if multiple */}
        {totalAssets > 1 && (
          <span className={styles.mediaCounterBadge}>
            {currentAsset?.type === "video" ? "🎬" : "📷"} {activeMediaIdx + 1} / {totalAssets}
          </span>
        )}

        {/* Target Amount */}
        {formattedTarget && (
          <span className={styles.projectAmountTag}>Target: {formattedTarget}</span>
        )}

        {/* Slide controls overlay if multiple assets */}
        {totalAssets > 1 && (
          <>
            <div className={styles.mediaOverlayNav}>
              <button
                type="button"
                className={styles.overlayArrowBtn}
                onClick={handlePrevMedia}
                aria-label="Previous Media"
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.overlayArrowBtn}
                onClick={handleNextMedia}
                aria-label="Next Media"
              >
                ›
              </button>
            </div>

            <div className={styles.mediaBottomBar}>
              {allAssets.map((asset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.sliderDot} ${
                    idx === activeMediaIdx ? styles.sliderDotActive : ""
                  }`}
                  onClick={() => setActiveMediaIdx(idx)}
                  aria-label={`Jump to asset ${idx + 1} (${asset.type})`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.projectBody}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>

        <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
          <button
            type="button"
            className={styles.supportBtn}
            style={{ flex: 1 }}
            onClick={onSupport}
          >
            <span>Support This Project</span>
            <span>→</span>
          </button>
          <button
            type="button"
            className={styles.cardShareBtn}
            onClick={onShare}
            title="Share this project"
            style={{ padding: "0 14px", height: "44px" }}
          >
            <FaShareAlt size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

// Memory cache for instantaneous client transitions
let outreachMemoryCache: {
  settings?: OutreachSettingsData;
  accounts?: BankAccountData[];
  types?: DonationTypeData[];
  videos?: OutreachVideoData[];
  projects?: ChurchProjectData[];
} | null = null;

// 3. MAIN DONATION / OUTREACH COMPONENT
export default function DonationSection({ initialData }: DonationSectionProps) {
  const cachedOrInitial = initialData || outreachMemoryCache;
  const [loading, setLoading] = useState(!cachedOrInitial);
  const [activeTab, setActiveTab] = useState<"revelation" | "accounts" | "projects">("revelation");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [settings, setSettings] = useState<OutreachSettingsData>(
    cachedOrInitial?.settings || {
      heading: "CAC MOUNT ZION GLOBAL KINGDOM OUTREACH",
      subtitle:
        "Partnering together to impact lives, spread the Gospel, and build God's Kingdom.",
      verseText:
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.",
      verseRef: "2 Corinthians 9:7",
    }
  );
  const [accounts, setAccounts] = useState<BankAccountData[]>(cachedOrInitial?.accounts || []);
  const [types, setTypes] = useState<DonationTypeData[]>(cachedOrInitial?.types || []);
  const [videos, setVideos] = useState<OutreachVideoData[]>(cachedOrInitial?.videos || []);
  const [projects, setProjects] = useState<ChurchProjectData[]>(cachedOrInitial?.projects || []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareData, setShareData] = useState<{
    title: string;
    url: string;
    description?: string;
  } | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  // Close share modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShareData(null);
      }
    };
    if (shareData) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shareData]);

  // Sync section & id from URL query parameters and hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get("section")?.toLowerCase();
      const targetId = params.get("id");
      const hash = window.location.hash.replace("#", "").toLowerCase();

      const active = sectionParam || hash;
      if (active === "revelation") setActiveTab("revelation");
      else if (active === "accounts" || active === "account-details" || active === "give")
        setActiveTab("accounts");
      else if (active === "projects") setActiveTab("projects");

      if (targetId) {
        setHighlightedId(targetId);
        setTimeout(() => {
          const el = document.getElementById(`item-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 600);
      }
    }
  }, []);

  // Fetch real-time data from /api/outreach
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get("/outreach");
        if (res.data) {
          if (res.data.settings) setSettings(res.data.settings);
          if (res.data.accounts) setAccounts(res.data.accounts);
          if (res.data.types) setTypes(res.data.types);
          if (res.data.videos) setVideos(res.data.videos);
          if (res.data.projects) setProjects(res.data.projects);

          outreachMemoryCache = {
            settings: res.data.settings,
            accounts: res.data.accounts,
            types: res.data.types,
            videos: res.data.videos,
            projects: res.data.projects,
          };
        }
      } catch (err) {
        console.error("Error fetching outreach data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyAccount = (accountNumber: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedId(id);
      setToastMessage(`Account number ${accountNumber} copied to clipboard!`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }
  };

  const handleSupportProject = () => {
    setActiveTab("accounts");
    setTimeout(() => {
      const el = document.getElementById("account-details-target");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Share Dialog Trigger (supports WhatsApp, Email, Direct Link Copy, and Device Share)
  const handleOpenShare = (params: {
    section: string;
    id?: string;
    title: string;
    description?: string;
  }) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.origin + "/donate");
    url.searchParams.set("section", params.section);
    if (params.id) {
      url.searchParams.set("id", params.id);
    }
    const shareUrl = url.toString();
    setModalCopied(false);
    setShareData({
      title: params.title,
      url: shareUrl,
      description: params.description,
    });
  };

  const handleCopyShareLink = () => {
    if (!shareData) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      setModalCopied(true);
      setToastMessage("Direct link copied to clipboard!");
      setTimeout(() => setModalCopied(false), 2500);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDeviceNativeShare = async () => {
    if (!shareData || !navigator.share) return;
    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.description
          ? `${shareData.title}\n${shareData.description}`
          : shareData.title,
        url: shareData.url,
      });
    } catch {
      // User cancelled or dismissed
    }
  };

  const formatAmount = (amount?: number | null, currency = "NGN") => {
    if (amount === undefined || amount === null) return null;
    const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "₦";
    return `${symbol}${Number(amount).toLocaleString()}`;
  };

  return (
    <section className={styles.section} id="outreach">
      <div id="donate" />
      <div className={styles.container}>
        {/* Main Header */}
        <header className={styles.header}>
          <div className={styles.badge}>Global Kingdom Outreach</div>
          <h1 className={styles.title}>{settings.heading}</h1>
          <p className={styles.subtitle}>{settings.subtitle}</p>
        </header>

        {/* Loading Spinner State */}
        {loading ? (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <LoadingSpinner size="large" text="Loading Kingdom Outreach details..." />
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <nav className={styles.tabNav} aria-label="Outreach sections">
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "revelation" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("revelation")}
              >
                <FaVideo className={styles.tabIcon} />
                <span>Revelation</span>
                {videos.length > 0 && <span className={styles.tabCount}>{videos.length}</span>}
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "accounts" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("accounts")}
              >
                <FaCreditCard className={styles.tabIcon} />
                <span>Account Details</span>
                {accounts.length > 0 && <span className={styles.tabCount}>{accounts.length}</span>}
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "projects" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                <FaHandHoldingHeart className={styles.tabIcon} />
                <span>Projects</span>
                {projects.length > 0 && <span className={styles.tabCount}>{projects.length}</span>}
              </button>
            </nav>

            {/* ========================================= */}
            {/* TAB 1: REVELATION (VIDEOS) */}
            {/* ========================================= */}
            {activeTab === "revelation" && (
              <div>
                <div className={styles.sectionIntro}>
                  <div>
                    <h2 className={styles.sectionIntroTitle}>Outreach & Ministry Revelations</h2>
                    <p className={styles.sectionIntroDesc}>
                      Watch the tangible impact of our missions, community evangelism, crusades, and
                      hospital outreach programs in spreading the Love and Power of Jesus Christ. Slide
                      through each revelation to view all recorded videos.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.shareSectionBtn}
                    onClick={() =>
                      handleOpenShare({
                        section: "revelation",
                        title: "CAC Mount Zion - Outreach Revelations",
                        description:
                          "Watch recorded ministry revelations, crusades, and hospital evangelism in spreading the Gospel.",
                      })
                    }
                    title="Share this section with friends"
                  >
                    <FaShareAlt />
                    <span>Share Section</span>
                  </button>
                </div>

                {videos.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🎬</span>
                    <h3 className={styles.emptyTitle}>No Revelation Videos Available</h3>
                    <p className={styles.emptyText}>
                      Video records of our latest global kingdom outreaches will appear here. Check back
                      soon or view our accounts to partner with us!
                    </p>
                  </div>
                ) : (
                  <div className={styles.videoGrid}>
                    {videos.map((vid) => (
                      <RevelationVideoCard
                        key={vid._id}
                        video={vid}
                        isHighlighted={highlightedId === vid._id}
                        onShare={() =>
                          handleOpenShare({
                            section: "revelation",
                            id: vid._id,
                            title: vid.title,
                            description: vid.description,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================= */}
            {/* TAB 2: ACCOUNT DETAILS */}
            {/* ========================================= */}
            {activeTab === "accounts" && (
              <div id="account-details-target">
                <div className={styles.sectionIntro} style={{ marginBottom: 22 }}>
                  <div>
                    <h2 className={styles.sectionIntroTitle}>Bank Giving Accounts & Details</h2>
                    <p className={styles.sectionIntroDesc}>
                      Direct your tithes, general offerings, divine partnerships, and building fund
                      contributions into the verified church accounts below.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.shareSectionBtn}
                    onClick={() =>
                      handleOpenShare({
                        section: "accounts",
                        title: "CAC Mount Zion - Bank Giving Details",
                        description:
                          "Direct your tithes, general offerings, divine partnerships, and kingdom contributions into verified church accounts.",
                      })
                    }
                    title="Share church bank account details"
                  >
                    <FaShareAlt />
                    <span>Share Details</span>
                  </button>
                </div>

                <div className={styles.accountLayout}>
                  {/* Left Column: Scripture + Bank Cards */}
                  <div className={styles.accountLeft}>
                    {/* Scripture Card */}
                    <div className={styles.verseCard}>
                      <div className={styles.verseQuoteIcon}>
                        <FaQuoteLeft />
                      </div>
                      <p className={styles.verseText}>&ldquo;{settings.verseText}&rdquo;</p>
                      <p className={styles.verseRef}>{settings.verseRef}</p>
                    </div>

                    {/* Bank Grid */}
                    <div className={styles.bankGrid}>
                      {accounts.map((acc) => (
                        <div key={acc._id} className={styles.bankCard}>
                          <div className={styles.bankHeader}>
                            <div className={styles.bankLogoWrap}>
                              <Image
                                src={resolveLogo(acc.logo)}
                                alt={`${acc.bank} logo`}
                                width={52}
                                height={52}
                                unoptimized
                                className={styles.bankLogo}
                              />
                            </div>
                            <div className={styles.bankHeaderText}>
                              <h3 className={styles.bankName}>{acc.bank}</h3>
                              {acc.type && (
                                <span className={styles.bankAccountType}>{acc.type}</span>
                              )}
                            </div>
                          </div>

                          <div className={styles.bankDetailsBox}>
                            <div className={styles.bankRow}>
                              <span className={styles.bankLabel}>Account Name</span>
                              <span className={styles.bankValue}>{acc.name}</span>
                            </div>

                            <div className={styles.accountNumberBox}>
                              <div>
                                <span className={styles.bankLabel} style={{ display: "block" }}>
                                  Account Number
                                </span>
                                <span className={styles.accountNumber}>{acc.accountNumber}</span>
                              </div>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  type="button"
                                  className={`${styles.copyBtn} ${
                                    copiedId === acc._id ? styles.copyBtnCopied : ""
                                  }`}
                                  onClick={() => handleCopyAccount(acc.accountNumber, acc._id)}
                                  title="Copy Account Number"
                                >
                                  {copiedId === acc._id ? (
                                    <>
                                      <FaCheck />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <FaCopy />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  className={styles.copyBtn}
                                  onClick={() =>
                                    handleOpenShare({
                                      section: "accounts",
                                      id: acc._id,
                                      title: `${acc.bank} Account - CAC Mount Zion`,
                                      description: `Account Name: ${acc.name} | Account Number: ${acc.accountNumber} (${acc.bank}). Accepted for: ${acc.accepts?.join(", ") || "Church Giving"}`,
                                    })
                                  }
                                  title="Share this bank account"
                                >
                                  <FaShareAlt size={11} />
                                  <span>Share</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {acc.accepts && acc.accepts.length > 0 && (
                            <div className={styles.acceptsRow}>
                              <span className={styles.bankLabel}>Accepted Purposes:</span>
                              <div className={styles.acceptsBadges}>
                                {acc.accepts.map((tag) => (
                                  <span key={tag} className={styles.acceptsBadge}>
                                    <span>•</span>
                                    <span>{tag}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Donation Types Reference */}
                  <aside className={styles.accountRight}>
                    <div className={styles.typesCard}>
                      <h3 className={styles.typesCardTitle}>
                        <span>💝</span>
                        <span>Giving Categories</span>
                      </h3>
                      <ul className={styles.typesList}>
                        {types.map((t) => (
                          <li key={t._id} className={styles.typeItem}>
                            <div className={styles.typeHeader}>
                              <span className={styles.typeIcon}>{t.icon || "🔸"}</span>
                              <h4 className={styles.typeTitle}>{t.title}</h4>
                            </div>
                            {t.description && <p className={styles.typeDesc}>{t.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* TAB 3: PROJECTS */}
            {/* ========================================= */}
            {activeTab === "projects" && (
              <div>
                <div className={styles.sectionIntro}>
                  <div>
                    <h2 className={styles.sectionIntroTitle}>Ongoing Church Projects</h2>
                    <p className={styles.sectionIntroDesc}>
                      Partner with CAC Mount Zion in fulfilling strategic kingdom initiatives — from
                      missionary vehicles and bus acquisitions to facility enhancements and evangelism
                      gear. Slide to explore all images and video walkthroughs for each project.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.shareSectionBtn}
                    onClick={() =>
                      handleOpenShare({
                        section: "projects",
                        title: "CAC Mount Zion - Ongoing Church Projects",
                        description:
                          "Partner with CAC Mount Zion in fulfilling strategic kingdom initiatives — from missionary vehicles and bus acquisitions to facility enhancements.",
                      })
                    }
                    title="Share ongoing church projects"
                  >
                    <FaShareAlt />
                    <span>Share Section</span>
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🏗️</span>
                    <h3 className={styles.emptyTitle}>No Ongoing Projects Listed</h3>
                    <p className={styles.emptyText}>
                      Upcoming capital campaigns and building/outreach projects will be listed here. You
                      can support general church operations in Account Details.
                    </p>
                  </div>
                ) : (
                  <div className={styles.projectGrid}>
                    {projects.map((proj) => (
                      <ProjectCardItem
                        key={proj._id}
                        project={proj}
                        isHighlighted={highlightedId === proj._id}
                        onSupport={handleSupportProject}
                        onShare={() =>
                          handleOpenShare({
                            section: "projects",
                            id: proj._id,
                            title: proj.title,
                            description: proj.description,
                          })
                        }
                        formatAmount={formatAmount}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Share Modal Dialog (WhatsApp, Email, Copy Link, Native Share) */}
        {shareData && (
          <div
            className={styles.shareModalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShareData(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Share dialog"
          >
            <div className={styles.shareModal}>
              <div className={styles.shareModalHeader}>
                <div>
                  <h3 className={styles.shareModalTitle}>{shareData.title}</h3>
                  <p className={styles.shareModalSubtitle}>
                    Share with brethren and friends across WhatsApp, Email, or direct link.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.shareCloseBtn}
                  onClick={() => setShareData(null)}
                  aria-label="Close share dialog"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Quick Action Channels: WhatsApp & Email */}
              <div className={styles.shareChannelsGrid}>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${shareData.title}\n${
                      shareData.description ? `${shareData.description}\n\n` : "\n"
                    }Partner with CAC Mount Zion Global Kingdom Outreach:\n${shareData.url}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.shareChannelBtn} ${styles.shareWhatsappBtn}`}
                >
                  <FaWhatsapp size={19} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `CAC Mount Zion: ${shareData.title}`
                  )}&body=${encodeURIComponent(
                    `Grace and peace,\n\nI want to share this with you from CAC Mount Zion Global Kingdom Outreach:\n\n${
                      shareData.title
                    }\n${
                      shareData.description ? `${shareData.description}\n\n` : "\n"
                    }View full details and partner here:\n${shareData.url}\n\nGod bless you!`
                  )}`}
                  className={`${styles.shareChannelBtn} ${styles.shareEmailBtn}`}
                >
                  <FaEnvelope size={17} />
                  <span>Email</span>
                </a>
              </div>

              {/* Direct Link Copy Box */}
              <div className={styles.shareBox}>
                <span className={styles.shareBoxLabel}>Shareable Direct Link</span>
                <div className={styles.shareLinkInputRow}>
                  <input
                    type="text"
                    readOnly
                    value={shareData.url}
                    className={styles.shareLinkInput}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    type="button"
                    className={`${styles.shareCopyBtn} ${
                      modalCopied ? styles.shareCopyBtnCopied : ""
                    }`}
                    onClick={handleCopyShareLink}
                  >
                    {modalCopied ? (
                      <>
                        <FaCheck size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* System Native Share Button (Mobile / Supported devices) */}
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  type="button"
                  className={styles.moreShareBtn}
                  onClick={handleDeviceNativeShare}
                >
                  <FaShareAlt size={13} />
                  <span>More Sharing Options (Device Menu)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Copy Notification Toast */}
        {toastMessage && (
          <div className={styles.toast} role="status">
            <FaCheck />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </section>
  );
}
