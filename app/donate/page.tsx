"use client"

import MainHeader from "../components/main-header";
import { useLandingPage } from "../hooks/use-landing-page";
import DonationSection from "../sections/donation";
import Footer from "../sections/footer";



export default function Home() {
  const { generalSettings } = useLandingPage();


  return (
    <div>
      <MainHeader />
      <DonationSection />
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
