import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import sedap from "../assets/Sedap.png";

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // Scroll Down
        setIsVisible(false);
      } else {
        // Scroll Up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-gradient-to-br from-orange-50 px-4 lg:px-6 py-4 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2">
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
            {["Home", "About", "Food", "Testimonial", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[18px] text-[#2E2E3A] hover:text-orange-500 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Icons & Auth */}
        <div className="flex items-center space-x-4">
          {/* Login & Register */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="/login"
              className="text-[16px] text-[#2E2E3A] hover:text-orange-500 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="text-[16px] text-white bg-red-500 py-2 px-4 rounded-xl hover:bg-red-600 transition"
            >
              Register
            </a>
          </div>

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
        </div>
      </div>
    </nav>
  );
}

export default Header;
