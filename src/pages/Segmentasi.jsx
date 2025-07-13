import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, Line, Bar } from 'react-chartjs-2';
import Papa from 'papaparse';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const clusterColors = ["green", "blue", "orange", "red", "violet"];
const clusterNames = {
  0: "Pelanggan Loyal",
  1: "Pengunjung Baru",
  2: "Pembeli Hemat",
  3: "Pemboros / Big Spender"
};

const Segmentasi = () => {
  const [visualData, setVisualData] = useState([]);
  const [elbowData, setElbowData] = useState([]);
  const [barData, setBarData] = useState(null);
  const [clusterStats, setClusterStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setIsLoading(true);
    setError(null);
    setVisualData([]);
    setElbowData([]);
    setBarData(null);
    setClusterStats({});

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const allPoints = [];
          const preparedForElbow = [];

          for (const row of results.data) {
            const rowData = {
              gender: parseInt(row.gender),
              kategori_produk: parseInt(row.kategori_produk),
              warna: parseInt(row.warna),
              ukuran: parseInt(row.ukuran),
              metode_pembayaran: parseInt(row.metode_pembayaran),
              jumlah_pembelian: parseFloat(row.jumlah_pembelian),
              total_belanja: parseFloat(row.total_belanja),
              frekuensi_kunjungan: parseFloat(row.frekuensi_kunjungan),
            };

            try {
              const response = await fetch("https://018c-34-80-22-60.ngrok-free.app/predict/visual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowData),
              });

              const data = await response.json();
              if (data.success) {
                allPoints.push({
                  x: data.annual_income,
                  y: data.spending_score,
                  cluster: data.cluster,
                });
              }
            } catch (err) {
              console.error("Gagal prediksi visualisasi:", row, err);
            }

            preparedForElbow.push([
              rowData.gender,
              rowData.kategori_produk,
              rowData.warna,
              rowData.ukuran,
              rowData.metode_pembayaran,
              rowData.jumlah_pembelian,
              rowData.total_belanja,
              rowData.frekuensi_kunjungan
            ]);
          }

          if (allPoints.length === 0) {
            throw new Error("Tidak ada data yang dapat diproses dari file CSV. Pastikan file tidak kosong dan formatnya benar.");
          }

          setVisualData(allPoints);

          const clusterCounts = {};
          allPoints.forEach(p => {
            clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1;
          });

          setBarData({
            labels: Object.keys(clusterCounts).map(k => clusterNames[k] || `Cluster ${k}`),
            datasets: [{
              label: 'Jumlah Anggota',
              data: Object.values(clusterCounts),
              backgroundColor: Object.keys(clusterCounts).map(k => clusterColors[k] || 'gray'),
            }]
          });

          try {
            const statRes = await fetch("https://018c-34-80-22-60.ngrok-free.app/cluster_stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: preparedForElbow }),
            });

            const statData = await statRes.json();
            if (statData.success) {
              setClusterStats(statData.stats);
            }
          } catch (err) {
            console.error("Gagal ambil statistik klaster:", err);
          }

          try {
            const res = await fetch("https://018c-34-80-22-60.ngrok-free.app/elbow", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: preparedForElbow }),
            });
            const resData = await res.json();
            if (resData.success) {
              setElbowData(resData.inertia);
            }
          } catch (err) {
            console.error("Gagal ambil data Elbow:", err);
          }
        } catch (err) {
            console.error("Gagal memproses file:", err);
            setError(err.message || "Terjadi kesalahan saat memproses file. Pastikan formatnya benar dan coba lagi.");
        } finally {
            setIsLoading(false);
        }
      }
    });
  };

  const scatterDatasets = clusterColors.map((color, idx) => ({
    label: clusterNames[idx] || `Cluster ${idx}`,
    data: visualData.filter(p => p.cluster === idx),
    backgroundColor: color,
    pointRadius: 5
  }));

  const scatterChart = { datasets: scatterDatasets };

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Visualisasi Klaster Pelanggan' },
    },
    scales: {
      x: { title: { display: true, text: 'Annual Income' } },
      y: { title: { display: true, text: 'Spending Score' } },
    },
  };

  const elbowChart = {
    labels: Array.from({ length: elbowData.length }, (_, i) => i + 1),
    datasets: [{
      label: 'Inertia',
      data: elbowData,
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.3,
      pointRadius: 5
    }]
  };

  const elbowOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Elbow Method: Menentukan Jumlah Klaster' }
    },
    scales: {
      x: { title: { display: true, text: 'Jumlah Klaster' } },
      y: { title: { display: true, text: 'Inertia' } }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Segmentasi Pelanggan</h1>
        <p className="text-sm sm:text-base text-gray-600">Analisis dan visualisasi segmentasi pelanggan menggunakan machine learning</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upload Data CSV</h2>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">
              Pilih file CSV dengan kolom: Annual Income, Spending Score
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Memproses data...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>
      </div>

      {elbowData.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Elbow Method</h2>
          <div className="h-64 sm:h-80">
            <Line data={elbowChart} options={elbowOptions} />
          </div>
        </div>
      )}

      {barData && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Distribusi Klaster (Bar Chart)</h2>
          <div className="h-64 sm:h-80">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Jumlah Anggota per Klaster' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Jumlah Anggota' }
                  }
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(clusterStats).map(([key, stat]) => (
              <div key={key} className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm border-l-4" style={{ borderColor: clusterColors[key] }}>
                <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">{clusterNames[key] || `Cluster ${key}`}</h4>
                <p className="text-xs sm:text-sm text-gray-700 mb-1">Rata-rata Total Belanja: Rp{Number(stat.rata_rata_total_belanja).toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-700 mb-1">Rata-rata Frekuensi: {stat.rata_rata_frekuensi_kunjungan.toFixed(2)} kali</p>
                <p className="text-xs sm:text-sm text-gray-700 font-semibold">Jumlah Anggota: {stat.jumlah_anggota}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visualData.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Visualisasi Klaster (Scatter Chart)</h2>
          <div className="h-64 sm:h-80">
            <Scatter data={scatterChart} options={scatterOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Segmentasi;