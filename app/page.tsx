'use client';

import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { UserProvider } from './contexts/UserContext';
import AppRouter from './components/AppRouter';

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://beige-peaceful-elephant-205.mypinata.cloud/ipfs/bafkreihz4w56ebhzcnbddrtqcgsexffrrvoouv5kratb3dvbrzazdm52a4">
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </TonConnectUIProvider>
  );
}
