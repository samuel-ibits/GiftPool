// app/(dashboard)/dashboard/layout.tsx
"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../../globals.css";
import Lines from "@/components/Lines";
import ThemeToggler from "@/components/Header/ThemeToggler";

const inter = Inter({ subsets: ["latin"] });

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Stats", href: "/dashboard/stats", icon: "📈" },
    { name: "Gifts", href: "/dashboard/gift", icon: "🎁" },
    { name: "Analytics", href: "/dashboard/analytics", icon: "📉" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  const isActivePage = (href: string) => {
    return pathname === href;
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <Lines />
          <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              </div>

              <nav className="mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActivePage(item.href)
                        ? "border-r-2 border-blue-700 bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
              <header className="border-b bg-white shadow-sm">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {navigation.find((item) => item.href === pathname)
                        ?.name || "Dashboard"}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <ThemeToggler />
                      <button className="text-gray-500 hover:text-gray-700">
                        🔔
                      </button>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-sm font-medium text-white">
                          U
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default DashboardLayout;
