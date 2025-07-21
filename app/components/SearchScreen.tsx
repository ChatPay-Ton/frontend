'use client';

import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SearchFilters, ServiceProvider } from '../types/database';
import { useServiceProviderSearch } from '../hooks/useServiceProviderSearch';
import {
  SearchBar,
  SearchFilters as SearchFiltersComponent,
  ServiceProviderCard,
  ServiceProviderModal,
  EmptyState
} from './search';

const SearchScreen: React.FC = () => {
  const { setCurrentScreen } = useUser();

  const goBackToClientDashboard = () => {
    setCurrentScreen('client-dashboard');
  };

  // Estados principais
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    availability: []
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar prestadores com filtros aplicados
  const { providers: filteredProviders, loading, error, refetch } = useServiceProviderSearch(filters);

  // Handlers
  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleToggleFilters = () => {
    setIsFiltersOpen(prev => !prev);
  };

  const handleViewProfile = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleContract = (provider: ServiceProvider) => {
    // TODO: Implementar lógica de contratação
    console.log('Contratar prestador:', provider);
    alert(`Funcionalidade de contratação será implementada em breve!\n\nPrestador: ${provider.name}\nCategoria: ${provider.category}\nPreço: R$ ${provider.hourly_rate}/hora`);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      availability: []
    });
    setIsFiltersOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = Boolean(filters.query) || Boolean(filters.category) || Boolean(filters.location) ||
    filters.minPrice > 0 || filters.maxPrice > 0 || filters.minRating > 0;

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="min-h-screen bg-light-blue">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToClientDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Buscar Prestadores</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando prestadores...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-blue">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToClientDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Buscar Prestadores</h1>
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
              <p className="text-gray-600 mb-4">Erro ao carregar prestadores: {error}</p>
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

  return (
    <div className="min-h-screen bg-light-blue">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBackToClientDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-navy">Buscar Prestadores</h1>
            </div>
            <div className="text-sm text-gray-600">
              {filteredProviders.length} prestador{filteredProviders.length !== 1 ? 'es' : ''} encontrado{filteredProviders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Barra de busca */}
          <SearchBar
            filters={filters}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="mb-6">
          <SearchFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={isFiltersOpen}
            onToggle={handleToggleFilters}
          />
        </div>

        {/* Resultados */}
        {filteredProviders.length > 0 ? (
          <div className="space-y-6">
            {filteredProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                onViewProfile={handleViewProfile}
                onContract={handleContract}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasSearchTerm={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      {/* Modal de perfil */}
      <ServiceProviderModal
        provider={selectedProvider}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContract={handleContract}
      />
    </div>
  );
};

export default SearchScreen; 