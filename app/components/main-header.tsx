"use client"

import React, { createRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./main-header.module.css";
import { AiOutlineHome, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Logo from "../../public/src/img/brand/logo.jpg"
import Image from "next/image";
import { FaPhotoFilm } from "react-icons/fa6";

export const MainHeader = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Close mobile menu when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (typeof window === "undefined") return;
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Detect scroll for header shadow effect
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const headerRef = createRef<HTMLDivElement>();

    useEffect(() => {
        // function to make it fixed on scroll
        const handleScroll = () => {
            if (typeof window === "undefined") return;
            const header = headerRef.current;
            if (header) {
                header.className = window.scrollY > 100 ? "header scrolled" : "header";
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                {/* Brand */}
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo} aria-label="Home">
                        <div className={styles.logoIconWrap}>
                            <Image src={Logo} width={40} height={40} alt="C.A.C Mount Zion Logo" className={styles.logoIcon} />
                            {/* <span className={styles.logoIcon}>⛪</span> */}
                        </div>
                        <div className={styles.logoBrand}>
                            <span className={styles.logoText}>C.A.C</span>
                            <span className={styles.logoSubtext}>Mount Zion, Ojodu</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Primary">
                    <button
                        className={styles.closeMenu}
                        aria-label="close menu"
                        onClick={() => setOpen((s) => !s)}
                        aria-expanded={open}
                    >
                        <AiOutlineClose size={24} />
                    </button>

                    <Link href="/" className={`${styles.navLink}`} onClick={() => setOpen(false)}>
                        <AiOutlineHome className={styles.navIcon} />
                        <span>Home</span>
                    </Link>

                    <Link href="/#about" className={`${styles.navLink}`} onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>About</span>
                    </Link>

                    <Link href="/#events" className={`${styles.navLink} ${pathname.includes("events") ? styles.active : ""}`} onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M16 2v4M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>Events</span>
                    </Link>

                    <Link href="/profile" className={`${styles.navLink} ${pathname === "/profile" ? styles.active : ""}`} onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Profile</span>
                    </Link>

                     <Link href="/gallery" className={`${styles.navLink} ${pathname === "/profile" ? styles.active : ""}`} onClick={() => setOpen(false)}>
                        <FaPhotoFilm/>
                        <span>Gallery</span>
                    </Link>


                    <Link href="/#contact" className={`${styles.navLink} ${pathname.includes("contact") ? styles.active : ""}`} onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Contact</span>
                    </Link>
                </nav>

                {/* Actions */}
                <div className={styles.actions}>
                    <Link href="/donate" className={styles.donateBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8 8.6c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11a5 5 0 0 1 8-4c1.4-1 3.6-1 5 0a5 5 0 0 1 8 4z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                        </svg>
                        
                        <span>Donate</span>
                    </Link>

                    <button
                        className={styles.hamburger}
                        aria-label="Toggle menu"
                        onClick={() => setOpen((s) => !s)}
                        aria-expanded={open}
                    >
                        {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            <div className={`${styles.backdrop} ${open ? styles.backdropVisible : ""}`} onClick={() => setOpen(false)} />
        </header>
    );
};

export default MainHeader;

