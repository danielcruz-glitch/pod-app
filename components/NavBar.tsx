import Link from 'next/link';

export default function NavBar() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid #ddd',
        marginBottom: '24px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/pod/new">New POD</Link>
      <Link href="/pod/history">POD History</Link>
    </nav>
  );
}