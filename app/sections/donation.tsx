"use client"

import React from "react";
import Image from "next/image";
import styles from "./donation.module.css";

type BankDetail = {
  id: string;
  name?: string;
  accountNumber?: string;
  bank?: string;
  logo?: string;
  type?: string;
  accepts?: string[]; // ids of donation types this account accepts
  data?: any[]; // additional data if needed
};

type DonationType = {
  id: string;
  title: string;
  description?: string;
};

const DEFAULT_BANKS: any = [
  {

    id: "bank3",
    data: [
      {
        name: "C.A.C Mount Zion Ojodu",
        accountNumber: "0017420693",
        bank: "Access Bank",
        logo: "/src/img/donations/abank.png",
        type: "Current",
        accepts: ["Tithe"],
      },

      {
        name: "Akinleye Joseph Ayodare",
        accountNumber: "0016422566",
        bank: "Access Bank",
        logo: "/src/img/donations/abank.png",
        type: "Current",
        accepts: ["Tithe"],
      }
    ],

  },
  {
    id: "bank1",
    data: [

      {
        name: "C.A.C Mount Zion Ojodu",
        accountNumber: "2026245339",
        bank: "First Bank PLC",
        logo: "/src/img/donations/fbank.jpg",
        type: "Current",
        accepts: ["Devine Parnership"],
      },
      {
        name: "Akinleye Joseph Ayodare",
        accountNumber: "3133764368",
        bank: "First Bank PLC",
        logo: "/src/img/donations/fbank.jpg",
        type: "Savings",
        accepts: ["Devine Parnership"],
      }
    ],

  },
  {
    id: "bank6",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "0017420686",
    bank: "Access Bank",
    logo: "/src/img/donations/abank.png",
    type: "Current",
    accepts: ["General offering"],
  },
  {
    id: "bank2",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "0019526325",
    bank: "Guaranty Trust Bank",
    logo: "/src/img/donations/gtbank.jpg",
    type: "Current",
    accepts: ["Missionary account"],
  },

  {
    id: "bank4",
    name: "C.A.C Kingdom Zone",
    accountNumber: "3004620197",
    bank: "UBA",
    logo: "/src/img/donations/uba.png",
    type: "Dollar Account",
    accepts: ["General"],
  },
  {
    id: "bank5",
    name: "C.A.C Mount Zion Pentecostal Congress",
    accountNumber: "13311814993",
    bank: "Zenith",
    logo: "/src/img/donations/zbank.png",
    type: "Current",
    accepts: ["Covention"],
  },
];

const DEFAULT_TYPES: DonationType[] = [
  { id: "tithe", title: "Tithe", description: "Giving back the Lord's tithe as an act of worship." },
  { id: "offering", title: "Offering", description: "Freewill offerings for church operations and ministries." },
  { id: "missions", title: "Missions", description: "Support local and international mission work." },
  { id: "building", title: "Building Fund", description: "Contributions toward church infrastructure and facilities." },
  { id: "other", title: "Other", description: "Designate your gift for a specific need." },
];

const TYPE_ICONS: Record<string, string> = {
  tithe: "💒",
  offering: "💝",
  missions: "🌍",
  building: "🏗️",
  other: "🔖",
};

interface DonationSectionProps {
  banks?: BankDetail[];
  types?: DonationType[];
  verse?: { text: string; ref?: string };
}

export default function DonationSection({
  banks = DEFAULT_BANKS,
  types = DEFAULT_TYPES,
  verse = { text: "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.", ref: "2 Corinthians 9:7" },
}: DonationSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Give / Donate</h2>
          <p className={styles.subtitle}>Partner with us to advance the work of the Kingdom</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.verseCard}>
              <p className={styles.verseText}>&ldquo;{verse.text}&rdquo;</p>
              {verse.ref && <p className={styles.verseRef}>{verse.ref}</p>}
            </div>

            <div className={styles.bankList}>
              <h3 className={styles.sectionTitle}>Bank Details</h3>
              {banks.map((b) => {
                const accounts = b.data && b.data.length > 0 ? b.data : [b];
                const isSlider = accounts.length > 1;

                return (
                  <div key={b.id} className={isSlider ? styles.sliderContainer : undefined}>
                    {accounts.map((account, idx) => (
                      <div key={`${b.id}-${idx}`} className={styles.bankCard}>
                        <div className={styles.bankHeader}>
                          <div className={styles.logoWrap}>
                            <Image src={account.logo ?? '/src/img/donations/abank.png'} alt={`${account.bank} logo`} width={100} height={100} className={styles.bankLogo} />
                          </div>
                          <div className={styles.bankHeaderText}>
                            <div className={styles.bankCardTitle}>{account.bank}</div>
                            <div className={styles.bankCardSubtitle}>{account.name}</div>
                          </div>
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>Name</span>
                          <span className={styles.bankValue}>{account.name}</span>
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>Account</span>
                          <span className={styles.bankValue}>{account.accountNumber}</span>
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>Bank</span>
                          <span className={styles.bankValue}>{account.bank}</span>
                        </div>
                        {account.type && (
                          <div className={styles.bankRow}>
                            <span className={styles.bankLabel}>Type</span>
                            <span className={styles.bankValue}>{account.type}</span>
                          </div>
                        )}

                        {/* Accepted donation types badges */}
                        {account.accepts && account.accepts.length > 0 && (
                          <div className={styles.acceptsRow}>
                            <span className={styles.bankLabel}>Accepts</span>
                            <div className={styles.badges}>
                              {account.accepts.map((tid: string) => (
                                <span key={tid} className={styles.badge} title={tid}>
                                  <span className={styles.badgeIcon}>{TYPE_ICONS[tid] ?? "🔸"}</span>
                                  <span className={styles.badgeLabel}>{(DEFAULT_TYPES.find((x) => x.id === tid)?.title) ?? tid}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <aside className={styles.right}>
            <h3 className={styles.sectionTitle}>Donation Types</h3>
            <ul className={styles.typesList}>
              {types.map((t) => (
                <li key={t.id} className={styles.typeItem}>
                  <h4 className={styles.typeTitle}>{t.title}</h4>
                  {t.description && <p className={styles.typeDesc}>{t.description}</p>}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
