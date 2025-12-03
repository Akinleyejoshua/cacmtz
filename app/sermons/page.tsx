"use client"

import MainHeader from "../components/main-header";
import { useLandingPage } from "../hooks/use-landing-page";
import Footer from "../sections/footer";



export default function Home() {
  const { generalSettings } = useLandingPage();


  return (
    <div>
      <MainHeader />
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
