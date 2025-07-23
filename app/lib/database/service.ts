import { getDb } from './config';
import type {
  ServiceProvider,
  Client,
  ServiceContract,
  CreateServiceProviderWithAvailability,
  CreateClient,
  CreateServiceContract,
  UpdateServiceProvider,
  UpdateClient,
  UpdateServiceContract,
} from '../../types/database';

// Tipos para resultados do banco de dados
interface DatabaseRow {
  [key: string]: unknown;
}

interface QueryResult {
  rows: DatabaseRow[];
  rowsAffected: number;
}

interface DatabaseTransaction {
  execute: (query: { sql: string; args: unknown[] }) => Promise<QueryResult>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

// ===== SERVICE PROVIDERS =====

export class ServiceProviderService {
  static async create(data: CreateServiceProviderWithAvailability): Promise<ServiceProvider> {
    try {
      // Usar transação para inserir dados nas duas tabelas
      const transaction = await getDb().transaction() as DatabaseTransaction;

      try {
        // 1. Inserir dados do prestador
        const providerResult = await transaction.execute({
          sql: `
            INSERT INTO service_providers (id, name, email, phone, description, category, wallet_address, hourly_rate, city, state, country, experience)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
          `,
          args: [
            data.provider.wallet_address,
            data.provider.name,
            data.provider.email,
            data.provider.phone,
            data.provider.description,
            data.provider.category,
            data.provider.wallet_address,
            data.provider.hourly_rate,
            data.provider.city,
            data.provider.state,
            data.provider.country,
            data.provider.experience,
          ],
        });

        const provider = providerResult.rows[0] as unknown as ServiceProvider;
        console.log("providerResult", providerResult);

        // 2. Inserir dados de disponibilidade
        if (data.availability && data.availability.length > 0) {
          for (const day of data.availability) {
            await transaction.execute({
              sql: `
                INSERT INTO provider_availability (provider_id, day_of_week)
                VALUES (?, ?)
              `,
              args: [provider.wallet_address, day],
            });
          }
        }

        // Commit da transação
        await transaction.commit();

        return provider;
      } catch (error) {
        // Rollback em caso de erro
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar prestador:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<ServiceProvider | null> {
    const result = await getDb().execute({
      sql: 'SELECT * FROM service_providers WHERE id = ?',
      args: [id],
    }) as QueryResult;

    return (result.rows[0] as unknown as ServiceProvider) || null;
  }

  static async findByWalletAddress(walletAddress: string): Promise<ServiceProvider | null> {
    try {
      console.log('🔍 Buscando prestador por wallet:', walletAddress);

      const result = await getDb().execute({
        sql: 'SELECT * FROM service_providers WHERE wallet_address = ?',
        args: [walletAddress],
      }) as QueryResult;

      console.log('📊 Resultado da consulta:', {
        rowCount: result.rows.length,
        rows: result.rows
      });

      if (result.rows.length === 0) {
        console.log('❌ Nenhum prestador encontrado para wallet:', walletAddress);
        return null;
      }

      const provider = result.rows[0] as unknown as ServiceProvider;
      console.log('✅ Prestador encontrado:', provider);

      return provider;
    } catch (error) {
      console.error('❌ Erro ao buscar prestador por wallet:', error);
      return null;
    }
  }

  static async findByCategory(category: string): Promise<ServiceProvider[]> {
    const result = await getDb().execute({
      sql: 'SELECT * FROM service_providers WHERE category = ? ORDER BY created_at DESC',
      args: [category],
    }) as QueryResult;

    return result.rows as unknown as ServiceProvider[];
  }

  static async findAll(): Promise<ServiceProvider[]> {
    try {
      const result = await getDb().execute(`
        SELECT 
          sp.id,
          sp.wallet_address,
          sp.name, 
          sp.email, 
          sp.phone, 
          sp.category, 
          sp.description, 
          sp.hourly_rate,
          sp.city, 
          sp.state, 
          sp.country, 
          sp.experience, 
          sp.rating, 
          sp.completed_jobs, 
          sp.verified,
          STRING_AGG(pa.day_of_week, ',') AS days_of_week
      FROM 
          service_providers AS sp
      INNER JOIN 
          provider_availability AS pa ON pa.provider_id = sp.id
      GROUP BY 
          sp.id, sp.wallet_address, sp.name, sp.email, sp.phone, sp.category, sp.description, sp.hourly_rate,
          sp.city, sp.state, sp.country, sp.experience, sp.rating, sp.completed_jobs, sp.verified;
      `) as QueryResult;

      return result.rows as unknown as ServiceProvider[];
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
      return []; // Retornar array vazio em caso de erro
    }
  }

  // Método para buscar um prestador específico com disponibilidade completa
  static async findByIdWithAvailability(id: string): Promise<(Omit<ServiceProvider, 'availability'> & { availability: string[] }) | null> {
    try {
      // Buscar dados do prestador
      const providerResult = await getDb().execute({
        sql: `
          SELECT * FROM service_providers 
          WHERE id = ?
        `,
        args: [id],
      }) as QueryResult;

      if (providerResult.rows.length === 0) {
        return null;
      }

      // Buscar disponibilidade do prestador
      const availabilityResult = await getDb().execute({
        sql: `
          SELECT day_of_week FROM provider_availability 
          WHERE provider_id = ?
        `,
        args: [id],
      }) as QueryResult;

      const provider = providerResult.rows[0] as unknown as ServiceProvider;
      const availabilityArray = availabilityResult.rows.map((row: DatabaseRow) => (row as unknown as { day_of_week: string }).day_of_week);

      // Omitir a propriedade availability original e adicionar a nova
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { availability, ...providerWithoutAvailability } = provider;

      return {
        ...providerWithoutAvailability,
        availability: availabilityArray,
      };
    } catch (error) {
      console.error('Erro ao buscar prestador:', error);
      return null;
    }
  }

  static async update(id: string, data: UpdateServiceProvider): Promise<ServiceProvider | null> {
    const fields = Object.keys(data).filter(key => data[key as keyof UpdateServiceProvider] !== undefined);
    if (fields.length === 0) return null;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field as keyof UpdateServiceProvider]).filter(v => v !== undefined);

    const result = await getDb().execute({
      sql: `UPDATE service_providers SET ${setClause} WHERE id = ? RETURNING *`,
      args: [...values, id],
    }) as QueryResult;

    return (result.rows[0] as unknown as ServiceProvider) || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await getDb().execute({
      sql: 'DELETE FROM service_providers WHERE id = ?',
      args: [id],
    }) as QueryResult;

    return result.rowsAffected > 0;
  }
}

// ===== CLIENTS =====

export class ClientService {
  static async create(data: CreateClient): Promise<Client> {
    const result = await getDb().execute({
      sql: `
        INSERT INTO clients (id, name, email, phone, wallet_address)
        VALUES (?, ?, ?, ?, ?)
        RETURNING *
      `,
      args: [data.id, data.name, data.email, data.phone, data.wallet_address],
    }) as QueryResult;

    return result.rows[0] as unknown as Client;
  }

