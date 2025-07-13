import { Link } from 'react-router-dom';

const Pelanggan = () => {
  const data = [
    { id: 1, nama: 'Siti Nurhaliza', email: 'siti@mail.com' },
    { id: 2, nama: 'Agus Salim', email: 'agus@mail.com' },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Daftar Pelanggan</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{item.nama}</h3>
                <p className="text-gray-600 text-sm">{item.email}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">ID: {item.id}</span>
            </div>
            <div className="mt-3">
              <Link
                to={`/pelanggan/${item.id}`}
                className="text-blue-500 hover:underline text-sm font-medium"
              >
                Lihat Detail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pelanggan;
