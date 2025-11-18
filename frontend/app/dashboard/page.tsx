'use client';

import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import StatsCards from '@/components/Dashboard/StatsCards';
import Card from '@/components/UI/Card';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 w-full">
          <Header />
          <main className="p-6 mt-16">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {user?.userType === 'Patient' 
                  ? 'Suas informações pessoais'
                  : 'Visão geral do sistema de saúde'}
              </p>
            </div>
            <StatsCards />
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bem-vindo ao Sistema UNIMA Saúde
              </h2>
              <p className="text-gray-600">
                {user?.userType === 'Patient' 
                  ? 'Aqui você pode visualizar suas informações pessoais e acompanhar seu histórico no sistema.'
                  : 'Este é o painel de controle do sistema de gestão de saúde. Aqui você pode gerenciar pacientes, usuários e acompanhar as estatísticas do sistema.'}
              </p>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

