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
    isBuildTime,
    url: dbUrl?.substring(0, 20) + '...' // Mostrar apenas parte da URL por segurança
  });
}

// Verificar se as variáveis de ambiente estão configuradas
if (!dbUrl) {
  console.error('❌ NEXT_PUBLIC_DATABASE_URL não está configurada');

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production environment');
  }
}

if (!authToken && dbUrl?.startsWith('libsql:')) {
  console.warn('⚠️  NEXT_PUBLIC_DATABASE_AUTH_TOKEN não está configurada para URL libsql://');
}

// Configuração padrão
const getDbConfig = () => {
  // Em produção, as variáveis devem estar configuradas
  if (process.env.NODE_ENV === 'production' && !dbUrl) {
    throw new Error('NEXT_PUBLIC_DATABASE_URL is required in production');
  }

  // Para desenvolvimento sem URL configurada, usar um banco in-memory
  if (!dbUrl) {
    console.warn('⚠️  Usando banco de dados em memória (apenas desenvolvimento)');
    return { url: ':memory:' };
  }

  // Validar se a URL tem um esquema suportado
  const supportedSchemes = ['libsql:', 'wss:', 'ws:', 'https:', 'http:'];
  const hasValidScheme = supportedSchemes.some(scheme => dbUrl.startsWith(scheme));

  if (!hasValidScheme) {
    console.error('❌ URL do banco deve usar um dos esquemas suportados: libsql://, wss://, ws://, https://, http://');
    throw new Error(`Unsupported URL scheme: ${dbUrl}. Supported schemes: ${supportedSchemes.join(', ')}`);
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
      console.log('🔗 Conectando ao banco de dados...');
      db = createClient(config);
      console.log('✅ Conexão com banco estabelecida');
    } catch (error) {
      console.error('❌ Erro ao conectar com o banco de dados:', error);
      throw error; // Re-throw o erro ao invés de usar fallback problemático
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