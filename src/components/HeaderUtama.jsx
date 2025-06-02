import React from "react";
import butikImage from "../assets/tempatButik.jpg";

export default function HeaderUtama() {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={butikImage}
        alt="Restoran Sedap"
        className="w-full object-cover"
        style={{ height: "500px" }} // Atur tinggi sesuai kebutuhan
      />
    </div>
  );
}
