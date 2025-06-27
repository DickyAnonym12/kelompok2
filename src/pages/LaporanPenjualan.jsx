import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../supabase';

const emptyForm = { product: '', qty: '', price: '', discount: '', total: '' };

export default function LaporanPenjualan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const sumTotal = data.reduce((acc, item) => acc + Number(item.total), 0);

  const fetchData = async () => {
    setLoading(true);
    const { data: laporan, error } = await supabase
      .from('laporan_penjualan')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } else if (laporan) {
      setData(
        laporan.map((item, idx) => ({
          no: idx + 1,
          product: item.product_name,
          qty: item.quantity,
          price: item.unit_price,
          discount: item.discount,
          total: item.total,
          id: item.id,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      product: item.product,
      qty: item.qty,
      price: item.price,
      discount: item.discount,
      total: item.total
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    const qty = Number(name === "qty" ? value : newForm.qty || 0);
    const price = Number(name === "price" ? value : newForm.price || 0);
    const discount = Number(name === "discount" ? value : newForm.discount || 0);

    newForm.total = qty * price - discount;
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product || !form.qty || !form.price) return;

    const dataToSave = {
      product_name: form.product,
      quantity: Number(form.qty),
      unit_price: Number(form.price),
      discount: Number(form.discount),
      total: Number(form.total),
    };

    if (editingItem) {
      await supabase.from('laporan_penjualan').update(dataToSave).eq('id', editingItem.id);
    } else {
      await supabase.from('laporan_penjualan').insert([dataToSave]);
    }
    
    fetchData();
    closeModal();
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await supabase.from('laporan_penjualan').delete().eq('id', itemToDelete.id);
      fetchData();
      closeDeleteModal();
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('LAPORAN PENJUALAN', 14, 18);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 25);
    doc.text('No. Laporan: SLS-2024-001', 14, 30);
    doc.text('Butik Cantik Jaya', 150, 18, { align: 'right' });
    doc.text('Jl. Melati No. 10, Jakarta', 150, 23, { align: 'right' });
    doc.text('Telp: 021-12345678', 150, 28, { align: 'right' });
    doc.text('www.butikcantikjaya.com', 150, 33, { align: 'right' });

    autoTable(doc, {
      startY: 38,
      head: [['No', 'Product', 'Quantity', 'Unit Price', 'Discount', 'Total']],
      body: data.map(row => [
        row.no,
        row.product,
        row.qty,
        `Rp ${row.price.toLocaleString('id-ID')}`,
        `Rp ${row.discount.toLocaleString('id-ID')}`,
        `Rp ${row.total.toLocaleString('id-ID')}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { font: 'helvetica', fontSize: 10 },
      foot: [['', '', '', '', 'Grand Total', `Rp ${sumTotal.toLocaleString('id-ID')}`]],
      footStyles: { fillColor: [232, 240, 254], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    doc.save('laporan-penjualan.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Laporan Penjualan</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={openAddModal} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            + Tambah Data
          </button>
          <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Download PDF
          </button>
        </div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-4 flex-col sm:flex-row bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
          <span className="text-gray-600 text-sm font-medium">Grand Total: </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Rp {sumTotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white text-left text-sm font-semibold">
                <th className="px-6 py-4 rounded-l-xl">No</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-3">Loading...</span>
                  </div>
                </td></tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {item.no}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">Rp {item.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">Rp {item.discount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-lg">Rp {item.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEditModal(item)} className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">Edit</button>
                      <button onClick={() => openDeleteModal(item)} className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                <td colSpan="5" className="px-6 py-4 text-right font-bold text-gray-700 text-lg">Grand Total</td>
                <td className="px-6 py-4 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-xl">Rp {sumTotal.toLocaleString('id-ID')}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200">&times;</button>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{editingItem ? 'Edit Data' : 'Tambah Data'}</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Product</label>
                <input type="text" name="product" value={form.product} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" required />
              </div>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Quantity</label>
                  <input type="number" name="qty" value={form.qty} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" required min="1" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Unit Price</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" required min="0" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Discount</label>
                  <input type="number" name="discount" value={form.discount} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Total</label>
                <input type="number" name="total" value={form.total} readOnly className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 font-bold text-gray-700" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200">Batal</button>
                <button type="button" onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">{editingItem ? 'Update' : 'Tambah'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative text-center">
            <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200">&times;</button>
            <div className="mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3">Hapus Data?</h3>
              <p className="text-gray-600 mb-2">Anda yakin ingin menghapus</p>
              <p className="font-semibold text-indigo-600">"{itemToDelete.product}"?</p>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={closeDeleteModal} className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200">Batal</button>
              <button onClick={confirmDelete} className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}