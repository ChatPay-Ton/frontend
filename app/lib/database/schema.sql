-- Tabela de fornecedores de serviço
CREATE TABLE IF NOT EXISTS service_providers (
    id TEXT PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    hourly_rate REAL NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    experience TEXT NOT NULL,
    rating REAL DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de habilidades dos fornecedores
CREATE TABLE IF NOT EXISTS provider_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id TEXT NOT NULL,
    skill TEXT NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Tabela de disponibilidade dos fornecedores
CREATE TABLE IF NOT EXISTS provider_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contratos/serviços contratados
CREATE TABLE IF NOT EXISTS service_contracts (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    hourly_rate REAL NOT NULL,
    estimated_hours REAL,
    total_amount REAL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    scheduled_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES service_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_providers_category ON service_providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_city ON service_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_state ON service_providers(state);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON service_providers(rating);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON service_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_client ON service_contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_provider ON service_contracts(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_skills_provider ON provider_skills(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider ON provider_availability(provider_id); 