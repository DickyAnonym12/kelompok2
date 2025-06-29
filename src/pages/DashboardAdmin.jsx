import React, { useState, useEffect } from 'react';
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
import { Line, Bar } from 'react-chartjs-2';
import { supabase } from '../supabase';

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

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSubscribers: 0,
    totalSales: 0,
    recentSales: []
  });
  const [monthlySalesData, setMonthlySalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Penjualan Bulanan',
      data: [0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  });
  const [topProductsData, setTopProductsData] = useState({
    labels: ['Belum ada data'],
    datasets: [{
      label: 'Jumlah Terjual',
      data: [0],
      backgroundColor: ['rgba(156, 163, 175, 0.8)'],
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlySalesData();
  }, []);

  useEffect(() => {
    // Update chart produk terlaris ketika stats.recentSales berubah
    updateTopProductsChart();
  }, [stats.recentSales]);

  const fetchMonthlySalesData = async () => {
    const data = await getMonthlySalesData();
    setMonthlySalesData(data);
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch jumlah produk
      const { count: productCount } = await supabase
        .from('product')
        .select('*', { count: 'exact', head: true });

      // Fetch jumlah subscriber newsletter
      const { count: subscriberCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

      // Fetch laporan penjualan - urutkan berdasarkan created_at (descending untuk yang terbaru)
      const { data: salesData } = await supabase
        .from('laporan_penjualan')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Hitung total penjualan
      const totalSales = salesData?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

      setStats({
        totalProducts: productCount || 0,
        totalSubscribers: subscriberCount || 0,
        totalSales: totalSales,
        recentSales: salesData || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Data untuk chart penjualan bulanan (dari data real)
  const getMonthlySalesData = async () => {
    try {
      // Ambil semua data penjualan untuk analisis bulanan
      const { data: allSalesData } = await supabase
        .from('laporan_penjualan')
        .select('*')
        .order('created_at', { ascending: true });

      if (!allSalesData || allSalesData.length === 0) {
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Penjualan Bulanan',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        };
      }

      // Hitung total penjualan per bulan
      const monthlySales = {};
      allSalesData.forEach(sale => {
        if (sale.created_at) {
          const date = new Date(sale.created_at);
          const year = date.getFullYear();
          const month = date.getMonth(); // 0-11
          const monthKey = `${year}-${month}`;
          
          if (monthlySales[monthKey]) {
            monthlySales[monthKey] += sale.total || 0;
          } else {
            monthlySales[monthKey] = sale.total || 0;
          }
        }
      });

      // Jika tidak ada data dengan created_at, gunakan data dummy
      if (Object.keys(monthlySales).length === 0) {
        const totalSales = allSalesData.reduce((sum, item) => sum + (item.total || 0), 0);
        const averageMonthly = totalSales / 6;
        
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Penjualan Bulanan',
            data: [
              averageMonthly * 0.8,
              averageMonthly * 1.2,
              averageMonthly * 1.5,
              averageMonthly * 0.9,
              averageMonthly * 1.3,
              averageMonthly * 1.1
            ],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        };
      }

      // Urutkan berdasarkan bulan dan tahun
      const sortedMonths = Object.keys(monthlySales).sort();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const labels = sortedMonths.map(monthKey => {
        const [, month] = monthKey.split('-');
        return monthNames[parseInt(month)];
      });
      
      const data = sortedMonths.map(monthKey => monthlySales[monthKey]);

      return {
        labels: labels,
        datasets: [{
          label: 'Penjualan Bulanan',
          data: data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        }]
      };
    } catch (error) {
      console.error('Error getting monthly sales data:', error);
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Penjualan Bulanan',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        }]
      };
    }
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: 'Trend Penjualan Bulanan',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Total Penjualan (Rp)' },
        ticks: {
          callback: function(value) {
            return 'Rp' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  const updateTopProductsChart = () => {
    if (!stats.recentSales || stats.recentSales.length === 0) {
      setTopProductsData({
        labels: ['Belum ada data'],
        datasets: [{
          label: 'Jumlah Terjual',
          data: [0],
          backgroundColor: ['rgba(156, 163, 175, 0.8)'],
          borderWidth: 1,
        }]
      });
      return;
    }

    // Hitung total penjualan per produk
    const productSales = {};
    stats.recentSales.forEach(sale => {
      const productName = sale.product_name;
      if (productSales[productName]) {
        productSales[productName] += sale.quantity;
      } else {
        productSales[productName] = sale.quantity;
      }
    });

    // Urutkan berdasarkan jumlah terjual dan ambil 5 teratas
    const sortedProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
    ];

    setTopProductsData({
      labels: sortedProducts.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
      datasets: [{
        label: 'Jumlah Terjual',
        data: sortedProducts.map(([, quantity]) => quantity),
        backgroundColor: sortedProducts.map((_, index) => colors[index] || 'rgba(156, 163, 175, 0.8)'),
        borderWidth: 1,
      }]
    });
  };

  const productsChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: 'Produk Terlaris',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Jumlah Terjual' }
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">Dashboard Admin</h1>
              <p className="text-blue-100 text-lg">Selamat datang di panel admin Ivan Gunawan Prive</p>
              <div className="flex items-center gap-2 mt-2 text-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Last updated: {new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchDashboardData();
                fetchMonthlySalesData();
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Produk */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Produk</p>
              <p className="text-4xl font-bold">{stats.totalProducts}</p>
              <p className="text-blue-200 text-sm mt-1">Produk tersedia</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Subscriber */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Newsletter Subscribers</p>
              <p className="text-4xl font-bold">{stats.totalSubscribers}</p>
              <p className="text-green-200 text-sm mt-1">Pelanggan aktif</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Penjualan */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Total Penjualan</p>
              <p className="text-4xl font-bold">Rp{(stats.totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-orange-200 text-sm mt-1">Pendapatan total</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Penjualan */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Trend Penjualan Bulanan</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <Line data={monthlySalesData} options={salesChartOptions} />
          </div>

          {/* Chart Produk Terlaris */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <Bar data={topProductsData} options={productsChartOptions} />
          </div>
        </div>
      </div>

      {/* Tabel Penjualan Terbaru */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Penjualan Terbaru</h2>
              <p className="text-gray-500 text-sm">5 transaksi terakhir</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {stats.recentSales.length} Transaksi
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga Satuan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {stats.recentSales.slice(0, 5).map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{sale.product_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sale.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Rp{sale.unit_price?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-600">Rp{sale.total?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.created_at 
                      ? new Date(sale.created_at).toLocaleDateString('id-ID')
                      : 'N/A'
                    }
                  </td>
                </tr>
              ))}
              {stats.recentSales.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <p className="text-gray-500 text-sm">Belum ada transaksi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
