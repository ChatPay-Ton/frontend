'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceContract } from '../types/database';
import { ServiceContractService } from '../lib/database/service';
import { useTonAuth } from './useTonAuth';

interface UseProviderContractsReturn {
  contracts: ServiceContract[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  contractsCount: number;
}

export const useProviderContracts = (): UseProviderContractsReturn => {
  const { address: userAddress } = useTonAuth();
  const [contracts, setContracts] = useState<ServiceContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!userAddress) {
      setContracts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('📋 Buscando contratos para provider:', userAddress);

      const providerContracts = await ServiceContractService.findByProviderId(userAddress);

      console.log('✅ Contratos encontrados:', providerContracts.length);
      console.log('📋 Contratos:', providerContracts);

      setContracts(providerContracts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar contratos';
      console.error('❌ Erro ao buscar contratos:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  const refetch = useCallback(async () => {
    await fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch,
    contractsCount: contracts.length
  };
}; 