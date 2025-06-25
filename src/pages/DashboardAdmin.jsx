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
import { Scatter, Line } from 'react-chartjs-2';
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

const DashboardAdmin = () => {
  const [visualData, setVisualData] = useState([]);
  const [elbowData, setElbowData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
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

          // Data untuk visualisasi
          try {
            const response = await fetch("https://ec67-35-237-188-71.ngrok-free.app/predict/visual", {
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

          // Data untuk Elbow
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

        // Fetch inertia untuk Elbow Method
        try {
          const res = await fetch("https://ec67-35-237-188-71.ngrok-free.app/elbow", {
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

        setVisualData(allPoints);
      }
    });
  };

  // Scatter chart untuk visualisasi klaster
  const scatterDatasets = clusterColors.map((color, idx) => ({
    label: `Cluster ${idx}`,
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

  // Line chart untuk Elbow Method
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
      {/* Upload File */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Upload Data CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border p-2 rounded-md"
        />
        <p className="text-sm text-gray-500 mt-1">
          Kolom: gender, kategori_produk, warna, ukuran, metode_pembayaran, jumlah_pembelian, total_belanja, frekuensi_kunjungan
        </p>
      </div>

      {/* Grafik Visualisasi Klaster */}
      {visualData.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Visualisasi Klaster</h2>
          <Scatter data={scatterChart} options={scatterOptions} />
        </div>
      )}

      {/* Grafik Elbow Method */}
      {elbowData.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Elbow Method</h2>
          <Line data={elbowChart} options={elbowOptions} />
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
