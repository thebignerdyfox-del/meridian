'use client';

import Sparkline from './Sparkline';

export type Quote = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  history: number[];
};

export default function StockCard({
  quote,
  onBuy,
}: {
  quote: Quote;
  onBuy: (symbol: string) => void;
}) {
  const positive = quote.changePct >= 0;

  return (
    <div className="rise-in bg-surface border border-border/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-emerald/40 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-sm text-muted">{quote.symbol}</div>
          <div className="font-display text-lg text-ink">{quote.name}</div>
        </div>
        <Sparkline points={quote.history} positive={positive} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-2xl text-ink">${quote.price.toFixed(2)}</div>
          <div className={`font-mono text-sm ${positive ? 'text-emerald' : 'text-rose'}`}>
            {positive ? '+' : ''}
            {quote.changePct.toFixed(2)}%
          </div>
        </div>
        <button
          onClick={() => onBuy(quote.symbol)}
          className="bg-emerald text-deep font-medium text-sm rounded-full px-5 py-2 hover:bg-emerald-dim transition-colors"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
