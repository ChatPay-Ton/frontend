import { createClient } from '@libsql/client';

// Configuração do banco de dados
const dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL!;
const authToken = process.env.NEXT_PUBLIC_DATABASE_AUTH_TOKEN!;

export const db = createClient({
  url: dbUrl,
  authToken: authToken,
});

// Tipo para facilitar o uso
export type Database = typeof db; 