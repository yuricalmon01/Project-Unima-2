'use client';

import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import NovoPacienteForm from '@/components/Pacientes/NovoPacienteForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NovoPacientePage() {
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
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 w-full">
          <Header />
          <main className="p-6 mt-16">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Novo Paciente
              </h1>
              <p className="text-gray-600 mt-1">
                Cadastre um novo paciente no sistema
              </p>
            </div>
            <NovoPacienteForm />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

