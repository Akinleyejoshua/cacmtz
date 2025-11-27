"use client"

import MainHeader from "../components/main-header";
import { SplashScreen } from "../components/splash-screen";
import { useLandingPage } from "../hooks/use-landing-page";
import Footer from "../sections/footer";
import MinistersSection from "../sections/ministers";



export default function Home() {
  const {loading} = useLandingPage();

  if (loading) return SplashScreen();


  return (
    <div>
     <MainHeader />
     <MinistersSection/>
    <Footer />
    </div>
  );
}
