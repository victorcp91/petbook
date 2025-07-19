'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  userRoles,
  validateCPF,
  formatCPF,
  validateBrazilianPhone,
  formatBrazilianPhone,
} from '@/lib/auth-config';
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
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Building2,
  Mail,
} from 'lucide-react';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  cpf: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
}

interface SignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export function SignUpForm({
  onSuccess,
  onError,
  redirectTo = '/dashboard',
}: SignUpFormProps) {
  const router = useRouter();
  const { signUp, loading, error } = useAuthContext();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    shopName: '',
    shopAddress: '',
    shopPhone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push(
        'Senha deve conter pelo menos um caractere especial (!@#$%^&*)'
      );
    }
    return errors;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Owner validation
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join(', ');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }

    if (formData.phone && !validateBrazilianPhone(formData.phone)) {
      errors.phone = 'Telefone inválido';
    }
    if (formData.cpf && !validateCPF(formData.cpf)) {
      errors.cpf = 'CPF inválido';
    }

    // Shop validation
    if (!formData.shopName.trim()) {
      errors.shopName = 'Nome do pet shop é obrigatório';
    }
    if (!formData.shopAddress.trim()) {
      errors.shopAddress = 'Endereço do pet shop é obrigatório';
    }
    if (!formData.shopPhone.trim()) {
      errors.shopPhone = 'Telefone do pet shop é obrigatório';
    } else if (!validateBrazilianPhone(formData.shopPhone)) {
      errors.shopPhone = 'Telefone do pet shop inválido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the owner account with shop data
      const { user, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name.trim(),
          role: userRoles.OWNER,
          shop_data: {
            name: formData.shopName.trim(),
            address: formData.shopAddress.trim(),
            phone: formData.shopPhone.trim(),
            owner_email: formData.email,
          },
        }
      );

      if (signUpError) {
        onError?.(signUpError.message);
        return;
      }

      if (user) {
        // User was created and confirmed immediately (rare case)
        onSuccess?.();
        router.push(redirectTo);
      } else {
        // User needs email confirmation
        setShowConfirmation(true);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    handleInputChange('cpf', formatted);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatBrazilianPhone(value);
    handleInputChange('phone', formatted);
  };

  const handleShopPhoneChange = (value: string) => {
    const formatted = formatBrazilianPhone(value);
    handleInputChange('shopPhone', formatted);
  };

  // Show confirmation message
  if (showConfirmation) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Mail className="h-6 w-6" />
            Verifique seu Email
          </CardTitle>
          <CardDescription className="text-center">
            Enviamos um link de confirmação para seu email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium mb-2">
                Email enviado para: {formData.email}
              </p>
              <p className="text-blue-700 text-sm">
                Clique no link enviado para confirmar sua conta e acessar o
                PetBook.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Não recebeu o email? Verifique sua caixa de spam ou:
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth/signin')}
                  className="flex-1"
                >
                  Ir para Login
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6" />
          Criar Pet Shop
        </CardTitle>
        <CardDescription className="text-center">
          Crie sua conta de proprietário e configure seu pet shop no PetBook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Proprietário
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Digite seu nome completo"
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder="Digite sua senha"
                    className={
                      validationErrors.password
                        ? 'border-red-500 pr-10'
                        : 'pr-10'
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    placeholder="Confirme sua senha"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (opcional)</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={e => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={validationErrors.cpf ? 'border-red-500' : ''}
                />
                {validationErrors.cpf && (
                  <p className="text-sm text-red-500">{validationErrors.cpf}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Pet Shop
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Nome do Pet Shop *</Label>
                <Input
                  id="shopName"
                  type="text"
                  value={formData.shopName}
                  onChange={e => handleInputChange('shopName', e.target.value)}
                  placeholder="Digite o nome do seu pet shop"
                  className={validationErrors.shopName ? 'border-red-500' : ''}
                />
                {validationErrors.shopName && (
                  <p className="text-sm text-red-500">
                    {validationErrors.shopName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopAddress">Endereço do Pet Shop *</Label>
                <Input
                  id="shopAddress"
                  type="text"
                  value={formData.shopAddress}
                  onChange={e =>
                    handleInputChange('shopAddress', e.target.value)
                  }
                  placeholder="Digite o endereço completo do pet shop"
                  className={
                    validationErrors.shopAddress ? 'border-red-500' : ''
                  }
                />
                {validationErrors.shopAddress && (
                  <p className="text-sm text-red-500">
                    {validationErrors.shopAddress}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopPhone">Telefone do Pet Shop *</Label>
                <Input
                  id="shopPhone"
                  type="tel"
                  value={formData.shopPhone}
                  onChange={e => handleShopPhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={validationErrors.shopPhone ? 'border-red-500' : ''}
                />
                {validationErrors.shopPhone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.shopPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando pet shop...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Criar Pet Shop
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
