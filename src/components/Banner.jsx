import React from "react";
import model from "../assets/model.png";

export default function Banner() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 sm:px-8 overflow-hidden">
      {/* Background Text "Sedap" */}
      <h1 className="absolute text-[150px] sm:text-[200px] lg:text-[280px] font-extrabold text-orange-100 -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none">
        Sedap
      </h1>

      {/* Decorative Circle */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-orange-100 rounded-full -z-10" />
      {/* Decorative Square */}
      <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-orange-200 rotate-12 -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl w-full z-10">
        {/* Text Content */}
        <div className="space-y-8 text-center md:text-left">
          <h1 className="font-jost-bold text-6xl sm:text-7xl md:text-8xl lg:text-[94px] text-gray-900 leading-tight">
            <span className="text-orange-500">Se</span>dap
          </h1>

          <p className="text-gray-500 text-xl font-muli-reguler text=[20px] max-w-md mx-auto md:mx-0">
            Jelajahi cita rasa autentik dari berbagai macam makanan enak yang
            kami sajikan khusus untuk Anda
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg">
              Pesan Sekarang
            </button>
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl transition-all duration-300 font-medium text-lg">
              Lihat Menu
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative w-full h-full group">
          <div className="overflow-hidden rounded-[200px_0_0_200px] xl:rounded-[250px_0_0_250px] transform group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
            <img
              src={model}
              alt="Makanan Sedap"
              className="w-full h-[500px] md:h-[600px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-orange-500/10 mix-blend-multiply" />
          </div>

          {/* Extra Decorative Element */}
          <div className="absolute -bottom-6 -right-6 bg-orange-500 w-24 h-24 rounded-full z-[-1] hidden md:block" />
          <div className="absolute -bottom-6 -left-200 top-1 bg-orange-500 w-24 h-24 rounded-full z-[-1] hidden md:block" />
        </div>
      </div>
    </div>
  );
}
