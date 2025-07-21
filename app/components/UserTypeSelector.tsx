'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import WalletInfo from './WalletInfo';

const UserTypeSelector: React.FC = () => {
  const { selectUserType, isLoading } = useUser();

  const handleSelectClient = () => {
    selectUserType('client');
  };

  const handleSelectProvider = () => {
    selectUserType('provider');
  };

  return (
    <div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Wallet Info */}
          <WalletInfo className="mb-6" />

          {/* Título */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-navy">
              Primeiro acesso
            </h1>
            <p className="text-lg text-navy opacity-80">
              Como você gostaria de usar a plataforma?
            </p>
          </div>

          {/* Opções de tipo de usuário */}
          <div className="space-y-4">
            {/* Cliente */}
            <button
              onClick={handleSelectClient}
              disabled={isLoading}
              className="w-full bg-white/90 hover:bg-white transition-colors duration-200 rounded-lg p-6 text-left border border-gray-200 hover:border-turquoise disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-turquoise rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-1">
                    Quero Contratar
                  </h3>
                  <p className="text-sm text-gray-600">
                    Encontre e contrate profissionais qualificados para seus projetos
                  </p>
                </div>
                <div className="w-6 h-6 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {/* Prestador */}
            <button
              onClick={handleSelectProvider}
              disabled={isLoading}
              className="w-full bg-white/90 hover:bg-white transition-colors duration-200 rounded-lg p-6 text-left border border-gray-200 hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-1">
                    Quero Trabalhar
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ofereça seus serviços e conecte-se com clientes
                  </p>
                </div>
                <div className="w-6 h-6 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Informações adicionais */}
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Você pode alterar isso depois
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Sua escolha inicial não é definitiva. Você pode ajustar seu perfil a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector; 