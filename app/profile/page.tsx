"use client"

import MainHeader from "../components/main-header";
import { SplashScreen } from "../components/splash-screen";
import { useChurchProfileManager } from "../hooks/use-church-profile-manager";
import Footer from "../sections/footer";
import ProfileSection from "../sections/profile-section";



export default function Home() {
  const {profiles} = useChurchProfileManager();

  if (profiles.length == 0) return SplashScreen();


  return (
    <div>
     <MainHeader />
     <ProfileSection profiles={profiles}/>
    <Footer />
    </div>
  );
}
