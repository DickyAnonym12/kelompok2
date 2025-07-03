import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';

const CustomerServiceAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all users who have sent messages
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('user_id', { distinct: true })
        .neq('sender_role', 'admin');
      if (!error && data) {
        // Optionally fetch user details from users table
        const userIds = data.map((d) => d.user_id);
        if (userIds.length > 0) {
          const { data: userDetails } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', userIds);
          setUsers(userDetails || []);
        } else {
          setUsers([]);
        }
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', selectedUser.id)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data);
    };
    fetchMessages();

    // Subscribe to all new messages (no filter user_id)
    const channel = supabase
      .channel('realtime:messages-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (selectedUser && payload.new.user_id === selectedUser.id) {
            setMessages((msgs) => {
              if (msgs.some((m) => m.id === payload.new.id)) return msgs;
              return [...msgs, payload.new];
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!input.trim() || !selectedUser) return;

    // Optimistic update
    const newMsg = {
      user_id: selectedUser.id,
      sender_role: 'admin',
      message: input,
      created_at: new Date().toISOString(),
      id: 'temp-' + Date.now(), // id sementara
    };
    setMessages((msgs) => [...msgs, newMsg]);

    const { error } = await supabase.from('messages').insert([
      {
        user_id: selectedUser.id,
        sender_role: 'admin',
        message: input,
      },
    ]);
    if (error) {
      setErrorMsg(error.message);
      setMessages((msgs) => msgs.filter((msg) => msg.id !== newMsg.id));
      return;
    }
    setInput('');
  };

  return (
    <div className="mx-auto max-w-2xl w-full bg-white shadow-2xl rounded-xl flex flex-col h-[32rem] border border-gray-200 mt-8">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 text-black px-4 py-2 rounded-t-xl font-bold flex items-center justify-between">
        <span>Customer Service Admin</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/3 border-r bg-yellow-50 overflow-y-auto">
          <div className="font-semibold text-yellow-700 px-3 py-2 border-b bg-gradient-to-r from-yellow-100 to-orange-100">User</div>
          {users.length === 0 && <div className="p-3 text-yellow-400 text-sm">Belum ada pesan masuk</div>}
          {users.map((u) => (
            <button
              key={u.id}
              className={`w-full text-left px-3 py-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 ${selectedUser?.id === u.id ? 'bg-gradient-to-r from-yellow-300 to-orange-200 font-bold text-yellow-900' : 'text-yellow-800'}`}
              onClick={() => setSelectedUser(u)}
            >
              <div>{u.name || u.email || u.id}</div>
              <div className="text-xs text-yellow-600">{u.email}</div>
            </button>
          ))}
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-yellow-50">
            {selectedUser ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs transition-all duration-200 ${
                      msg.sender_role === 'admin'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        : 'bg-white text-yellow-900 border border-yellow-100'
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs text-right mt-1 opacity-60">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-yellow-400 text-center mt-10">Pilih user untuk melihat chat</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          {selectedUser && (
            <form onSubmit={sendMessage} className="p-2 border-t flex flex-col gap-2 bg-yellow-50">
              {errorMsg && <div className="text-red-600 text-sm mb-1">{errorMsg}</div>}
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded-lg px-2 py-1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tulis pesan..."
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-200"
                >
                  Kirim
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceAdmin; 