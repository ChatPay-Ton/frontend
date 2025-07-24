import { useEffect, useState } from 'react';
import { TonClient, Address } from '@ton/ton';

export function useTonBalance(address: string | null) {
  const [balance, setBalance] = useState<number | null>(null);

  const mainnet = 'https://toncenter.com/api/v2/jsonRPC';
  // const testnet = 'https://testnet.toncenter.com/api/v2/jsonRPC';

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
    const client = new TonClient({ endpoint: mainnet });
    client.getBalance(Address.parse(address))
      .then(bal => setBalance(Number(bal) / 1e9))
      .catch(() => setBalance(null));
  }, [address]);

  return balance;
}