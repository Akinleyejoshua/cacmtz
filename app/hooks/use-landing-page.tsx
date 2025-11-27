// "use client";

import { useEffect, useState } from "react";
import request from "../utils/axios";

type Event = {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  location: string;
  image: string;
  liveLink?: string;
  isLive?: boolean;
};


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

const convertTimeFormat = (date: any) => {
  const split = date.split("-");
  console.log(split)
  return new Date(split[0], split[1], split[2])
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

  const get_events = async () => {
    try {
      const [eventsRes, generalRes] = await Promise.all([
        request.get("/get-events"),
        request.get("/general")
      ]);
      setEvents(eventsRes.data);
      setGeneralSettings(generalRes.data);
    } catch (error) {
      console.error("Error fetching landing page data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    get_events();
  }, [])

  return { loading, events, generalSettings, formatRelativeTime, formatTime, formatDuration, convertTimeFormat }
}