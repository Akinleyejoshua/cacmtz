import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import request from "../utils/axios";

type Profile = {
    _id: string;
    title: string;
    content: string;
    description?: string;
    order: number;
    isActive: boolean;
};


export const useChurchProfileManager = () => {

    // ====================================== VIEWS

    const [profiles, setProfiles] = useState<Profile[]>([]);

    const get_church_profiles = async () => {
        const res_data = await request.get("/get-church-profiles");
        setProfiles(res_data.data)
    }

    useEffect(() => {
        get_church_profiles();
    }, [])


    const [searchQuery, setSearchQuery] = useState("");
    const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

    const filteredProfiles = useMemo(() => {
        let filtered = [...profiles];

        if (filterActive !== "all") {
            filtered = filtered.filter((p) => p.isActive === (filterActive === "active"));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) => p.title.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => a.order - b.order);
    }, [profiles, searchQuery, filterActive]);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this profile?")) {
            del_church_profile(id);
        }
    };

    const handleToggleActive = (id: string) => {
        setProfiles((prev) =>
            prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p))
        );
    };

    const handleReorder = (id: string, direction: "up" | "down") => {
        setProfiles((prev) => {
            const index = prev.findIndex((p) => p._id === id);
            if (direction === "up" && index > 0) {
                const newProfiles = [...prev];
                [newProfiles[index].order, newProfiles[index - 1].order] = [
                    newProfiles[index - 1].order,
                    newProfiles[index].order,
                ];
                return newProfiles.sort((a, b) => a.order - b.order);
            } else if (direction === "down" && index < prev.length - 1) {
                const newProfiles = [...prev];
                [newProfiles[index].order, newProfiles[index + 1].order] = [
                    newProfiles[index + 1].order,
                    newProfiles[index].order,
                ];
                return newProfiles.sort((a, b) => a.order - b.order);
            }
            return prev;
        });
    };

    //   ========================================== CREATE

    const router = useRouter();

    const [formData, setFormData] = useState<Omit<Profile, "_id">>({
        title: "",
        description: "",
        content: "",
        order: 1,
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Profile title is required";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Profile content is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "order" ? parseInt(value) || 1 : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content,
        }));
        if (errors.content) {
            setErrors((prev) => ({
                ...prev,
                content: "",
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
            await request.post("/add-church-profile", { data: formData });

            setSuccess(true);
            router.push("/admin/profile-manager");

        } catch (error) {
            console.error("Error creating profile:", error);
            setErrors({ submit: "Failed to create profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    // ================================ DEL =========================

       const del_church_profile = async (id: any) => {
        const res: any = await request.post("/del-church-profile", { id });
        get_church_profiles();
    }

    

    return {
        profiles, setProfiles,
        filterActive, setFilterActive,
        filteredProfiles, handleDelete,
        handleToggleActive,
        handleReorder, searchQuery, setSearchQuery,

        formData, setFormData,
        errors, setErrors,
        loading, setLoading,
        success, setSuccess,
        validateForm,
        handleChange,

        handleContentChange,
        handleSubmit,
        handleCancel,

        del_church_profile,
        get_church_profiles,
    }
}