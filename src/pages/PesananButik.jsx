import React from "react";
import { Link } from "react-router-dom";

const dataPesanan = [
  { id: 1, nama: "Nadia", produk: "Dress Batik", status: "Diproses", total: 250000 },
  { id: 2, nama: "Tania", produk: "Blouse Polos", status: "Dikirim", total: 180000 },
  { id: 3, nama: "Alya", produk: "Rok Mini", status: "Selesai", total: 210000 },
];

const statusColor = {
  Diproses: "bg-yellow-100 text-yellow-700",
  Dikirim: "bg-blue-100 text-blue-700",
  Selesai: "bg-green-100 text-green-700",
};

const PesananButik = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-fuchsia-700 mb-4 sm:mb-6">Daftar Pesanan Butik</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-fuchsia-100 text-fuchsia-800 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Nama Pelanggan</th>
              <th className="py-3 px-4 text-left">Produk</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {dataPesanan.map((pesanan) => (
              <tr key={pesanan.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{pesanan.nama}</td>
                <td className="py-3 px-4">{pesanan.produk}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[pesanan.status]}`}>
                    {pesanan.status}
                  </span>
                </td>
                <td className="py-3 px-4">Rp {pesanan.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {dataPesanan.map((pesanan) => (
          <div key={pesanan.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{pesanan.nama}</h3>
                <p className="text-gray-600 text-sm">{pesanan.produk}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[pesanan.status]}`}>
                {pesanan.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-fuchsia-700">
                Rp {pesanan.total.toLocaleString()}
              </span>
              <Link
                to={`/pesanan/${pesanan.id}`}
                className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium"
              >
                Detail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PesananButik;
