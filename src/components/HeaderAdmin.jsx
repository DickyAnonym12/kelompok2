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
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{currentPageName}</h1>
            <p className="text-xs sm:text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin

