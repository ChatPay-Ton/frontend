'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useClientForm } from '../hooks/useClientForm';
import { useTonAuth } from '../hooks/useTonAuth';
import WalletInfo from './WalletInfo';

const ClientRegistration: React.FC = () => {
  const { completeRegistration, goBackToUserTypeSelection } = useUser();
  const { address } = useTonAuth();
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useClientForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert('Erro: Carteira não conectada');
      return;
    }

    try {
      // Criar cliente com endereço da wallet
      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        wallet_address: address,
        id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Tentar registrar
      await handleSubmit(e);

      // Se chegou aqui, o registro foi bem-sucedido
      completeRegistration(clientData);

    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    }
  };

  return (
    <div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-4">
          {/* Wallet Info */}
          <WalletInfo className="mb-6" />

          {/* Botão Voltar */}
          <div className="flex justify-start mb-4">
            <button
              onClick={goBackToUserTypeSelection}
              className="flex items-center space-x-2 text-gray-600 hover:text-navy transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar</span>
            </button>
          </div>

          {/* Título */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-navy">
              Cadastro de Cliente
            </h1>
            <p className="text-sm text-gray-600">
              Complete seu perfil para começar a contratar serviços
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="card space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Digite seu nome completo"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Digite seu email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="(11) 99999-9999"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Erro geral */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Botão de cadastro */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Cadastrando...</span>
                  </div>
                ) : (
                  'Completar Cadastro'
                )}
              </button>
            </div>
          </form>

          {/* Informações de segurança */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Dados Protegidos
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Seus dados são criptografados e protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration; 