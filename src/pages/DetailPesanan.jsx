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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-fuchsia-700 mb-4">Detail Pesanan #{id}</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div><strong>Nama Pelanggan:</strong> {detail.nama}</div>
        <div><strong>Produk:</strong> {detail.produk}</div>
        <div>
          <strong>Status:</strong>{" "}
          <span className={`font-semibold ${statusColor[detail.status]}`}>
            {detail.status}
          </span>
        </div>
        <div><strong>Total:</strong> Rp {detail.total.toLocaleString()}</div>
        <div><strong>Alamat Pengiriman:</strong> {detail.alamat}</div>
        <div><strong>Metode Pembayaran:</strong> {detail.metode}</div>
        <div><strong>Catatan:</strong> {detail.catatan}</div>
      </div>

      <Link to="/pesanan-butik" className="inline-block mt-5 text-fuchsia-600 hover:underline">
        ← Kembali ke Daftar Pesanan
      </Link>
    </div>
  );
};

export default DetailPesananButik;
