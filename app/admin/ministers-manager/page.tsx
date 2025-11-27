"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";

type Minister = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
};

const SAMPLE_MINISTERS: Minister[] = [
  {
    id: "m001",
    name: "Pastor John Adekunle",
    position: "Senior Pastor",
    department: "Pastoral Care",
    email: "john.adekunle@cacmz.org",
    phone: "+234 803 123 4567",
    bio: "Over 20 years of pastoral ministry experience. Specializes in biblical teaching and community outreach.",
  },
  {
    id: "m002",
    name: "Bishop Samuel Okafor",
    position: "Overseer",
    department: "Administration",
    email: "samuel.okafor@cacmz.org",
    phone: "+234 703 234 5678",
    bio: "Bishop Samuel oversees all church operations and provides spiritual guidance to the congregation.",
  },
  {
    id: "m003",
    name: "Pastor Amara Emeka",
    position: "Pastoral Assistant",
    department: "Youth Ministry",
    email: "amara.emeka@cacmz.org",
    phone: "+234 802 345 6789",
    bio: "Dedicated to youth development and Christian education. Passionate about mentoring young believers.",
  },
  {
    id: "m004",
    name: "Deacon Michael Obi",
    position: "Deacon",
    department: "Ushering",
    email: "michael.obi@cacmz.org",
    phone: "+234 701 456 7890",
    bio: "Serves as head deacon with focus on welcoming and organizing church services.",
  },
];

export default function MinistersManagerPage() {
  const [ministers, setMinisters] = useState<Minister[]>(SAMPLE_MINISTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const departments = useMemo(() => {
    return Array.from(new Set(ministers.map((m) => m.department))).sort();
  }, [ministers]);

  const filteredMinisters = useMemo(() => {
    return ministers
      .filter((minister) => {
        const matchesSearch =
          minister.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          minister.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          minister.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = !filterDepartment || minister.department === filterDepartment;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [ministers, searchQuery, filterDepartment]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this minister?")) {
      setMinisters((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Ministers Manager</h1>
          <p className={styles.subtitle}>Manage church ministers and their information</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, position, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* Filter */}
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Create Button */}
        <Link href="/admin/ministers-manager/add" className={styles.createBtn}>
          + Add Minister
        </Link>
      </div>

      {/* Ministers Table */}
      {filteredMinisters.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMinisters.map((minister) => (
                <tr key={minister.id}>
                  <td className={styles.idCell}>
                    <span className={styles.idBadge}>{minister.id}</span>
                  </td>
                  <td className={styles.nameCell}>
                    <div className={styles.ministerName}>{minister.name}</div>
                  </td>
                  <td className={styles.positionCell}>
                    <span className={styles.positionBadge}>{minister.position}</span>
                  </td>
                  <td className={styles.departmentCell}>
                    <span className={styles.departmentBadge}>{minister.department}</span>
                  </td>
                  <td className={styles.contactCell}>
                    <div className={styles.contactInfo}>
                      <div className={styles.email}>
                        <span className={styles.contactLabel}>Email:</span> {minister.email}
                      </div>
                      <div className={styles.phone}>
                        <span className={styles.contactLabel}>Phone:</span> {minister.phone}
                      </div>
                    </div>
                  </td>
                  <td className={styles.bioCell}>
                    <p className={styles.bioText}>{minister.bio}</p>
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      href={`/admin/ministers-manager/edit/${minister.id}`}
                      className={styles.editBtn}
                      title="Edit minister"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(minister.id)}
                      className={styles.deleteBtn}
                      title="Delete minister"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3 className={styles.emptyTitle}>No Ministers Found</h3>
          <p className={styles.emptyMessage}>
            {searchQuery || filterDepartment
              ? "Try a different search or filter"
              : "Add your first minister to get started"}
          </p>
          <Link href="/admin/ministers-manager/add" className={styles.emptyBtn}>
            Add Minister
          </Link>
        </div>
      )}

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{ministers.length}</div>
          <div className={styles.statLabel}>Total Ministers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{filteredMinisters.length}</div>
          <div className={styles.statLabel}>Displayed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{departments.length}</div>
          <div className={styles.statLabel}>Departments</div>
        </div>
      </div>
    </div>
  );
}
