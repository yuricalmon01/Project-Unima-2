'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { NovoUsuarioRequest } from '@/types';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Card from '@/components/UI/Card';

const usuarioSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  first_name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  user_type_id: z.number().min(1, 'Tipo de usuário é obrigatório'),
  active: z.boolean().default(true),
});

export default function NovoUsuarioForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovoUsuarioRequest>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      active: true,
      user_type_id: 5, // Patient por padrão
    },
  });

  const onSubmit = async (data: NovoUsuarioRequest) => {
    setIsLoading(true);
    try {
      // Normaliza o username (remove espaços e caracteres especiais como @)
      const normalizedUsername = data.username.trim().replace(/^@+/, ''); // Remove @ do início
      const normalizedData = {
        ...data,
        username: normalizedUsername,
      };
      await api.post('/api/users', normalizedData);
      toast.success('Usuário cadastrado com sucesso!');
      router.push('/usuarios');
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      
      // Melhora o tratamento de erro para garantir que sempre mostre uma mensagem
      let errorMessage = "Erro ao cadastrar usuário";
      
      if (error.response) {
        // Erro com resposta do servidor (401, 400, 500, etc)
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Erro de rede (sem resposta do servidor)
        errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
      } else if (error.message) {
        // Outro tipo de erro
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Username"
            type="text"
            placeholder="Digite o username"
            {...register('username')}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Digite o email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <Input
          label="Senha"
          type="password"
          placeholder="Digite a senha"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Digite o nome"
            {...register('first_name')}
            error={errors.first_name?.message}
          />

          <Input
            label="Sobrenome"
            type="text"
            placeholder="Digite o sobrenome"
            {...register('last_name')}
            error={errors.last_name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Usuário
          </label>
          <select
            {...register('user_type_id', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={5}>Paciente</option>
            <option value={2}>Médico</option>
            <option value={1}>Admin</option>
          </select>
          {errors.user_type_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.user_type_id.message}
            </p>
          )}
        </div>

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
            Cadastrar Usuário
          </Button>
        </div>
      </form>
    </Card>
  );
}

