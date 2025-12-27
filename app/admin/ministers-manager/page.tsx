"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminTopNav from "../../components/admin-top-nav";
import styles from "./page.module.css";
import request from "@/app/utils/axios";
import LoadingSpinner from "@/app/components/loading-spinner";

type Minister = {
  _id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
};

export default function MinistersManagerPage() {
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const fetchMinisters = async () => {
    try {
      const res = await request.get("/ministers");
      setMinisters(res.data);
    } catch (error) {
      console.error("Failed to fetch ministers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinisters();
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(ministers.map((m) => m.department))).sort();
  }, [ministers]);

  const filteredMinisters = useMemo(() => {
    return ministers
      .filter((minister) => {
        const matchesSearch =
          minister.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          minister.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (minister.email && minister.email.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDepartment = !filterDepartment || minister.department === filterDepartment;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [ministers, searchQuery, filterDepartment]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this minister?")) {
      try {
        await request.delete(`/ministers/${id}`);
        setMinisters((prev) => prev.filter((m) => m._id !== id));
      } catch (error) {
        console.error("Failed to delete minister:", error);
        alert("Failed to delete minister");
      }
    }
  };

  return (
    <div className={styles.page}>
      <AdminTopNav />
      <div className={styles.container}>

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
          <Link href="/admin/ministers-manager/create" className={styles.createBtn}>
            + Add Minister
          </Link>
        </div>

        {/* Ministers Table */}
        {loading ? (
          <div className={styles.loadingState}><LoadingSpinner size="medium" /></div>
        ) : filteredMinisters.length > 0 ? (
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
                  <tr key={minister._id}>
                    <td className={styles.idCell}>
                      <span className={styles.idBadge}>{minister._id.substring(0, 6)}...</span>
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
                        {minister.email && (
                          <div className={styles.email}>
                            <span className={styles.contactLabel}>Email:</span> {minister.email}
                          </div>
                        )}
                        {minister.phone && (
                          <div className={styles.phone}>
                            <span className={styles.contactLabel}>Phone:</span> {minister.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.bioCell}>
                      <p className={styles.bioText}>{minister.bio ? (minister.bio.length > 50 ? minister.bio.substring(0, 50) + "..." : minister.bio) : "-"}</p>
                    </td>
                    <td className={styles.actionsCell}>
                      <Link
                        href={`/admin/ministers-manager/edit/${minister._id}`}
                        className={styles.editBtn}
                        title="Edit minister"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(minister._id)}
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
            <Link href="/admin/ministers-manager/create" className={styles.emptyBtn}>
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
    </div>
  );
}
