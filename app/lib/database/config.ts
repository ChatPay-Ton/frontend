import { createClient } from '@libsql/client';

// Verificar se estamos no ambiente do servidor durante build
const isServerSide = typeof window === 'undefined';
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

// Configuração do banco de dados
const dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
const authToken = process.env.NEXT_PUBLIC_DATABASE_AUTH_TOKEN;

// Log apenas no desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Database Config:', {
    hasUrl: !!dbUrl,
    hasToken: !!authToken,
    isServerSide,
    isBuildTime
  });
}

// Verificar se as variáveis de ambiente estão configuradas
if (!dbUrl && process.env.NODE_ENV === 'development') {
  console.warn('⚠️  NEXT_PUBLIC_DATABASE_URL não está configurada');
  console.warn('📝 Configure as variáveis de ambiente baseadas no arquivo ENVIRONMENT_SETUP.md');
}

// Configuração padrão
const getDbConfig = () => {
  // Durante o build ou se não há URL, usar SQLite local
  if (isBuildTime || !dbUrl) {
    return { url: 'file:local.db' };
  }

  return {
    url: dbUrl,
    ...(authToken && { authToken: authToken }),
  };
};

let db: ReturnType<typeof createClient> | null = null;

// Função para obter instância do banco
const getDatabase = () => {
  if (!db) {
    try {
      const config = getDbConfig();
      db = createClient(config);
    } catch (error) {
      console.error('❌ Erro ao conectar com o banco de dados:', error);
      // Fallback para SQLite local em caso de erro
      db = createClient({ url: 'file:local.db' });
    }
  }
  return db;
};

// Exportar função getter ao invés da instância direta
export const getDb = () => getDatabase();

// Para compatibilidade com código existente
export { getDb as db };

// Tipo para facilitar o uso
export type Database = ReturnType<typeof createClient>; 