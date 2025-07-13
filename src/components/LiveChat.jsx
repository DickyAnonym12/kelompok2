import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

const LiveChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Bot responses based on keywords
  const botResponses = {
    'harga': 'Harga produk kami bervariasi mulai dari Rp 50.000 hingga Rp 500.000. Silakan cek halaman produk untuk informasi lengkap.',
    'ongkir': 'Ongkos kirim dihitung berdasarkan lokasi pengiriman. Untuk Jakarta Rp 15.000, luar Jakarta Rp 25.000, dan luar pulau Rp 35.000.',
    'pembayaran': 'Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, DANA, GoPay), dan COD untuk area tertentu.',
    'retur': 'Kebijakan retur berlaku 7 hari setelah barang diterima dengan kondisi barang masih baik dan tag masih lengkap.',
    'stok': 'Untuk informasi stok terkini, silakan cek langsung di halaman produk atau hubungi customer service kami.',
    'ukuran': 'Kami menyediakan ukuran XS, S, M, L, XL, dan XXL. Untuk panduan ukuran, silakan cek tabel size guide di halaman produk.',
    'warna': 'Setiap produk memiliki variasi warna yang berbeda. Silakan cek galeri foto di halaman produk untuk melihat warna yang tersedia.',
    'member': 'Program membership kami memberikan diskon 5-20% berdasarkan tier. Bronze (5%), Silver (10%), Gold (15%), Platinum (20%).',
    'point': 'Setiap pembelian Rp 10.000 mendapatkan 1 point. Point dapat ditukar dengan voucher atau diskon.',
    'promo': 'Kami rutin mengadakan promo setiap bulan. Ikuti media sosial kami untuk informasi promo terbaru.',
    'jam': 'Jam operasional kami Senin-Jumat 09:00-17:00 WIB, Sabtu 09:00-15:00 WIB, Minggu tutup.',
    'alamat': 'Toko kami berlokasi di Jl. Sudirman No. 123, Jakarta Pusat. Buka Senin-Jumat 09:00-17:00 WIB.',
    'kontak': 'Anda dapat menghubungi kami di 021-1234567 atau email info@butik.com. Customer service kami siap membantu 24/7.',
    'order': 'Untuk melakukan pemesanan, silakan pilih produk yang diinginkan, masukkan ke keranjang, dan ikuti proses checkout.',
    'tracking': 'Setelah pembayaran dikonfirmasi, Anda akan menerima nomor resi untuk tracking pengiriman via SMS/email.',
    'gratis': 'Gratis ongkir untuk pembelian minimal Rp 200.000 ke seluruh Indonesia.',
    'diskon': 'Diskon member berlaku untuk semua produk kecuali produk promo. Maksimal diskon 20% untuk member Platinum.',
    'kualitas': 'Kami menjamin kualitas produk 100%. Semua produk original dengan garansi 30 hari.',
    'bahan': 'Kami menggunakan bahan berkualitas tinggi seperti katun premium, linen, dan sutra untuk kenyamanan maksimal.',
    'model': 'Foto model menggunakan ukuran standar M. Untuk referensi ukuran yang lebih akurat, silakan cek tabel size guide.'
  };

  // Default welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          message: 'Halo! Saya adalah bot asisten Butik Fashion. Ada yang bisa saya bantu?\n\nSaya bisa membantu dengan:\n• Informasi harga dan promo\n• Cara pemesanan\n• Status pengiriman\n• Program membership\n• Dan lainnya\n\nSilakan tanyakan apa saja!',
          sender_role: 'bot',
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Check for common greetings
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hi')) {
      return 'Halo! Senang bertemu dengan Anda. Ada yang bisa saya bantu hari ini?';
    }

    // Check for thanks
    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('makasih') || lowerMessage.includes('thanks')) {
      return 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya!';
    }

    // Check for goodbye
    if (lowerMessage.includes('selamat tinggal') || lowerMessage.includes('bye') || lowerMessage.includes('dadah')) {
      return 'Terima kasih sudah berkunjung! Semoga hari Anda menyenangkan. Sampai jumpa! 👋';
    }

    // Default response
    return 'Maaf, saya belum memahami pertanyaan Anda. Silakan coba tanyakan tentang harga, ongkir, pembayaran, retur, stok, ukuran, warna, member, point, promo, jam operasional, alamat, kontak, cara order, tracking, atau informasi lainnya. Atau Anda bisa menghubungi customer service kami untuk bantuan lebih lanjut.';
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      message: userMessage,
      sender_role: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate typing
    setIsTyping(true);
    
    // Get bot response
    const botResponse = getBotResponse(userMessage);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: 'bot-' + Date.now(),
        message: botResponse,
        sender_role: 'bot',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="mx-auto max-w-lg w-full bg-white shadow-xl rounded-xl flex flex-col h-80 sm:h-96 border border-gray-200 mt-6 sm:mt-8">
      <div className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-t-xl font-bold flex items-center text-sm sm:text-base">
        <span className="mr-2">🤖</span>
        Live Chat Bot
      </div>
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
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-2 sm:px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm sm:text-base">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="text-xs text-right mt-1 opacity-60">Bot sedang mengetik...</div>
            </div>
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat; 