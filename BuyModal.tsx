'use client';

import { useState } from 'react';

export default function BuyModal({
  symbol,
  price,
  onClose,
  onPlaced,
}: {
  symbol: string;
  price: number;
  onClose: () => void;
  onPlaced: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/alpaca/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, qty, side }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Order failed.');
      return;
    }

    setSuccess(true);
    onPlaced();
  }

  return (
    <div className="fixed inset-0 bg-deep/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm">
        {success ? (
          <>
            <h2 className="font-display text-2xl text-emerald mb-2">Order placed</h2>
            <p className="text-muted text-sm mb-6">
              Your {side} order for {qty} share{qty > 1 ? 's' : ''} of {symbol} was sent to your broker.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-emerald text-deep font-medium rounded-full px-6 py-2.5 hover:bg-emerald-dim transition-colors"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-ink mb-1">{symbol}</h2>
            <p className="font-mono text-muted text-sm mb-6">${price.toFixed(2)} / share</p>

            <div className="flex gap-2 mb-4">
              {(['buy', 'sell'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium capitalize transition-colors ${
                    side === s
                      ? s === 'buy'
                        ? 'bg-emerald text-deep'
                        : 'bg-rose text-deep'
                      : 'bg-surface2 text-muted'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="text-sm text-muted block mb-1.5">Shares</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-ink font-mono outline-none focus:border-emerald mb-4"
            />

            <p className="text-xs text-muted mb-4">
              Estimated total: <span className="font-mono text-ink">${(qty * price).toFixed(2)}</span>
            </p>

            {error && <p className="text-rose text-sm mb-4">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 border border-border text-muted rounded-full py-2.5 hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-emerald text-deep font-medium rounded-full py-2.5 hover:bg-emerald-dim transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing…' : `Confirm ${side}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
