import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

export function AddCampaignForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: { class: 'outline-none min-h-[140px] text-sm sm:text-base px-3 py-2' },
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => editor.chain().focus().setImage({ src: e.target.result }).run();
    reader.readAsDataURL(file);
    event.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotif("");
    try {
      await axios.post("http://localhost:5000/api/newsletter", { title, content });
      setNotif("Campaign added!");
      if (onSuccess) onSuccess();
      setTimeout(() => navigate("/admin/newsletter-campaigns"), 800);
    } catch (err) {
      setNotif("Failed to add campaign");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8 mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1">Add Campaign</h1>
      <div className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Dashboard / Newsletter / Campaigns / Add</div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-sm sm:text-base">Title</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Campaign title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-sm sm:text-base">Content</label>
          {editor && (
            <div className="flex gap-1 mb-2 flex-wrap">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-xs sm:text-base font-bold ${editor.isActive('bold') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-xs sm:text-base italic ${editor.isActive('italic') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded text-xs sm:text-base underline ${editor.isActive('underline') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>U</button>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-xs sm:text-base ${editor.isActive('bulletList') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>• List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded text-xs sm:text-base ${editor.isActive('orderedList') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>1. List</button>
              <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`px-2 py-1 rounded text-xs sm:text-base ${editor.isActive('paragraph') ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>P</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded text-xs sm:text-base ${editor.isActive('heading', { level: 1 }) ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>H1</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded text-xs sm:text-base ${editor.isActive('heading', { level: 2 }) ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}`}>H2</button>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="px-2 py-1 rounded text-xs sm:text-base text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200"
                title="Insert Image"
              >🖼️</button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt('Masukkan URL gambar (gunakan link https://...)');
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
                className="px-2 py-1 rounded text-xs sm:text-base text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200"
                title="Insert Image by URL"
              >🌐</button>
            </div>
          )}
          <EditorContent
            editor={editor}
            className="min-h-[140px] bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base shadow hover:bg-green-700 transition" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {notif && <div className="text-green-600 mt-2 text-sm sm:text-base">{notif}</div>}
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        axios.get("http://localhost:5000/api/newsletter"),
        axios.get("http://localhost:5000/api/subscriber"),
      ]);
      setCampaigns(c.data);
      setSubscribers(s.data.filter(sub => sub.status !== 'unsubscribed'));
    } catch (error) {
      setNotif("Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setNotif(`Campaign sent successfully!`);
      setShowModal(false);
      fetchData();
    } catch (err) {
      setNotif("Failed to send campaign. Check server logs.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    await axios.delete(`http://localhost:5000/api/newsletter/${id}`);
    fetchData();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Campaigns</h2>
          <div className="text-sm text-gray-500">Dashboard / Newsletter / Campaigns</div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
          onClick={() => navigate("/admin/newsletter-admin")}
        >
          Back to Subscribers
        </button>
      </div>
      {notif && <div className="mb-4 text-green-600 text-sm sm:text-base">{notif}</div>}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="mb-4">
          <button
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
            onClick={() => navigate("/admin/newsletter-campaigns/add")}
          >
            Add campaign
          </button>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Content Preview</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created at</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td></tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-xs" dangerouslySetInnerHTML={{ __html: c.content }} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.status === 'completed' ? 'bg-green-100 text-green-800' :
                        c.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                          onClick={() => handleStart(c)}
                          disabled={c.status === "running" || c.status === "completed"}
                        >
                          Start
                        </button>
                        <button 
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition" 
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {campaigns.length === 0 && !loading && (
                <tr><td colSpan="5" className="text-center py-6 text-gray-400">No campaigns found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600 text-sm">Loading...</span>
              </div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No campaigns found.</div>
          ) : (
            campaigns.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{c.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: c.content }} />
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === 'completed' ? 'bg-green-100 text-green-800' :
                      c.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                        onClick={() => handleStart(c)}
                        disabled={c.status === "running" || c.status === "completed"}
                      >
                        Start
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition" 
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Select Subscribers</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-4">
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {subscribers.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 mb-1 text-sm">
                    <input
                      type="checkbox"
                      value={s.email}
                      checked={selectedEmails.includes(s.email)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedEmails([...selectedEmails, s.email]);
                        else setSelectedEmails(selectedEmails.filter((em) => em !== s.email));
                      }}
                    />
                    {s.email}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm" disabled={loading || selectedEmails.length === 0}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 