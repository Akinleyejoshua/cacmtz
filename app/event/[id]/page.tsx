"use client"

import MainHeader from "../../components/main-header";
import { SplashScreen } from "../../components/splash-screen";
import { useLandingPage } from "../../hooks/use-landing-page";
import Footer from "../../sections/footer";



export default function Home() {
  const { loading, generalSettings } = useLandingPage();
  if (loading) return SplashScreen();


  return (
    <div>
     <MainHeader />
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
