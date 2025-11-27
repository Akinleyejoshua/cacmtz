"use client"

import MainHeader from "../components/main-header";
import { SplashScreen } from "../components/splash-screen";
import { useLandingPage } from "../hooks/use-landing-page";
import DonationSection from "../sections/donation";
import Footer from "../sections/footer";



export default function Home() {
  const {loading} = useLandingPage();

  if (loading) return SplashScreen();


  return (
    <div>
     <MainHeader />
     <DonationSection  />
    <Footer />
    </div>
  );
}
