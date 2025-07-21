'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

interface TonAuthState {
  isConnected: boolean;
  isLoading: boolean;
  address: string | null;
  wallet: any;
  error: string | null;
}

interface TonAuthActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  checkConnection: () => boolean;
  clearError: () => void;
}

export const useTonAuth = (): TonAuthState & TonAuthActions => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado derivado do wallet
  const isConnected = !!(wallet && wallet.account && wallet.account.address);
  const address = wallet?.account?.address || null;

  // Debug: Log da wallet conectada
  useEffect(() => {
    if (wallet && wallet.account && wallet.account.address) {
      console.log('🔗 Wallet conectada:', {
        address: wallet.account.address,
        wallet: wallet.device,
        isConnected,
        fullWallet: wallet
      });
    }
  }, [wallet, isConnected]);

  // Verificar conexão
  const checkConnection = useCallback(() => {
    return isConnected;
  }, [isConnected]);

  // Conectar carteira
  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar se já está conectado
      if (isConnected) {
        console.log('Carteira já está conectada');
        return;
      }

      // Abrir modal de conexão
      await tonConnectUI.openModal();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conectar carteira';
      setError(errorMessage);
      console.error('Erro ao conectar carteira:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI, isConnected]);

  // Desconectar carteira
  const disconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isConnected) {
        console.log('Carteira já está desconectada');
        return;
      }

      await tonConnectUI.disconnect();

      // Limpar localStorage
      localStorage.removeItem('tonconnect_auth');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desconectar carteira';
      setError(errorMessage);
      console.error('Erro ao desconectar carteira:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI, isConnected]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efeito para monitorar mudanças no wallet
  useEffect(() => {
    if (isConnected) {
      // Salvar estado de autenticação
      localStorage.setItem('tonconnect_auth', 'true');
      localStorage.setItem('tonconnect_address', address!);
    } else {
      // Limpar estado de autenticação
      localStorage.removeItem('tonconnect_auth');
      localStorage.removeItem('tonconnect_address');
    }
  }, [isConnected, address]);

  // Efeito para verificar estado salvo no carregamento inicial
  useEffect(() => {
    const savedAuthState = localStorage.getItem('tonconnect_auth');
    const savedAddress = localStorage.getItem('tonconnect_address');

    if (savedAuthState === 'true' && savedAddress && !isConnected) {
      // Se havia uma sessão salva mas não há wallet conectado, limpar
      localStorage.removeItem('tonconnect_auth');
      localStorage.removeItem('tonconnect_address');
    }
  }, [isConnected]);

  return {
    // Estado
    isConnected,
    isLoading,
    address,
    wallet,
    error,

    // Ações
    connect,
    disconnect,
    checkConnection,
    clearError
  };
}; 