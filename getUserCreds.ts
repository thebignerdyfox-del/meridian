import { createServiceClient } from './supabase/server';
import { decrypt } from './encryption';
import type { AlpacaCreds } from './alpaca';

export async function getUserAlpacaCreds(userId: string): Promise<AlpacaCreds | null> {
  const service = createServiceClient();
  const { data, error } = await service
    .from('broker_credentials')
    .select('encrypted_key_id, encrypted_secret_key, paper')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    keyId: decrypt(data.encrypted_key_id),
    secretKey: decrypt(data.encrypted_secret_key),
    paper: data.paper,
  };
}
