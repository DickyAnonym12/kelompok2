import React from 'react';
import LiveChat from '../components/LiveChat';

const LiveChatUser = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Live Chat Bot</h1>
      <LiveChat />
    </div>
  );
};

export default LiveChatUser; 