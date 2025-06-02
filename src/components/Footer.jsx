import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlusG, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#252b3b] text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & Desc */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white">Se</span>
            <span className="text-[#f94f4f]">dap</span>
          </h2>
          <p className="text-gray-300 mb-4">
            Cafe dengan konsep minimalis dan modern.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#f94f4f]">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#f94f4f]">
              <FaTwitter />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#f94f4f]">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#f94f4f]">
              <FaGooglePlusG />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">SERVICES</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Delicious Food</li>
            <li>Parking Area</li>
            <li>Free Wifi</li>
          </ul>
        </div>

        {/* Important Link */}
        <div>
          <h3 className="text-xl font-semibold mb-4">IMPORTANT LINK</h3>
          <ul className="space-y-2 text-gray-300">
            <li>About Us</li>
            <li>Produk</li>
            <li>Testimonial</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">CONTACT</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1" />
              <span>
                Rumbai <br /> Riau, Pekanbaru
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt /> +62 8956 0152 2474
            </li>
            <li className="flex items-center gap-3">
              <FaPaperPlane /> sedap@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-6 text-center text-gray-400 text-sm">
        Copyright © 2025 Bert. All Rights Reserved.
      </div>
    </footer>
  );
}
