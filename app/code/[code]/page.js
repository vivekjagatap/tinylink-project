// app/code/[code]/page.js
import Header from '../../components/Header';

export default async function StatsPage({ params }) {
  const code = params.code;
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/links/${code}`);
  if (!res.ok) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-4">
          <h2 className="text-xl">Not found</h2>
        </main>
      </>
    );
  }
  const link = await res.json();
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Stats for {link.code}</h1>
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Target</strong>: <a href={link.target} className="underline">{link.target}</a></p>
          <p><strong>Clicks</strong>: {link.clicks}</p>
          <p><strong>Created</strong>: {new Date(link.created_at).toLocaleString()}</p>
          <p><strong>Last clicked</strong>: {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : '-'}</p>
        </div>
      </main>
    </>
  );
}
