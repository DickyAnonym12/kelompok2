import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/HeaderAdmin";
import React, { useState } from "react";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar untuk desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Sidebar mobile drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
                    {/* Sidebar drawer */}
                    <div className="relative w-64 bg-white h-full shadow-lg z-50">
                        <Sidebar />
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header dengan tombol hamburger di mobile */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-700 focus:outline-none">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-bold text-lg text-purple-700">UMKM CRM</span>
                </div>
                <div className="hidden md:block">
                    <Header />
                </div>
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}


