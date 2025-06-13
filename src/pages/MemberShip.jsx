import React from "react";

const dataPelanggan = [
  { id: 1, nama: "Andi", total: 50000, frekuensi: 1 },
  { id: 2, nama: "Budi", total: 150000, frekuensi: 2 },
  { id: 3, nama: "Citra", total: 350000, frekuensi: 3 },
  { id: 4, nama: "Dewi", total: 800000, frekuensi: 6 },
  { id: 5, nama: "Eko", total: 250000, frekuensi: 4 },
  { id: 6, nama: "Fina", total: 1000000, frekuensi: 2 },
];

// Fungsi membership berdasarkan frekuensi transaksi
function getMembership(frequency) {
  if (frequency <= 1) return "Bronze";
  else if (frequency <= 3) return "Silver";
  else if (frequency <= 5) return "Gold";
  else return "Platinum";
}

// Warna badge membership
const membershipColor = {
  Bronze: "bg-amber-800 text-white",           // Coklat
  Silver: "bg-gray-200 text-gray-700",         // Silver
  Gold: "bg-yellow-400 text-yellow-900",       // Emas
  Platinum: "bg-indigo-600 text-white",        // Mewah
};

const MembershipList = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-fuchsia-700 mb-6">Daftar Membership Pelanggan</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-fuchsia-100 text-fuchsia-800 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Nama Pelanggan</th>
              <th className="py-3 px-4 text-left">Total Pembelian</th>
              <th className="py-3 px-4 text-left">Transaksi</th>
              <th className="py-3 px-4 text-left">Membership</th>
            </tr>
          </thead>
          <tbody>
            {dataPelanggan.map((pelanggan) => {
              const level = getMembership(pelanggan.frekuensi);
              return (
                <tr key={pelanggan.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{pelanggan.nama}</td>
                  <td className="py-3 px-4">Rp {pelanggan.total.toLocaleString()}</td>
                  <td className="py-3 px-4">{pelanggan.frekuensi}x / bulan</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${membershipColor[level]}`}
                    >
                      {level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembershipList;
