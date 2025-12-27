'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './splash-screen.module.css';
import Logo from '../../public/src/img/brand/logo.jpg';

// Random motivational/loading text to keep users engaged
const LOADING_MESSAGES = [
    "Preparing a blessing for you...",
    "Loading God's promises...",
    "Getting things ready...",
    "Gathering the congregation...",
    "Setting up your experience...",
    "Upon Mount Zion shall be deliverance...",
    "Faith is being sure of what we hope for...",
    "Be still and know that I am God...",
    "The Lord is my shepherd...",
    "Trust in the Lord with all your heart...",
    "Preparing the way of the Lord...",
    "Come, let us worship together...",
    "Loading the kingdom zone...",
    "Grace and peace to you...",
    "His mercies are new every morning...",
];

interface SplashScreenProps {
    isLoading: boolean;
}

export const SplashScreen = ({ isLoading }: SplashScreenProps) => {
    const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
    const [fadeIn, setFadeIn] = useState(true);

    // Rotate through messages every 3 seconds
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setFadeIn(false);
            
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
                setCurrentMessage(LOADING_MESSAGES[randomIndex]);
                setFadeIn(true);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Icon/Logo in the middle */}
                <div className={styles.iconWrapper}>
                    <div className={styles.icon}>
                        <Image 
                            style={{ borderRadius: '10px' }} 
                            src={Logo} 
                            alt="C.A.C Mount Zion Logo" 
                            width={140} 
                            height={140} 
                            priority
                        />
                    </div>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingSpinnerOuter}></div>
                </div>

                {/* Name and Loading Text */}
                <div className={styles.footer}>
                    <h1 className={styles.title}>C.A.C Mount Zion</h1>
                    <p className={styles.subtitle}>Kingdom Zone</p>
                    
                    {/* Animated Loading Message */}
                    <div className={styles.messageContainer}>
                        <p className={`${styles.loadingMessage} ${fadeIn ? styles.fadeIn : styles.fadeOut}`}>
                            {currentMessage}
                        </p>
                    </div>
                    
                    {/* Progress Dots */}
                    <div className={styles.progressDots}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}