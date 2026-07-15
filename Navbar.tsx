import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-border/60 bg-deep/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display italic text-xl tracking-tight text-ink">
          Meridian
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/dashboard" className="hover:text-ink transition-colors">
            Markets
          </Link>
          <Link href="/connect-broker" className="hover:text-ink transition-colors">
            Broker
          </Link>
          <Link
            href="/login"
            className="text-ink border border-border rounded-full px-4 py-1.5 hover:border-emerald hover:text-emerald transition-colors"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
