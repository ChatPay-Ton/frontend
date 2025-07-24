'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import WalletInfo from './WalletInfo';
import type { ServiceProvider } from '../types/database';

const ProviderDashboard: React.FC = () => {
  const { userData, logout, setCurrentScreen } = useUser();
  const providerData = userData as ServiceProvider;

  return (
    <div className="min-h-screen bg-light-blue p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy">
                  Olá, {providerData?.name || 'Profissional'}!
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo ao seu painel de profissional
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="mb-6">
          <WalletInfo />
        </div>

        {/* Informações do perfil */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            Seu Perfil
          </h3>

          {providerData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Categoria</p>
                <p className="font-medium text-navy">{providerData.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor por Hora</p>
                <p className="font-medium text-navy">R$ {providerData.hourly_rate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Localização</p>
                <p className="font-medium text-navy">{providerData.city}, {providerData.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experiência</p>
                <p className="font-medium text-navy">{providerData.experience}</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  <strong>Debug:</strong> Dados do profissional não encontrados
                </p>
              </div>
              <div className="mt-2 text-xs text-yellow-700">
                <p>Verifique o console para mais detalhes sobre o estado dos dados.</p>
              </div>
            </div>
          )}
        </div> */}

        {/* Ações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy">
                Gerenciar Serviços
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Edite seus serviços e disponibilidade
            </p>
            <button className="w-full btn-primary">
              Editar Perfil
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-turquoise rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy">
                Meus Contratos
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Visualize e gerencie seus contratos ativos
            </p>
            <button
              onClick={() => setCurrentScreen('provider-contracts')}
              className="w-full btn-secondary"
            >
              Ver Contratos
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            Estatísticas do Profissional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple mb-1">0</div>
              <div className="text-sm text-gray-600">Contratos Ativos</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-turquoise mb-1">0</div>
              <div className="text-sm text-gray-600">Projetos Concluídos</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-navy mb-1">0</div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">R$ 0</div>
              <div className="text-sm text-gray-600">Ganhos Totais</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProviderDashboard; 