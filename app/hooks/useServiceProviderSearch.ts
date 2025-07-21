'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceProviderService } from '../lib/database/service';
import { ServiceProvider, SearchFilters, filterServiceProviders } from '../types/database';

export const useServiceProviderSearch = (filters: SearchFilters) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);

  // Função para buscar todos os prestadores uma única vez
  const fetchAllProviders = useCallback(async () => {
    try {
      const result = await ServiceProviderService.findAll();
      console.log('🔍 Todos os prestadores carregados:', result.length);
      setAllProviders(result);
      return result;
    } catch (err) {
      console.error('❌ Erro ao buscar prestadores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar prestadores');
      setAllProviders([]);
      return [];
    }
  }, []);

  // Função para buscar prestadores com filtros aplicados
  const searchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let providers: ServiceProvider[] = [];

      // Se há filtro de categoria, usar busca específica no banco
      if (filters.category && filters.category !== '') {
        console.log('🔍 Buscando por categoria:', filters.category);
        providers = await ServiceProviderService.findByCategory(filters.category);
      } else {
        // Se não há filtro de categoria, usar todos os prestadores
        providers = allProviders.length > 0 ? allProviders : await fetchAllProviders();
      }

      // Aplicar filtros restantes no frontend
      const filteredProviders = filterServiceProviders(providers, filters);

      console.log('🔍 Resultados da busca:', {
        total: providers.length,
        filtered: filteredProviders.length,
        filters: filters
      });

      setProviders(filteredProviders);
    } catch (err) {
      console.error('❌ Erro na busca:', err);
      setError(err instanceof Error ? err.message : 'Erro na busca');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [filters, allProviders, fetchAllProviders]);

  // Carregar prestadores inicialmente
  useEffect(() => {
    if (allProviders.length === 0) {
      fetchAllProviders().then(() => {
        setLoading(false);
      });
    }
  }, [fetchAllProviders, allProviders.length]);

  // Reexecutar busca quando filtros mudarem
  useEffect(() => {
    if (allProviders.length > 0) {
      searchProviders();
    }
  }, [searchProviders, allProviders.length]);

  const refetch = useCallback(() => {
    fetchAllProviders().then(() => {
      searchProviders();
    });
  }, [fetchAllProviders, searchProviders]);

  return {
    providers,
    loading,
    error,
    refetch
  };
}; 