'use client';

import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { UserProvider } from './contexts/UserContext';
import AppRouter from './components/AppRouter';

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://beige-peaceful-elephant-205.mypinata.cloud/ipfs/bafkreigfhqhpdi3l3ji57txismsaxcdm7wh5b4ov22mpk7rvtkhw7alp64">
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </TonConnectUIProvider>
  );
}
