'use client';

import { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PetBook</h1>
          <p className="text-gray-600">Sistema de gestão para pet shops</p>
        </div>
        <SignUpForm redirectTo="/dashboard" />
        <div className="text-center text-sm text-gray-500">
          <p>
            Ao criar uma conta, você concorda com nossos{' '}
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
