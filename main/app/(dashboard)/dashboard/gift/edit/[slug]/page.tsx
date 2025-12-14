"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, X, Shield, Users, Calendar, DollarSign } from "lucide-react";

type ExpectedParticipant = {
    name?: string;
    email?: string;
    nin?: string;
    bvn?: string;
    secretCode?: string;
    choice?: string[];
    allowRepeat?: boolean;
    private?: boolean;
};

type GiftBagItemDetails = {
    enabled: boolean;
    networks?: string[];
    types?: string[];
    banks?: string[];
};

type GiftBag = {
    airtime: GiftBagItemDetails;
    data: GiftBagItemDetails;
    giftCard: GiftBagItemDetails;
    bank: GiftBagItemDetails;
    random: {
        enabled: boolean;
    };
};

type Gift = {
    title: string;
    description: string;
    image: string;
    amount: number;
    splits: number;
    duration: number;
    dispense: string;
    giftBag: GiftBag;
    expectedParticipant?: ExpectedParticipant;
};

const verificationOptions = [
    { value: "name", label: "Name", description: "Participant's full name" },
    { value: "email", label: "Email", description: "Email address" },
    { value: "nin", label: "NIN", description: "National Identity Number" },
    { value: "bvn", label: "BVN", description: "Bank Verification Number" },
    { value: "secretCode", label: "Secret Code", description: "Custom secret code" }
];

