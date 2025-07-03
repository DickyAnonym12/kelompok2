import React, { useState } from 'react';
import { useFaq } from '../context/FaqContext';

const emptyForm = { question: '', answer: '' };

export default function FaqAdmin() {
  const { faq, addFaq, updateFaq, deleteFaq } = useFaq();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentItem, setCurrentItem] = useState(null);

  const openAddModal = () => {
    setForm(emptyForm);
    setCurrentItem(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setForm({ question: item.question, answer: item.answer });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setCurrentItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question || !form.answer) return;
    if (currentItem) {
      updateFaq(currentItem.id, form);
    } else {
      addFaq(form);
    }
    closeModal();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteFaq(itemToDelete.id);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-black">Kelola FAQ</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow w-full sm:w-auto"
          >
            + Tambah FAQ
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 text-white text-left text-sm font-semibold">
                <th className="px-6 py-4 rounded-l-xl">Pertanyaan</th>
                <th className="px-6 py-4">Jawaban</th>
                <th className="px-6 py-4 rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100 text-sm text-gray-800">
              {faq.map((item) => (
                <tr key={item.id} className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
                  <td className="px-6 py-4 font-medium text-gray-700 w-1/3">{item.question}</td>
                  <td className="px-6 py-4 w-1/2">{item.answer}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(item)} className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(item)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Hapus</button>
                  </td>
                </tr>
              ))}
              {faq.length === 0 && (
                <tr><td colSpan={3} className="text-center py-6 text-gray-400">Belum ada FAQ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit FAQ */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">{currentItem ? 'Edit FAQ' : 'Tambah FAQ'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pertanyaan</label>
                <input type="text" name="question" value={form.question} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jawaban</label>
                <textarea name="answer" value={form.answer} onChange={handleChange} className="w-full border rounded px-3 py-2" required rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">{currentItem ? 'Update' : 'Tambah'}</button>
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
              <h3 className="text-lg font-bold text-red-600 mb-2">Hapus FAQ?</h3>
              <p className="text-gray-600">FAQ yang dihapus tidak dapat dikembalikan.</p>
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