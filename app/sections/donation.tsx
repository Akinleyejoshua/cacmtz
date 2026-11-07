"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./donation.module.css";
import request from "../utils/axios";
import { getYouTubeEmbedUrl } from "../utils/youtube";
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

export default function DonationSection({ initialData }: DonationSectionProps) {
  const [activeTab, setActiveTab] = useState<"revelation" | "accounts" | "projects">("revelation");
  const [settings, setSettings] = useState<OutreachSettingsData>(
    initialData?.settings || {
      heading: "CAC MOUNT ZION GLOBAL KINGDOM OUTREACH",
      subtitle:
        "Partnering together to impact lives, spread the Gospel, and build God's Kingdom.",
      verseText:
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.",
      verseRef: "2 Corinthians 9:7",
    }
  );
  const [accounts, setAccounts] = useState<BankAccountData[]>(initialData?.accounts || []);
  const [types, setTypes] = useState<DonationTypeData[]>(initialData?.types || []);
  const [videos, setVideos] = useState<OutreachVideoData[]>(initialData?.videos || []);
  const [projects, setProjects] = useState<ChurchProjectData[]>(initialData?.projects || []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync hash from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "revelation") setActiveTab("revelation");
      else if (hash === "accounts" || hash === "account-details" || hash === "give")
        setActiveTab("accounts");
      else if (hash === "projects") setActiveTab("projects");
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
        }
      } catch (err) {
        console.error("Error fetching outreach data:", err);
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
    // Smooth scroll to account section
    setTimeout(() => {
      const el = document.getElementById("account-details-target");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
                  hospital outreach programs in spreading the Love and Power of Jesus Christ.
                </p>
              </div>
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
                {videos.map((vid) => {
                  const embedUrl = getYouTubeEmbedUrl(vid.youtubeUrl);
                  return (
                    <article key={vid._id} className={styles.videoCard}>
                      <div className={styles.videoWrapper}>
                        {embedUrl ? (
                          <iframe
                            className={styles.videoEmbed}
                            src={embedUrl}
                            title={vid.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className={styles.projectPlaceholderImage}>
                            <FaVideo className={styles.projectPlaceholderIcon} />
                            <span>Invalid YouTube URL</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.videoInfo}>
                        <h3 className={styles.videoTitle}>{vid.title}</h3>
                        <p className={styles.videoDescription}>{vid.description}</p>
                        <div className={styles.videoFooter}>
                          <Link
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.youtubeLink}
                          >
                            <FaYoutube />
                            <span>Watch on YouTube</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: ACCOUNT DETAILS */}
        {/* ========================================= */}
        {activeTab === "accounts" && (
          <div id="account-details-target">
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
                  gear.
                </p>
              </div>
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
                {projects.map((proj) => {
                  const hasImage = proj.images && proj.images.length > 0;
                  const formattedTarget = formatAmount(proj.amount, proj.currency);

                  return (
                    <article key={proj._id} className={styles.projectCard}>
                      <div className={styles.projectImageWrap}>
                        {hasImage ? (
                          <Image
                            src={proj.images[0]}
                            alt={proj.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className={styles.projectImage}
                          />
                        ) : (
                          <div className={styles.projectPlaceholderImage}>
                            <span className={styles.projectPlaceholderIcon}>🏗️</span>
                            <span>Church Project</span>
                          </div>
                        )}

                        <span
                          className={`${styles.projectStatusBadge} ${
                            proj.status === "Active"
                              ? styles.statusActive
                              : proj.status === "Ongoing"
                              ? styles.statusOngoing
                              : styles.statusCompleted
                          }`}
                        >
                          {proj.status || "Active"}
                        </span>

                        {formattedTarget && (
                          <span className={styles.projectAmountTag}>
                            Target: {formattedTarget}
                          </span>
                        )}
                      </div>

                      <div className={styles.projectBody}>
                        <h3 className={styles.projectTitle}>{proj.title}</h3>
                        <p className={styles.projectDescription}>{proj.description}</p>

                        <button
                          type="button"
                          className={styles.supportBtn}
                          onClick={handleSupportProject}
                        >
                          <span>Support This Project</span>
                          <span>→</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
