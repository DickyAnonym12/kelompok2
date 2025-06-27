import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price_product * item.qty, 0);

  const handleCheckout = async () => {
    for (const item of cart) {
      await supabase.from("laporan_penjualan").insert([
        {
          product_name: item.name_product,
          quantity: item.qty,
          unit_price: item.price_product,
          discount: 0,
          total: item.price_product * item.qty,
        },
      ]);
    }
    clearCart();
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="max-w-xl mx-auto p-10 mt-16 bg-white rounded-2xl shadow-lg text-center">
        <div className="text-6xl mb-4">🛒</div>
        <div className="text-xl font-semibold text-gray-500 mb-2">Keranjang belanja kosong</div>
        <div className="text-gray-400 mb-6">Yuk, belanja produk favoritmu!</div>
        <button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow transition">Lihat Produk</button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">🛒 Keranjang Belanja</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-orange-50">
                <th className="py-3 px-2 text-left">Produk</th>
                <th className="py-3 px-2">Harga</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="bg-orange-50/50 rounded-xl shadow">
                  <td className="py-3 px-2 font-semibold">{item.name_product}</td>
                  <td className="py-3 px-2">Rp {Number(item.price_product).toLocaleString("id-ID")}</td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                      className="w-14 text-center border rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-3 px-2 font-bold text-green-600">
                    Rp {(item.price_product * item.qty).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-8">
          <span className="text-xl font-bold text-gray-700">
            Total: <span className="text-green-600">Rp {total.toLocaleString("id-ID")}</span>
          </span>
          <button
            onClick={handleCheckout}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow transition"
          >
            Checkout
          </button>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center transition duration-300 scale-100">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path d="M8 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">Pembelian Berhasil!</div>
            <div className="text-gray-500 mb-4 text-center">Terima kasih sudah berbelanja di Ivan Gunawan Prive.<br />Anda akan diarahkan ke halaman utama.</div>
            <button onClick={() => { setShowSuccess(false); navigate("/"); }} className="mt-2 px-6 py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Tutup</button>
          </div>
        </div>
      )}
    </>
  );
} 