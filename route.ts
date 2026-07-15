import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserAlpacaCreds } from '@/lib/getUserCreds';
import { getQuote } from '@/lib/alpaca';

const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'TSLA', 'META', 'JPM'];

const NAMES: Record<string, string> = {
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  NVDA: 'NVIDIA',
  AMZN: 'Amazon',
  GOOGL: 'Alphabet',
  TSLA: 'Tesla',
  META: 'Meta Platforms',
  JPM: 'JPMorgan Chase',
};

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  const creds = await getUserAlpacaCreds(user.id);
  if (!creds) {
    return NextResponse.json({ error: 'Connect a broker account first.' }, { status: 400 });
  }

  const symbolsParam = req.nextUrl.searchParams.get('symbols');
  const symbols = symbolsParam ? symbolsParam.split(',') : DEFAULT_WATCHLIST;

  try {
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const q = await getQuote(creds, symbol);
        return { ...q, name: NAMES[symbol] ?? symbol };
      })
    );
    return NextResponse.json({ quotes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch quotes.' }, { status: 502 });
  }
}
