import React from "react";
import { FaShoppingCart, FaSearch, FaEnvelope, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import sedap from "../assets/Sedap.png";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-br from-orange-50 px-4 lg:px-6 py-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <div className="h-10 w-auto">
            <img
              src={sedap}
              alt="Makanan"
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="text-3xl font-bold text-gray-900">
            Se<span className="text-orange-500">dap</span>
          </span>
        </a>

        {/* Navigation Menu */}
        <div className="hidden items-center w-full lg:flex lg:w-auto">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 items-center">
            {[
              { name: "Home", id: "home" },
              { name: "About", id: "about" },
              { name: "Products", id: "products" },
              { name: "Testimonial", id: "testimonial" },
              { name: "FAQ", id: "faq" }
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-[18px] text-[#2E2E3A] hover:text-orange-500 transition"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Icons & Auth */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>

              {/* Newsletter Button */}
              <button
                onClick={() => scrollToSection('newsletter')}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <FaEnvelope className="text-sm" />
                <span className="text-sm font-medium">Newsletter</span>
              </button>

              {/* Search Icon */}
              <div className="p-3 bg-gray-100 rounded-full text-gray-600 cursor-pointer hover:text-red-500 flex items-center justify-center">
                <FaSearch />
              </div>

              {/* Cart Icon with Badge */}
              <div className="relative flex items-center justify-center">
                <div className="p-3 bg-gray-100 rounded-full text-gray-600 cursor-pointer hover:text-red-500">
                  <FaShoppingCart />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                  2
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <FaSignInAlt className="text-sm" />
                <span className="text-sm font-medium">Login</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
