# ChatPay TON Frontend

Este é o frontend da aplicação ChatPay TON, construído com Next.js 15 e TypeScript.

## Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Linguagem de programação tipada
- **Tailwind CSS** - Framework CSS utilitário
- **TON Connect** - Integração com a blockchain TON
- **Turso** - Banco de dados SQLite distribuído

## Integração com Turso

### Configuração

1. **Variáveis de Ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   
   ```env
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   ```

2. **Estrutura do Banco de Dados**

   O banco possui 4 tabelas principais:
   
   - `service_providers` - Fornecedores de serviços
   - `clients` - Clientes
   - `services` - Serviços oferecidos
   - `contracted_services` - Serviços contratados (conecta cliente, fornecedor e serviço)

### Uso dos Hooks

#### Fornecedores de Serviço

```typescript
import { useServiceProviders, useServiceProvider } from '@/app/hooks/useServiceProviders';

// Listar todos os fornecedores
const { providers, loading, error, createProvider } = useServiceProviders();

// Buscar fornecedor específico
const { provider } = useServiceProvider(providerId);

// Buscar por categoria
const { providers } = useServiceProvidersByCategory('tecnologia');

// Buscar por wallet
const { provider } = useServiceProviderByWallet(walletAddress);
```

#### Clientes

```typescript
import { useClients, useClient } from '@/app/hooks/useClients';

// Listar todos os clientes
const { clients, loading, error, createClient } = useClients();

// Buscar cliente específico
const { client } = useClient(clientId);

// Buscar por wallet
const { client } = useClientByWallet(walletAddress);
```

#### Serviços

```typescript
import { useServices, useService } from '@/app/hooks/useServices';

// Listar todos os serviços
const { services, loading, error, createService } = useServices();

// Buscar serviço específico
const { service } = useService(serviceId);

// Buscar por fornecedor
const { services } = useServicesByProvider(providerId);

// Buscar por categoria
const { services } = useServicesByCategory('consultoria');
```

#### Serviços Contratados

```typescript
import { 
  useContractedServices, 
  useContractedServicesByClient,
  useContractedServicesByProvider 
} from '@/app/hooks/useServices';

// Listar todos os serviços contratados
const { contractedServices, createContractedService, completeContractedService } = useContractedServices();

// Buscar por cliente
const { contractedServices } = useContractedServicesByClient(clientId);

// Buscar por fornecedor
const { contractedServices } = useContractedServicesByProvider(providerId);

// Buscar por status
const { contractedServices } = useContractedServicesByStatus('pending');
```

### Inicialização do Banco

Para inicializar o banco de dados (criar tabelas, índices e triggers):

```typescript
import { initializeDatabase } from '@/app/lib/database/init';

// Inicializar banco
await initializeDatabase();
```

### Exemplo de Uso Completo

```typescript
'use client';

import { useServiceProviders } from '@/app/hooks/useServiceProviders';
import { useContractedServices } from '@/app/hooks/useServices';

export default function ServiceDashboard() {
  const { providers, loading: providersLoading } = useServiceProviders();
  const { contractedServices, createContractedService } = useContractedServices();

  const handleContractService = async (serviceId: string, clientId: string, providerId: string) => {
    const newContract = await createContractedService({
      service_id: serviceId,
      client_id: clientId,
      provider_id: providerId,
      status: 'pending',
      total_amount: 100.0,
    });
    
    if (newContract) {
      console.log('Serviço contratado com sucesso!');
    }
  };

  if (providersLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Fornecedores Disponíveis</h1>
      {providers.map(provider => (
        <div key={provider.id}>
          <h2>{provider.name}</h2>
          <p>{provider.description}</p>
          <p>Categoria: {provider.category}</p>
        </div>
      ))}
    </div>
  );
}
```

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## Estrutura de Arquivos

```
app/
├── hooks/                 # Hooks personalizados
│   ├── useServiceProviders.ts
│   ├── useClients.ts
│   └── useServices.ts
├── lib/
│   ├── turso.ts          # Cliente Turso
│   └── database/
│       ├── schema.ts     # Esquemas das tabelas
│       ├── service.ts    # Serviços de banco
│       └── init.ts       # Inicialização
├── types/
│   └── database.ts       # Tipos TypeScript
└── ...
```

## Funcionalidades

- ✅ Integração completa com Turso
- ✅ Hooks React para gerenciamento de estado
- ✅ Operações CRUD para todas as entidades
- ✅ Relacionamentos entre tabelas
- ✅ Busca por diferentes critérios
- ✅ Tratamento de erros
- ✅ Tipos TypeScript seguros
- ✅ Inicialização automática do banco

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
