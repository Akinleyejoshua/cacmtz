"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { load, save } from "../utils/helpers";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email || !password) {
      setError("Please provide both email and password.");
      return false;
    }
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL || password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setError("Invalid credentials. Use the administrator email and password.");
      setLoading(false);
      return;
    }
    // simulate authentication call - replace with real API
    try {
      // mock success for a demo admin: email contains "admin"
      if (email.toLowerCase().includes("gmail")) {
        // redirect to admin dashboard (placeholder)
        save("admin-auth", true);
        router.push(load("admin-path")||"/admin/general");
      } else {
        setError("Invalid credentials. Use an administrator email.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card} role="main">
        <header className={styles.header}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.lead}>Sign in with your administrative account</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.footer}>
          {/* <a className={styles.link} href="/admin/forgot">Forgot password?</a> */}
        </div>
      </div>
    </main>
  );
}