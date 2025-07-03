import React from 'react';
import CustomerServiceAdmin from '../components/CustomerServiceAdmin';

const LiveChatAdmin = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Customer Service Admin</h1>
      <CustomerServiceAdmin />
    </div>
  );
};

export default LiveChatAdmin; 