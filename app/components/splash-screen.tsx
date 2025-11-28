'use client'
import Image from 'next/image';
import styles from './splash-screen.module.css';
import Logo from '../../public/src/img/brand/logo.jpg';

export const SplashScreen = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Icon/Logo in the middle */}
                <div className={styles.iconWrapper}>
                    <div className={styles.icon}>
                        <Image style={{borderRadius: '10px'}} src={Logo} alt="Logo" width={140} height={140} />
                    </div>
                    <div className={styles.loadingSpinner}></div>
                </div>

                {/* Name at the bottom */}
                <div className={styles.footer}>
                    <h1 className={styles.title}>C.A.C Mount Zion</h1>
                    <p className={styles.subtitle}>Kingdom Zone</p>
                </div>
            </div>
        </div>
    );
}