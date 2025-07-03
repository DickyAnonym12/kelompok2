import React from 'react';
import CustomerService from '../components/CustomerService';

const CustomerServiceUser = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Customer Service</h1>
      <CustomerService />
    </div>
  );
};

export default CustomerServiceUser; 