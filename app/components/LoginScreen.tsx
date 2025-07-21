import React from 'react';
import Image from 'next/image';
import { useTonAuth } from '../hooks/useTonAuth';

interface LoginScreenProps {
	onLogin?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
	const { connect, isLoading, error, clearError } = useTonAuth();

	const handleConnect = async () => {
		try {
			await connect();
			console.log('Conectado com sucesso');
			onLogin?.();
		} catch (err) {
			console.error('Erro ao conectar:', err);
		}
	};

	return (
		<div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Container principal */}
				<div className="text-center space-y-4">
					{/* Logo */}
					<div className="flex justify-center mb-4">
						<Image
							src="/ChatPay-Go-1.png"
							alt="ChatPay Logo"
							width={200}
							height={200}
							priority
							className="w-auto h-auto max-w-[200px] max-h-[200px] object-contain"
						/>
					</div>

					{/* Título e descrição */}
					<div className="space-y-4">
						<h1 className="text-3xl font-bold text-navy">
							Bem-vindo ao ChatPay
						</h1>
						<p className="text-lg text-navy opacity-80">
							Conexão com carteira TON para acessar a plataforma
						</p>
					</div>

					{/* Card com botão de login */}
					<div className="card space-y-6">
						<div className="text-center space-y-3">
							<h2 className="text-xl font-semibold text-navy">
								Conectar Carteira
							</h2>
							<p className="text-sm text-gray-600">
								Processo simples, use sua carteira TON para fazer login de forma segura
							</p>
						</div>

						{/* Mostrar erro se houver */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<div className="flex items-center space-x-2">
									<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p className="text-sm text-red-600">{error}</p>
								</div>
								<button
									onClick={clearError}
									className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
								>
									Limpar erro
								</button>
							</div>
						)}

						{/* Botão de conexão */}
						<button
							onClick={handleConnect}
							disabled={isLoading}
							className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Conectando...</span>
								</>
							) : (
								<>
									<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<span>Conectar Carteira TON</span>
								</>
							)}
						</button>

						{/* Informações de segurança */}
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center space-x-2 mb-2">
								<svg
									className="w-5 h-5 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span className="text-sm font-medium text-gray-700">
									Conexão Segura
								</span>
							</div>
							<p className="text-xs text-gray-500">
								Suas chaves privadas nunca deixam sua carteira
							</p>
						</div>
					</div>

					{/* Recursos da plataforma */}
					<div className="grid grid-cols-2 gap-4 mt-8">
						<div className="bg-white/60 rounded-lg p-4 text-center">
							<div className="w-8 h-8 bg-turquoise rounded-full flex items-center justify-center mx-auto mb-2">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
							</div>
							<h3 className="text-sm font-semibold text-navy">
								Pagamentos Rápidos
							</h3>
							<p className="text-xs text-gray-600 mt-1">
								Transações instantâneas via TON
							</p>
						</div>

						<div className="bg-white/60 rounded-lg p-4 text-center">
							<div className="w-8 h-8 bg-purple rounded-full flex items-center justify-center mx-auto mb-2">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-sm font-semibold text-navy">
								Rede de Serviços
							</h3>
							<p className="text-xs text-gray-600 mt-1">
								Conecte-se com um profissional qualificado
							</p>
						</div>
					</div>

					{/* Informações adicionais */}
					<div className="text-center space-y-2">
						<p className="text-xs text-gray-500">
							Ao conectar sua carteira, você concorda com nossos
						</p>
						<div className="flex justify-center space-x-4 text-xs">
							<a href="#" className="text-purple underline">
								Termos de Uso
							</a>
							<a href="#" className="text-blue underline">
								Política de Privacidade
							</a>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
};

export default LoginScreen; 