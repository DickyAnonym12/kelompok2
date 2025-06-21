import { useState, useEffect } from 'react';

function UserForm({ addUser, updateUser, editingUser }) {
  const [user, setUser] = useState({ name: '', email: '', role: 'user', password: '' });

  useEffect(() => {
    if (editingUser) {
      setUser({ ...editingUser, password: '' });
    } else {
      setUser({ name: '', email: '', role: 'user', password: '' });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(user);
    } else {
      addUser(user);
    }
    setUser({ name: '', email: '', role: 'user', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password (wajib untuk user baru)"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required={!editingUser}
        />
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        {editingUser ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
}

export default UserForm; 