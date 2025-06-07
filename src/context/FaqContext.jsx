import React, { createContext, useContext, useState, useEffect } from "react";

const FaqContext = createContext();

const initialFaq = [
  { id: 1, question: 'Bagaimana cara memesan produk?', answer: 'Anda dapat memesan produk melalui halaman produk dan mengikuti langkah checkout.' },
  { id: 2, question: 'Apakah bisa membatalkan pesanan?', answer: 'Pesanan dapat dibatalkan sebelum dikirim dengan menghubungi admin.' },
];

export function FaqProvider({ children }) {
  const [faq, setFaq] = useState(() => {
    const stored = localStorage.getItem("faq");
    return stored ? JSON.parse(stored) : initialFaq;
  });

  // Simpan ke localStorage setiap kali faq berubah
  useEffect(() => {
    localStorage.setItem("faq", JSON.stringify(faq));
  }, [faq]);

  // Sinkronisasi antar tab
  useEffect(() => {
    const sync = (e) => {
      if (e.key === "faq") {
        setFaq(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <FaqContext.Provider value={{ faq, setFaq }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaq() {
  return useContext(FaqContext);
} 