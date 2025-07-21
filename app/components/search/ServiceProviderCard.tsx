'use client';

import React from 'react';
import { ServiceProvider } from '../../types/database';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onViewProfile: (provider: ServiceProvider) => void;
  onContract: (provider: ServiceProvider) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onViewProfile,
  onContract
}) => {
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

  return (
    <div className="provider-card bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      {/* Header com nome e verificação */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-navy">{provider.name}</h3>
            {/* {provider.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verificado
              </span>
            )} */}
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
          <div className="text-2xl font-bold text-navy">
            R$ {provider.hourly_rate.toFixed(2)}
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

      {/* Ações */}
      <div className="flex space-x-3">
        <button
          onClick={() => onViewProfile(provider)}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Ver Perfil
        </button>
        <button
          onClick={() => onContract(provider)}
          className='btn-primary'
        >
          Contratar
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderCard; 