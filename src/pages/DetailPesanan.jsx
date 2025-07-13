import React from "react";
import { useParams, Link } from "react-router-dom";

// Data dummy
const pesananMock = {
  1: {
    nama: "Nadia",
    produk: "Dress Batik",
    status: "Diproses",
    total: 250000,
    alamat: "Jl. Melati No. 10, Pekanbaru",
    metode: "Transfer Bank",
    catatan: "Ukuran M, tolong bungkus kado ya.",
  },
  2: {
    nama: "Tania",
    produk: "Blouse Polos",
    status: "Dikirim",
    total: 180000,
    alamat: "Jl. Sakura No. 5, Dumai",
    metode: "COD",
    catatan: "-",
  },
  3: {
    nama: "Alya",
    produk: "Rok Mini",
    status: "Selesai",
    total: 210000,
    alamat: "Jl. Mawar No. 20, Duri",
    metode: "E-wallet",
    catatan: "Kirim sebelum Jumat.",
  },
};

const statusColor = {
  Diproses: "text-yellow-600",
  Dikirim: "text-blue-600",
  Selesai: "text-green-600",
};

const DetailPesananButik = () => {
  const { id } = useParams();
  const detail = pesananMock[id];

  if (!detail) {
    return <div className="p-6 text-red-600">❌ Pesanan tidak ditemukan.</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-fuchsia-700 mb-4">Detail Pesanan #{id}</h1>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-3">
        <div className="text-sm sm:text-base"><strong>Nama Pelanggan:</strong> {detail.nama}</div>
        <div className="text-sm sm:text-base"><strong>Produk:</strong> {detail.produk}</div>
        <div className="text-sm sm:text-base">
          <strong>Status:</strong>{" "}
          <span className={`font-semibold ${statusColor[detail.status]}`}>
            {detail.status}
          </span>
        </div>
        <div className="text-sm sm:text-base"><strong>Total:</strong> Rp {detail.total.toLocaleString()}</div>
        <div className="text-sm sm:text-base"><strong>Alamat Pengiriman:</strong> {detail.alamat}</div>
        <div className="text-sm sm:text-base"><strong>Metode Pembayaran:</strong> {detail.metode}</div>
        <div className="text-sm sm:text-base"><strong>Catatan:</strong> {detail.catatan}</div>
      </div>
      <div className="mt-4 sm:mt-6">
        <Link
          to="/pesanan-butik"
          className="inline-block bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    </div>
  );
};

export default DetailPesananButik;
