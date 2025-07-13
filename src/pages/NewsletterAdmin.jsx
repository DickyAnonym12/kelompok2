import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/subscriber");
      setSubscribers(res.data);
    } catch (err) {
      setNotif("Gagal mengambil data subscriber");
    }
    setLoading(false);
  };

  const handleStatusChange = async (email, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/subscriber/${email}`, { status });
      setSubscribers((subs) =>
        subs.map((s) => (s.email === email ? { ...s, status } : s))
      );
    } catch (err) {
      setNotif("Gagal update status");
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Newsletter</h2>
          <div className="text-sm text-gray-500">Home / Newsletter</div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
          onClick={() => navigate("/admin/newsletter-campaigns")}
        >
          Campaigns
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">No subscribers found.</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.email} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{sub.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`status-${sub.email}`}
                            checked={sub.status !== "unsubscribed"}
                            onChange={() => handleStatusChange(sub.email, "active")}
                            className="text-blue-600"
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`status-${sub.email}`}
                            checked={sub.status === "unsubscribed"}
                            onChange={() => handleStatusChange(sub.email, "unsubscribed")}
                            className="text-blue-600"
                          />
                          <span className="text-sm">Unsubscribe</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 text-sm">Loading...</span>
              </div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No subscribers found.</div>
          ) : (
            subscribers.map((sub) => (
              <div key={sub.email} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{sub.email}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`status-${sub.email}`}
                        checked={sub.status !== "unsubscribed"}
                        onChange={() => handleStatusChange(sub.email, "active")}
                        className="text-blue-600"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`status-${sub.email}`}
                        checked={sub.status === "unsubscribed"}
                        onChange={() => handleStatusChange(sub.email, "unsubscribed")}
                        className="text-blue-600"
                      />
                      <span className="text-sm">Unsubscribe</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="text-center text-gray-400 mt-8 text-sm">
        © Copyright. All Rights Reserved
      </div>
      {notif && <div className="mt-4 text-red-600 text-center text-sm">{notif}</div>}
    </div>
  );
} 