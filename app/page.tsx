"use client"

import { useLandingPage } from "./hooks/use-landing-page";
import { SplashScreen } from "./components/splash-screen";
import MainHeader from "./components/main-header";
import Hero from "./components/hero";
import Events from "./sections/events";
import Banner from "./sections/banner";
import SermonSection from "./sections/sermon";
import ContactSection from "./sections/contact";
import Footer from "./sections/footer";
import AboutSection from "./sections/about";

export default function Home() {
  const { loading, events, generalSettings, latestSermon } = useLandingPage();

  if (loading) return SplashScreen();

  return (
    <div>
      <MainHeader />
      <Hero />
      <Banner />
      <Events events={events} />
      <SermonSection sermon={latestSermon} />
      <AboutSection generalSettings={generalSettings} />
      <ContactSection generalSettings={generalSettings} />
      <Footer generalSettings={generalSettings} />

    </div>
  );
}
