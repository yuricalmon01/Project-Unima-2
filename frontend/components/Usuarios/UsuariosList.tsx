'use client';

import { useApi } from '@/hooks/useApi';
import { User } from '@/types';
import Loading from '@/components/UI/Loading';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';
import { Mail, User as UserIcon } from 'lucide-react';

export default function UsuariosList() {
  const router = useRouter();
  const { data: usuarios, loading } = useApi<User[]>('/api/users', {
    immediate: true,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Usuários</h2>
        <Button
          variant="primary"
          onClick={() => router.push('/usuarios/novo')}
        >
          Novo Usuário
        </Button>
      </div>

      {!usuarios || usuarios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum usuário cadastrado.</p>
            <Button
              variant="primary"
              onClick={() => router.push('/usuarios/novo')}
              className="mt-4"
            >
              Cadastrar Primeiro Usuário
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {usuario.first_name} {usuario.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">@{usuario.username}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>{usuario.email}</span>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-700 capitalize">
                    {usuario.userType}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

