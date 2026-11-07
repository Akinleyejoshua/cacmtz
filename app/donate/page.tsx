"use client";

import MainHeader from "../components/main-header";
import { useLandingPage } from "../hooks/use-landing-page";
import DonationSection from "../sections/donation";
import Footer from "../sections/footer";
import PageTracker from "../components/page-tracker";

export default function DonatePage() {
  const { generalSettings } = useLandingPage();

  return (
    <div>
      <PageTracker pageUrl="/donate" />
      <MainHeader />
      <DonationSection />
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
