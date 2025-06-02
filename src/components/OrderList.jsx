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
    <div className="px-4">
      <PageHeader title="Order List" breadcrumb={["Orders", "Order List"]}>
        <button onClick={() => window.location.href = "/orderform"}className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2">Add Order</button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mr-2">Export</button>
        <button onClick={() => window.location.href = "/"} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Kembali</button>
      </PageHeader>

      <div className="max-w-5xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.orderDate}</td>
                  <td className={`px-4 py-2 ${statusColors[order.status] || 'text-gray-700'}`}>
                    {order.status}
                  </td>
                  <td className="px-4 py-2">{formatCurrency(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-white ${
              currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-white ${
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
