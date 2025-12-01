"use client";
import React, { useState } from "react";
import ThemeToggler from "@/components/Header/ThemeToggler";

export default function AppConfiguration() {
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    App Configuration
                </h3>
            </div>
            <div className="p-7">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-black dark:text-white">Theme</h4>
                            <p className="text-sm text-gray-500">
                                Toggle between light and dark mode
                            </p>
                        </div>
                        <ThemeToggler />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-black dark:text-white">
                                Notifications
                            </h4>
                            <p className="text-sm text-gray-500">
                                Enable or disable app notifications
                            </p>
                        </div>
                        <label
                            htmlFor="toggle1"
                            className="flex cursor-pointer select-none items-center"
                        >
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="toggle1"
                                    className="sr-only"
                                    checked={notifications}
                                    onChange={() => setNotifications(!notifications)}
                                />
                                <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                <div
                                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${notifications && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                                        }`}
                                ></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
