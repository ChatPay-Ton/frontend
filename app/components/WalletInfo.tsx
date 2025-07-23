'use client';

import React from 'react';
import { useTonAuth } from '../hooks/useTonAuth';
import { useTonBalance } from '../hooks/useTonBalance';

interface WalletInfoProps {
  className?: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ className = '' }) => {
  const { isConnected, address, wallet } = useTonAuth();
  const balance = useTonBalance(address);

  if (!isConnected || !address) {
    return null;
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className={` flex flex-col items-start justify-start bg-white/90 backdrop-blur-sm rounded-lg p-3 ${className}`}>
      <div className="flex items-start justify-start space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">Conectado</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-600 font-mono">{shortAddress}</p>
        </div>
      </div>

      {wallet && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Carteira: {wallet.device.appName}</p>
          <p>Saldo: {balance?.toFixed(2)} TON</p>
        </div>
      )}
    </div>
  );
};

export default WalletInfo; 