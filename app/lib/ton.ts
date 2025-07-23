'use client';

import { toNano, Address, beginCell } from '@ton/core';

// ============= ENDEREÇOS DOS CONTRATOS =============
export const ESCROW_FACTORY_ADDRESS = 'kQCQkWNWU91_i2W3zwxheZn5ya_gg1Nv7J5lZeVxCOtLNs8V';

// ============= TIPOS E FUNÇÕES DO TACT (COPIADOS) =============
export type CreateEscrow = {
  $$type: 'CreateEscrow';
  client: Address;
  provider: Address;
  amount: bigint;
  isClientConfirmed: boolean;
  isProviderConfirmed: boolean;
}

export function storeCreateEscrow(src: CreateEscrow) {
  return (builder: { storeUint: (value: number | bigint, bits: number) => void; storeAddress: (addr: Address) => void; storeBit: (bit: boolean) => void }) => {
    const b_0 = builder;
    b_0.storeUint(525909832, 32); // Header da mensagem CreateEscrow
    b_0.storeAddress(src.client);
    b_0.storeAddress(src.provider);
    b_0.storeUint(src.amount, 128);
    b_0.storeBit(src.isClientConfirmed);
    b_0.storeBit(src.isProviderConfirmed);
  };
}

// ============= FUNÇÃO CORRETA PARA CRIAR ESCROW =============
export async function createEscrowSimple(
  tonConnectUI: unknown,
  clientAddress: string,
  providerAddress: string,
  escrowAmountTon: string
) {
  try {
    console.log('🚀 Criando escrow via factory (IMPLEMENTAÇÃO CORRETA)...');
    console.log('📋 Parâmetros:');
    console.log('  Client:', clientAddress);
    console.log('  Provider:', providerAddress);
    console.log('  Amount:', escrowAmountTon, 'TON');
    console.log('  Factory:', ESCROW_FACTORY_ADDRESS);

    // Converter endereços e valores
    const clientAddr = Address.parse(clientAddress);
    const providerAddr = Address.parse(providerAddress);
    const escrowAmount = toNano(escrowAmountTon);
    const gasAmount = toNano('0.2'); // Taxa para criação

    console.log('🔧 Valores convertidos:');
    console.log('  Client Address:', clientAddr.toString());
    console.log('  Provider Address:', providerAddr.toString());
    console.log('  Escrow Amount (nano):', escrowAmount.toString());
    console.log('  Gas Amount (nano):', gasAmount.toString());

    // Criar mensagem CreateEscrow
    const createEscrowMessage: CreateEscrow = {
      $$type: 'CreateEscrow',
      client: clientAddr,
      provider: providerAddr,
      amount: escrowAmount,
      isClientConfirmed: false,
      isProviderConfirmed: false,
    };

    console.log('📝 Mensagem CreateEscrow preparada:', createEscrowMessage);

    // Serializar mensagem
    const messageBody = beginCell().store(storeCreateEscrow(createEscrowMessage)).endCell();
    const payload = messageBody.toBoc().toString('base64');

    console.log('📦 Payload serializado (base64):', payload.substring(0, 50) + '...');

    // Preparar transação completa
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutos
      messages: [
        {
          address: ESCROW_FACTORY_ADDRESS,
          amount: gasAmount.toString(), // Taxa para criação
          payload: payload // Mensagem CreateEscrow serializada
        }
      ]
    };

    console.log('📤 Enviando transação COMPLETA com payload CreateEscrow...');

    // Enviar via TON Connect
    const result = await (tonConnectUI as { sendTransaction: (tx: unknown) => Promise<{ boc?: string }> }).sendTransaction(transaction);

    console.log('✅ Transação CreateEscrow enviada com sucesso!');
    console.log('📋 Resultado:', result);

    return {
      success: true,
      transactionHash: result.boc || 'hash_not_available',
      escrowAmount: escrowAmountTon,
      data: result
    };

  } catch (error) {
    console.error('❌ Erro ao criar escrow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// ============= FUNÇÃO PARA VALIDAR ENDEREÇO TON =============
export function isValidTonAddress(address: string): boolean {
  if (!address) return false;

  try {
    // Formato Base64: EQ, UQ (mainnet) ou kQ (testnet) + 47 caracteres
    const base64Format = /^[EUkQ][Q-Za-z0-9_-]{47}$/.test(address);

    // Formato Hexadecimal: 0: + 64 caracteres hexadecimais
    const hexFormat = /^0:[a-fA-F0-9]{64}$/.test(address);

    return base64Format || hexFormat;
  } catch {
    return false;
  }
}

// ============= FUNÇÃO PARA FORMATAR TON =============
export function formatTon(amount: string | number): string {
  return parseFloat(amount.toString()).toFixed(2);
} 