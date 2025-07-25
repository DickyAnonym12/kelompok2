import React from "react";
import {
  FaUtensils,
  FaParking,
  FaSwimmer,
  FaSpa,
  FaDumbbell,
  FaWifi,
  FaCoffee,
  FaEllipsisH,
} from "react-icons/fa";

export default function FacilitiesSection() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-8 lg:px-16">
      {/* Stats Section - Enhanced */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center mb-12 sm:mb-16 md:mb-24">
        {[
          { value: "150+", label: "Food & Drink" },
          { value: "4", label: "Restaurants" },
          { value: "1000+", label: "Testimonials" },
        ].map((stat, index) => (
          <div key={index} className="p-3 sm:p-4 md:p-6 rounded-xl bg-orange-50">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
              {stat.value}
            </h2>
            <p className="text-orange-800 mt-1 sm:mt-2 md:mt-3 font-medium text-sm sm:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Facilities Box - Redesigned */}
      <div className="max-w-8xl mx-auto bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center shadow-md">
        {/* Header Section */}
        <div className="lg:col-span-1">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            We Provide <span className="text-orange-600">Premium</span> <br />{" "}
            Facilities
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
            Experience exceptional amenities designed for your comfort and
            enjoyment.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm sm:text-base">
            Discover More
          </button>
        </div>

        {/* Facilities Grid - Enhanced */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {[
            { icon: <FaUtensils />, title: "Delicious Food" },
            { icon: <FaParking />, title: "Parking Area" },
            { icon: <FaDumbbell />, title: "Exercise Space" },
            { icon: <FaWifi />, title: "Free Wifi" },
            { icon: <FaCoffee />, title: "Breakfast" },
            { icon: <FaEllipsisH />, title: "Other Services" },
          ].map((facility, index) => (
            <Facility key={index} icon={facility.icon} title={facility.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Enhanced Facility Component
function Facility({ icon, title }) {
  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
      <div className="text-2xl sm:text-3xl text-orange-500 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
        {icon}
      </div>
      <p className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300 text-sm sm:text-base">
        {title}
      </p>
    </div>
  );
}