  static async findById(id: string): Promise<Client | null> {
    const result = await getDb().execute({
      sql: 'SELECT * FROM clients WHERE id = ?',
      args: [id],
    }) as QueryResult;

    return (result.rows[0] as unknown as Client) || null;
  }

  static async findByWalletAddress(walletAddress: string): Promise<Client | null> {
    try {
      console.log('🔍 Buscando cliente por wallet:', walletAddress);

      const result = await getDb().execute({
        sql: 'SELECT * FROM clients WHERE wallet_address = ?',
        args: [walletAddress],
      }) as QueryResult;

      console.log('📊 Resultado da consulta cliente:', {
        rowCount: result.rows.length,
        rows: result.rows
      });

      if (result.rows.length === 0) {
        console.log('❌ Nenhum cliente encontrado para wallet:', walletAddress);
        return null;
      }

      const client = result.rows[0] as unknown as Client;
      console.log('✅ Cliente encontrado:', client);

      return client;
    } catch (error) {
      console.error('❌ Erro ao buscar cliente por wallet:', error);
      return null;
    }
  }

  static async findAll(): Promise<Client[]> {
    const result = await getDb().execute('SELECT * FROM clients ORDER BY created_at DESC') as QueryResult;
    return result.rows as unknown as Client[];
  }

