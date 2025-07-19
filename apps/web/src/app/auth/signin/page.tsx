'use client';

import { Metadata } from 'next';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PetBook</h1>
          <p className="text-gray-600">Sistema de gestão para pet shops</p>
        </div>
        <SignInForm redirectTo="/dashboard" />
        <div className="text-center text-sm text-gray-500">
          <p>
            Ao fazer login, você concorda com nossos{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-800">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
