import { useState, useEffect } from "react";
import axios from "axios";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(""); // untuk filter kategori
  const [searchTerm, setSearchTerm] = useState(""); // untuk cari nama produk

  const breadcrumb = ["Products", "Product List"];

  useEffect(() => {
    const url = category
      ? `https://fakestoreapi.com/products/category/${category}`
      : `https://fakestoreapi.com/products`;

    axios
      .get(url)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }
        setProducts(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "An unknown error occurred");
      });
  }, [category]);

  // Filter berdasarkan searchTerm di frontend
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const errorInfo = error ? (
    <div className="bg-red-100 mb-5 p-5 text-sm font-light text-red-600 rounded-xl flex items-center">
      <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
      {error}
    </div>
  ) : null;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Products" breadcrumb={breadcrumb} />

      {errorInfo}

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari produk..."
            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Semua Kategori</option>
            <option value="men's clothing">Pakaian Pria</option>
            <option value="women's clothing">Pakaian Wanita</option>
            <option value="jewelery">Perhiasan</option>
            <option value="electronics">Elektronik</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-indigo-600 text-white text-left text-sm font-semibold">
                <th className="px-6 py-4 rounded-l-xl">#</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 rounded-r-xl">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
              {filteredProducts.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {index + 1}.
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 capitalize">{item.category}</td>
                  <td className="px-6 py-4 font-medium">
                    Rp {(item.price * 15000).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {item.rating.rate} ({item.rating.count})
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