  static async update(id: string, data: UpdateClient): Promise<Client | null> {
    const fields = Object.keys(data).filter(key => data[key as keyof UpdateClient] !== undefined);
    if (fields.length === 0) return null;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field as keyof UpdateClient]).filter(v => v !== undefined);

    const result = await getDb().execute({
      sql: `UPDATE clients SET ${setClause} WHERE id = ? RETURNING *`,
      args: [...values, id],
    }) as QueryResult;

    return (result.rows[0] as unknown as Client) || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await getDb().execute({
      sql: 'DELETE FROM clients WHERE id = ?',
      args: [id],
    }) as QueryResult;

    return result.rowsAffected > 0;
  }
}

// ===== SERVICES =====

// export class ServiceService {
//   static async create(data: CreateService): Promise<Service> {
//     const result = await getDb().execute({
//       sql: `
//         INSERT INTO services (title, description, price, provider_id, category, duration_hours)
//         VALUES (?, ?, ?, ?, ?, ?)
//         RETURNING *
//       `,
//       args: [data.title, data.description, data.price, data.provider_id, data.category, data.duration_hours],
//     }) as QueryResult;

//     return result.rows[0] as unknown as Service;
//   }

//   static async findById(id: string): Promise<Service | null> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM services WHERE id = ?',
//       args: [id],
//     }) as QueryResult;

//     return (result.rows[0] as unknown as Service) || null;
//   }

//   static async findByProviderId(providerId: string): Promise<Service[]> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM services WHERE provider_id = ? ORDER BY created_at DESC',
//       args: [providerId],
//     }) as QueryResult;

//     return result.rows as unknown as Service[];
//   }

//   static async findByCategory(category: string): Promise<Service[]> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM services WHERE category = ? ORDER BY created_at DESC',
//       args: [category],
//     }) as QueryResult;

//     return result.rows as unknown as Service[];
//   }

//   static async findAll(): Promise<Service[]> {
//     const result = await getDb().execute(`
//       SELECT 
//           sp.id, 
//           sp.name, 
//           sp.email, 
//           sp.phone, 
//           sp.category, 
//           sp.description, 
//           sp.hourly_rate,
//           sp.city, 
//           sp.state, 
//           sp.country, 
//           sp.experience, 
//           sp.rating, 
//           sp.completed_jobs, 
//           sp.verified,
//           STRING_AGG(pa.day_of_week, ',') AS days_of_week
//       FROM 
//           service_providers AS sp
//       INNER JOIN 
//           provider_availability AS pa ON pa.provider_id = sp.id
//       GROUP BY 
//           sp.id, sp.name, sp.email, sp.phone, sp.category, sp.description, sp.hourly_rate,
//           sp.city, sp.state, sp.country, sp.experience, sp.rating, sp.completed_jobs, sp.verified;
//       `) as QueryResult;
//     return result.rows as unknown as Service[];
//   }

//   static async update(id: string, data: UpdateService): Promise<Service | null> {
//     const fields = Object.keys(data).filter(key => data[key as keyof UpdateService] !== undefined);
//     if (fields.length === 0) return null;

//     const setClause = fields.map(field => `${field} = ?`).join(', ');
//     const values = fields.map(field => data[field as keyof UpdateService]).filter(v => v !== undefined);

//     const result = await getDb().execute({
//       sql: `UPDATE services SET ${setClause} WHERE id = ? RETURNING *`,
//       args: [...values, id],
//     }) as QueryResult;

//     return (result.rows[0] as unknown as Service) || null;
//   }

//   static async delete(id: string): Promise<boolean> {
//     const result = await getDb().execute({
//       sql: 'DELETE FROM services WHERE id = ?',
//       args: [id],
//     }) as QueryResult;

//     return result.rowsAffected > 0;
//   }
// }

