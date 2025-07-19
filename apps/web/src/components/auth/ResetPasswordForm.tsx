'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, XCircle, CheckCircle } from 'lucide-react';

interface ResetPasswordFormData {
  email: string;
}

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ResetPasswordForm({
  onSuccess,
  onError,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword, loading, error } = useAuthContext();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } = await resetPassword(formData.email);

      if (resetError) {
        onError?.(resetError.message);
        return;
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : 'Erro ao enviar email de reset'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof ResetPasswordFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Email Enviado
          </CardTitle>
          <CardDescription className="text-center">
            Verifique sua caixa de entrada
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Enviamos um link para redefinir sua senha para{' '}
              <strong>{formData.email}</strong>. Verifique sua caixa de entrada
              e spam.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button
              type="button"
              className="w-full"
              onClick={() => router.push('/auth/signin')}
            >
              Voltar para o Login
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não recebeu o email?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({ email: '' });
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tentar novamente
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Redefinir Senha
        </CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber um link de redefinição
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Link de Reset
              </>
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
