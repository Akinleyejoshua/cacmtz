"use client";

import { useEffect, useState } from "react";
import request from "../utils/axios";
import { save } from "../utils/helpers";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 0) return "Ended";
  if (diffMins < 1) return "Starting now";
  if (diffMins < 60) return `In ${diffMins}m`;
  if (diffHours < 24) return `In ${diffHours}h`;
  if (diffDays < 7) return `In ${diffDays}d`;
  return date.toLocaleDateString();
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

export const useLandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [latestSermon, setLatestSermon] = useState<any>(null);
  const [ministers, setMinisters] = useState<any[]>([]);

  const get_events = async () => {
    try {
      const [eventsRes, generalRes, sermonsRes, ministersRes] = await Promise.all([
        request.get("/get-events"),
        request.get("/general"),
        request.get("/sermon"),
        request.get("/ministers")
      ]);
      setEvents(eventsRes.data);
      setGeneralSettings(generalRes.data);
      setMinisters(ministersRes.data);

      if (sermonsRes.data && sermonsRes.data.length > 0) {
        setLatestSermon(sermonsRes.data[0]);
      }

    } catch (error) {
      console.error("Error fetching landing page data:", error);
    } finally {
      setLoading(false);
      sessionStorage.setItem("landingPageLoaded", "true")
    }
  }

  useEffect(() => {
    get_events();
  }, [])

  return { loading, events, generalSettings, latestSermon, ministers, formatRelativeTime, formatTime, formatDuration }
}