"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Users,
    Gift,
    DollarSign,
    Calendar,
    Activity,
    Award,
    Clock,
    Target
} from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    color,
    description
}) => {
    const isPositive = change && change > 0;

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </h3>
                    {description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                    {change !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {isPositive ? "+" : ""}
                                {change}%
                            </span>
                            <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>
                <div
                    className={`rounded-lg ${color} p-3 transition-transform duration-300 group-hover:scale-110`}
                >
                    {icon}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-gray-700" />
        </div>
    );
};

interface ChartBarProps {
    label: string;
    value: number;
    maxValue: number;
    color: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ label, value, maxValue, color }) => {
    const percentage = (value / maxValue) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-gray-600 dark:text-gray-400">{value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const StatsComponent: React.FC = () => {
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

    // Sample data - replace with actual API data
    const stats = {
        totalGifts: 156,
        activeUsers: 1234,
        totalRevenue: 45678,
        completedEvents: 89,
        pendingGifts: 23,
        averageGiftValue: 293,
        participationRate: 78,
        topContributors: 45,
    };

    const giftsByCategory = [
        { label: "Birthday", value: 45, color: "bg-blue-500" },
        { label: "Wedding", value: 38, color: "bg-purple-500" },
        { label: "Anniversary", value: 32, color: "bg-pink-500" },
        { label: "Graduation", value: 25, color: "bg-green-500" },
        { label: "Other", value: 16, color: "bg-yellow-500" },
    ];

    const maxCategoryValue = Math.max(...giftsByCategory.map(c => c.value));

    const recentActivity = [
        { event: "New gift created", user: "John Doe", time: "2 hours ago" },
        { event: "Payment received", user: "Jane Smith", time: "5 hours ago" },
        { event: "Event completed", user: "Mike Johnson", time: "1 day ago" },
        { event: "New user registered", user: "Sarah Williams", time: "2 days ago" },
    ];

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Statistics & Insights
                </h2>
                <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                    {(["week", "month", "year"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${timeRange === range
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Gifts"
                    value={stats.totalGifts}
                    change={12.5}
                    icon={<Gift className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    description="All time gifts created"
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers.toLocaleString()}
                    change={8.2}
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    description="Currently active users"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    change={15.3}
                    icon={<DollarSign className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    description="Revenue this month"
                />
                <StatCard
                    title="Completed Events"
                    value={stats.completedEvents}
                    change={-2.4}
                    icon={<Calendar className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-pink-500 to-pink-600"
                    description="Successfully completed"
                />
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Pending Gifts"
                    value={stats.pendingGifts}
                    icon={<Clock className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                    description="Awaiting completion"
                />
                <StatCard
                    title="Avg Gift Value"
                    value={`$${stats.averageGiftValue}`}
                    change={5.7}
                    icon={<Target className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-cyan-500 to-cyan-600"
                    description="Per gift average"
                />
                <StatCard
                    title="Participation Rate"
                    value={`${stats.participationRate}%`}
                    change={3.1}
                    icon={<Activity className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    description="User engagement"
                />
                <StatCard
                    title="Top Contributors"
                    value={stats.topContributors}
                    icon={<Award className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                    description="Most active givers"
                />
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Gifts by Category Chart */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                        Gifts by Category
                    </h3>
                    <div className="space-y-4">
                        {giftsByCategory.map((category) => (
                            <ChartBar
                                key={category.label}
                                label={category.label}
                                value={category.value}
                                maxValue={maxCategoryValue}
                                color={category.color}
                            />
                        ))}
                    </div>
                    <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                Birthday gifts
                            </span>{" "}
                            are the most popular category this {timeRange}
                        </p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {activity.event}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {activity.user}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {activity.time}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50">
                        View All Activity
                    </button>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-gray-800 dark:to-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    📊 Performance Insights
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Peak Activity Time
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                            2:00 PM - 5:00 PM
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Most Popular Day
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                            Saturday
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Avg Response Time
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                            2.3 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsComponent;
