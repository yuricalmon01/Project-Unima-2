'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Paciente } from '@/types';
import PacienteCard from './PacienteCard';
import Loading from '@/components/UI/Loading';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Input from '@/components/UI/Input';

export default function PacientesList() {
  const router = useRouter();
  const { data: pacientes, loading, refetch } = useApi<Paciente[]>(
    '/api/pacientes',
    { immediate: true }
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Debug: log dos pacientes recebidos
  if (pacientes) {
    console.log('[PacientesList] Pacientes recebidos:', pacientes.map(p => ({
      id: p.id,
      nome: p.nome,
      risk_score: p.risk_score,
      symptoms: p.symptoms
    })));
  }

  const filteredPacientes =
    pacientes?.filter(
      (p) =>
        (p.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.sobrenome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ).filter((p) => p.nome && p.sobrenome && p.email) || [];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/pacientes/novo')}
        >
          Novo Paciente
        </Button>
      </div>

      {filteredPacientes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? 'Nenhum paciente encontrado com essa busca.'
              : 'Nenhum paciente cadastrado ainda.'}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => router.push('/pacientes/novo')}
              className="mt-4"
            >
              Cadastrar Primeiro Paciente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <PacienteCard key={paciente.id} paciente={paciente} />
          ))}
        </div>
      )}
    </div>
  );
}

