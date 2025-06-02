import React from "react";
import Banner from "../components/Banner";
import AboutUs from "../components/AboutUs";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import testimonials from "../assets/testimonials.json";
import HeaderUtama from "../components/HeaderUtama.jsx";

export default function Dashboard() {
  return (
    <div>
        <HeaderUtama />
        <Banner />
        <AboutUs />

        <div>
        {/* Produk Section */}
        <div className="py-16 bg-white">
            <h2 className="text-3xl font-bold text-center mb-10">Produk Kami</h2>
            <ProductCard />
        </div>

        {/* Testimoni Section */}
        <div className="py-16 bg-white">
            <h2 className="text-3xl font-bold text-center mb-10">Testimoni</h2>
            <div className="flex flex-wrap justify-center gap-6">
            {testimonials.map((testi, index) => (
                <TestimonialCard key={index} testi={testi} />
            ))}
            </div>
        </div>
    </div>
    </div>
  );
}
