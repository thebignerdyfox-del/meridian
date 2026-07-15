'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <h1 className="font-display text-3xl text-ink mb-3">Check your inbox</h1>
        <p className="text-muted">We sent a confirmation link to {email}. Confirm your email, then sign in.</p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-ink mb-2">Create an account</h1>
      <p className="text-muted text-sm mb-8">Already have one? <Link href="/login" className="text-emerald hover:underline">Sign in</Link></p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-muted block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-ink outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="text-sm text-muted block mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-ink outline-none focus:border-emerald"
          />
        </div>

        {error && <p className="text-rose text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald text-deep font-medium rounded-full px-6 py-2.5 mt-2 hover:bg-emerald-dim transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </main>
  );
}
