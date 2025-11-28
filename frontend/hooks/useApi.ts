'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = { immediate: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(url);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      let errorMessage = 'Erro ao carregar dados';
      
      if (err.response) {
        // Erro com resposta do servidor
        if (err.response.status === 403) {
          errorMessage = err.response?.data?.error || 'Acesso negado. Verificando autenticação...';
        } else if (err.response.status === 401) {
          errorMessage = err.response?.data?.error || 'Não autorizado. Redirecionando para login...';
        } else {
          errorMessage = err.response?.data?.error || `Erro ${err.response.status}: ${err.message}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options.immediate]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}

