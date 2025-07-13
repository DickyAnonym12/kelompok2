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
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl flex flex-col h-80 sm:h-96 border border-gray-200">
        <div className="bg-yellow-400 text-black px-3 sm:px-4 py-2 rounded-t-xl font-bold text-sm sm:text-base">Customer Service</div>
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="px-2 sm:px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-800 text-sm sm:text-base">
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
                className={`px-2 sm:px-3 py-2 rounded-lg max-w-xs text-sm sm:text-base ${
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
        <div className="p-2 sm:p-3 border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerService; 