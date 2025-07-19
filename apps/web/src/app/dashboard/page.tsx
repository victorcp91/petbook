'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atendimentos Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">12</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">3</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Concluídos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">9</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">R$ 45,00</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
