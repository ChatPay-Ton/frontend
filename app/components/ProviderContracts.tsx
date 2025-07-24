'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useProviderContracts } from '../hooks/useProviderContracts';
import { ContractCard } from './contracts';

const ProviderContracts: React.FC = () => {
  const { setCurrentScreen } = useUser();
  const { contracts, loading, error, refetch, contractsCount } = useProviderContracts();

  const goBackToProviderDashboard = () => {
    setCurrentScreen('provider-dashboard');
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-light-blue">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToProviderDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Meus Contratos</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando contratos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen bg-light-blue">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToProviderDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Meus Contratos</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Erro ao carregar contratos: {error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal
  return (
    <div className="min-h-screen bg-light-blue">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToProviderDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Meus Contratos</h1>
            </div>
            <div className="text-sm text-gray-600">
              {contractsCount} contrato{contractsCount !== 1 ? 's' : ''} encontrado{contractsCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {contractsCount > 0 ? (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} isProvider={true} onContractUpdate={refetch} />
            ))}
          </div>
        ) : (
          // Estado vazio
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center max-w-md">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não recebeu contratos de clientes. Continue divulgando seus serviços.
              </p>
              <button
                onClick={goBackToProviderDashboard}
                className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderContracts; 