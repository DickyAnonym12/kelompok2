import React, { useState } from 'react';
import { useFaq } from '../context/FaqContext';

export default function Faq() {
  const { faq } = useFaq();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-6 sm:mb-8">Frequently Asked Questions</h1>
      <div className="space-y-3 sm:space-y-4">
        {faq.map((item, idx) => (
          <div key={item.id} className="border rounded-xl bg-white shadow">
            <button
              className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center focus:outline-none text-sm sm:text-base"
              onClick={() => toggle(idx)}
            >
              <span className="font-semibold text-gray-800">{item.question}</span>
              <span className={`ml-2 sm:ml-4 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {openIndex === idx && (
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
  );
} 