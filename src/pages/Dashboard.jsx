import React, { useState } from "react";
import Banner from "../components/Banner";
import AboutUs from "../components/AboutUs";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import testimonials from "../assets/testimonials.json";
import HeaderUtama from "../components/HeaderUtama.jsx";
import Newsletter from '../components/Newsletter';
import { useFaq } from '../context/FaqContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { faq } = useFaq();
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const { user, role } = useAuth();

    const toggleFaq = (idx) => {
        setOpenFaqIndex(openFaqIndex === idx ? null : idx);
    };

    return (
        <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 font-poppins">
            <div id="home">
                <HeaderUtama />
                <Banner />
            </div>

            <div id="about" className="my-6 sm:my-8">
                <AboutUs />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Produk Section */}
                <div id="products" className="py-6 sm:py-8 lg:py-16 bg-white rounded-3xl shadow-xl border border-yellow-100 mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 lg:mb-10 text-yellow-700 drop-shadow-lg tracking-wide">Produk Kami</h2>
                    <ProductCard />
                </div>

                {/* Testimoni Section */}
                <div id="testimonial" className="py-6 sm:py-8 lg:py-16 bg-white rounded-3xl shadow-xl border border-yellow-100 mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 lg:mb-10 text-yellow-700 drop-shadow-lg tracking-wide">Testimoni</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {testimonials.map((testi, index) => (
                            <TestimonialCard key={index} testi={testi} />
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="py-6 sm:py-8 lg:py-16 bg-white rounded-3xl shadow-xl border border-yellow-100 mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 lg:mb-10 text-yellow-700 drop-shadow-lg tracking-wide">Frequently Asked Questions</h2>
                    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
                        {faq.map((item, idx) => (
                            <div key={item.id} className="border rounded-xl bg-white shadow">
                                <button
                                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center focus:outline-none hover:bg-yellow-50 text-sm sm:text-base"
                                    onClick={() => toggleFaq(idx)}
                                >
                                    <span className="font-semibold text-gray-800">{item.question}</span>
                                    <span className={`ml-2 sm:ml-4 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-700 animate-fade-in text-sm sm:text-base">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                        {faq.length === 0 && (
                            <div className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">Belum ada FAQ.</div>
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
