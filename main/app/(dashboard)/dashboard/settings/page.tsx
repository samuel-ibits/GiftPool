"use client";
import React, { useState } from "react";
import Profile from "@/components/Settings/Profile";
import BankAccount from "@/components/Settings/BankAccount";
import AppConfiguration from "@/components/Settings/AppConfiguration";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
                <button
                    className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${activeTab === "profile"
                            ? "border-primary text-primary"
                            : "border-transparent text-body dark:text-bodydark"
                        }`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                <button
                    className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${activeTab === "bank"
                            ? "border-primary text-primary"
                            : "border-transparent text-body dark:text-bodydark"
                        }`}
                    onClick={() => setActiveTab("bank")}
                >
                    Bank Account
                </button>
                <button
                    className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${activeTab === "config"
                            ? "border-primary text-primary"
                            : "border-transparent text-body dark:text-bodydark"
                        }`}
                    onClick={() => setActiveTab("config")}
                >
                    App Configuration
                </button>
            </div>

            <div>
                {activeTab === "profile" && <Profile />}
                {activeTab === "bank" && <BankAccount />}
                {activeTab === "config" && <AppConfiguration />}
            </div>
        </div>
    );
}
