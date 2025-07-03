import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

const CustomerService = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [prevMsgCount, setPrevMsgCount] = useState(0);

  // Fetch messages & subscribe realtime
  useEffect(() => {
    if (!user?.id) return;

    let channel = null;
    let isMounted = true;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (!error && isMounted) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages for this user only
    channel = supabase
      .channel('realtime:messages-user-' + user.id)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Pesan baru:', payload.new);
          setMessages((msgs) => {
            // Cegah duplikat jika event double
            if (msgs.some((m) => m.id === payload.new.id)) return msgs;
            return [...msgs, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (messages.length > prevMsgCount) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setPrevMsgCount(messages.length);
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!input.trim()) return;

    // Optimistic update: tampilkan pesan langsung
    const newMsg = {
      user_id: user.id,
      sender_role: 'user',
      message: input,
      created_at: new Date().toISOString(),
      id: 'temp-' + Date.now(), // id sementara
    };
    setMessages((msgs) => [...msgs, newMsg]);

    const { data, error } = await supabase.from('messages').insert([
      {
        user_id: user.id,
        sender_role: 'user',
        message: input,
      },
    ]).select().single();

    if (error) {
      setErrorMsg(error.message);
      // Hapus pesan temp jika gagal
      setMessages((msgs) => msgs.filter((msg) => msg.id !== newMsg.id));
      return;
    }

    // Ganti pesan temp dengan pesan dari database (agar id dan timestamp benar)
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === newMsg.id ? data : msg
      )
    );
    setInput('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl flex flex-col h-96 border border-gray-200">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl font-bold">Customer Service</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                Halo! Ada yang bisa kami bantu? Tim customer service kami siap membantu Anda.
                <div className="text-xs text-right mt-1 opacity-60">Customer Service</div>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
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
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="p-2 border-t flex flex-col gap-2">
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
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerService; 