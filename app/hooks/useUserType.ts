'use client';

import { useState, useEffect } from 'react';
import { useTonAuth } from './useTonAuth';
import { ClientService, ServiceProviderService } from '../lib/database/service';
import type { Client, ServiceProvider } from '../types/database';

export type UserType = 'client' | 'provider' | 'new' | 'unknown';

export interface UserTypeData {
  type: UserType;
  userData: Client | ServiceProvider | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserType = (): UserTypeData => {
  const { isConnected, address } = useTonAuth();
  const [userType, setUserType] = useState<UserType>('unknown');
  const [userData, setUserData] = useState<Client | ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log do address recebido
  console.log('🔍 useUserType - Estado atual:', {
    isConnected,
    address,
    addressType: typeof address,
    shouldFetch: isConnected && address
  });

  useEffect(() => {
    const determineUserType = async () => {
      // Se não está conectado, não fazer nada - deixar como 'unknown'
      if (!isConnected || !address) {
        setUserType('unknown');
        setUserData(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      // Só iniciar o processo se a wallet estiver conectada
      setIsLoading(true);
      setError(null);

      try {
        // Buscar dados do cliente e profissional simultaneamente
        const [clientResult, providerResult] = await Promise.allSettled([
          ClientService.findByWalletAddress(address),
          ServiceProviderService.findByWalletAddress(address)
        ]);

        // Extrair dados dos resultados
        const client = clientResult.status === 'fulfilled' ? clientResult.value : null;
        const provider = providerResult.status === 'fulfilled' ? providerResult.value : null;

        // Verificar se houve erros em ambas as consultas
        if (clientResult.status === 'rejected' && providerResult.status === 'rejected') {
          setError('Erro ao verificar tipo de usuário');
          setUserType('unknown');
          setUserData(null);
          return;
        }

        // Determinar tipo baseado nos dados encontrados
        console.log('🔍 Determinando tipo de usuário:', {
          address,
          client,
          provider
        });

        if (client) {
          console.log('✅ Usuário identificado como CLIENTE:', client);
          console.log('✅ Usuário identificado como PROFISSIONAL:', provider);
          setUserType('client');
          setUserData(client);
        } else if (provider) {
          console.log('✅ Usuário identificado como PROFISSIONAL:', provider);
          setUserType('provider');
          setUserData(provider);
        } else {
          console.log('🆕 Usuário NOVO - não encontrado nas tabelas', {
            address,
            client,
            provider
          });
          // Usuário novo - wallet conectada mas não está em nenhuma tabela
          setUserType('new');
          setUserData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao determinar tipo de usuário');
        setUserType('unknown');
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    determineUserType();
  }, [isConnected, address]);

  return {
    type: userType,
    userData,
    isLoading,
    error
  };
}; 