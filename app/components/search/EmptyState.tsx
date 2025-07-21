'use client';

import React from 'react';

interface EmptyStateProps {
  hasSearchTerm: boolean;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchTerm, onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasSearchTerm ? 'Nenhum resultado encontrado' : 'Nenhum prestador disponível'}
      </h3>

      <p className="text-gray-600 mb-6 max-w-md">
        {hasSearchTerm
          ? 'Não encontramos prestadores que correspondam aos seus critérios de busca. Tente ajustar os filtros ou buscar por outros termos.'
          : 'Não há prestadores disponíveis no momento. Tente novamente mais tarde.'}
      </p>

      {hasSearchTerm && (
        <div className="space-y-3">
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            Limpar Filtros
          </button>

          <div className="text-sm text-gray-500">
            <p>Dicas para melhor busca:</p>
            <ul className="mt-2 text-left space-y-1">
              <li>• Tente termos mais gerais</li>
              <li>• Verifique a ortografia</li>
              <li>• Use sinônimos</li>
              <li>• Expanda a área de localização</li>
            </ul>
          </div>
        </div>
      )}

      {!hasSearchTerm && (
        <div className="text-sm text-gray-500 space-y-2">
          <p>Enquanto isso, você pode:</p>
          <ul className="space-y-1">
            <li>• Cadastrar-se como prestador</li>
            <li>• Verificar novamente mais tarde</li>
            <li>• Entrar em contato conosco</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState; 