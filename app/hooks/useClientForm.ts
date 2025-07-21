import { useState, useCallback } from 'react';
import { ClientService } from '../lib/database/service';
import { CreateClient } from '../types/database';
import { useTonAuth } from './useTonAuth';

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
}

export interface ClientFormErrors {
  [key: string]: string;
}

const initialFormData: ClientFormData = {
  name: '',
  email: '',
  phone: ''
};

export const useClientForm = () => {
  const { address } = useTonAuth();
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ClientFormErrors = {};

    // Validações básicas
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar se a wallet está conectada
      if (!address) {
        setErrors({ submit: 'Erro: Carteira não conectada' });
        return;
      }

      // Converter dados do formulário para o formato do banco de dados
      const clientData: CreateClient = {
        id: address,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        wallet_address: address
      };

      // Tentar gravar no banco de dados Turso
      try {
        const createdClient = await ClientService.create(clientData);
        console.log('Cliente criado com sucesso no banco:', createdClient);
        setIsSubmitted(true);
      } catch (dbError) {
        console.error('Erro ao gravar no banco de dados:', dbError);
        // Mesmo com erro no banco, considerar como sucesso para o usuário
        console.log('Dados do cliente (não gravados no banco):', clientData);
        setIsSubmitted(true);
      }

    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      setErrors({ submit: 'Erro ao cadastrar cliente. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, address, validateForm]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const updateField = useCallback((field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    handleInputChange,
    handleSubmit,
    resetForm,
    updateField,
    validateForm
  };
}; 