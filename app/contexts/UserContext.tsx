'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserType, UserTypeData } from '../hooks/useUserType';
import { useTonAuth } from '../hooks/useTonAuth';
import type { Client, ServiceProvider } from '../types/database';

interface UserContextType extends UserTypeData {
  // Controle de navegação
  currentScreen: 'login' | 'user-type-selection' | 'client-registration' | 'provider-registration' | 'client-dashboard' | 'provider-dashboard' | 'search';
  setCurrentScreen: (screen: UserContextType['currentScreen']) => void;

  // Ações do usuário
  selectUserType: (type: 'client' | 'provider') => void;
  completeRegistration: (userData: Client | ServiceProvider) => void;
  goBackToUserTypeSelection: () => void;
  goToSearch: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { isConnected, disconnect } = useTonAuth();
  const userTypeData = useUserType();
  const [currentScreen, setCurrentScreen] = useState<UserContextType['currentScreen']>('login');
  const [, setSelectedUserType] = useState<'client' | 'provider' | null>(null);

  // Determinar tela atual baseado no estado da autenticação e tipo de usuário
  useEffect(() => {
    const determineScreen = () => {
      // Se não está conectado, mostrar login
      if (!isConnected) {
        setCurrentScreen('login');
        setSelectedUserType(null);
        return;
      }

      // Se acabou de conectar mas ainda não carregou os dados, mostrar loading
      if (isConnected && userTypeData.isLoading) {
        // Não mudar a tela ainda, deixar o loading acontecer
        return;
      }

      // Se há erro, mostrar login
      if (userTypeData.error) {
        setCurrentScreen('login');
        return;
      }

      // Determinar próxima tela baseado no tipo de usuário
      switch (userTypeData.type) {
        case 'client':
          setCurrentScreen('client-dashboard');
          break;
        case 'provider':
          setCurrentScreen('provider-dashboard');
          break;
        case 'new':
          setCurrentScreen('user-type-selection');
          break;
        default:
          setCurrentScreen('login');
          break;
      }
    };

    determineScreen();
  }, [isConnected, userTypeData.type, userTypeData.isLoading, userTypeData.error]);

  // Selecionar tipo de usuário (para novos usuários)
  const selectUserType = (type: 'client' | 'provider') => {
    setSelectedUserType(type);
    if (type === 'client') {
      setCurrentScreen('client-registration');
    } else {
      setCurrentScreen('provider-registration');
    }
  };

  // Completar registro (após cadastro bem-sucedido)
  const completeRegistration = (userData: Client | ServiceProvider) => {
    // Atualizar tela baseado no tipo de usuário registrado
    if ('wallet_address' in userData) {
      // Verificar se é client ou provider baseado na estrutura
      const isClient = !('category' in userData);
      if (isClient) {
        setCurrentScreen('client-dashboard');
      } else {
        setCurrentScreen('provider-dashboard');
      }
    }
  };

  // Voltar para seleção de tipo de usuário
  const goBackToUserTypeSelection = () => {
    setCurrentScreen('user-type-selection');
    setSelectedUserType(null);
  };

  // Ir para tela de busca
  const goToSearch = () => {
    setCurrentScreen('search');
  };

  // Logout
  const logout = async () => {
    try {
      await disconnect();
      setCurrentScreen('login');
      setSelectedUserType(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: UserContextType = {
    // Dados do usuário
    ...userTypeData,

    // Navegação
    currentScreen,
    setCurrentScreen,

    // Ações
    selectUserType,
    completeRegistration,
    goBackToUserTypeSelection,
    goToSearch,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 