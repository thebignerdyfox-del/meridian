const PAPER_TRADING_URL = 'https://paper-api.alpaca.markets';
const LIVE_TRADING_URL = 'https://api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';

export type AlpacaCreds = {
  keyId: string;
  secretKey: string;
  paper: boolean;
};

function authHeaders(creds: AlpacaCreds) {
  return {
    'APCA-API-KEY-ID': creds.keyId,
    'APCA-API-SECRET-KEY': creds.secretKey,
    'Content-Type': 'application/json',
  };
}

function tradingBaseUrl(creds: AlpacaCreds) {
  return creds.paper ? PAPER_TRADING_URL : LIVE_TRADING_URL;
}

// Verifies a set of keys actually works before we save them.
export async function verifyCredentials(creds: AlpacaCreds) {
  const res = await fetch(`${tradingBaseUrl(creds)}/v2/account`, {
    headers: authHeaders(creds),
  });
  if (!res.ok) {
    throw new Error(`Alpaca rejected these credentials (status ${res.status})`);
  }
  return res.json();
}

export async function getAccount(creds: AlpacaCreds) {
  const res = await fetch(`${tradingBaseUrl(creds)}/v2/account`, {
    headers: authHeaders(creds),
  });
  if (!res.ok) throw new Error('Failed to fetch account');
  return res.json();
}

export async function getPositions(creds: AlpacaCreds) {
  const res = await fetch(`${tradingBaseUrl(creds)}/v2/positions`, {
    headers: authHeaders(creds),
  });
  if (!res.ok) throw new Error('Failed to fetch positions');
  return res.json();
}

// Latest trade + a short bar history, used to render price + sparkline.
export async function getQuote(creds: AlpacaCreds, symbol: string) {
  const [tradeRes, barsRes] = await Promise.all([
    fetch(`${DATA_URL}/v2/stocks/${symbol}/trades/latest`, { headers: authHeaders(creds) }),
    fetch(
      `${DATA_URL}/v2/stocks/${symbol}/bars?timeframe=1Day&limit=14`,
      { headers: authHeaders(creds) }
    ),
  ]);

  if (!tradeRes.ok || !barsRes.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  const trade = await tradeRes.json();
  const bars = await barsRes.json();

  const closes: number[] = (bars.bars ?? []).map((b: any) => b.c);
  const price = trade.trade?.p ?? closes[closes.length - 1] ?? 0;
  const prevClose = closes.length > 1 ? closes[closes.length - 2] : price;
  const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

  return { symbol, price, changePct, history: closes.length ? closes : [price] };
}

export type OrderRequest = {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: 'market';
  time_in_force: 'day';
};

export async function placeOrder(creds: AlpacaCreds, order: OrderRequest) {
  const res = await fetch(`${tradingBaseUrl(creds)}/v2/orders`, {
    method: 'POST',
    headers: authHeaders(creds),
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Alpaca order failed (${res.status}): ${body}`);
  }
  return res.json();
}
