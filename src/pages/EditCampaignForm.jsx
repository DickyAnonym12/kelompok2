import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const c = await axios.get(`http://localhost:5000/api/newsletter/${id}`);
    const s = await axios.get("http://localhost:5000/api/subscriber");
    setCampaign(c.data);
    setStatus(c.data.status || "created");
    setSelectedUsers(c.data.users || []);
    setSubscribers(s.data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotif("");
    try {
      await axios.put(`http://localhost:5000/api/newsletter/${id}`, {
        status,
        users: selectedUsers,
      });
      setNotif("Campaign updated!");
      navigate("/newsletter-campaigns");
    } catch (err) {
      setNotif("Failed to update campaign");
    }
    setLoading(false);
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Campaign</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="created">Created</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2">Select users</label>
          <div className="bg-gray-50 border rounded p-2 max-h-48 overflow-y-auto">
            {subscribers.map((s) => (
              <label key={s.email} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  value={s.email}
                  checked={selectedUsers.includes(s.email)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, s.email]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(em => em !== s.email));
                    }
                  }}
                />
                {s.email}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold text-base shadow hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
        {notif && <div className="text-green-600 mt-2">{notif}</div>}
      </form>
    </div>
  );
} 