import { useParams, Link } from 'react-router-dom';

const DetailPelanggan = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Link to="/pelanggan" className="text-blue-500 hover:underline mb-4 inline-block">← Kembali</Link>
      <h1 className="text-2xl font-semibold mb-4">Detail Pelanggan #{id}</h1>
      <p>Nama: (data dinamis di sini)</p>
      <p>Email: (email dinamis di sini)</p>
    </div>
  );
};

export default DetailPelanggan;
