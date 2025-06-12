import React from "react";
import Banner from "../components/Banner";
import AboutUs from "../components/AboutUs";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import testimonials from "../assets/testimonials.json";
import HeaderUtama from "../components/HeaderUtama.jsx";
import Newsletter from '../components/Newsletter';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
        <HeaderUtama />
        <Banner />
        <AboutUs />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Produk Section */}
            <div className="py-8 sm:py-16 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Produk Kami</h2>
                <ProductCard />
            </div>

            {/* Testimoni Section */}
            <div className="py-8 sm:py-16 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Testimoni</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {testimonials.map((testi, index) => (
                        <TestimonialCard key={index} testi={testi} />
                    ))}
                </div>
            </div>
        </div>

        <Newsletter />
    </div>
  );
}
