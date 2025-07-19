'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Get the current session to check if user is authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError('Erro ao verificar sessão');
          setStatus('error');
          return;
        }

        if (!session?.user) {
          setError('Usuário não autenticado');
          setStatus('error');
          return;
        }

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          // First, get or create the shop to get its ID
          let shopId = null;

          // Check if shop exists for this user
          const { data: existingShop, error: shopCheckError } = await supabase
            .from('shops')
            .select('id')
            .eq('email', session.user.email)
            .single();

          if (shopCheckError && shopCheckError.code === 'PGRST116') {
            // Shop doesn't exist, create it
            // Try to get shop data from temp_shop_data table
            const { data: tempShopData, error: tempShopError } = await supabase
              .from('temp_shop_data')
              .select('shop_data')
              .eq('email', session.user.email)
              .is('used_at', null)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            let shopName = `${session.user.user_metadata?.name || 'Usuário'} - Pet Shop`;
            let shopAddress = null;
            let shopPhone = null;

            if (tempShopData && !tempShopError) {
              try {
                const shopData = tempShopData.shop_data;
                shopName = shopData.name;
                shopAddress = shopData.address;
                shopPhone = shopData.phone;

                // Mark the temp data as used
                await supabase
                  .from('temp_shop_data')
                  .update({ used_at: new Date().toISOString() })
                  .eq('email', session.user.email)
                  .is('used_at', null);
              } catch (error) {
                console.error('Error parsing shop data:', error);
              }
            }

            const { data: newShop, error: createShopError } = await supabase
              .from('shops')
              .insert({
                name: shopName,
                address: shopAddress,
                phone: shopPhone,
                email: session.user.email,
                settings: {
                  setup_completed: false,
                  needs_onboarding: true,
                  created_via_signup: true,
                },
                status: 'active',
              })
              .select('id')
              .single();

            if (createShopError) {
              console.error('Error creating shop:', createShopError);
              setError('Erro ao criar pet shop');
              setStatus('error');
              return;
            }

            shopId = newShop.id;
          } else {
            shopId = existingShop?.id || null;
          }

          const { error: createProfileError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || 'Usuário',
              role: session.user.user_metadata?.role || 'owner',
              shop_id: shopId,
              is_active: true,
            });

          if (createProfileError) {
            console.error('Error creating user profile:', createProfileError);
            setError('Erro ao criar perfil do usuário');
            setStatus('error');
            return;
          }
        }

        setStatus('success');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error in confirmation:', error);
        setError('Erro ao processar confirmação');
        setStatus('error');
      }
    };

    handleConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PetBook</h1>
          <p className="text-gray-600">Sistema de gestão para pet shops</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Mail className="h-6 w-6" />
              Configurando sua Conta
            </CardTitle>
            <CardDescription className="text-center">
              Finalizando a configuração do seu pet shop...
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'loading' && (
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600">
                  Configurando sua conta e pet shop...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                <p className="text-green-600 font-medium">
                  Conta configurada com sucesso!
                </p>
                <p className="text-gray-600">
                  Redirecionando para o dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Não foi possível configurar sua conta.
                  </p>
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    className="w-full"
                  >
                    Ir para Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
