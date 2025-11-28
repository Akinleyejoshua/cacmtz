"use client"

import { useEffect, useState } from "react";
import MainHeader from "../components/main-header";
import { SplashScreen } from "../components/splash-screen";
import Footer from "../sections/footer";
import MinistersSection from "../sections/ministers";
import request from "../utils/axios";
import { Minister } from "../types/minister";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [ministers, setMinisters] = useState<Minister[]>([]);

    useEffect(() => {
        const fetchMinisters = async () => {
            try {
                const response = await request.get("/ministers");
                setMinisters(response.data);
            } catch (error) {
                console.error("Failed to fetch ministers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMinisters();
    }, []);

    if (loading) return SplashScreen();

    return (
        <div>
            <MainHeader />
            <MinistersSection ministers={ministers} />
            <Footer />
        </div>
    );
}
