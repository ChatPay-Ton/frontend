'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceProviderService } from '../lib/database/service';
import { ServiceProvider } from '../types/database';

export const useServiceProviders = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ServiceProviderService.findAll();
      console.log('🔍 Profissionais encontrados:', result.length);
      setProviders(result);
    } catch (err) {
      console.error('❌ Erro ao buscar profissionais:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar profissionais');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const refetch = useCallback(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    loading,
    error,
    refetch
  };
};

export const useServiceProvidersByCategory = (category: string) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProvidersByCategory = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ServiceProviderService.findByCategory(category);
      console.log(`🔍 Profissionais encontrados para categoria "${category}":`, result.length);
      setProviders(result);
    } catch (err) {
      console.error('❌ Erro ao buscar profissionais por categoria:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar profissionais');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProvidersByCategory();
  }, [fetchProvidersByCategory]);

  const refetch = useCallback(() => {
    fetchProvidersByCategory();
  }, [fetchProvidersByCategory]);

  return {
    providers,
    loading,
    error,
    refetch
  };
};

export const useServiceProvider = (id: string) => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProvider = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ServiceProviderService.findById(id);
      console.log('🔍 Profissional encontrado:', result);
      setProvider(result);
    } catch (err) {
      console.error('❌ Erro ao buscar profissional:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar profissional');
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const refetch = useCallback(() => {
    fetchProvider();
  }, [fetchProvider]);

  return {
    provider,
    loading,
    error,
    refetch
  };
};

export const useServiceProviderByWallet = (walletAddress: string) => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviderByWallet = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ServiceProviderService.findByWalletAddress(walletAddress);
      console.log('🔍 Profissional encontrado por wallet:', result);
      setProvider(result);
    } catch (err) {
      console.error('❌ Erro ao buscar profissional por wallet:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar profissional');
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchProviderByWallet();
  }, [fetchProviderByWallet]);

  const refetch = useCallback(() => {
    fetchProviderByWallet();
  }, [fetchProviderByWallet]);

  return {
    provider,
    loading,
    error,
    refetch
  };
}; 