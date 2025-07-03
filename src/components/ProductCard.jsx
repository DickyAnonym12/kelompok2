import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { useCart } from "../context/CartContext";

function ProductCard({ produk }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      console.log(`User is authenticated, proceeding to buy ${produk.name_product}`);
      alert(`Anda telah menambahkan ${produk.name_product} ke keranjang!`);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg w-72 shrink-0 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="overflow-hidden">
        {produk.image_product ? (
          <img
            src={produk.image_product}
            alt={produk.name_product}
            className="w-full h-64 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-wide truncate">
          {produk.name_product}
        </h3>
        <p className="text-2xl text-red-600 font-extrabold mb-1">
          Rp{Number(produk.price_product).toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-400 mb-5">Stok: {produk.stock_product}</p>

        <button
          onClick={() => navigate(`/products/${produk.id}`)}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 rounded-xl shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300 font-semibold tracking-wide"
        >
          Detail
        </button>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleProductCount, setVisibleProductCount] = useState(6);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .order("name_product", { ascending: true });

      if (error) {
        setError(error.message);
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((produk) =>
    produk.name_product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  const handleShowMoreProducts = () => {
    setVisibleProductCount((prev) => prev + 6);
  };

  useEffect(() => {
    setVisibleProductCount(6);
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full max-w-md px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="mb-12">
        <div className="flex flex-wrap gap-6 justify-center">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((produk) => (
              <ProductCard key={produk.id} produk={produk} />
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
              Tampilkan Lebih Banyak
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
