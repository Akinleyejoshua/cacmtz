"use client"

import React, { useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

type Slide = {
	id: string;
	image: string;
	title: string;
	subtitle?: string;
	cta?: { label: string; href?: string };
	secondary?: { label: string; href?: string };
};

const DEFAULT_SLIDES: Slide[] = [
	{
		id: "s1",
		image:
			"https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=2000&q=60",
		title: "Welcome to Christ Apostolic Church Mount Zion",
		subtitle: "We are not just a church, We are a kingdom movement proclaiming the eternal realities of christ gospel to the nations. Our message is christ, our mission is preparing people for God's Kingdom on Earth and raising desciples for the work of the God's Kingdom, Our passion is to bring God's kingdom to every Family with a testimony of life transformed by the power of holy spirit. We are blessed to welcome you to our faith family—a place where hearts are transformed, spirits are nurtured, and communities are strengthened through Christ's love. Join us as we worship together, grow in faith, and serve with purpose and compassion.",
		cta: { label: "Join Us for Worship", href: "/#banner" },
		secondary: { label: "Learn Our Story", href: "/profile" },
	},
	{
		id: "s2",
		image:
			"https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=2000&q=60",
		title: "Community & Ministries",
		subtitle: "At C.A.C Mount Zion, we believe in the power of community and purposeful service. Our diverse ministries reach families, youth, and our city with compassion and hope. Whether you're seeking spiritual growth, fellowship, or ways to make a meaningful difference, there's a place for you here.",
		cta: { label: "Explore Our Ministries", href: "/ministries" },
		secondary: { label: "Upcoming Events", href: "/events" },
	},
	{
		id: "s3",
		image:
			"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=60",
		title: "Give & Support God's Work",
		subtitle: "Your generous gifts extend God's kingdom and transform lives. Whether you're responding to His call through tithes, offerings, or mission support, your contributions fuel our outreach, strengthen our community, and help us reach those in need with hope and healing.",
		cta: { label: "Give Now", href: "/give" },
		secondary: { label: "Learn How Your Gift Helps", href: "/give" },
	},
];

export default function Hero({ slides = DEFAULT_SLIDES, interval = 40000 }: { slides?: Slide[]; interval?: number }) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const timeoutRef = useRef<number | null>(null);
	const touchStartX = useRef<number | null>(null);

	const next = () => setIndex((i) => (i + 1) % slides.length);
	const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

	useEffect(() => {
		if (paused) return;
		timeoutRef.current = window.setTimeout(() => {
			next();
		}, interval);
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, [index, paused, interval, slides.length]);

	// keyboard support
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	// touch handlers for swipe
	const onTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current == null) return;
		const dx = e.changedTouches[0].clientX - touchStartX.current;
		const threshold = 50;
		if (dx > threshold) prev();
		if (dx < -threshold) next();
		touchStartX.current = null;
	};

	return (
		<section id="hero"
			className={styles.hero}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			aria-roledescription="carousel"
			aria-label="Hero carousel"
		>
			
			<div className={styles.slides}>
				{slides.map((s, i) => (
					<div
						key={s.id}
						className={`${styles.slide} ${i === index ? styles.active : ""}`}
						style={{ backgroundImage: `url(${s.image})` }}
						aria-hidden={i === index ? "false" : "true"}
					>
						<div className={styles.overlay} />
						<div className={styles.content}>
							<h2 className={styles.title}>{s.title}</h2>
							{s.subtitle && <p className={styles.subtitle}>{s.subtitle}</p>}
							<div className={styles.ctas}>
								{s.cta && (
									<a className={styles.primary} href={s.cta.href || "#"}>
										{s.cta.label}
									</a>
								)}
								{s.secondary && (
									<a className={styles.secondary} href={s.secondary.href || "#"}>
										{s.secondary.label}
									</a>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<button className={`${styles.arrow} ${styles.left}`} onClick={prev} aria-label="Previous slide">
				‹
			</button>
			<button className={`${styles.arrow} ${styles.right}`} onClick={next} aria-label="Next slide">
				›
			</button>

			<div className={styles.dots}>
				{slides.map((s, i) => (
					<button
						key={s.id}
						className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
						onClick={() => setIndex(i)}
						aria-label={`Go to slide ${i + 1}`}
						aria-current={i === index}
					/>
				))}
			</div>
		</section>
	);
}

