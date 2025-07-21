'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useServiceProviderForm } from '../hooks/useServiceProviderForm';
import { useTonAuth } from '../hooks/useTonAuth';
import WalletInfo from './WalletInfo';

const ProviderRegistration: React.FC = () => {
  const { completeRegistration, goBackToUserTypeSelection } = useUser();
  const { address } = useTonAuth();
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleAvailabilityChange,
    handleSubmit
  } = useServiceProviderForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert('Erro: Carteira não conectada');
      return;
    }

    try {
      // Criar dados do prestador com endereço da wallet
      const providerData = {
        id: '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        category: formData.category,
        wallet_address: address,
        hourly_rate: parseFloat(formData.hourlyRate),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        experience: formData.experience,
        availability: formData.availability.join(','),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Tentar registrar
      await handleSubmit(e);

      // Se chegou aqui, o registro foi bem-sucedido
      completeRegistration(providerData);

    } catch (error) {
      console.error('Erro ao registrar prestador:', error);
    }
  };

  const categories = [
    'Tecnologia',
    'Design',
    'Marketing',
    'Educação',
    'Consultoria',
    'Saúde',
    'Outros'
  ];

  const experiences = [
    'Iniciante (0-1 anos)',
    'Júnior (1-3 anos)',
    'Pleno (3-5 anos)',
    'Sênior (5+ anos)'
  ];

  const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  return (
    <div className="min-h-screen bg-light-blue p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-4 mb-6">
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
              Cadastro de Prestador
            </h1>
            <p className="text-sm text-gray-600">
              Complete seu perfil para começar a oferecer serviços
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="card space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Informações Pessoais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.name ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="(11) 99999-9999"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição dos Serviços
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Descreva os serviços que você oferece..."
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Informações Profissionais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Valor por Hora */}
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor por Hora (R$)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ex: 50.00"
                    required
                  />
                  {errors.hourlyRate && (
                    <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
                  )}
                </div>

                {/* Experiência */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Experiência
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.experience ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Selecione seu nível</option>
                    {experiences.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Localização</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cidade */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ex: São Paulo"
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    maxLength={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ex: SP"
                    required
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                {/* País */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple ${errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ex: Brasil"
                    required
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Disponibilidade</h3>
              <p className="text-sm text-gray-600">Selecione os dias da semana que você está disponível</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {daysOfWeek.map(day => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={() => handleAvailabilityChange(day)}
                      className="w-4 h-4 text-purple focus:ring-purple border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="text-red-500 text-xs mt-1">{errors.availability}</p>
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
        <div className="bg-gray-50 rounded-lg p-4 text-center mt-6">
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
            Suas informações são criptografadas e protegidas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration; 