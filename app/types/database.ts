// Tipos consolidados para as entidades do banco de dados

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  category: string;
  wallet_address: string;
  hourly_rate: number;
  city: string;
  state: string;
  country: string;
  experience: string;
  availability: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Campos extras para busca e exibição
  rating?: number;
  completedJobs?: number;
  verified?: boolean;
  days_of_week?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  provider_id: string;
  category: string;
  duration_hours: number;
  created_at: string;
  updated_at: string;
}

export interface ContractedService {
  id: string;
  service_id: string;
  client_id: string;
  provider_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  contracted_at: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para inserção (sem campos auto-gerados)
export interface CreateServiceProvider {
  name: string;
  email: string;
  phone: string;
  description: string;
  category: string;
  wallet_address: string;
  hourly_rate: number;
  city: string;
  state: string;
  country: string;
  experience: string;
  availability: string[];
}

export interface CreateClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet_address: string;
}

export interface CreateService {
  title: string;
  description: string;
  price: number;
  provider_id: string;
  category: string;
  duration_hours: number;
}

export interface CreateContractedService {
  service_id: string;
  client_id: string;
  provider_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
}

// Tipos para atualização (campos opcionais)
export interface UpdateServiceProvider {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  category?: string;
  wallet_address?: string;
  hourly_rate?: number;
  city?: string;
  state?: string;
  country?: string;
  experience?: string;
}

export interface UpdateClient {
  name?: string;
  email?: string;
  phone?: string;
  wallet_address?: string;
}

export interface UpdateService {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  duration_hours?: number;
}

export interface UpdateContractedService {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_amount?: number;
  completed_at?: string;
  notes?: string;
}

// Interface para disponibilidade
export interface ProviderAvailability {
  id: number;
  provider_id: string;
  day_of_week: string;
}

export interface CreateProviderAvailability {
  provider_id: string;
  day_of_week: string;
}

// Interface para criar um prestador com disponibilidade
export interface CreateServiceProviderWithAvailability {
  provider: CreateServiceProvider;
  availability: string[];
}

// Tipos para busca e filtros
export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  availability: string[];
}

// Categorias disponíveis
export const serviceCategories = [
  'Limpeza Doméstica',
  'Jardinagem',
  'Encanador',
  'Eletricista',
  'Pintor',
  'Marceneiro',
  'Técnico em Informática',
  'Professor Particular',
  'Cuidador de Idosos',
  'Babá',
  'Montador de Móveis',
  'Chaveiro',
  'Outros'
];

// Localizações disponíveis
export const availableLocations = [
  'São Paulo',
  'Campinas',
  'Guarulhos',
  'Santo André',
  'São Bernardo do Campo',
  'Osasco',
  'Santos',
  'Sorocaba'
];

// Opções de experiência
export const experienceOptions = [
  { value: "menos-1", label: "Menos de 1 ano" },
  { value: "1-3", label: "1 a 3 anos" },
  { value: "3-5", label: "3 a 5 anos" },
  { value: "5-10", label: "5 a 10 anos" },
  { value: "mais-10", label: "Mais de 10 anos" }
];

// Função utilitária para filtrar prestadores
export const filterServiceProviders = (
  providers: ServiceProvider[],
  filters: SearchFilters
): ServiceProvider[] => {
  return providers.filter(provider => {
    // Filtro por texto
    const matchesQuery = filters.query === '' ||
      provider.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      provider.description.toLowerCase().includes(filters.query.toLowerCase()) ||
      provider.category.toLowerCase().includes(filters.query.toLowerCase());

    // Filtro por categoria
    const matchesCategory = filters.category === '' || provider.category === filters.category;

    // Filtro por localização
    const matchesLocation = filters.location === '' || provider.city === filters.location;

    // Filtro por preço
    const matchesPrice = provider.hourly_rate >= filters.minPrice &&
      (filters.maxPrice === 0 || provider.hourly_rate <= filters.maxPrice);

    // Filtro por avaliação
    const matchesRating = (provider.rating || 0) >= filters.minRating;

    // Filtro por disponibilidade
    const matchesAvailability = filters.availability.length === 0 || (() => {
      // Verificar se o prestador está disponível nos dias solicitados
      const providerAvailability = provider.days_of_week ?
        provider.days_of_week.split(',').map(day => day.trim()) :
        provider.availability ? provider.availability.split(',').map(day => day.trim()) : [];

      return filters.availability.some(requestedDay =>
        providerAvailability.includes(requestedDay)
      );
    })();

    return matchesQuery && matchesCategory && matchesLocation &&
      matchesPrice && matchesRating && matchesAvailability;
  });
};

// ============= SERVICE CONTRACTS (TON ESCROW) =============

export interface ServiceContract {
  id: string; // Endereço do contrato escrow TON
  client: string;
  provider: string;
  provider_category: string;
  total_amount: number; // Valor em TON
  status: 'created' | 'deposited' | 'client_confirmed' | 'provider_confirmed' | 'completed' | 'cancelled';
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceContract {
  id: string; // Endereço do contrato escrow
  client_id: string;
  provider_id: string;
  transaction_hash?: string;
  total_amount: number;
}

export interface UpdateServiceContract {
  status?: 'created' | 'deposited' | 'client_confirmed' | 'provider_confirmed' | 'completed' | 'cancelled';
  escrow_status?: number;
  transaction_hash?: string;
}

// ============= CONSTANTES =============

// Opções de categoria 