'use client';

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useTonAuth } from '../hooks/useTonAuth';
import LoginScreen from './LoginScreen';
import UserTypeSelector from './UserTypeSelector';
import ClientRegistration from '../components/ClientRegistration';
import ProviderRegistration from '../components/ProviderRegistration';
import ClientDashboard from '../components/ClientDashboard';
import ProviderDashboard from '../components/ProviderDashboard';
import SearchScreen from '../components/SearchScreen';
import LoadingScreen from '../components/LoadingScreen';
import ClientContracts from '../components/ClientContracts';
import ProviderContracts from '../components/ProviderContracts';

const AppRouter: React.FC = () => {
  const { currentScreen, isLoading } = useUser();
  const { isConnected } = useTonAuth();

  // Mostrar loading apenas quando está conectado e carregando dados
  if (isConnected && isLoading) {
    return <LoadingScreen />;
  }

  // Renderizar tela baseada no estado atual
  switch (currentScreen) {
    case 'login':
      return <LoginScreen />;

    case 'user-type-selection':
      return <UserTypeSelector />;

    case 'client-registration':
      return <ClientRegistration />;

    case 'provider-registration':
      return <ProviderRegistration />;

    case 'client-dashboard':
      return <ClientDashboard />;

    case 'client-contracts':
      return <ClientContracts />;

    case 'provider-dashboard':
      return <ProviderDashboard />;

    case 'provider-contracts':
      return <ProviderContracts />;

    case 'search':
      return <SearchScreen />;

    default:
      return <LoginScreen />;
  }
};

export default AppRouter; 