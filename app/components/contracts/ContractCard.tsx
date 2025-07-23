'use client';

import React from 'react';
import { ServiceContract } from '../../types/database';

interface ContractCardProps {
  contract: ServiceContract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deposited':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client_confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'provider_confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Função para traduzir status
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      created: 'Criado',
      deposited: 'Depositado',
      client_confirmed: 'Cliente Confirmou',
      provider_confirmed: 'Prestador Confirmou',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Função para traduzir escrow status
  const translateEscrowStatus = (escrowStatus: number) => {
    switch (escrowStatus) {
      case 0:
        return 'Aguardando';
      case 1:
        return 'Cliente Confirmou';
      case 2:
        return 'Prestador Confirmou';
      case 3:
        return 'Ambos Confirmaram';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header do contrato */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-navy mb-1">
            Contrato
          </h3>
          <p className="text-sm text-gray-600">
            Criado em {formatDate(contract.created_at)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-navy mb-1">
            {contract.total_amount.toFixed(2)} TON
          </div>
          <div className="text-sm text-gray-500">valor total</div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
          {translateStatus(contract.status)}
        </span>
        {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">
          Escrow: {translateEscrowStatus(contract.status)}
        </span> */}
      </div>

      {/* Informações do contrato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Prestador</p>
          <p className="font-medium text-gray-900">
            {contract.provider}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Categoria</p>
          <p className="font-medium text-gray-900">
            {contract.provider_category}
          </p>
        </div>
      </div>

      {/* Footer com ações */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Atualizado: {formatDate(contract.updated_at)}
        </div>
        <div className="flex space-x-2">
          <button className="text-sm text-navy hover:text-navy-dark font-medium">
            Ver Detalhes
          </button>
          {(contract.status === 'created' || contract.status === 'deposited') && (
            <button className="text-sm bg-navy text-white px-3 py-1 rounded hover:bg-navy-dark transition-colors">
              Gerenciar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractCard; 