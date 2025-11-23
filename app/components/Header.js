// app/components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">TinyLink</Link>
        <nav>
          <a href="/healthz" className="text-sm mr-4">Health</a>
        </nav>
      </div>
    </header>
  );
}
