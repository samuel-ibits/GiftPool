"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Beneficiary {
    _id: string;
    name: string;
    accountNumber: string;
    bank: string;
    accountType: string;
}

export default function BankAccount() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        bank: "",
        accountType: "Savings",
    });

    const fetchBeneficiaries = async () => {
        try {
            const res = await fetch("/api/wallet/beneficiary");
            const data = await res.json();
            if (res.ok) {
                setBeneficiaries(data.beneficiaries || []);
            }
        } catch (error) {
            console.error("Failed to fetch beneficiaries", error);
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/wallet/beneficiary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to add beneficiary");
            }

            toast.success("Beneficiary added successfully!");
            setFormData({
                name: "",
                accountNumber: "",
                bank: "",
                accountType: "Savings",
            });
            fetchBeneficiaries();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountNumber: string) => {
        if (!confirm("Are you sure you want to delete this beneficiary?")) return;

        try {
            const res = await fetch(`/api/wallet/beneficiary?accountNumber=${accountNumber}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete beneficiary");
            }

            toast.success("Beneficiary deleted successfully");
            fetchBeneficiaries();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Bank Accounts
                </h3>
            </div>
            <div className="p-7">
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="name"
                            >
                                Account Name
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="accountNumber"
                            >
                                Account Number
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="accountNumber"
                                id="accountNumber"
                                placeholder="1234567890"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="bank"
                            >
                                Bank Name
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="bank"
                                id="bank"
                                placeholder="Bank of America"
                                value={formData.bank}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full sm:w-1/2">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="accountType"
                            >
                                Account Type
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    name="accountType"
                                    id="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                >
                                    <option value="Savings">Savings</option>
                                    <option value="Current">Current</option>
                                </select>
                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                    <svg
                                        className="fill-current"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.8">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                fill=""
                                            ></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Account"}
                        </button>
                    </div>
                </form>

                <div className="flex flex-col gap-4">
                    {beneficiaries.map((beneficiary, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded border border-stroke bg-gray py-4 px-6 dark:border-strokedark dark:bg-meta-4"
                        >
                            <div>
                                <h4 className="font-medium text-black dark:text-white">
                                    {beneficiary.bank} - {beneficiary.accountType}
                                </h4>
                                <p className="text-sm text-black dark:text-white">
                                    {beneficiary.name}
                                </p>
                                <p className="text-xs text-body">
                                    {beneficiary.accountNumber}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(beneficiary.accountNumber)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {beneficiaries.length === 0 && (
                        <p className="text-center text-gray-500">No beneficiaries added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
