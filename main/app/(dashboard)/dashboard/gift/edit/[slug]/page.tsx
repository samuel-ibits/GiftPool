"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Gift = {
    title: string;
    description: string;
    amount: number;
    splits: number;
    duration: number;
    dispense: string;
};

export default function EditGiftPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Gift>>({});

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const res = await fetch(`/api/gift/details/${slug}`);
                const data = await res.json();

                if (res.ok) {
                    setFormData(data.data);
                } else {
                    alert("Failed to load gift");
                    router.push("/dashboard/gift");
                }
            } catch (error) {
                console.error("Error fetching gift:", error);
                alert("An error occurred");
                router.push("/dashboard/gift");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchGift();
    }, [slug, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/gift/update/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Gift updated successfully!");
                router.push(`/dashboard/gift/details/${slug}`);
            } else {
                alert(data.message || "Failed to update gift");
            }
        } catch (error) {
            console.error("Error updating gift:", error);
            alert("An error occurred while updating the gift");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-indigo-600 border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Edit Gift</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-md">
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                value={formData.amount || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: Number(e.target.value) })
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Number of Splits
                            </label>
                            <input
                                type="number"
                                value={formData.splits || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, splits: Number(e.target.value) })
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Duration (days)
                            </label>
                            <input
                                type="number"
                                value={formData.duration || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, duration: Number(e.target.value) })
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Dispense Date
                            </label>
                            <input
                                type="date"
                                value={
                                    formData.dispense
                                        ? new Date(formData.dispense).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={(e) =>
                                    setFormData({ ...formData, dispense: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => router.back()}
                            disabled={saving}
                            className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
