import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import PageHeader from "../components/PageHeader";
import { BsFillExclamationDiamondFill } from "react-icons/bs";

const emptyForm = {
  name_product: "",
  price_product: "",
  stock_product: 0,
  size_product: "",
  color_product: "",
  image_product: "",
  image_file: null,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const breadcrumb = ["Products", "Product Management"];

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("product").select("*").order('name_product', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({ ...product, image_file: null });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_file") {
      setForm({ ...form, image_file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name_product || !form.price_product) return;

    let imageUrl = editingProduct ? editingProduct.image_product : '';

    if (form.image_file) {
      const file = form.image_file;
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
      const fileName = `${Date.now()}-${cleanFileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        setError('Gagal mengupload gambar: ' + uploadError.message);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }

    const productData = {
      name_product: form.name_product,
      price_product: form.price_product,
      stock_product: form.stock_product,
      size_product: form.size_product,
      color_product: form.color_product,
      image_product: imageUrl,
    };
    
    if (editingProduct) {
      const { error } = await supabase.from("product").update(productData).eq("id", editingProduct.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from("product").insert([productData]);
      if (error) setError(error.message);
    }
    
    closeModal();
    fetchProducts();
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      const { error } = await supabase.from("product").delete().eq("id", productToDelete.id);
      if (error) setError(error.message);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Product Management" breadcrumb={breadcrumb} />

      {error && (
        <div className="bg-red-100 p-4 text-red-700 rounded-lg flex items-center">
          <BsFillExclamationDiamondFill className="mr-2" /> {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-indigo-600 text-white text-left text-sm font-semibold">
                <th className="px-6 py-4 rounded-l-xl">Gambar</th>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Ukuran</th>
                <th className="px-6 py-4">Warna</th>
                <th className="px-6 py-4 rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.image_product ? 
                      <img src={product.image_product} alt={product.name_product} className="h-12 w-12 object-cover rounded-md" /> : 
                      <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
                    }
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name_product}</td>
                  <td className="px-6 py-4">Rp {Number(product.price_product).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{product.stock_product}</td>
                  <td className="px-6 py-4">{product.size_product}</td>
                  <td className="px-6 py-4">{product.color_product}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(product)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => openDeleteModal(product)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Hapus</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr><td colSpan="7" className="text-center py-6 text-gray-400">Belum ada produk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name_product" value={form.name_product} onChange={handleChange} placeholder="Nama Produk" className="w-full border rounded px-3 py-2" required />
              <input type="number" name="price_product" value={form.price_product} onChange={handleChange} placeholder="Harga" className="w-full border rounded px-3 py-2" required />
              <input type="number" name="stock_product" value={form.stock_product} onChange={handleChange} placeholder="Stok" className="w-full border rounded px-3 py-2" required />
              <input type="text" name="size_product" value={form.size_product} onChange={handleChange} placeholder="Ukuran (e.g., S, M, L)" className="w-full border rounded px-3 py-2" />
              <input type="text" name="color_product" value={form.color_product} onChange={handleChange} placeholder="Warna" className="w-full border rounded px-3 py-2" />
              <div>
                <label className="block text-sm font-medium mb-1">Gambar Produk</label>
                <input type="file" name="image_file" onChange={handleChange} className="w-full border rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" accept="image/*" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">{editingProduct ? 'Update' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative text-center">
            <h3 className="text-lg font-bold text-red-600 mb-4">Hapus Produk?</h3>
            <p className="text-gray-600 mb-6">Anda yakin ingin menghapus produk "{productToDelete?.name_product}"?</p>
            <div className="flex justify-center gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
