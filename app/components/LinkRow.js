// app/components/LinkRow.js
"use client";
import { useState } from 'react';

export default function LinkRow({ link, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this link?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/links/${link.code}`, { method: 'DELETE' });
      if (res.ok) {
        if (onDeleted) onDeleted();
      } else {
        alert('Failed to delete');
      }
    } catch {
      alert('Error deleting');
    } finally {
      setDeleting(false);
    }
  }

  async function copyHref() {
    const url = `${window.location.origin}/${link.code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  return (
    <tr>
      <td className="py-2 px-2">{link.code}</td>
      <td className="py-2 px-2 max-w-sm truncate">{link.target}</td>
      <td className="py-2 px-2">{link.clicks}</td>
      <td className="py-2 px-2">{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : '-'}</td>
      <td className="py-2 px-2 flex gap-2">
        <a href={`/code/${link.code}`} className="underline">Stats</a>
        <button onClick={copyHref} className="px-2 py-1 border rounded">{copied ? 'Copied' : 'Copy'}</button>
        <button onClick={handleDelete} disabled={deleting} className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50">Delete</button>
      </td>
    </tr>
  );
}
