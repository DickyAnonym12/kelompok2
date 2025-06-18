import React, { useState } from "react";
import liviadress from "../assets/produk/gambar1.png";
import feronicadress from "../assets/produk/gambar2.png";
import catalinaset from "../assets/produk/gambar3.png";
import shainasetcream from "../assets/produk/gambar4.png";
import shaairasetblue from "../assets/produk/gambar5.png";
import yazrinsetwhite from "../assets/produk/gambar6.png";
import emilybagsilver from "../assets/produk/gambar7.png";
import angelbag from "../assets/produk/gambar8.png";
import ladytotebagsoftpink from "../assets/produk/gambar9.png";

const productImages = {
  "gambar1.png": liviadress,
  "gambar2.png": feronicadress,
  "gambar3.png": catalinaset,
  "gambar4.png": shainasetcream,
  "gambar5.png": shaairasetblue,
  "gambar6.png": yazrinsetwhite,
  "gambar7.png": emilybagsilver,
  "gambar8.png": angelbag,
  "gambar9.png": ladytotebagsoftpink,
};

// Data produk fashion
const products = [
  {
    nama_produk: "Livia Dress",
    kode_produk: "LD01",
    harga: 4200000,
    stok: 10,
    image: "gambar1.png",
  },
  {
    nama_produk: "Feronica Dress",
    kode_produk: "FD02",
    harga: 3900000,
    stok: 0,
    image: "gambar2.png",
  },
  {
    nama_produk: "Catalina Set",
    kode_produk: "CS03",
    harga: 4000000,
    stok: 5,
    image: "gambar3.png",
  },
  {
    nama_produk: "Shaina Set Cream",
    kode_produk: "SSCA04",
    harga: 4000000,
    stok: 3,
    image: "gambar4.png",
  },
  {
    nama_produk: "Shaira Set Blue",
    kode_produk: "SSTO05",
    harga: 4000000,
    stok: 8,
    image: "gambar5.png",
  },
  {
    nama_produk: "Yazrin Set White",
    kode_produk: "YSW06",
    harga: 4000000,
    stok: 8,
    image: "gambar6.png",
  },
  {
    nama_produk: "Emily Bag Silver",
    kode_produk: "EBS07",
    harga: 1500000,
    stok: 8,
    image: "gambar7.png",
  },
  {
    nama_produk: "Angle Bag",
    kode_produk: "AB08",
    harga: 1500000,
    stok: 8,
    image: "gambar8.png",
  },
  {
    nama_produk: "Lady Totebag Soft Pink",
    kode_produk: "LTSP09",
    harga: 1499000,
    stok: 6,
    image: "gambar9.png",
  },
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
          <span className="text-base text-gray-500 font-normal">/item</span>
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
  const [visibleProductCount, setVisibleProductCount] = useState(6);

  // Filter produk berdasarkan search term
  const filteredProducts = products.filter((produk) => {
    const term = searchTerm.toLowerCase();
    return (
      produk.kode_produk.toLowerCase().includes(term) ||
      produk.nama_produk.toLowerCase().includes(term)
    );
  });

  // Produk yang tampil sesuai visibleCount
  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  // Fungsi show more untuk produk
  const handleShowMoreProducts = () => {
    setVisibleProductCount((prev) => prev + 6);
  };

  // Reset visible count saat search term berubah
  React.useEffect(() => {
    setVisibleProductCount(6);
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

      {/* Section Produk Fashion */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Produk Fashion</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((produk) => (
              <ProductCard key={produk.kode_produk} produk={produk} />
            ))
          ) : (
            <p className="text-gray-500">Produk tidak ditemukan.</p>
          )}
        </div>
        {visibleProductCount < filteredProducts.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMoreProducts}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300 font-semibold"
            >
              Tampilkan Lebih Banyak Produk
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
