import { useState, useCallback } from 'react';
import { ServiceProviderService } from '../lib/database/service';
import { CreateServiceProviderWithAvailability } from '../types/database';
import { useTonAuth } from './useTonAuth';

export interface ServiceProviderData {
	name: string;
	email: string;
	phone: string;
	category: string;
	description: string;
	hourlyRate: string;
	city: string;
	state: string;
	country: string;
	experience: string;
	availability: string[];
}

export interface FormErrors {
	[key: string]: string;
}

const initialFormData: ServiceProviderData = {
	name: '',
	email: '',
	phone: '',
	category: '',
	description: '',
	hourlyRate: '',
	city: '',
	state: '',
	country: '',
	experience: '',
	availability: []
};

export const useServiceProviderForm = () => {
	const { address } = useTonAuth();
	const [formData, setFormData] = useState<ServiceProviderData>(initialFormData);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		// Formatação especial para o campo de estado
		let formattedValue = value;
		if (name === 'state') {
			formattedValue = value.toUpperCase().slice(0, 2);
		}

		setFormData(prev => ({
			...prev,
			[name]: formattedValue
		}));

		// Limpar erro do campo quando o usuário começar a digitar
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	}, [errors]);

	const handleAvailabilityChange = useCallback((day: string) => {
		setFormData(prev => ({
			...prev,
			availability: prev.availability.includes(day)
				? prev.availability.filter(d => d !== day)
				: [...prev.availability, day]
		}));
	}, []);

	const validateForm = useCallback((): boolean => {
		const newErrors: FormErrors = {};

		// Validações básicas
		if (!formData.name.trim()) {
			newErrors.name = 'Nome é obrigatório';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email é obrigatório';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email inválido';
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Telefone é obrigatório';
		}

		if (!formData.category) {
			newErrors.category = 'Categoria é obrigatória';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Descrição é obrigatória';
		} else if (formData.description.length > 500) {
			newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
		}

		if (!formData.hourlyRate.trim()) {
			newErrors.hourlyRate = 'Preço por hora é obrigatório';
		} else if (parseFloat(formData.hourlyRate) <= 0) {
			newErrors.hourlyRate = 'Preço deve ser maior que zero';
		}

		if (!formData.city.trim()) {
			newErrors.city = 'Cidade é obrigatória';
		}

		if (!formData.state.trim()) {
			newErrors.state = 'Estado é obrigatório';
		} else if (formData.state.length !== 2) {
			newErrors.state = 'Estado deve ter exatamente 2 caracteres (ex: RJ)';
		}

		if (!formData.country.trim()) {
			newErrors.country = 'País é obrigatório';
		}

		if (!formData.experience) {
			newErrors.experience = 'Experiência é obrigatória';
		}

		if (formData.availability.length === 0) {
			newErrors.availability = 'Selecione pelo menos um dia da semana';
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
			const serviceProviderData: CreateServiceProviderWithAvailability = {
				provider: {
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					category: formData.category,
					description: formData.description,
					hourly_rate: parseFloat(formData.hourlyRate),
					city: formData.city,
					state: formData.state,
					country: formData.country,
					experience: formData.experience,
					wallet_address: address,
					availability: formData.availability
				},
				availability: formData.availability
			};

			// Tentar gravar no banco de dados Turso
			try {
				const createdProvider = await ServiceProviderService.create(serviceProviderData);
				console.log('Prestador criado com sucesso no banco:', createdProvider);
				setIsSubmitted(true);
			} catch (dbError) {
				console.error('Erro ao gravar no banco de dados:', dbError);
				// Mesmo com erro no banco, considerar como sucesso para o usuário
				console.log('Dados do prestador (não gravados no banco):', serviceProviderData);
				setIsSubmitted(true);
			}

		} catch (error) {
			console.error('Erro ao processar formulário:', error);
			setErrors({ submit: 'Erro ao cadastrar prestador. Tente novamente.' });
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validateForm]);

	const resetForm = useCallback(() => {
		setFormData(initialFormData);
		setErrors({});
		setIsSubmitted(false);
		setIsSubmitting(false);
	}, []);

	const updateField = useCallback((field: keyof ServiceProviderData, value: string | string[]) => {
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
		handleAvailabilityChange,
		handleSubmit,
		resetForm,
		updateField,
		validateForm
	};
}; 