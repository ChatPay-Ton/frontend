// Schemas SQL para as tabelas do banco de dados

export const createServiceProvidersTable = `
  CREATE TABLE IF NOT EXISTS service_providers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    hourly_rate REAL NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    experience TEXT NOT NULL,
    availability TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createClientsTable = `
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createServicesTable = `
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    provider_id TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_hours INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
  );
`;

export const createContractedServicesTable = `
  CREATE TABLE IF NOT EXISTS contracted_services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    service_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    total_amount REAL NOT NULL,
    contracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
  );
`;

// Índices para melhorar performance
export const createIndexes = [
  `CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(category);`,
  `CREATE INDEX IF NOT EXISTS idx_service_providers_wallet ON service_providers(wallet_address);`,
  `CREATE INDEX IF NOT EXISTS idx_clients_wallet ON clients(wallet_address);`,
  `CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);`,
  `CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);`,
  `CREATE INDEX IF NOT EXISTS idx_contracted_services_client ON contracted_services(client_id);`,
  `CREATE INDEX IF NOT EXISTS idx_contracted_services_provider ON contracted_services(provider_id);`,
  `CREATE INDEX IF NOT EXISTS idx_contracted_services_status ON contracted_services(status);`,
  `CREATE INDEX IF NOT EXISTS idx_contracted_services_date ON contracted_services(contracted_at);`,
];

// Triggers para atualizar updated_at automaticamente
export const createUpdateTriggers = [
  `CREATE TRIGGER IF NOT EXISTS update_service_providers_updated_at
   AFTER UPDATE ON service_providers
   FOR EACH ROW
   BEGIN
     UPDATE service_providers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END;`,

  `CREATE TRIGGER IF NOT EXISTS update_clients_updated_at
   AFTER UPDATE ON clients
   FOR EACH ROW
   BEGIN
     UPDATE clients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END;`,

  `CREATE TRIGGER IF NOT EXISTS update_services_updated_at
   AFTER UPDATE ON services
   FOR EACH ROW
   BEGIN
     UPDATE services SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END;`,

  `CREATE TRIGGER IF NOT EXISTS update_contracted_services_updated_at
   AFTER UPDATE ON contracted_services
   FOR EACH ROW
   BEGIN
     UPDATE contracted_services SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END;`,
];