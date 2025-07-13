import React, { useState } from "react";
import { FaShoppingCart, FaSearch, FaEnvelope, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import sedap from "../assets/ivan.png";
import { useCart } from "../context/CartContext";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-br from-orange-50 px-4 lg:px-6 py-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <div className="h-8 sm:h-10 w-auto">
            <img
              src={sedap}
              alt="Makanan"
              className="h-full w-auto object-contain"
            />
          </div>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-gray-600 hover:text-orange-500 transition"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Navigation Menu - Desktop */}
        <div className="hidden lg:flex items-center w-full lg:w-auto">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 items-center">
            {[
              { name: "Home", id: "home" },
              { name: "About", id: "about" },
              { name: "Products", id: "products" },
              { name: "Testimonial", id: "testimonial" },
              { name: "FAQ", id: "faq" },
              { name: "Membership", id: "membership", isLink: true }
            ].map((item) => (
              <li key={item.name}>
                {item.isLink ? (
                  <Link
                    to="/membership"
                    className="text-base lg:text-lg text-[#2E2E3A] hover:text-orange-500 transition"
                  >
                    {item.name}
                  </Link>
                ) : (
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-base lg:text-lg text-[#2E2E3A] hover:text-orange-500 transition"
                >
                  {item.name}
                </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Icons & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* User Info - Desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>

              {/* Newsletter Button - Desktop */}
              <button
                onClick={() => scrollToSection('newsletter')}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <FaEnvelope className="text-sm" />
                <span className="text-sm font-medium">Newsletter</span>
              </button>

              {/* Search Icon */}
              <div className="p-2 sm:p-3 bg-gray-100 rounded-full text-gray-600 cursor-pointer hover:text-red-500 flex items-center justify-center">
                <FaSearch className="text-sm sm:text-base" />
              </div>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative flex items-center justify-center">
                <div className="p-2 sm:p-3 bg-gray-100 rounded-full text-gray-600 cursor-pointer hover:text-red-500">
                  <FaShoppingCart className="text-sm sm:text-base" />
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Logout Button - Desktop */}
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
              {/* Login/Register - Desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                >
                  <FaSignInAlt className="text-sm" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* User Info - Mobile */}
            {isAuthenticated && (
              <div className="border-b border-gray-200 pb-3 mb-3">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            )}

            {/* Navigation Links - Mobile */}
            <ul className="space-y-2">
              {[
                { name: "Home", id: "home" },
                { name: "About", id: "about" },
                { name: "Products", id: "products" },
                { name: "Testimonial", id: "testimonial" },
                { name: "FAQ", id: "faq" },
                { name: "Membership", id: "membership", isLink: true }
              ].map((item) => (
                <li key={item.name}>
                  {item.isLink ? (
                    <Link
                      to="/membership"
                      className="block px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition text-sm"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition text-sm"
                    >
                      {item.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Action Buttons - Mobile */}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => scrollToSection('newsletter')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <FaEnvelope className="text-sm" />
                    <span>Newsletter</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  <FaSignInAlt className="text-sm" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
