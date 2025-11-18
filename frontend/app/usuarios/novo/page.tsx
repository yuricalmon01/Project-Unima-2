'use client';

import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import NovoUsuarioForm from '@/components/Usuarios/NovoUsuarioForm';

export default function NovoUsuarioPage() {
  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 w-full">
          <Header />
          <main className="p-6 mt-16">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Novo Usuário</h1>
              <p className="text-gray-600 mt-1">
                Cadastre um novo usuário no sistema (Apenas Admin)
              </p>
            </div>
            <NovoUsuarioForm />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

