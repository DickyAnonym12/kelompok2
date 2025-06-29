import { Search, User, LogOut, Bell, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const HeaderAdmin = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mapping untuk nama halaman berdasarkan path
  const getPageName = (pathname) => {
    const pathMappings = {
      '/admin': 'Dashboard',
      '/admin/products': 'Produk',
      '/admin/pelanggan': 'Pelanggan',
      '/admin/pesanan-butik': 'Pesanan Butik',
      '/admin/laporan-penjualan': 'Laporan Penjualan',
      '/admin/segmentasi': 'Segmentasi',
      '/admin/faq-admin': 'FAQ Admin',
      '/admin/newsletter-admin': 'Newsletter',
      '/admin/newsletter-campaigns': 'Newsletter Campaigns',
      '/admin/membership': 'Membership',
      '/admin/user-list': 'User List'
    };

    // Cek untuk detail pages
    if (pathname.includes('/admin/products/') && pathname !== '/admin/products') {
      return 'Detail Produk';
    }
    if (pathname.includes('/admin/pelanggan/') && pathname !== '/admin/pelanggan') {
      return 'Detail Pelanggan';
    }
    if (pathname.includes('/admin/pesanan-butik/') && pathname !== '/admin/pesanan-butik') {
      return 'Detail Pesanan';
    }
    if (pathname.includes('/admin/newsletter-campaigns/add')) {
      return 'Tambah Campaign';
    }
    if (pathname.includes('/admin/newsletter-campaigns/') && pathname.includes('/edit')) {
      return 'Edit Campaign';
    }

    return pathMappings[pathname] || 'Dashboard';
  };

  const currentPageName = getPageName(location.pathname);

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white px-6 py-4 shadow-lg border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Pages</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentPageName}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="px-4 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm w-64 transition-all duration-300"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">New order received</p>
                    <p className="text-xs text-blue-600">2 minutes ago</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">Payment successful</p>
                    <p className="text-xs text-green-600">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-600 group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderAdmin

