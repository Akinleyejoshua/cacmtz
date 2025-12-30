"use client";

import { useState, useEffect, useMemo } from "react";
import request from "../utils/axios";

export interface Sermon {
    _id: string;
    title: string;
    minister: string;
    date: string;
    description: string;
    youtubeLink: string;
    duration: number;
    bulletinId?: string;
    createdAt: string;
    updatedAt: string;
}

export type TimeFilter = "all" | "week" | "month" | "year";
export type SortBy = "newest" | "oldest" | "title" | "minister";

const SERMONS_PER_PAGE = 12;

export const useSermons = () => {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
    const [sortBy, setSortBy] = useState<SortBy>("newest");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch sermons from API
    useEffect(() => {
        const fetchSermons = async () => {
            setLoading(true);
            try {
                const response = await request.get("/sermon");
                setSermons(response.data || []);
            } catch (error) {
                console.error("Failed to fetch sermons:", error);
                setSermons([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSermons();
    }, []);

    // Filter and sort sermons
    const filteredSermons = useMemo(() => {
        let result = [...sermons];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (sermon) =>
                    sermon.title.toLowerCase().includes(query) ||
                    sermon.minister.toLowerCase().includes(query)
            );
        }

        // Apply time filter
        const now = new Date();
        if (timeFilter !== "all") {
            result = result.filter((sermon) => {
                const sermonDate = new Date(sermon.date);
                switch (timeFilter) {
                    case "week":
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return sermonDate >= weekAgo;
                    case "month":
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        return sermonDate >= monthAgo;
                    case "year":
                        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                        return sermonDate >= yearAgo;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "oldest":
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "minister":
                    return a.minister.localeCompare(b.minister);
                default:
                    return 0;
            }
        });

        return result;
    }, [sermons, searchQuery, timeFilter, sortBy]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredSermons.length / SERMONS_PER_PAGE);

    // Get paginated sermons
    const paginatedSermons = useMemo(() => {
        const startIndex = (currentPage - 1) * SERMONS_PER_PAGE;
        return filteredSermons.slice(startIndex, startIndex + SERMONS_PER_PAGE);
    }, [filteredSermons, currentPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, timeFilter, sortBy]);

    // Helper to extract YouTube video ID for thumbnail
    const getYouTubeThumbnail = (url: string): string => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if (match && match[1]) {
            return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
        }
        return "/placeholder-sermon.jpg";
    };

    // Format duration to readable string
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    // Format date to readable string
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return {
        sermons,
        loading,
        searchQuery,
        setSearchQuery,
        timeFilter,
        setTimeFilter,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        filteredSermons,
        paginatedSermons,
        totalPages,
        totalSermons: filteredSermons.length,
        getYouTubeThumbnail,
        formatDuration,
        formatDate,
        SERMONS_PER_PAGE,
    };
};
