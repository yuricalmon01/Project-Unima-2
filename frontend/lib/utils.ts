import { RiskLevel } from '@/types';

export function calcularRisco(symptoms: string[] = []): RiskLevel {
  const sintomasGraves = ['falta de ar', 'dor no peito', 'inconsciência'];
  const sintomasModerados = ['febre', 'tosse', 'dor de cabeça'];

  const temGrave = symptoms.some((s) =>
    sintomasGraves.includes(s.toLowerCase())
  );
  const temModerado = symptoms.some((s) =>
    sintomasModerados.includes(s.toLowerCase())
  );

  if (temGrave) return 'Alta';
  if (temModerado) return 'Média';
  return 'Baixa';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Alta':
      return 'bg-red-100 border-red-200';
    case 'Média':
      return 'bg-yellow-100 border-yellow-200';
    case 'Baixa':
      return 'bg-green-100 border-green-200';
    default:
      return 'bg-gray-100 border-gray-200';
  }
}

export function getRiskTextColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Alta':
      return '!text-red-900 text-red-900';
    case 'Média':
      return '!text-yellow-900 text-yellow-900';
    case 'Baixa':
      return '!text-green-900 text-green-900';
    default:
      return '!text-gray-900 text-gray-900';
  }
}

