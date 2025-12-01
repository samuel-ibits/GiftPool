"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        address: "",
        phoneNumber: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                bio: user.bio || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setUser(data.user);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                </h3>
            </div>
            <div className="p-7">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="firstName"
                            >
                                First Name
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Devid"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="lastName"
                            >
                                Last Name
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Jhon"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-5.5">
                        <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="phoneNumber"
                        >
                            Phone Number
                        </label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="+990 3343 7865"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-5.5">
                        <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                        >
                            Address
                        </label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="address"
                            id="address"
                            placeholder="123 Main St, City, Country"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-5.5">
                        <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="bio"
                        >
                            Bio
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                name="bio"
                                id="bio"
                                rows={6}
                                placeholder="Write your bio here"
                                value={formData.bio}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
