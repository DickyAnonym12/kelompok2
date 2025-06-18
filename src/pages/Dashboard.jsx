import React, { useState } from "react";
import Banner from "../components/Banner";
import AboutUs from "../components/AboutUs";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import testimonials from "../assets/testimonials.json";
import HeaderUtama from "../components/HeaderUtama.jsx";
import Newsletter from '../components/Newsletter';
import { useFaq } from '../context/FaqContext';

export default function Dashboard() {
  const { faq } = useFaq();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen">
        <div id="home">
          <HeaderUtama />
          <Banner />
        </div>
        
        <div id="about">
          <AboutUs />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Produk Section */}
            <div id="products" className="py-8 sm:py-16 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Produk Kami</h2>
                <ProductCard />
            </div>

            {/* Testimoni Section */}
            <div id="testimonial" className="py-8 sm:py-16 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Testimoni</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {testimonials.map((testi, index) => (
                        <TestimonialCard key={index} testi={testi} />
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="py-8 sm:py-16 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Frequently Asked Questions</h2>
                <div className="max-w-2xl mx-auto space-y-4">
                    {faq.map((item, idx) => (
                        <div key={item.id} className="border rounded-xl bg-white shadow">
                            <button
                                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-50"
                                onClick={() => toggleFaq(idx)}
                            >
                                <span className="font-semibold text-gray-800">{item.question}</span>
                                <span className={`ml-4 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {openFaqIndex === idx && (
                                <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                    {faq.length === 0 && (
                        <div className="text-center text-gray-400 py-8">Belum ada FAQ.</div>
                    )}
                </div>
            </div>
        </div>

        <div id="newsletter">
          <Newsletter />
        </div>
    </div>
  );
}
