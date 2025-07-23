'use client';

import { useState, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTonAuth } from './useTonAuth';
import { createEscrowSimple, isValidTonAddress } from '../lib/ton-simple';

export interface CreateEscrowParams {
  providerAddress: string;
  escrowAmountTon: string;
}

export interface CreateEscrowResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  data?: unknown;
}

export const useTon = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { isConnected, address: userAddress } = useTonAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEscrow = useCallback(async (params: CreateEscrowParams): Promise<CreateEscrowResult> => {
    // Validações básicas
    if (!isConnected || !userAddress) {
      const errorMsg = 'Carteira não conectada';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!params.providerAddress) {
      const errorMsg = 'Endereço do prestador é obrigatório';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!isValidTonAddress(params.providerAddress)) {
      const errorMsg = 'Endereço do prestador inválido';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!params.escrowAmountTon || parseFloat(params.escrowAmountTon) <= 0) {
      const errorMsg = 'Valor do escrow deve ser maior que zero';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🎯 Iniciando criação de escrow simples...');

      const result = await createEscrowSimple(
        tonConnectUI,
        userAddress,
        params.providerAddress,
        params.escrowAmountTon
      );

      if (result.success) {
        console.log('🎉 Escrow criado com sucesso!');
      } else {
        console.error('❌ Falha ao criar escrow:', result.error);
        setError(result.error || 'Erro desconhecido');
      }

      return result;

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar escrow';
      console.error('❌ Erro no hook:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };

    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI, isConnected, userAddress]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createEscrow,
    isLoading,
    error,
    clearError,
    isConnected,
    userAddress
  };
}; 