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
  } from 'lucide-react'
  import { Link, useLocation } from 'react-router-dom'
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { name: 'Produk', icon: <Box />, path: '/products' },
    { name: 'Laporan Penjualan', icon: <BarChart2 />, path: '/laporan-penjualan' },
    { name: 'Pelanggan', icon: <Users />, path: '/pelanggan' },
    { name: 'FAQ Admin', icon: <Settings />, path: '/faq-admin' },
    { name: 'Pesanan Butik', icon: <ShoppingCart />, path: '/pesanan-butik' },
    { name: 'Newsletter', icon: <BarChart2 />, path: '/newsletter-admin' },
    { name: 'Member Ship', icon: <MdOutlineWorkspacePremium />, path: '/membership' },
  ]
  
  const accountItems = [
    { name: 'Pengaturan Akun', icon: <Settings />, path: '/akun' },
    { name: 'Sign In', icon: <LogIn />, path: '/signin' },
    { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
  ]
  
  const Sidebar = () => {
    const location = useLocation()
  
    const isActive = (path) => location.pathname === path
  
    return (
      <aside className="bg-white w-64 md:w-64 h-full md:h-screen shadow-lg px-4 py-6 block md:rounded-none rounded-r-2xl max-w-full overflow-y-auto border-r-4 border-yellow-400">
        <div className="text-xl font-bold mb-8 text-yellow-500 tracking-wide">UMKM CRM</div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-yellow-50 hover:text-yellow-700 ${
                isActive(item.path)
                  ? 'bg-yellow-100 text-yellow-800 font-semibold border-l-4 border-yellow-400 shadow'
                  : 'text-gray-700'
              }`}
            >
              <span className={`w-5 h-5 ${isActive(item.path) ? 'text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'}`}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
  
        <div className="mt-8 text-xs font-semibold text-yellow-600">AKUN</div>
        <nav className="mt-2 space-y-1">
          {accountItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-yellow-50 hover:text-yellow-700 ${
                isActive(item.path)
                  ? 'bg-yellow-100 text-yellow-800 font-semibold border-l-4 border-yellow-400 shadow'
                  : 'text-gray-700'
              }`}
            >
              <span className={`w-5 h-5 ${isActive(item.path) ? 'text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'}`}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    )
  }
  
  export default Sidebar
  
  
  