// // ===== CONTRACTED SERVICES =====

// export class ContractedServiceService {
//   static async findById(id: string): Promise<ContractedService | null> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM contracted_services WHERE id = ?',
//       args: [id],
//     }) as QueryResult;

//     return (result.rows[0] as unknown as ContractedService) || null;
//   }

//   static async findByClientId(clientId: string): Promise<ContractedService[]> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM contracted_services WHERE client_id = ? ORDER BY contracted_at DESC',
//       args: [clientId],
//     }) as QueryResult;

//     return result.rows as unknown as ContractedService[];
//   }

//   static async findByProviderId(providerId: string): Promise<ContractedService[]> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM contracted_services WHERE provider_id = ? ORDER BY contracted_at DESC',
//       args: [providerId],
//     }) as QueryResult;

//     return result.rows as unknown as ContractedService[];
//   }

//   static async findByStatus(status: string): Promise<ContractedService[]> {
//     const result = await getDb().execute({
//       sql: 'SELECT * FROM contracted_services WHERE status = ? ORDER BY contracted_at DESC',
//       args: [status],
//     }) as QueryResult;

//     return result.rows as unknown as ContractedService[];
//   }

//   static async findAll(): Promise<ContractedService[]> {
//     const result = await getDb().execute('SELECT * FROM contracted_services ORDER BY contracted_at DESC') as QueryResult;
//     return result.rows as unknown as ContractedService[];
//   }

//   static async update(id: string, data: UpdateContractedService): Promise<ContractedService | null> {
//     const fields = Object.keys(data).filter(key => data[key as keyof UpdateContractedService] !== undefined);
//     if (fields.length === 0) return null;

//     const setClause = fields.map(field => `${field} = ?`).join(', ');
//     const values = fields.map(field => data[field as keyof UpdateContractedService]).filter(v => v !== undefined);

//     const result = await getDb().execute({
//       sql: `UPDATE contracted_services SET ${setClause} WHERE id = ? RETURNING *`,
//       args: [...values, id],
//     }) as QueryResult;

//     return (result.rows[0] as unknown as ContractedService) || null;
//   }

//   static async delete(id: string): Promise<boolean> {
//     const result = await getDb().execute({
//       sql: 'DELETE FROM contracted_services WHERE id = ?',
//       args: [id],
//     }) as QueryResult;

//     return result.rowsAffected > 0;
//   }

//   // Método específico para completar um serviço
//   static async completeService(id: string): Promise<ContractedService | null> {
//     const result = await getDb().execute({
//       sql: `
//         UPDATE contracted_services 
//         SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
//         WHERE id = ? 
//         RETURNING *
//       `,
//       args: [id],
//     }) as QueryResult;

//     return (result.rows[0] as unknown as ContractedService) || null;
//   }

//   // Método para buscar serviços com informações detalhadas (JOIN)
//   static async findWithDetails(id: string): Promise<unknown | null> {
//     const result = await getDb().execute({
//       sql: `
//         SELECT 
//           cs.*,
//           s.title as service_title,
//           s.description as service_description,
//           s.price as service_price,
//           s.category as service_category,
//           c.name as client_name,
//           c.email as client_email,
//           sp.name as provider_name,
//           sp.email as provider_email
//         FROM contracted_services cs
//         JOIN services s ON cs.service_id = s.id
//         JOIN clients c ON cs.client_id = c.id
//         JOIN service_providers sp ON cs.provider_id = sp.id
//         WHERE cs.id = ?
//       `,
//       args: [id],
//     }) as QueryResult;

//     return result.rows[0] || null;
//   }
// }

// ===== SERVICE CONTRACTS (TON ESCROW) =====

