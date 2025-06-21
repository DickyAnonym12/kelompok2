import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import UserForm from '../components/UserForm';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching users:', error);
    else setUsers(data);
  };

  const addUser = async (user) => {
    // Note: Supabase auth users are not added this way. 
    // This adds to a 'users' table, not Supabase's auth.users table.
    // WARNING: Storing plain text passwords is a security risk.
    const { error } = await supabase.from('users').insert(user);
    if (error) console.error('Error adding user:', error);
    else fetchUsers();
  };

  const updateUser = async (user) => {
    // Buat objek update, hanya sertakan password jika diisi
    const updateData = {
      name: user.name,
      role: user.role
    };

    if (user.password) {
      updateData.password = user.password;
    }

    const { error } = await supabase.from('users').update(updateData).eq('id', user.id);
    if (error) console.error('Error updating user:', error);
    else {
      fetchUsers();
      setEditingUser(null);
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error('Error deleting user:', error);
    else fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">User Management</h1>
      
      <UserForm
        addUser={addUser}
        updateUser={updateUser}
        editingUser={editingUser}
        key={editingUser ? editingUser.id : 'add-user'}
      />

      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user.id} className="border p-4 my-2 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email} - <span className="font-medium text-gray-800">{user.role}</span></p>
              </div>
              <div className="space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setEditingUser(user)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserListPage; 