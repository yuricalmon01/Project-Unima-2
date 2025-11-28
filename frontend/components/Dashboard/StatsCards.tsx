'use client';

import { Users, Stethoscope, Activity, User } from 'lucide-react';
import Card from '@/components/UI/Card';
import { useApi } from '@/hooks/useApi';
import { Paciente } from '@/types';
import Loading from '@/components/UI/Loading';
import { useAuth } from '@/hooks/useAuth';

export default function StatsCards() {
  const { user, isLoading: userLoading } = useAuth();
  // Garantir que flags de loading/controle sejam booleanas
  const userLoadingBool: boolean = !!userLoading;
  const isPatient: boolean = !!user && user.userType === 'Patient';
  const shouldFetch: boolean = !userLoadingBool && !!user?.userType && !isPatient;

  const { data: pacientes, loading: loadingFlag } = useApi<Paciente[]>('/api/pacientes', {
    immediate: shouldFetch, // Não busca se for Patient ou ainda carregando
  });
  const loading: boolean = !!loadingFlag;

  // Se ainda está carregando o usuário, mostra loading
  if (userLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" />
      </div>
    );
  }

  // Se for paciente, mostra apenas informações pessoais
  if (user?.userType === 'Patient') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Meu Perfil</p>
              <p className="text-2xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </p>
            </div>
            <div className="bg-primary-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sistema Ativo</p>
              <p className="text-2xl font-bold text-gray-800">Online</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const pacientesHoje =
    pacientes?.filter((p) => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      if (Number.isNaN(date.getTime())) return false;
      return date.toDateString() === new Date().toDateString();
    }).length || 0;

  // Para Admin, Doctor, etc - mostra estatísticas completas
  const stats = [
    {
      title: 'Total de Pacientes',
      value: pacientes?.length || 0,
      icon: Stethoscope,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Pacientes Hoje',
      value: pacientesHoje,
      icon: Activity,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Sistema Ativo',
      value: 'Online',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

