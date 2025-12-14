import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-8 sm:p-12 space-y-8">

                        {/* Introduction */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Shield className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Privacy Matters</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                At GiftPool, we take your privacy seriously. We understand that you trust us with your personal information when you participate in giveaways or claim gifts. This policy outlines exactly how we collect, use, and protect your data.
                            </p>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Data Collection */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Information We Collect</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                When you participate in a gift or giveaway, we may collect the following information necessary to process your claim:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Contact information (email address, phone number)</li>
                                <li>Identity verification details (Name, NIN, BVN - only for verification purposes)</li>
                                <li>Payment details (Bank account number, wallet address) for gift delivery</li>
                            </ul>
                        </section>

                        {/* Data Usage */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Database className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">How We Use Your Data</h2>
                            </div>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>To verify your identity and eligibility for a gift.</li>
                                <li>To process and deliver your claimed gifts (airtime, cash, etc.).</li>
                                <li>To communicate with you regarding the status of your claim.</li>
                                <li>To prevent fraud and ensure fair participation.</li>
                            </ul>
                        </section>

                        {/* Data Protection */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Lock className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Data Security</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                We implement robust security measures to protect your personal information. Your sensitive data is encrypted during transmission and storage. We do not sell your personal data to third parties. Identity verification data (like NIN/BVN) is used strictly for verification and is not stored permanently longer than necessary for the transaction or legal compliance.
                            </p>
                        </section>

                        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 text-center">
                                If you have any questions about this Privacy Policy, please contact our support team.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
