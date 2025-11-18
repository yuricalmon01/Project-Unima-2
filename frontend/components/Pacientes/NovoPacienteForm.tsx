'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { NovoPacienteRequest, NovoPacienteResponse } from '@/types';
import { calcularRisco, getRiskColor, getRiskTextColor } from '@/lib/utils';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Card from '@/components/UI/Card';

const pacienteSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      { message: 'Email inválido' }
    ),
  symptoms: z.string().optional(),
});

export default function NovoPacienteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedRisk, setCalculatedRisk] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NovoPacienteRequest & { symptoms: string }>({
    resolver: zodResolver(pacienteSchema),
  });

  const symptoms = watch('symptoms');

  // Calcula risco quando symptoms mudam
  useEffect(() => {
    if (symptoms) {
      const symptomsArray = symptoms
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const risk = calcularRisco(symptomsArray);
      setCalculatedRisk(risk);
    } else {
      setCalculatedRisk(null);
    }
  }, [symptoms]);

  const onSubmit = async (data: NovoPacienteRequest & { symptoms: string }) => {
    setIsLoading(true);
    try {
      const symptomsArray = data.symptoms
        ? data.symptoms.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : [];

      const payload: NovoPacienteRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email?.trim() || undefined,
        symptoms: symptomsArray,
      };

      const response = await api.post<NovoPacienteResponse>(
        '/api/pacientes',
        payload
      );
      
      // Mostra informações de login do paciente
      const username = response.data.username || 'N/A';
      const message = `Paciente cadastrado com sucesso!\n\nUsername: ${username}\nSenha: 123456`;
      toast.success(message, {
        duration: 6000,
      });
      
      router.push('/pacientes');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Erro ao cadastrar paciente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const symptomsArray = symptoms
    ? symptoms.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
    : [];
  const risk = calcularRisco(symptomsArray);

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Digite o nome"
            {...register('firstName')}
            error={errors.firstName?.message}
          />

          <Input
            label="Sobrenome"
            type="text"
            placeholder="Digite o sobrenome"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Email (opcional)"
          type="email"
          placeholder="Digite o email do paciente"
          {...register('email')}
          error={errors.email?.message}
        />

        <div>
          <Input
            label="Sintomas (separados por vírgula)"
            type="text"
            placeholder="Ex: febre, tosse, dor de cabeça"
            {...register('symptoms')}
            error={errors.symptoms?.message}
          />
          <p className="text-sm text-gray-500 mt-1">
            Exemplos: febre, tosse, dor de cabeça, falta de ar, dor no peito
          </p>
        </div>

        {risk && (
          <div
            className={`p-4 rounded-lg border-2 ${getRiskColor(
              risk as any
            )} transition-all`}
            style={{
              color: risk === 'Alta' ? '#7f1d1d' : 
                     risk === 'Média' ? '#713f12' : 
                     risk === 'Baixa' ? '#14532d' : '#1f2937'
            }}
          >
            <p 
              className="font-semibold mb-2"
              style={{
                color: risk === 'Alta' ? '#7f1d1d' : 
                       risk === 'Média' ? '#713f12' : 
                       risk === 'Baixa' ? '#14532d' : '#1f2937'
              }}
            >
              Nível de Risco Calculado:
            </p>
            <p 
              className="text-lg font-bold"
              style={{
                color: risk === 'Alta' ? '#7f1d1d' : 
                       risk === 'Média' ? '#713f12' : 
                       risk === 'Baixa' ? '#14532d' : '#1f2937'
              }}
            >
              {risk}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
          >
            Cadastrar Paciente
          </Button>
        </div>
      </form>
    </Card>
  );
}

