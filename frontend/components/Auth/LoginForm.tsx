"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { LoginRequest, LoginResponse, User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

const loginSchema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // Normaliza o username (remove espaços e caracteres especiais como @)
      const normalizedUsername = data.username.trim().replace(/^@+/, ""); // Remove @ do início
      const normalizedData = {
        ...data,
        username: normalizedUsername,
      };
      const response = await api.post<LoginResponse>(
        "/api/auth/login",
        normalizedData
      );

      // Mapeia a resposta da API para o formato esperado
      const apiUser = response.data.user;
      const nameParts = apiUser.name?.split(" ") || [];
      const userData: User = {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        userType: apiUser.userType || "Patient",
        name: apiUser.name,
        first_name: apiUser.first_name || nameParts[0] || "",
        last_name: apiUser.last_name || nameParts.slice(1).join(" ") || "",
      };

      login(response.data.token, userData);
      toast.success("Login realizado com sucesso!");

      // Aguarda um pouco para o estado atualizar e então redireciona
      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    } catch (error: any) {
      console.error("Erro no login:", error);
      console.error("Erro completo:", {
        response: error.response,
        request: error.request,
        message: error.message,
      });

      // Melhora o tratamento de erro para garantir que sempre mostre uma mensagem
      let errorMessage = "Erro ao fazer login";

      if (error.response) {
        // Erro com resposta do servidor (401, 400, 500, etc)
        const status = error.response.status;
        const serverError = error.response.data?.error;

        if (status === 401) {
          errorMessage =
            serverError ||
            "Credenciais inválidas. Verifique seu username e senha.";
        } else if (status === 400) {
          errorMessage =
            serverError || "Dados inválidos. Verifique os campos preenchidos.";
        } else {
          errorMessage = serverError || `Erro do servidor (${status})`;
        }
      } else if (error.request) {
        // Erro de rede (sem resposta do servidor)
        errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
      } else if (error.message) {
        // Outro tipo de erro
        errorMessage = error.message;
      }

      // Força a exibição do toast com um delay para garantir que seja renderizado
      setTimeout(() => {
        toast.error(errorMessage, {
          duration: 5000,
          style: {
            fontSize: "14px",
          },
        });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Username"
        type="text"
        placeholder="Digite seu username"
        {...register("username")}
        error={errors.username?.message}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Entrar
      </Button>

      <div className="text-sm text-gray-600 mt-4">
        <p className="font-semibold mb-2">Usuários de teste:</p>
        <ul className="space-y-1">
          <li>• admin / 123456 (Admin)</li>
          <li>• medico1 / 123456 (Doctor)</li>
          <li>• paciente1 / 123456 (Patient)</li>
        </ul>
      </div>
    </form>
  );
}
