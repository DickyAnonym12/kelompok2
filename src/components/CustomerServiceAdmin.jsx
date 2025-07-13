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
    <div className="mx-auto max-w-2xl w-full bg-white shadow-2xl rounded-xl flex flex-col h-[28rem] sm:h-[32rem] border border-gray-200 mt-6 sm:mt-8">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 text-black px-3 sm:px-4 py-2 rounded-t-xl font-bold flex items-center justify-between text-sm sm:text-base">
        <span>Customer Service Admin</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/3 border-r bg-yellow-50 overflow-y-auto">
          <div className="font-semibold text-yellow-700 px-2 sm:px-3 py-2 border-b bg-gradient-to-r from-yellow-100 to-orange-100 text-xs sm:text-sm">User</div>
          {users.length === 0 && <div className="p-2 sm:p-3 text-yellow-400 text-xs sm:text-sm">Belum ada pesan masuk</div>}
          {users.map((u) => (
            <button
              key={u.id}
              className={`w-full text-left px-2 sm:px-3 py-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 text-xs sm:text-sm ${selectedUser?.id === u.id ? 'bg-gradient-to-r from-yellow-300 to-orange-200 font-bold text-yellow-900' : 'text-yellow-800'}`}
              onClick={() => setSelectedUser(u)}
            >
              <div>{u.name || u.email || u.id}</div>
              <div className="text-xs text-yellow-600">{u.email}</div>
            </button>
          ))}
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 bg-gray-50">
            {selectedUser && messages.filter(m => m.user_id === selectedUser.id).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-2 sm:px-3 py-2 rounded-lg max-w-xs text-xs sm:text-sm ${
                    msg.sender_role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.message}
                  <div className="text-xs text-right mt-1 opacity-60">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {!selectedUser && (
              <div className="text-center text-gray-500 text-xs sm:text-sm py-8">
                Pilih user untuk melihat chat
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 sm:p-3 border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
                disabled={!selectedUser}
              />
              <button
                type="submit"
                disabled={!input.trim() || !selectedUser}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceAdmin; 