'use client';

import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import PacientesList from '@/components/Pacientes/PacientesList';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PacientesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.userType === 'Patient') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.userType === 'Patient') {
    return null;
  }

  return (
    <ProtectedRoute requiredRole={undefined}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 w-full">
          <Header />
          <main className="p-6 mt-16">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os pacientes do sistema
              </p>
            </div>
            <PacientesList />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

