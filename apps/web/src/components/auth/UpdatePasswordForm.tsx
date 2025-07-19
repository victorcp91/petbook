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
import { Loader2, Lock, XCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

interface UpdatePasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function UpdatePasswordForm({
  onSuccess,
  onError,
}: UpdatePasswordFormProps) {
  const router = useRouter();
  const { updatePassword, loading, error } = useAuthContext();

  const [formData, setFormData] = useState<UpdatePasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    }

    return errors;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join(', ');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
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
      const { error: updateError } = await updatePassword(formData.password);

      if (updateError) {
        onError?.(updateError.message);
        return;
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : 'Erro ao atualizar senha'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof UpdatePasswordFormData,
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
            Senha Atualizada
          </CardTitle>
          <CardDescription className="text-center">
            Sua senha foi alterada com sucesso
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Sua senha foi atualizada com sucesso. Você pode fazer login com
              sua nova senha.
            </AlertDescription>
          </Alert>

          <Button
            type="button"
            className="w-full"
            onClick={() => router.push('/auth/signin')}
          >
            Ir para o Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Nova Senha
        </CardTitle>
        <CardDescription className="text-center">
          Digite sua nova senha
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="Digite sua nova senha"
                className={
                  validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-500">
                {validationErrors.password}
              </p>
            )}
            <p className="text-xs text-gray-500">
              A senha deve ter pelo menos 8 caracteres, incluindo maiúscula,
              minúscula, número e caractere especial.
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={e =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                placeholder="Confirme sua nova senha"
                className={
                  validationErrors.confirmPassword
                    ? 'border-red-500 pr-10'
                    : 'pr-10'
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {validationErrors.confirmPassword}
              </p>
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
                Atualizando...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Atualizar Senha
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