export class ServiceContractService {
  static async create(data: CreateServiceContract): Promise<ServiceContract> {
    try {
      const result = await getDb().execute({
        sql: `
          INSERT INTO service_contracts (
            id, client_id, provider_id, transaction_hash, total_amount
          )
          VALUES (?, ?, ?, ?, ?)
          RETURNING *
        `,
        args: [
          data.id,
          data.client_id,
          data.provider_id,
          data.transaction_hash || null,
          data.total_amount,
        ],
      }) as QueryResult;

      return result.rows[0] as unknown as ServiceContract;
    } catch (error) {
      console.error('❌ Erro ao criar service contract:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<ServiceContract | null> {
    try {
      const result = await getDb().execute({
        sql: 'SELECT * FROM service_contracts WHERE id = ?',
        args: [id],
      }) as QueryResult;

      return (result.rows[0] as unknown as ServiceContract) || null;
    } catch (error) {
      console.error('❌ Erro ao buscar service contract por ID:', error);
      return null;
    }
  }

  static async findByClientId(clientId: string): Promise<ServiceContract[]> {
    try {
      const result = await getDb().execute({
        sql: `SELECT sc.id, sc.client_id AS client, sp.name AS provider, sp.category AS provider_category,
              sc.total_amount, sc.status, sc.transaction_hash, sc.created_at, sc.updated_at
              FROM service_contracts AS sc
              INNER JOIN service_providers AS sp ON sp.id = sc.provider_id
              WHERE sc.client_id = ?
              ORDER BY sc.created_at DESC `,
        args: [clientId],
      }) as QueryResult;

      console.log('result', result.rows);
      return result.rows as unknown as ServiceContract[];
    } catch (error) {
      console.error('❌ Erro ao buscar service contracts por cliente:', error);
      return [];
    }
  }

  static async findByProviderId(providerId: string): Promise<ServiceContract[]> {
    try {
      const result = await getDb().execute({
        sql: 'SELECT * FROM service_contracts WHERE provider_id = ? ORDER BY created_at DESC',
        args: [providerId],
      }) as QueryResult;

      return result.rows as unknown as ServiceContract[];
    } catch (error) {
      console.error('❌ Erro ao buscar service contracts por prestador:', error);
      return [];
    }
  }

  static async findByWallet(walletAddress: string): Promise<ServiceContract[]> {
    try {
      const result = await getDb().execute({
        sql: `
          SELECT * FROM service_contracts 
          WHERE client_wallet = ? OR provider_wallet = ? 
          ORDER BY created_at DESC
        `,
        args: [walletAddress, walletAddress],
      }) as QueryResult;

      return result.rows as unknown as ServiceContract[];
    } catch (error) {
      console.error('❌ Erro ao buscar service contracts por wallet:', error);
      return [];
    }
  }

  static async update(id: string, data: UpdateServiceContract): Promise<ServiceContract | null> {
    try {
      // Construir query dinamicamente baseada nos campos fornecidos
      const fields = [];
      const values = [];

      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);
      }

      if (data.escrow_status !== undefined) {
        fields.push('escrow_status = ?');
        values.push(data.escrow_status);
      }

      if (data.transaction_hash !== undefined) {
        fields.push('transaction_hash = ?');
        values.push(data.transaction_hash);
      }

      if (fields.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }

      // Adicionar updated_at
      fields.push('updated_at = CURRENT_TIMESTAMP');

      // Adicionar ID no final
      values.push(id);

      const result = await getDb().execute({
        sql: `
          UPDATE service_contracts 
          SET ${fields.join(', ')} 
          WHERE id = ? 
          RETURNING *
        `,
        args: values,
      }) as QueryResult;

      return (result.rows[0] as unknown as ServiceContract) || null;
    } catch (error) {
      console.error('❌ Erro ao atualizar service contract:', error);
      return null;
    }
  }

  static async findWithDetails(id: string): Promise<unknown | null> {
    try {
      const result = await getDb().execute({
        sql: `
          SELECT 
            sc.*,
            c.name as client_name,
            c.email as client_email,
            sp.name as provider_name,
            sp.email as provider_email,
            sp.category as provider_category
          FROM service_contracts sc
          JOIN clients c ON sc.client_id = c.id
          JOIN service_providers sp ON sc.provider_id = sp.id
          WHERE sc.id = ?
        `,
        args: [id],
      }) as QueryResult;

      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao buscar service contract com detalhes:', error);
      return null;
    }
  }
} 