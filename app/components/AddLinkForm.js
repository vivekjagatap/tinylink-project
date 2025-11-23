// app/components/AddLinkForm.js
"use client";
import { useState } from 'react';

export default function AddLinkForm({ onAdded }) {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function validate() {
    try {
      const u = new URL(target);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'Use http or https';
    } catch {
      return 'Invalid URL';
    }
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) return 'Custom code must be 6-8 alphanumeric';
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, code: code || undefined })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to add');
      } else {
        setSuccess('Link created: ' + window.location.origin + '/' + data.code);
        setTarget('');
        setCode('');
        if (onAdded) onAdded();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 shadow rounded">
      <div className="mb-2">
        <label className="block text-sm font-medium">Long URL</label>
        <input
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="https://example.com/path..."
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Custom Code (optional, 6-8 alnum)</label>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="e.g., myCode1"
        />
      </div>
      <div className="flex items-center gap-2">
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {loading ? 'Creating...' : 'Create'}
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </form>
  );
}
