import React from "react";
import Sedap from "../assets/Sedap.png";

export default function AboutUs() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 xl:px-6">
        {/* Unified box container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
          <div className="flex flex-col md:flex-row">
            {/* Image Section - Left */}
            <div className="md:w-1/2 p-8 md:p-12 bg-orange-50 flex items-center justify-center">
              <img
                src={Sedap}
                alt="Sedap"
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Content Section - Right */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Explore All Corners Of <br />
                <span className="text-orange-500">The World With Us</span>
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                These are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable.
              </p>

              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 font-medium self-start">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
