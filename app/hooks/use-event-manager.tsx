// "use client";

import { useEffect, useMemo, useState } from "react";
import request from "../utils/axios";
import { useRouter } from "next/navigation";
type Event = {
    id: string;
    title: string;
    description?: string;
    date: any;
    duration: number; // in minutes
    location: string;
    image: string;
    liveLink?: string;
    isLive?: boolean;
    time?: any;
    dateTime: string;
    // Recurrence fields
    isRecurring?: boolean;
    recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrenceInterval?: number;
    recurrenceDays?: number[]; // 0-6 for Sunday-Saturday
    recurrenceEndDate?: string;
    recurrenceCount?: number;
    // Detailed View
    eventMinisters?: string[];
    bulletinId?: string;
    isPublicDetailedView?: boolean;
};

export const useEventManager = () => {


    // ==================================================== LIST

    const [events, setEvents] = useState([]);
    const [fetchingEvents, setFetchingEvents] = useState(true);
    const [ministers, setMinisters] = useState([]);
    const [bulletins, setBulletins] = useState([]);
    const [fetchingDependencies, setFetchingDependencies] = useState(false);

    const get_events = async () => {
        try {
            const res: any = await request.get("/get-events");
            let res_data = res.data;
            setEvents(res_data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setFetchingEvents(false);
        }
    }

    const get_dependencies = async () => {
        setFetchingDependencies(true);
        try {
            const [ministersRes, bulletinsRes] = await Promise.all([
                request.get("/ministers"), // Assuming this endpoint exists or will exist
                request.get("/bulletins")  // Assuming this endpoint exists or will exist
            ]);
            setMinisters((ministersRes as any).data || []);
            setBulletins((bulletinsRes as any).data || []);
        } catch (error) {
            console.error("Error fetching dependencies:", error);
        } finally {
            setFetchingDependencies(false);
        }
    }

    useEffect(() => {
        get_events();
        get_dependencies();
    }, [])

    function formatDate(date: Date): string {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    function formatTime(date: Date): string {
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    function formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    }

    function getEventStatus(dateTime: any, isLive?: boolean): "live" | "upcoming" | "past" | "ongoing" {
        const now = new Date();
        if (isLive) return "live";
        if (dateTime == now.getTime()) return "ongoing";
        if (dateTime > now.getTime()) return "upcoming";
        return "past";
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "live" | "upcoming" | "past">("all");
    const [sortBy, setSortBy] = useState<"date" | "name">("date");

    // Filter and search logic
    const filteredEvents = useMemo(() => {
        let filtered = [...events];

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter((event: any) => getEventStatus(event.date, event.isLive) === filterStatus);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (event: any) =>
                    event.name.toLowerCase().includes(query) ||
                    event.description?.toLowerCase().includes(query) ||
                    event.location.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === "date") {
            filtered.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else {
            filtered.sort((a: any, b: any) => String(a.name).localeCompare(b.name));
        }

        return filtered;
    }, [searchQuery, filterStatus, sortBy]);

    //================================================= CREATE

    const router = useRouter();

    const [formData, setFormData] = useState<Event>({
        id: "",
        title: "",
        description: "",
        date: "",
        duration: 60,
        location: "",
        image: "",
        liveLink: "",
        isLive: false,
        time: "",
        dateTime: "",
        // Recurrence defaults
        isRecurring: false,
        recurrenceType: 'weekly',
        recurrenceInterval: 1,
        recurrenceDays: [],
        recurrenceEndDate: "",
        recurrenceCount: undefined,
        // Detailed View
        eventMinisters: [],
        bulletinId: "",
        isPublicDetailedView: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            newErrors.name = "Event name is required";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        if (!formData.image.trim()) {
            newErrors.image = "Event image URL is required";
        }

        if (formData.duration <= 0) {
            newErrors.duration = "Duration must be greater than 0";
        }

        if (formData.date < new Date()) {
            newErrors.date = "Event date cannot be in the past";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: parseInt(value) || 0,
            }));
        } else if (name === "date") {

            setFormData((prev: any) => ({
                ...prev,
                dateTime: new Date(value).getTime(),
                date: value
            }));
        } else if (name === "time") {
            const [hours, minutes] = value.split(":");

            setFormData((prev: any) => ({
                ...prev,
                time: `${hours}:${minutes}`,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await add_event({
                title: formData.title,
                description: formData.description,
                time: formData.time,
                date: formData.date,
                duration: formData.duration,
                location: formData.location,
                image: formData.image,
                liveLink: formData.liveLink,
                isLive: false,
                dateTime: formData.dateTime,
                // Recurrence data
                isRecurring: formData.isRecurring,
                recurrenceType: formData.recurrenceType,
                recurrenceInterval: formData.recurrenceInterval,
                recurrenceDays: formData.recurrenceDays,
                recurrenceEndDate: formData.recurrenceEndDate,
                recurrenceCount: formData.recurrenceCount,
                // Detailed View
                eventMinisters: formData.eventMinisters,
                bulletinId: formData.bulletinId,
                isPublicDetailedView: formData.isPublicDetailedView,
            })

            setSuccess(true);
            router.push("/admin/event-manager");
            setState({ ...state, loading: false });

        } catch (error) {
            console.error("Error creating event:", error);
            setErrors({ submit: "Failed to create event. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const formatTimeForInput = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const fileToBase64 = (file: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();

        // readAsDataURL starts the read operation. The result will be
        // a data: URL (data:[<mediatype>][;base64],<data>)
        reader.readAsDataURL(file);

        // When the file is loaded successfully
        reader.onload = () => resolve(reader.result);

        // If an error occurs
        reader.onerror = (error) => reject(error);
    });



    const [state, setState] = useState({
        loading: false,
        msg: "",
        msgType: "",
        success: false,
        error: false,
        data: [],
    });

    const add_event = async (data: any) => {
        setState({
            ...state,
            loading: true,
        })
        const res: any = await request.post("/add-event", { data });
        let res_data = res.data;
        setState({
            ...state,
            loading: false,
            msg: res_data,
        })
        // console.log(res)
    }

    // =================================== DELETE
    const del_event = async (id: any) => {
        const res: any = await request.post("/del-event", { id });
        get_events();
    }



    return {
        add_event, state, events, setEvents, formatDate, formatTime, formatDuration,
        getEventStatus, searchQuery, filterStatus, sortBy, setSearchQuery, setFilterStatus, setSortBy,
        filteredEvents,


        formData, handleChange,
        handleSubmit,
        handleCancel,
        fileToBase64,
        formatTimeForInput,
        errors,
        loading,
        success,
        setSuccess,
        setLoading,
        setErrors,
        setFormData,
        del_event,
        fetchingEvents,
        ministers,
        bulletins,
        fetchingDependencies,
    }
}