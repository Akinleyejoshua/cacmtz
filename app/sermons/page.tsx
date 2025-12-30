"use client"

import MainHeader from "../components/main-header";
import { useLandingPage } from "../hooks/use-landing-page";
import Footer from "../sections/footer";
import SermonsSection from "../sections/sermons-section";
import styles from "./page.module.css";

export default function SermonsPage() {
  const { generalSettings } = useLandingPage();

  return (
    <div className={styles.page}>
      <MainHeader />
      <main className={styles.main}>
        <SermonsSection />
      </main>
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
