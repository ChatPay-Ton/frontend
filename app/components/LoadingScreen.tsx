'use client';

import React from 'react';
import Image from 'next/image';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/ChatPay-Go-1.png"
            alt="ChatPay Logo"
            width={150}
            height={150}
            priority
            className="w-auto h-auto max-w-[150px] max-h-[150px] object-contain"
          />
        </div>

        {/* Loading indicator */}
        <div className="space-y-4">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-navy">
              Verificando seu perfil...
            </h2>
            <p className="text-sm text-gray-600">
              Identificando seu tipo de usuário
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 