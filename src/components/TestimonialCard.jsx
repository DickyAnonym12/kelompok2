import React from "react";

export default function TestimonialCard({ testi }) {
  return (
    <div className="rounded-lg shadow-lg p-3 sm:p-4 w-56 sm:w-64 text-center transform transition duration-300 hover:scale-105">
      <img
        src={testi.avatar}
        alt={testi.nama}
        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full object-cover border-4 border-white shadow-md"
      />
      <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-800">{testi.nama}</h3>
      <div className="flex justify-center mb-2">
        {/* Rating Bintang */}
        {[...Array(5)].map((_, index) => (
          <span key={index} className={`text-yellow-500 ${index < testi.rating ? 'text-yellow-500' : 'text-gray-300'}`}>⭐</span>
        ))}
      </div>
      <p className="text-gray-600 text-xs sm:text-sm mt-2 italic">"{testi.ulasan}"</p>
    </div>
  );
}
