'use client';

import { useState, useEffect } from 'react';
import { Paciente } from '@/types';
import { pacientesAPI } from '@/lib/apiService';
import PacienteCard from './PacienteCard';
import Loading from '@/components/UI/Loading';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Input from '@/components/UI/Input';
import toast from 'react-hot-toast';

export default function PacientesList() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const data = await pacientesAPI.getAll();
      setPacientes(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes =
    pacientes?.filter(
      (p) =>
        (p.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ) || [];

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

