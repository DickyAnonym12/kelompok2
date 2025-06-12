import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export function AddCampaignForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");
  const navigate = useNavigate();

  // Setup Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[140px] text-base px-3 py-2',
        placeholder: 'Write your campaign content here...'
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) editor.commands.setContent(content);
  }, [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotif("");
    try {
      await axios.post("http://localhost:5000/api/newsletter", { title, content });
      setNotif("Campaign added!");
      if (onSuccess) onSuccess();
      setTimeout(() => navigate("/newsletter-campaigns"), 800);
    } catch (err) {
      setNotif("Failed to add campaign");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-1">Add Campaign</h1>
      <div className="text-base text-gray-500 mb-8">Dashboard / Newsletter / Campaigns / Add</div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-base"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Campaign title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Content</label>
          {editor && (
            <div className="flex gap-1 mb-2">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-base font-bold ${editor.isActive('bold') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-base italic ${editor.isActive('italic') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded text-base underline ${editor.isActive('underline') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>U</button>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-base ${editor.isActive('bulletList') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>• List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded text-base ${editor.isActive('orderedList') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>1. List</button>
              <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`px-2 py-1 rounded text-base ${editor.isActive('paragraph') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>P</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded text-base ${editor.isActive('heading', { level: 1 }) ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>H1</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded text-base ${editor.isActive('heading', { level: 2 }) ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>H2</button>
            </div>
          )}
          <EditorContent
            editor={editor}
            className="min-h-[140px] bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-base shadow hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {notif && <div className="text-green-600 mt-2">{notif}</div>}
      </form>
    </div>
  );
}

export default function NewsletterCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const [c, s] = await Promise.all([
      axios.get("http://localhost:5000/api/newsletter"),
      axios.get("http://localhost:5000/api/subscriber"),
    ]);
    setCampaigns(c.data);
    setSubscribers(s.data);
  };

  // Start campaign
  const handleStart = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedEmails([]);
    setShowModal(true);
  };

  const handleSend = async () => {
    setLoading(true);
    setNotif("");
    try {
      await axios.post(
        `http://localhost:5000/api/newsletter/${selectedCampaign.id}/send`,
        { emails: selectedEmails }
      );
      setNotif("Campaign sent successfully!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      setNotif("Failed to send campaign.");
    }
    setLoading(false);
  };

  // Delete campaign
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    await axios.delete(`http://localhost:5000/api/newsletter/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <div className="text-sm text-gray-500">Dashboard / Newsletter / Campaigns</div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/newsletter-admin")}
        >
          Back to Subscribers
        </button>
      </div>
      {notif && <div className="mb-4 text-green-600">{notif}</div>}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 overflow-x-auto">
        <div className="mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/newsletter-campaigns/add")}
          >
            Add campaign
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created at</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2">
                  <div className="truncate max-w-xs">{c.content}</div>
                </td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    onClick={() => handleStart(c)}
                    disabled={c.status === "running" || c.status === "completed"}
                  >
                    Start
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/newsletter-campaigns/${c.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal pilih subscriber */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Select Subscribers</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="space-y-4"
            >
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {subscribers.map((s) => (
                  <label key={s.email} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      value={s.email}
                      checked={selectedEmails.includes(s.email)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmails([...selectedEmails, s.email]);
                        } else {
                          setSelectedEmails(selectedEmails.filter((em) => em !== s.email));
                        }
                      }}
                    />
                    {s.email}
                  </label>
                ))}
                {subscribers.length === 0 && (
                  <div className="text-gray-400">No subscribers found.</div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  disabled={loading || selectedEmails.length === 0}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="text-center text-gray-400 mt-8">
        © Copyright. All Rights Reserved
      </div>
    </div>
  );
} 