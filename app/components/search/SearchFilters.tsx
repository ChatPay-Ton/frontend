'use client';

import React from 'react';
import { SearchFilters as SearchFiltersType, serviceCategories, availableLocations } from '../../types/database';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  isOpen,
  onToggle
}) => {
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    });
  };

  const handleLocationChange = (location: string) => {
    onFilterChange({
      ...filters,
      location: filters.location === location ? '' : location
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    onFilterChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    });
  };

  const clearFilters = () => {
    onFilterChange({
      query: filters.query, // Manter a busca por texto
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      availability: []
    });
  };

  const hasActiveFilters = filters.category || filters.location || filters.minPrice > 0 || filters.maxPrice > 0 || filters.minRating > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header do filtro */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="font-medium text-navy">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-purple text-white text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteúdo dos filtros */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-6 border-t">
          {/* Categoria */}
          <div>
            <h3 className="font-medium text-navy mb-3">Categoria</h3>
            <div className="grid grid-cols-2 gap-2">
              {serviceCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`p-2 rounded-lg text-sm transition-colors ${filters.category === category
                      ? 'bg-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div>
            <h3 className="font-medium text-navy mb-3">Localização</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`p-2 rounded-lg text-sm transition-colors ${filters.location === location
                      ? 'bg-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div>
            <h3 className="font-medium text-navy mb-3">Preço por hora</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mín:</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none"
                />
                <span className="text-sm text-gray-600">Máx:</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none"
                />
              </div>
            </div>
          </div>

          {/* Avaliação */}
          <div>
            <h3 className="font-medium text-navy mb-3">Avaliação mínima</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${filters.minRating === rating
                      ? 'bg-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <span>{rating}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Botão limpar filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 