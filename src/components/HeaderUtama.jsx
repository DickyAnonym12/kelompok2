import React from "react";
import butikImage from "../assets/tempatButik.jpg";

export default function HeaderUtama() {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={butikImage}
        alt="Restoran Sedap"
        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] object-cover"
      />
    </div>
  );
}
