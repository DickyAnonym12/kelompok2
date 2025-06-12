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

  // Untuk update status subscribe/unsubscribe (tambahkan endpoint PATCH/PUT di backend jika belum ada)
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
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Newsletter</h2>
          <div className="text-sm text-gray-500">Home / Newsletter</div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/newsletter-campaigns")}
        >
          Campaigns
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">Loading...</td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">No subscribers found.</td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.email} className="border-b">
                  <td className="py-2">{sub.email}</td>
                  <td className="py-2">
                    <span className="mr-2">Active</span>
                    <input
                      type="radio"
                      checked={sub.status !== "unsubscribed"}
                      onChange={() => handleStatusChange(sub.email, "active")}
                    />
                    <span className="mx-2">Unsubscribe</span>
                    <input
                      type="radio"
                      checked={sub.status === "unsubscribed"}
                      onChange={() => handleStatusChange(sub.email, "unsubscribed")}
                    />
                  </td>
                  <td className="py-2">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="text-center text-gray-400 mt-8">
        © Copyright. All Rights Reserved
      </div>
      {notif && <div className="mt-4 text-red-600 text-center">{notif}</div>}
    </div>
  );
} 