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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-fuchsia-700 mb-6">Daftar Pesanan Butik</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-fuchsia-100 text-fuchsia-800 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Nama Pelanggan</th>
              <th className="py-3 px-4 text-left">Produk</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {dataPesanan.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link to={`/pesanan-butik/${order.id}`} className="text-fuchsia-600 hover:underline">
                    {order.nama}
                  </Link>
                </td>
                <td className="py-3 px-4">{order.produk}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">Rp {order.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PesananButik;
