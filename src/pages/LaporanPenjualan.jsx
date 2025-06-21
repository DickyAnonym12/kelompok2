import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../supabase';

const initialData = [
  { no: 1, product: 'Blouse Katun', qty: 3, price: 120000, discount: 0, total: 360000 },
  { no: 2, product: 'Dress Batik', qty: 2, price: 250000, discount: 20000, total: 480000 },
  { no: 3, product: 'Celana Kulot', qty: 4, price: 90000, discount: 0, total: 360000 },
  { no: 4, product: 'Hijab Voal', qty: 5, price: 50000, discount: 0, total: 250000 },
  { no: 5, product: 'Outer Rajut', qty: 1, price: 175000, discount: 25000, total: 150000 },
];

const emptyForm = { product: '', qty: '', price: '', discount: '', total: '' };

export default function LaporanPenjualan() {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const sumTotal = data.reduce((acc, item) => acc + Number(item.total), 0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: laporan, error } = await supabase
        .from('laporan_penjualan')
        .select('*');
      if (!error && laporan) {
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
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (idx) => {
    setForm({ ...data[idx] });
    setEditIndex(idx);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    if (["qty", "price", "discount"].includes(name)) {
      const qty = Number(name === "qty" ? value : newForm.qty || 0);
      const price = Number(name === "price" ? value : newForm.price || 0);
      const discount = Number(name === "discount" ? value : newForm.discount || 0);
      newForm.total = qty * price - discount;
    }
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product || !form.qty || !form.price) return;

    if (editIndex !== null) {
      // Edit (update di Supabase)
      const item = data[editIndex];
      const { error } = await supabase
        .from('laporan_penjualan')
        .update({
          product_name: form.product,
          quantity: Number(form.qty),
          unit_price: Number(form.price),
          discount: Number(form.discount),
          total: Number(form.total),
        })
        .eq('id', item.id);
      if (!error) {
        // Update state lokal
        const newData = [...data];
        newData[editIndex] = { ...form, no: item.no, qty: Number(form.qty), price: Number(form.price), discount: Number(form.discount), total: Number(form.total), id: item.id };
        setData(newData);
      }
    } else {
      // Add (insert ke Supabase)
      const { data: inserted, error } = await supabase
        .from('laporan_penjualan')
        .insert([
          {
            product_name: form.product,
            quantity: Number(form.qty),
            unit_price: Number(form.price),
            discount: Number(form.discount),
            total: Number(form.total),
          },
        ])
        .select();
      if (!error && inserted && inserted.length > 0) {
        setData([
          ...data,
          {
            ...form,
            no: data.length ? Math.max(...data.map(d => d.no)) + 1 : 1,
            qty: Number(form.qty),
            price: Number(form.price),
            discount: Number(form.discount),
            total: Number(form.total),
            id: inserted[0].id,
          },
        ]);
      }
    }
    closeModal();
  };

  const handleDelete = (idx) => {
    setDeleteIndex(idx);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const item = data[deleteIndex];
    await supabase.from('laporan_penjualan').delete().eq('id', item.id);
    setData(data.filter((_, i) => i !== deleteIndex));
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('LAPORAN PENJUALAN', 14, 18);
    doc.setFontSize(10);
    doc.text('Tanggal: 11/05/2024', 14, 25);
    doc.text('No. Laporan: SLS-2024-001', 14, 30);
    doc.text('Butik Cantik Jaya', 150, 18, { align: 'right' });
    doc.text('Jl. Melati No. 10, Jakarta', 150, 23, { align: 'right' });
    doc.text('Telp: 021-12345678', 150, 28, { align: 'right' });
    doc.text('www.butikcantikjaya.com', 150, 33, { align: 'right' });

    autoTable(doc, {
      startY: 38,
      head: [[
        'No', 'Product', 'Quantity', 'Unit Price', 'Discount', 'Total'
      ]],
      body: data.map(row => [
        row.no,
        row.product,
        row.qty,
        `Rp ${row.price.toLocaleString()}`,
        `Rp ${row.discount.toLocaleString()}`,
        `Rp ${row.total.toLocaleString()}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { font: 'helvetica', fontSize: 10 },
      foot: [[
        '', '', '', '', 'Grand Total', `Rp ${sumTotal.toLocaleString()}`
      ]],
      footStyles: { fillColor: [232, 240, 254], textColor: [0,0,0], fontStyle: 'bold' },
    });

    doc.save('laporan-penjualan.pdf');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-indigo-700">Laporan Penjualan</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            + Tambah Data
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-4 flex-col sm:flex-row">
          <span className="text-gray-500 text-sm">Grand Total: </span>
          <span className="text-lg font-bold text-indigo-700">Rp {sumTotal.toLocaleString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-indigo-600 text-white text-left text-sm font-semibold">
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
              {data.map((item, idx) => (
                <tr key={item.no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">{item.no}</td>
                  <td className="px-6 py-4">{item.product}</td>
                  <td className="px-6 py-4">{item.qty}</td>
                  <td className="px-6 py-4">Rp {item.price.toLocaleString()}</td>
                  <td className="px-6 py-4">Rp {item.discount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-indigo-700">Rp {item.total.toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(idx)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(idx)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right font-semibold">Grand Total</td>
                <td className="px-6 py-4 font-bold text-indigo-700">Rp {sumTotal.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit Data' : 'Tambah Data'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input type="text" name="product" value={form.product} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input type="number" name="qty" value={form.qty} onChange={handleChange} className="w-full border rounded px-3 py-2" required min="1" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required min="0" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium mb-1">Discount</label>
                  <input type="number" name="discount" value={form.discount} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total</label>
                <input type="number" name="total" value={form.total} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">{editIndex !== null ? 'Update' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative text-center">
            <button onClick={cancelDelete} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div className="mb-4">
              <svg className="mx-auto mb-2" width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fee2e2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></svg>
              <h3 className="text-lg font-bold text-red-600 mb-2">Hapus Data?</h3>
              <p className="text-gray-600">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 