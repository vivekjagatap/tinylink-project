import './globals.css';

export const metadata = {
  title: 'TinyLink',
  description: 'Smart URL Shortener',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
