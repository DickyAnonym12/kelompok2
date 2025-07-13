import React from "react";
import model from "../assets/model.png";

export default function Banner() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 sm:px-8 overflow-hidden">
      {/* Background Text "Sedap" */}
      <h1 className="absolute text-[80px] sm:text-[120px] md:text-[150px] lg:text-[200px] xl:text-[280px] font-extrabold text-orange-100 -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none">
        Sedap
      </h1>

      {/* Decorative Circle */}
      <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-16 sm:w-24 h-16 sm:h-24 bg-orange-100 rounded-full -z-10" />
      {/* Decorative Square */}
      <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-12 sm:w-20 h-12 sm:h-20 border-4 border-orange-200 rotate-12 -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl w-full z-10">
        {/* Text Content */}
        <div className="space-y-6 sm:space-y-8 text-center md:text-left">
          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[94px] text-gray-900 leading-tight uppercase tracking-widest text-center">
            <span className="text-[#C39B58]">Ivan</span> Gunawan
            <br />
            <span className="text-[#C39B58]">Prive</span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg md:text-xl font-poppins font-normal max-w-md mx-auto md:mx-0">
            Rasakan pengalaman berbusana yang tak sekadar indah, tapi memancarkan kepribadian sejati Anda
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-base sm:text-lg">
              Pesan Sekarang
            </button>
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 font-medium text-base sm:text-lg">
              Lihat Menu
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative w-full h-full group">
          <div className="overflow-hidden rounded-[100px_0_0_100px] sm:rounded-[150px_0_0_150px] md:rounded-[200px_0_0_200px] xl:rounded-[250px_0_0_250px] transform group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
            <img
              src={model}
              alt="Makanan Sedap"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-orange-500/10 mix-blend-multiply" />
          </div>

          {/* Extra Decorative Element */}
          <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-orange-500 w-16 sm:w-24 h-16 sm:h-24 rounded-full z-[-1] hidden md:block" />
          <div className="absolute -bottom-4 sm:-bottom-6 -left-200 top-1 bg-orange-500 w-16 sm:w-24 h-16 sm:h-24 rounded-full z-[-1] hidden md:block" />
        </div>
      </div>
    </div>
  );
}
