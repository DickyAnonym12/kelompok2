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
    <div className="p-4 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Segmentasi Pelanggan</h1>
        <p className="text-gray-600">Analisis dan visualisasi segmentasi pelanggan menggunakan machine learning</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow relative">
        <h2 className="text-lg font-semibold mb-4">Upload Data CSV</h2>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Menganalisis data, mohon tunggu...
            </p>
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          <strong>Format CSV yang dibutuhkan:</strong><br />
          Kolom: gender, kategori_produk, warna, ukuran, metode_pembayaran, jumlah_pembelian, total_belanja, frekuensi_kunjungan
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <p className="font-bold">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      )}

      {barData && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Distribusi Klaster (Bar Chart)</h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(clusterStats).map(([key, stat]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4" style={{ borderColor: clusterColors[key] }}>
                <h4 className="font-semibold mb-2 text-gray-800">{clusterNames[key] || `Cluster ${key}`}</h4>
                <p className="text-sm text-gray-700 mb-1">Rata-rata Total Belanja: Rp{Number(stat.rata_rata_total_belanja).toLocaleString()}</p>
                <p className="text-sm text-gray-700 mb-1">Rata-rata Frekuensi: {stat.rata_rata_frekuensi_kunjungan.toFixed(2)} kali</p>
                <p className="text-sm text-gray-700 font-semibold">Jumlah Anggota: {stat.jumlah_anggota}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visualData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Visualisasi Klaster (Scatter Chart)</h2>
          <Scatter data={scatterChart} options={scatterOptions} />
        </div>
      )}

      {elbowData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Elbow Method</h2>
          <Line data={elbowChart} options={elbowOptions} />
        </div>
      )}
    </div>
  );
};

export default Segmentasi;