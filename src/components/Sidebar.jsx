import { MdOutlineWorkspacePremium } from "react-icons/md";  
import {
    LayoutDashboard,
    Users,         // untuk pelanggan
    ShoppingCart,  // untuk penjualan
    Box,           // untuk produk
    BarChart2,     // untuk laporan
    Settings,      // untuk pengaturan akun
    User,
    LogIn,
    UserPlus,
    PieChart,      // untuk segmentasi
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/admin' },
    { name: 'Produk', icon: <Box />, path: '/admin/products' },
    { name: 'Laporan Penjualan', icon: <BarChart2 />, path: '/admin/laporan-penjualan' },
    { name: 'Segmentasi', icon: <PieChart />, path: '/admin/segmentasi' },
    { name: 'Pelanggan', icon: <Users />, path: '/admin/pelanggan' },
    { name: 'FAQ Admin', icon: <Settings />, path: '/admin/faq-admin' },
    { name: 'Pesanan Butik', icon: <ShoppingCart />, path: '/admin/pesanan-butik' },
    { name: 'Newsletter', icon: <BarChart2 />, path: '/admin/newsletter-admin' },
    { name: 'Member Ship', icon: <MdOutlineWorkspacePremium />, path: '/admin/membership' },
    { name: 'User List', icon: <Users />, path: '/admin/user-list' },
]

const accountItems = [
    { name: 'Pengaturan Akun', icon: <Settings />, path: '/admin/akun' },
    { name: 'Sign In', icon: <LogIn />, path: '/login' },
    { name: 'Sign Up', icon: <UserPlus />, path: '/register' },
]

const Sidebar = () => {
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <aside className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 w-64 md:w-64 h-full md:h-screen shadow-2xl px-6 py-8 block md:rounded-none rounded-r-3xl max-w-full overflow-y-auto border-r-4 border-gradient-to-b from-yellow-400 to-orange-500 backdrop-blur-sm relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/20 to-yellow-300/10 rounded-full blur-2xl"></div>
            
            {/* Header with Enhanced Styling */}
            <div className="relative z-10">
                <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
                    IVAN GUNAWAN PRIVE
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-8 shadow-sm"></div>
            </div>

            {/* Main Navigation with Enhanced Styling */}
            <nav className="space-y-2 relative z-10">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium transform hover:scale-[1.02] hover:shadow-lg ${
                            isActive(item.path)
                                ? 'bg-gradient-to-r from-yellow-400/20 via-orange-400/15 to-amber-400/20 text-orange-800 font-bold border-l-4 border-gradient-to-b from-yellow-500 to-orange-600 shadow-xl backdrop-blur-sm'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-orange-700 hover:shadow-md'
                        }`}
                    >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${
                            isActive(item.path) 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                                : 'bg-white/70 text-gray-500 group-hover:bg-gradient-to-r group-hover:from-yellow-400/30 group-hover:to-orange-400/30 group-hover:text-orange-600 shadow-sm'
                        }`}>
                            <span className="w-5 h-5 block">{item.icon}</span>
                        </div>
                        <span className="flex-1 tracking-wide">{item.name}</span>
                        {isActive(item.path) && (
                            <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-sm"></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Account Section with Enhanced Styling */}
            <div className="mt-10 pt-6 border-t border-gradient-to-r from-yellow-200/40 to-orange-200/40 relative z-10">
                <div className="text-xs font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text uppercase tracking-wider mb-4 px-2">
                    AKUN
                </div>
                <nav className="space-y-2">
                    {accountItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-[1.02] ${
                                isActive(item.path)
                                    ? 'bg-gradient-to-r from-yellow-400/20 via-orange-400/15 to-amber-400/20 text-orange-800 font-semibold border-l-4 border-gradient-to-b from-yellow-500 to-orange-600 shadow-lg'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-orange-700 hover:shadow-sm'
                            }`}
                        >
                            <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                                isActive(item.path) 
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md' 
                                    : 'bg-white/50 text-gray-400 group-hover:bg-gradient-to-r group-hover:from-yellow-400/20 group-hover:to-orange-400/20 group-hover:text-orange-500'
                            }`}>
                                <span className="w-4 h-4 block">{item.icon}</span>
                            </div>
                            <span className="flex-1 tracking-wide text-sm">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

         
        </aside>
    )
}

export default Sidebar