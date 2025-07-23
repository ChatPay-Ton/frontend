'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import WalletInfo from './WalletInfo';
import type { Client } from '../types/database';

const ClientDashboard: React.FC = () => {
  const { userData, logout, goToSearch, setCurrentScreen } = useUser();
  const clientData = userData as Client;

  return (
    <div className="min-h-screen bg-light-blue p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-turquoise rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy">
                  Olá, {clientData?.name || 'Cliente'}!
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo ao seu painel de cliente
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

        {/* Ações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-turquoise rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy">
                Buscar Prestadores
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Encontre profissionais qualificados para seus projetos
            </p>
            <button
              onClick={goToSearch}
              className="w-full btn-primary"
            >
              Buscar Agora
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple rounded-full flex items-center justify-center">
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
              onClick={() => setCurrentScreen('client-contracts')}
              className="w-full btn-secondary"
            >
              Ver Contratos
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            Resumo da Conta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-turquoise mb-1">0</div>
              <div className="text-sm text-gray-600">Contratos Ativos</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple mb-1">0</div>
              <div className="text-sm text-gray-600">Projetos Concluídos</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-navy mb-1">0</div>
              <div className="text-sm text-gray-600">Avaliações Feitas</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ClientDashboard; 