export default function EditGiftPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Gift>>({
        expectedParticipant: {
            choice: ["name", "email"],
            allowRepeat: false,
        },
        giftBag: {
            airtime: { enabled: false },
            data: { enabled: false },
            giftCard: { enabled: false },
            bank: { enabled: false },
            random: { enabled: true },
        },
    });

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const res = await fetch(`/api/gift/details/${slug}`);
                const data = await res.json();

                if (res.ok) {
                    setFormData({
                        ...data.data,
                        expectedParticipant: data.data.expectedParticipant || {
                            choice: ["name", "email"],
                            allowRepeat: false,
                            private: false,
                        },
                    });
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

    const toggleVerificationField = (field: string) => {
        if (field === "email") return; // Email is compulsory

        const currentChoice = formData.expectedParticipant?.choice || [];
        const newChoice = currentChoice.includes(field)
            ? currentChoice.filter(f => f !== field)
            : [...currentChoice, field];

        setFormData({
            ...formData,
            expectedParticipant: {
                ...formData.expectedParticipant,
                choice: newChoice,
            },
        });
    };

    const updateSecurityField = (field: string, value: string) => {
        setFormData({
            ...formData,
            expectedParticipant: {
                ...formData.expectedParticipant,
                [field]: value,
            },
        });
    };

    const toggleAllowRepeat = () => {
        setFormData({
            ...formData,
            expectedParticipant: {
                ...formData.expectedParticipant,
                allowRepeat: !formData.expectedParticipant?.allowRepeat,
            },
        });
    };

    const togglePrivate = () => {
        setFormData({
            ...formData,
            expectedParticipant: {
                ...formData.expectedParticipant,
                private: !formData.expectedParticipant?.private,
            },
        });
    };

    const updateExpectedValue = (field: string, value: string) => {
        setFormData({
            ...formData,
            expectedParticipant: {
                ...formData.expectedParticipant,
                [field]: value.split(",").map(v => v.trim()),
            },
        });
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        🎁 Edit Gift
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
                            📝 Basic Information
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="Enter gift title"
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="Describe your gift"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gift Details */}
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-green-600" />
                            Gift Details
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    Amount ($) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: Number(e.target.value) })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Number of Splits *
                                </label>
                                <input
                                    type="number"
                                    value={formData.splits || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, splits: Number(e.target.value) })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="1"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    Duration (days) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, duration: Number(e.target.value) })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="1"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    Dispense Date *
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>
                        </div>

                        {formData.amount && formData.splits && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800">
                                    <span className="font-semibold">Amount per split:</span> ${(formData.amount / formData.splits).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Participant Verification Settings */}
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-purple-600" />
                            Participant Verification Settings
                        </h2>

                        <div className="space-y-6">
                            {/* Required Verification Fields */}
                            <div>
                                <h3 className="mb-4 text-lg font-medium text-gray-700">
                                    Required Verification Fields
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Select which information participants must provide to claim the gift
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {verificationOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => toggleVerificationField(option.value)}
                                            className={`p-4 rounded-lg border-2 text-left transition-all ${formData.expectedParticipant?.choice?.includes(option.value)
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 bg-white hover:border-purple-300"
                                                } ${option.value === "email" ? "opacity-75 cursor-not-allowed" : ""}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">
                                                        {option.label}
                                                        {option.value === "email" && <span className="ml-2 text-xs text-purple-600 font-bold">(Required)</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded flex items-center justify-center ${formData.expectedParticipant?.choice?.includes(option.value)
                                                    ? "bg-purple-600"
                                                    : "bg-gray-200"
                                                    }`}>
                                                    {formData.expectedParticipant?.choice?.includes(option.value) && (
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Security Values (Optional) */}
                            {!formData.expectedParticipant?.private && (
                                <div className="border-t pt-6">
                                    <h3 className="mb-4 text-lg font-medium text-gray-700">
                                        Security Values (Optional)
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        If you want to verify against specific values, enter them here
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.expectedParticipant?.choice?.includes("nin") && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Expected NIN
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.expectedParticipant?.nin || ""}
                                                    onChange={(e) => updateSecurityField("nin", e.target.value)}
                                                    maxLength={11}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                    placeholder="11-digit NIN"
                                                />
                                            </div>
                                        )}

                                        {formData.expectedParticipant?.choice?.includes("bvn") && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Expected BVN
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.expectedParticipant?.bvn || ""}
                                                    onChange={(e) => updateSecurityField("bvn", e.target.value)}
                                                    maxLength={11}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                    placeholder="11-digit BVN"
                                                />
                                            </div>
                                        )}

                                        {formData.expectedParticipant?.choice?.includes("secretCode") && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Secret Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.expectedParticipant?.secretCode || ""}
                                                    onChange={(e) => updateSecurityField("secretCode", e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                    placeholder="Enter secret code"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Allow Repeat Claims */}
                            <div className="border-t pt-6">
                                <button
                                    type="button"
                                    onClick={toggleAllowRepeat}
                                    className="flex items-center justify-between w-full p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                                >
                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">Allow Repeat Claims</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Enable participants to claim multiple times
                                        </p>
                                    </div>
                                    <div className={`relative w-14 h-7 rounded-full transition-colors ${formData.expectedParticipant?.allowRepeat ? "bg-purple-600" : "bg-gray-300"
                                        }`}>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.expectedParticipant?.allowRepeat ? "translate-x-7" : ""
                                            }`}></div>
                                    </div>
                                </button>
                            </div>

                            {/* Private Gift */}
                            <div className="border-t pt-6">
                                <button
                                    type="button"
                                    onClick={togglePrivate}
                                    className="flex items-center justify-between w-full p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                                >
                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">Private Gift</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Only allow specific participants to claim (enter values separated by comma)
                                        </p>
                                    </div>
                                    <div className={`relative w-14 h-7 rounded-full transition-colors ${formData.expectedParticipant?.private ? "bg-purple-600" : "bg-gray-300"
                                        }`}>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.expectedParticipant?.private ? "translate-x-7" : ""
                                            }`}></div>
                                    </div>
                                </button>

                                {formData.expectedParticipant?.private && (
                                    <div className="mt-4 space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        {formData.expectedParticipant?.choice?.map((choice) => (
                                            <div key={choice}>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 capitalize">
                                                    Expected {choice === "nin" ? "NIN" : choice === "bvn" ? "BVN" : choice}s
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={Array.isArray(formData.expectedParticipant?.[choice as keyof ExpectedParticipant])
                                                        ? (formData.expectedParticipant?.[choice as keyof ExpectedParticipant] as string[]).join(", ")
                                                        : ""}
                                                    onChange={(e) => updateExpectedValue(choice, e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                                                    placeholder={`Enter allowed ${choice}s separated by comma`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gift Bag Options */}
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
                            🎁 Gift Bag Options
                        </h2>

                        <div className="space-y-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Configure how recipients can receive their gifts
                            </p>

                            {/* Gift Type Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Airtime */}
                                <div className={`p-5 rounded-xl border-2 transition-all ${formData.giftBag?.airtime?.enabled
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">📱</span>
                                            <h3 className="font-semibold text-gray-800">Airtime</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                giftBag: {
                                                    ...formData.giftBag!,
                                                    airtime: {
                                                        ...formData.giftBag!.airtime,
                                                        enabled: !formData.giftBag?.airtime?.enabled
                                                    }
                                                }
                                            })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.giftBag?.airtime?.enabled ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.giftBag?.airtime?.enabled ? "translate-x-6" : ""
                                                }`}></div>
                                        </button>
                                    </div>
                                    {formData.giftBag?.airtime?.enabled && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                Networks (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.giftBag?.airtime?.networks?.join(", ") || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    giftBag: {
                                                        ...formData.giftBag!,
                                                        airtime: {
                                                            ...formData.giftBag!.airtime,
                                                            networks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        }
                                                    }
                                                })}
                                                placeholder="MTN, Airtel, Glo, 9mobile"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Data */}
                                <div className={`p-5 rounded-xl border-2 transition-all ${formData.giftBag?.data?.enabled
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">📶</span>
                                            <h3 className="font-semibold text-gray-800">Data</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                giftBag: {
                                                    ...formData.giftBag!,
                                                    data: {
                                                        ...formData.giftBag!.data,
                                                        enabled: !formData.giftBag?.data?.enabled
                                                    }
                                                }
                                            })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.giftBag?.data?.enabled ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.giftBag?.data?.enabled ? "translate-x-6" : ""
                                                }`}></div>
                                        </button>
                                    </div>
                                    {formData.giftBag?.data?.enabled && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                Networks (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.giftBag?.data?.networks?.join(", ") || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    giftBag: {
                                                        ...formData.giftBag!,
                                                        data: {
                                                            ...formData.giftBag!.data,
                                                            networks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        }
                                                    }
                                                })}
                                                placeholder="MTN, Airtel, Glo, 9mobile"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Gift Card */}
                                <div className={`p-5 rounded-xl border-2 transition-all ${formData.giftBag?.giftCard?.enabled
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🎟️</span>
                                            <h3 className="font-semibold text-gray-800">Gift Card</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                giftBag: {
                                                    ...formData.giftBag!,
                                                    giftCard: {
                                                        ...formData.giftBag!.giftCard,
                                                        enabled: !formData.giftBag?.giftCard?.enabled
                                                    }
                                                }
                                            })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.giftBag?.giftCard?.enabled ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.giftBag?.giftCard?.enabled ? "translate-x-6" : ""
                                                }`}></div>
                                        </button>
                                    </div>
                                    {formData.giftBag?.giftCard?.enabled && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                Types (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.giftBag?.giftCard?.types?.join(", ") || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    giftBag: {
                                                        ...formData.giftBag!,
                                                        giftCard: {
                                                            ...formData.giftBag!.giftCard,
                                                            types: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        }
                                                    }
                                                })}
                                                placeholder="Amazon, iTunes, Google Play"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Bank Transfer */}
                                <div className={`p-5 rounded-xl border-2 transition-all ${formData.giftBag?.bank?.enabled
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🏦</span>
                                            <h3 className="font-semibold text-gray-800">Bank Transfer</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                giftBag: {
                                                    ...formData.giftBag!,
                                                    bank: {
                                                        ...formData.giftBag!.bank,
                                                        enabled: !formData.giftBag?.bank?.enabled
                                                    }
                                                }
                                            })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.giftBag?.bank?.enabled ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.giftBag?.bank?.enabled ? "translate-x-6" : ""
                                                }`}></div>
                                        </button>
                                    </div>
                                    {formData.giftBag?.bank?.enabled && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                Banks (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.giftBag?.bank?.banks?.join(", ") || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    giftBag: {
                                                        ...formData.giftBag!,
                                                        bank: {
                                                            ...formData.giftBag!.bank,
                                                            banks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        }
                                                    }
                                                })}
                                                placeholder="GTBank, Access Bank, First Bank"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Random Selection */}
                            <div className="border-t pt-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        giftBag: {
                                            ...formData.giftBag!,
                                            random: {
                                                enabled: !formData.giftBag?.random?.enabled
                                            }
                                        }
                                    })}
                                    className="flex items-center justify-between w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
                                >
                                    <div className="text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">🎲</span>
                                            <p className="font-medium text-gray-800">Random Gift Selection</p>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Randomly assign gift types to participants from enabled options
                                        </p>
                                    </div>
                                    <div className={`relative w-14 h-7 rounded-full transition-colors ${formData.giftBag?.random?.enabled ? "bg-blue-600" : "bg-gray-300"
                                        }`}>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.giftBag?.random?.enabled ? "translate-x-7" : ""
                                            }`}></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => router.back()}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-lg bg-gray-500 px-8 py-3 text-white hover:bg-gray-600 disabled:opacity-50 transition-colors font-medium"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div >
            </div >
        </div >
    );
}