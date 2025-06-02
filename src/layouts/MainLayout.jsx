import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/HeaderAdmin";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - akan muncul di md ke atas */}
            <div className="block">
                <Sidebar />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}


