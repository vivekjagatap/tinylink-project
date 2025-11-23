// app/page.js
'use client';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import AddLinkForm from './components/AddLinkForm';
import LinkRow from './components/LinkRow';

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = links.filter(l =>
    l.code.toLowerCase().includes(q.toLowerCase()) ||
    l.target.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="mb-4">
          <AddLinkForm onAdded={load} />
        </div>

        <div className="mb-4 flex items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by code or URL" className="border p-2 rounded w-full" />
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4">No links yet.</div>
          ) : (
            <table className="w-full">
              <thead className="text-left bg-gray-50">
                <tr>
                  <th className="p-2">Code</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Clicks</th>
                  <th className="p-2">Last clicked</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(link => (
                  <LinkRow key={link.code} link={link} onDeleted={load} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
