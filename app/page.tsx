"use client"

import { useLandingPage } from "./hooks/use-landing-page";
import MainHeader from "./components/main-header";
import Hero from "./components/hero";
import Events from "./sections/events";
import Banner from "./sections/banner";
import SermonSection from "./sections/sermon";
import ContactSection from "./sections/contact";
import Footer from "./sections/footer";
import AboutSection from "./sections/about";
import MinistersSection from "./sections/ministers";
import { SplashScreen } from "./components/splash-screen";

export default function Home() {
  const { loading, events, generalSettings, latestSermon, ministers } = useLandingPage();

  // Show splash screen while loading
  if (loading) {
    return <SplashScreen isLoading={loading} />;
  }

  return (
    <div>
      <MainHeader />
      <Hero />
      <Banner generalSettings={generalSettings} />
      <Events events={events} />
      <SermonSection sermon={latestSermon} />
      <MinistersSection
        ministers={ministers.slice(0, 8)}
        showSearch={false}
        title="Meet Our Ministers"
        subtitle="Dedicated leaders serving our community"
      />
      <AboutSection generalSettings={generalSettings} />
      <ContactSection generalSettings={generalSettings} />
      <Footer generalSettings={generalSettings} />
    </div>
  );
}
