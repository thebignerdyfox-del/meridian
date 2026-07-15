'use client';

type TickerItem = {
  symbol: string;
  changePct: number;
};

const DEFAULT_ITEMS: TickerItem[] = [
  { symbol: 'AAPL', changePct: 1.24 },
  { symbol: 'MSFT', changePct: 0.58 },
  { symbol: 'NVDA', changePct: 2.91 },
  { symbol: 'AMZN', changePct: -0.42 },
  { symbol: 'GOOGL', changePct: 0.87 },
  { symbol: 'TSLA', changePct: -1.63 },
  { symbol: 'META', changePct: 1.05 },
  { symbol: 'BRK.B', changePct: 0.21 },
];

export default function TickerTape({ items = DEFAULT_ITEMS }: { items?: TickerItem[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-border/60 bg-surface/50 overflow-hidden py-2.5">
      <div className="flex ticker-track w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-sm font-mono whitespace-nowrap">
            <span className="text-ink/80">{item.symbol}</span>
            <span className={item.changePct >= 0 ? 'text-emerald' : 'text-rose'}>
              {item.changePct >= 0 ? '▲' : '▼'} {Math.abs(item.changePct).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
