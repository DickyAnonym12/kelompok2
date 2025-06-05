import { Link } from 'react-router-dom';

const Pelanggan = () => {
  const data = [
    { id: 1, nama: 'Siti Nurhaliza', email: 'siti@mail.com' },
    { id: 2, nama: 'Agus Salim', email: 'agus@mail.com' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar Pelanggan</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">
                <Link
                  to={`/pelanggan/${item.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pelanggan;
