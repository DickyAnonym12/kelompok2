import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlusG, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#252b3b] text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & Desc */}
        <div>
        <h2 className="text-2xl font-bold mb-4">
            <span className="text-[#D4AF37]">Ivan Gunawan</span>
            <span className="text-[#B8860B]"> Prive</span>
          </h2>

          <p className="text-gray-300 mb-4">
            Ivan Gunawan Prive adalah brand premium dari Ivan Gunawan,
            yang lahir sebagai bentuk apresiasi kepada wanita Indonesia
            dengan mengedepankan produk Premium, Exclusive dan Limited.
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
          <h3 className="text-xl font-semibold mb-4">LOKASI KAMI</h3>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6643917240117!2d101.45168467472804!3d0.5032944637124735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5af003eaadfd7%3A0x6aa7156787c4ff5d!2sIvan%20Gunawan%20Prive!5e0!3m2!1sen!2sid!4v1751290877958!5m2!1sen!2sid" 
              className="w-full h-48 border-0" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <a href="/live-chat" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-lg shadow hover:bg-green-700 transition">
            <span role="img" aria-label="bot">🤖</span> Live Chat Bot
          </a>
          <a href="/customer-service" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition">
            <span role="img" aria-label="cs">💬</span> Customer Service
          </a>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-6 text-center text-gray-400 text-sm">
        Copyright © 2025 Kelompok2. All Rights Reserved.
      </div>
    </footer>
  );
}
