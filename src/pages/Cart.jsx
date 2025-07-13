import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const { user, refetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price_product * item.qty, 0);

  const testInsert = async () => {
    try {
      console.log('Testing simple insert...');
      
      const testData = {
        product_name: 'Test Product',
        quantity: 1,
        unit_price: 10000,
        discount: 0,
        total: 10000,
        created_at: new Date().toISOString(),
      };
      
      console.log('Test data:', testData);
      
      const { data, error } = await supabase
        .from("laporan_penjualan")
        .insert([testData])
        .select();
      
      if (error) {
        console.error('Test insert failed:', error);
        alert('Test insert failed: ' + error.message);
      } else {
        console.log('Test insert successful:', data);
        alert('Test insert successful! Check console for details.');
      }
    } catch (error) {
      console.error('Test insert error:', error);
      alert('Test insert error: ' + error.message);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Anda harus login untuk melakukan checkout.");
      navigate("/login");
      return;
    }

    try {
      console.log("--- PROSES CHECKOUT DIMULAI ---");
      console.log("User yang sedang checkout:", user);
      
      // Insert semua item ke laporan_penjualan
      const insertPromises = cart.map(async (item) => {
        const dataToInsert = {
          product_name: item.name_product,
          quantity: item.qty,
          unit_price: item.price_product,
          discount: 0,
          total: item.price_product * item.qty,
          created_at: new Date().toISOString(),
          user_id: user.id,
        };
        
        console.log('Inserting data:', dataToInsert);
        
        const { error } = await supabase
          .from("laporan_penjualan")
          .insert([dataToInsert]);
        
        if (error) throw error;
      });
      
      // Tunggu semua insert selesai
      await Promise.all(insertPromises);
      
      console.log("Semua item berhasil dimasukkan ke laporan penjualan.");
      
      // Hitung dan update poin
      const total = cart.reduce((sum, item) => sum + item.price_product * item.qty, 0);
      console.log(`Total belanja: ${total}`);

      const pointsEarned = Math.floor(total / 100000);
      console.log(`Poin yang didapat dari transaksi ini (1 per 100.000): ${pointsEarned}`);

      if (pointsEarned > 0) {
        const currentPoints = user.profile?.points || 0;
        const newTotalPoints = currentPoints + pointsEarned;

        console.log(`Mencoba update poin menjadi ${newTotalPoints} untuk user ID: ${user.id}`);
        
        // Memanggil fungsi RPC, bukan update tabel langsung
        const { error: rpcError } = await supabase.rpc('update_user_points', {
          new_points: newTotalPoints
        });

        if (rpcError) {
          console.error("--- ERROR SAAT MEMANGGIL RPC update_user_points ---");
          console.error("Pesan Error:", rpcError.message);
          console.error("Detail Error:", rpcError);
          alert(`Gagal memperbarui poin via RPC. Error: ${rpcError.message}`);
        } else {
          console.log("--- SUKSES MEMANGGIL RPC update_user_points ---");
          // Memuat ulang data profil pengguna untuk mendapatkan poin terbaru
          await refetchUserProfile();
        }
      } else {
        console.log("Tidak ada poin yang didapat dari transaksi ini.");
      }
      
      // Clear cart dan tampilkan sukses
      clearCart();
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal melakukan checkout. Silakan coba lagi.');
    }
  };

  // Fungsi untuk memanggil Midtrans Snap
  const payWithMidtrans = async () => {
    if (!user) {
      alert("Anda harus login untuk melakukan pembayaran.");
      navigate("/login");
      return;
    }
    // Siapkan data order
    const order_id = `ORDER-${Date.now()}`;
    const gross_amount = cart.reduce((sum, item) => sum + item.price_product * item.qty, 0);
    const customer_details = {
      first_name: user.profile?.full_name || user.email,
      email: user.email,
    };
    const items = cart.map(item => ({
      id: item.id,
      price: item.price_product,
      quantity: item.qty,
      name: item.name_product,
    }));
    try {
      const res = await fetch('http://localhost:5000/api/midtrans/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, gross_amount, customer_details, items })
      });
      const data = await res.json();
      if (window.snap && data.snapToken) {
        window.snap.pay(data.snapToken, {
          onSuccess: function(result){
            alert('Pembayaran sukses!');
            handleCheckout();
          },
          onPending: function(result){
            alert('Transaksi belum selesai, silakan selesaikan pembayaran.');
          },
          onError: function(result){
            alert('Pembayaran gagal!');
          },
          onClose: function(){
            alert('Anda menutup popup tanpa menyelesaikan pembayaran');
          }
        });
      } else if (!window.snap) {
        alert('Midtrans Snap belum termuat. Silakan refresh halaman atau pastikan script Snap sudah ditambahkan di index.html.');
      } else {
        alert('Gagal mendapatkan token pembayaran.');
      }
    } catch (err) {
      alert('Gagal memproses pembayaran: ' + err.message);
    }
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-10 mt-8 sm:mt-16 bg-white rounded-2xl shadow-lg text-center">
        <div className="text-4xl sm:text-6xl mb-4">🛒</div>
        <div className="text-lg sm:text-xl font-semibold text-gray-500 mb-2">Keranjang belanja kosong</div>
        <div className="text-sm sm:text-base text-gray-400 mb-6">Yuk, belanja produk favoritmu!</div>
        <button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow transition text-sm sm:text-base">Lihat Produk</button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg mt-8 sm:mt-12 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-orange-600">🛒 Keranjang Belanja</h2>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-orange-50/50 rounded-xl p-4 shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-sm">{item.name_product}</h3>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Harga:</span>
                  <span>Rp {Number(item.price_product).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Jumlah:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    className="w-16 text-center border rounded-lg px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Total:</span>
                  <span>Rp {(item.price_product * item.qty).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-lg sm:text-xl font-bold text-gray-700">
              Total: <span className="text-green-600">Rp {total.toLocaleString("id-ID")}</span>
            </span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleCheckout}
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg shadow transition w-full sm:w-auto"
              >
                Checkout
              </button>
              <button
                onClick={payWithMidtrans}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg shadow transition w-full sm:w-auto"
              >
                Bayar dengan Midtrans
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center transition duration-300 scale-100 max-w-sm w-full">
            <div className="bg-green-100 rounded-full p-3 sm:p-4 mb-4">
              <svg className="w-10 h-10 sm:w-14 sm:h-14 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path d="M8 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2 text-center">Pembelian Berhasil!</div>
            <div className="text-sm sm:text-base text-gray-500 mb-4 text-center">Terima kasih sudah berbelanja di Ivan Gunawan Prive.<br />Anda akan diarahkan ke halaman utama.</div>
            <button onClick={() => { setShowSuccess(false); navigate("/"); }} className="mt-2 px-4 sm:px-6 py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition text-sm sm:text-base">Tutup</button>
          </div>
        </div>
      )}
    </>
  );
} 