'use client';

import React, { useState } from 'react';
import { ServiceProvider } from '../../types/database';
import { useTon } from '../../hooks/useTon';
import { isValidTonAddress } from '../../lib/ton-simple';
import { ServiceContractService } from '../../lib/database/service';
import { CreateServiceContract } from '../../types/database';
import { toNano } from '@ton/core';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onViewProfile: (provider: ServiceProvider) => void;
  onContract?: (provider: ServiceProvider) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onViewProfile,
  onContract
}) => {
  const {
    createEscrow,
    isLoading: hookLoading,
    isConnected,
    userAddress
  } = useTon();

  // Estados locais para controle da contratação
  const [isContracting, setIsContracting] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [contractSuccess, setContractSuccess] = useState(false);

  const formatExperience = (experience: string) => {
    const experienceMap: { [key: string]: string } = {
      'menos-1': 'Menos de 1 ano',
      '1-3': '1 a 3 anos',
      '3-5': '3 a 5 anos',
      '5-10': '5 a 10 anos',
      'mais-10': 'Mais de 10 anos'
    };
    return experienceMap[experience] || experience;
  };

  const formatAvailability = (availability: string) => {
    const days = availability.split(',').length > 0 ? availability.split(',') : availability;
    return `${days.length} dia${days.length > 1 ? 's' : ''} disponível${days.length > 1 ? 'is' : ''}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {/* Estrelas preenchidas */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* Meia estrela */}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}

        {/* Estrelas vazias */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  /**
   * Função principal para contratar o prestador
   */
  const handleContractProvider = async () => {
    // Limpar estados anteriores
    setContractError(null);
    setContractSuccess(false);

    // Verificar se carteira está conectada
    if (!isConnected || !userAddress) {
      setContractError('Por favor, conecte sua carteira TON primeiro');
      return;
    }

    console.log('wallet address', provider.wallet_address);

    // Verificar se prestador tem wallet_address
    if (!provider.wallet_address) {
      setContractError('Prestador não possui endereço de carteira configurado');
      return;
    }

    // Validar endereço do prestador usando @ton/core
    if (!isValidTonAddress(provider.wallet_address)) {
      setContractError('Endereço da carteira do prestador é inválido');
      return;
    }

    // Verificar se não está tentando contratar a si mesmo
    if (provider.wallet_address === userAddress) {
      setContractError('Você não pode contratar a si mesmo');
      return;
    }

    try {
      setIsContracting(true);
      console.log('🎯 Iniciando contratação:', {
        client: userAddress,
        provider: provider.wallet_address,
        amount: provider.hourly_rate + ' TON',
        factory: 'kQCQkWNWU91_i2W3zwxheZn5ya_gg1Nv7J5lZeVxCOtLNs8V'
      });

      // 1. Criar contrato de escrow na blockchain TON
      const escrowResult = await createEscrow({
        providerAddress: provider.wallet_address,
        escrowAmountTon: toNano(provider.hourly_rate).toString()
      });

      if (!escrowResult.success) {
        throw new Error(escrowResult.error || 'Falha ao criar escrow');
      }

      console.log('✅ Escrow criado na blockchain:', escrowResult);

      // 2. Preparar dados para salvar no banco
      // Usar hash da transação como ID (será substituído pelo endereço real do contrato quando disponível)
      const contractData: CreateServiceContract = {
        id: `escrow_${escrowResult.transactionHash}`, // Usar hash da transação
        client_id: userAddress,
        provider_id: provider.id,
        total_amount: provider.hourly_rate,
        transaction_hash: escrowResult.transactionHash
      };

      // 3. Salvar contrato no banco Turso
      try {
        const savedContract = await ServiceContractService.create(contractData);
        console.log('✅ Contrato salvo no banco:', savedContract);
      } catch (dbError) {
        console.warn('⚠️ Aviso: Erro ao salvar no banco, mas escrow foi criado:', dbError);
      }

      setContractSuccess(true);
      if (onContract) {
        onContract(provider);
      }

      console.log('🎉 Contratação concluída com sucesso!');
      console.log('📋 Detalhes:', {
        escrowAddress: contractData.id,
        transactionHash: escrowResult.transactionHash,
        amountTon: provider.hourly_rate,
        factoryAddress: 'kQCQkWNWU91_i2W3zwxheZn5ya_gg1Nv7J5lZeVxCOtLNs8V'
      });

    } catch (error) {
      console.error('❌ Erro na contratação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao contratar prestador';
      setContractError(errorMessage);
    } finally {
      setIsContracting(false);
    }
  };

  /**
   * Limpar mensagem de erro
   */
  const clearError = () => {
    setContractError(null);
  };

  // Estado de loading geral
  const isLoading = isContracting || hookLoading;

  return (
    <div className="provider-card bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      {/* Header com nome e verificação */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-navy">{provider.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{provider.category}</p>
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {provider.city}, {provider.state}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <div className="text-2xl font-bold text-navy">
              {provider.hourly_rate.toFixed(2)} TON
            </div>
          </div>
          <div className="text-sm text-gray-500">por hora</div>
        </div>
      </div>

      {/* Avaliações */}
      {provider.rating ? (
        <div className="flex items-center space-x-2 mb-4">
          {renderStars(provider.rating || 0)}
          <span className="text-sm font-medium text-gray-900">
            {provider.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-sm text-gray-500">
            ({provider.completedJobs || 0} trabalhos)
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 mb-2">
        </div>
      )}

      {/* Descrição */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {provider.description}
      </p>

      {/* Informações adicionais */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Experiência:</span>
          <div className="font-medium text-gray-900">
            {formatExperience(provider.experience)}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Disponibilidade:</span>
          <div className="font-medium text-gray-900">
            {formatAvailability(provider.days_of_week || '')}
          </div>
        </div>
      </div>

      {/* Mensagens de status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Conecte sua carteira TON para contratar este prestador
          </p>
        </div>
      )}

      {contractSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✅ Contrato criado com sucesso!
          </p>
        </div>
      )}

      {contractError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{contractError}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex space-x-3">
        <button
          onClick={() => onViewProfile(provider)}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Ver Perfil
        </button>

        <button
          onClick={handleContractProvider}
          disabled={isLoading || contractSuccess || !isConnected}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${contractSuccess
            ? 'bg-green-500 text-white cursor-default'
            : isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : !isConnected
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
        >
          {contractSuccess ? (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Contratado
            </span>
          ) : isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando escrow...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Contratar
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderCard; 