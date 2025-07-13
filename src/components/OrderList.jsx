import React, { useEffect, useState } from 'react';
import ordersData from '../assets/orders.json';
import PageHeader from '../components/PageHeader';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    setOrders(ordersData);
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const statusColors = {
    Completed: 'text-green-600 font-semibold',
    Pending: 'text-yellow-600 font-semibold',
    Cancelled: 'text-red-600 font-semibold'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="px-3 sm:px-4">
      <PageHeader title="Order List" breadcrumb={["Orders", "Order List"]}>
        <button onClick={() => window.location.href = "/orderform"}className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg mr-2 text-sm sm:text-base">Add Order</button>
        <button className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg mr-2 text-sm sm:text-base">Export</button>
        <button onClick={() => window.location.href = "/"} className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">Kembali</button>
      </PageHeader>

      <div className="max-w-6xl mx-auto mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Order ID</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Customer</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Product</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Amount</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Status</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium">{order.id}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{order.customerName}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{order.productName}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{formatCurrency(order.amount)}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                    <span className={statusColors[order.status]}>{order.status}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 sm:mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-md text-white text-sm sm:text-base ${
              currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 rounded-md text-white text-sm sm:text-base ${
              currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
