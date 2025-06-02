import React, { useState } from "react";
import nasigoreng from "../assets/produk/nasigoreng.jpg";
import miegoreng from "../assets/produk/miegoreng.jpg";
import bakso from "../assets/produk/bakso.jpeg";
import sate from "../assets/produk/sate.jpeg";
import soto from "../assets/produk/soto.jpg";
import ayambakarmadu from "../assets/produk/ayambakarmadu.jpeg";
import bakmi from "../assets/produk/bakmi.jpg";
import mieyamin from "../assets/produk/mie-yamin.jpg";
import nasiuduk from "../assets/produk/nasiuduk.jpg";
import gadogado from "../assets/produk/gadogado.jpg";
import esjeruk from "../assets/produk/esjeruk.jpg";
import esteh from "../assets/produk/esteh.jpeg";

const productImages = {
  "nasigoreng.jpg": nasigoreng,
  "miegoreng.jpg": miegoreng,
  "bakso.jpeg": bakso,
  "sate.jpeg": sate,
  "soto.jpg": soto,
  "ayambakarmadu.jpeg": ayambakarmadu,
  "bakmi.jpg": bakmi,
  "mie-yamin.jpg": mieyamin,
  "nasiuduk.jpg": nasiuduk,
  "gadogado.jpg": gadogado,
  "esjeruk.jpg": esjeruk,
  "esteh.jpeg": esteh,
};

// Pisahkan produk makanan dan minuman
const foods = [
  {
    nama_produk: "Nasi Goreng",
    kode_produk: "NSG01",
    harga: 15000,
    stok: 10,
    image: "nasigoreng.jpg",
  },
  {
    nama_produk: "Mie Goreng",
    kode_produk: "MGR02",
    harga: 12000,
    stok: 0,
    image: "miegoreng.jpg",
  },
  {
    nama_produk: "Bakso",
    kode_produk: "BKS03",
    harga: 17000,
    stok: 5,
    image: "bakso.jpeg",
  },
  {
    nama_produk: "Sate Ayam",
    kode_produk: "STA04",
    harga: 20000,
    stok: 3,
    image: "sate.jpeg",
  },
  {
    nama_produk: "Soto Ayam",
    kode_produk: "STO05",
    harga: 16000,
    stok: 8,
    image: "soto.jpg",
  },
  {
    nama_produk: "Ayam Bakar Madu",
    kode_produk: "ABMO06",
    harga: 20000,
    stok: 8,
    image: "ayambakarmadu.jpeg",
  },
  {
    nama_produk: "Bakmi Ayam",
    kode_produk: "BAO07",
    harga: 17000,
    stok: 8,
    image: "bakmi.jpg",
  },
  {
    nama_produk: "Mie Yamin",
    kode_produk: "MYO08",
    harga: 18000,
    stok: 8,
    image: "mie-yamin.jpg",
  },
  {
    nama_produk: "Nasi Uduk",
    kode_produk: "NDU09",
    harga: 14000,
    stok: 6,
    image: "nasiuduk.jpg",
  },
  {
    nama_produk: "Gado-Gado",
    kode_produk: "GDO10",
    harga: 13000,
    stok: 4,
    image: "gadogado.jpg",
  },
];

const drinks = [
  {
    nama_produk: "Es Teh Manis",
    kode_produk: "ETM11",
    harga: 5000,
    stok: 20,
    image: "esteh.jpeg",
  },
  {
    nama_produk: "Es Jeruk",
    kode_produk: "EJR12",
    harga: 7000,
    stok: 15,
    image: "esjeruk.jpg",
  },
  // Bisa tambah minuman lain di sini
];

function ProductCard({ produk }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg w-72 shrink-0 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="overflow-hidden">
        <img
          src={productImages[produk.image]}
          alt={produk.nama_produk}
          className="w-full h-44 object-cover transition-transform duration-500 ease-in-out hover:scale-110 border-2 border-gray-200"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-wide">
          {produk.nama_produk}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{produk.kode_produk}</p>
        <p className="text-2xl text-red-600 font-extrabold mb-1">
          Rp{produk.harga.toLocaleString("id-ID")}{" "}
          <span className="text-base text-gray-500 font-normal">/porsi</span>
        </p>
        <p className="text-sm text-gray-400 mb-5">Stok: {produk.stok}</p>

        <div className="flex items-center mb-3">
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-gray-300">⭐</span>
        </div>

        {produk.stok > 0 ? (
          <button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 rounded-xl shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300 font-semibold tracking-wide">
            Beli Sekarang
          </button>
        ) : (
          <button
            className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed select-none"
            disabled
          >
            Stok Habis
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleFoodCount, setVisibleFoodCount] = useState(5);
  const [visibleDrinkCount, setVisibleDrinkCount] = useState(3);

  // Filter makanan dan minuman berdasarkan search term
  const filteredFoods = foods.filter((produk) => {
    const term = searchTerm.toLowerCase();
    return (
      produk.kode_produk.toLowerCase().includes(term) ||
      produk.nama_produk.toLowerCase().includes(term)
    );
  });

  const filteredDrinks = drinks.filter((produk) => {
    const term = searchTerm.toLowerCase();
    return (
      produk.kode_produk.toLowerCase().includes(term) ||
      produk.nama_produk.toLowerCase().includes(term)
    );
  });

  // Produk yang tampil sesuai visibleCount
  const visibleFoods = filteredFoods.slice(0, visibleFoodCount);
  const visibleDrinks = filteredDrinks.slice(0, visibleDrinkCount);

  // Fungsi show more untuk makanan dan minuman
  const handleShowMoreFoods = () => {
    setVisibleFoodCount((prev) => prev + 5);
  };

  const handleShowMoreDrinks = () => {
    setVisibleDrinkCount((prev) => prev + 3);
  };

  // Reset visible count saat search term berubah
  React.useEffect(() => {
    setVisibleFoodCount(5);
    setVisibleDrinkCount(3);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Cari berdasarkan kode produk atau nama produk..."
          className="w-full max-w-md px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Section Makanan */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Makanan</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {visibleFoods.length > 0 ? (
            visibleFoods.map((produk) => (
              <ProductCard key={produk.kode_produk} produk={produk} />
            ))
          ) : (
            <p className="text-gray-500">Produk makanan tidak ditemukan.</p>
          )}
        </div>
        {visibleFoodCount < filteredFoods.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMoreFoods}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300 font-semibold"
            >
              Tampilkan Lebih Banyak Makanan
            </button>
          </div>
        )}
      </section>

      {/* Section Minuman */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Minuman</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {visibleDrinks.length > 0 ? (
            visibleDrinks.map((produk) => (
              <ProductCard key={produk.kode_produk} produk={produk} />
            ))
          ) : (
            <p className="text-gray-500">Produk minuman tidak ditemukan.</p>
          )}
        </div>
        {visibleDrinkCount < filteredDrinks.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMoreDrinks}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300 font-semibold"
            >
              Tampilkan Lebih Banyak Minuman
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
