import React from 'react';

interface SuccessMessageProps {
	onReset: () => void;
	providerName: string;
	userType?: 'provider' | 'client';
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset, providerName, userType = 'provider' }) => {
	return (
		<div className="min-h-screen bg-light-blue p-4 flex items-center justify-center">
			<div className="max-w-md mx-auto w-full">
				{/* Card de sucesso */}
				<div className="card-gradient text-center">
					{/* Ícone de sucesso */}
					<div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h1 className="text-2xl font-bold mb-2">
						🎉 Cadastro Realizado!
					</h1>

					<p className="text-lg opacity-90 mb-4">
						Parabéns, <strong>{providerName}</strong>!
					</p>

					<p className="opacity-80 mb-6">
						{userType === 'provider'
							? 'Seu cadastro foi realizado com sucesso. Agora você pode começar a receber solicitações de clientes.'
							: 'Seu cadastro foi realizado com sucesso. Agora você pode começar a contratar serviços.'
						}
					</p>

					<div className="bg-white/10 rounded-lg p-4 mb-6">
						<h3 className="font-semibold mb-2">Próximos passos:</h3>
						<ul className="text-sm opacity-90 space-y-1 text-left">
							<li>✅ Perfil criado com sucesso</li>
							<li>📧 Email de confirmação enviado</li>
							<li>🔍 Seu perfil está sendo analisado</li>
							<li>📱 Você receberá notificações no Telegram</li>
						</ul>
					</div>

					<div className="space-y-3">
						<button
							onClick={onReset}
							className="w-full bg-white text-purple font-semibold py-3 px-6 rounded-lg transition-all hover:bg-gray-50"
						>
							{userType === 'provider' ? 'Cadastrar outro Profissional' : 'Cadastrar outro Cliente'}
						</button>

						<button
							onClick={() => window.location.href = '/dashboard'}
							className="w-full bg-turquoise text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-opacity-90"
						>
							Ir para Dashboard
						</button>
					</div>
				</div>

				{/* Informações adicionais */}
				<div className="card mt-4">
					<h3 className="font-semibold text-navy mb-3">
						📋 Informações Importantes
					</h3>

					<div className="space-y-3 text-sm text-gray-600">
						<div className="flex items-start space-x-3">
							<span className="text-turquoise">💰</span>
							<div>
								<strong>Pagamentos:</strong> Todos os pagamentos são processados via TON Wallet de forma segura e transparente.
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<span className="text-blue">📞</span>
							<div>
								<strong>Suporte:</strong> Nossa equipe está disponível 24/7 através do chat do Telegram.
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<span className="text-purple">⭐</span>
							<div>
								<strong>Avaliações:</strong> Mantenha um bom histórico de avaliações para receber mais clientes.
							</div>
						</div>
					</div>
				</div>

				{/* Links úteis */}
				<div className="mt-6 text-center space-y-2">
					<p className="text-sm text-gray-500">
						Precisa de ajuda? Acesse nossos recursos:
					</p>
					<div className="flex justify-center space-x-4 text-sm">
						<a href="#" className="text-purple underline">
							Central de Ajuda
						</a>
						<a href="#" className="text-blue underline">
							Guia do Profissional
						</a>
						<a href="#" className="text-turquoise underline">
							Comunidade
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessMessage; 