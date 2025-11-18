import { Paciente } from '@/types';
import { formatDate, getRiskColor, getRiskTextColor } from '@/lib/utils';
import Card from '@/components/UI/Card';
import { Mail, Calendar, AlertCircle } from 'lucide-react';

export default function PacienteCard({ paciente }: { paciente: Paciente }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {paciente.nome} {paciente.sobrenome}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              <span>{paciente.email}</span>
            </div>
            {paciente.symptoms && paciente.symptoms.length > 0 && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">Sintomas: </span>
                <span>{paciente.symptoms.join(', ')}</span>
              </div>
            )}
            {paciente.risk_score ? (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border ${getRiskColor(
                  paciente.risk_score as any
                )}`}
                style={{
                  color: paciente.risk_score === 'Alta' ? '#7f1d1d' : 
                         paciente.risk_score === 'Média' ? '#713f12' : 
                         paciente.risk_score === 'Baixa' ? '#14532d' : '#1f2937'
                }}
              >
                <AlertCircle 
                  className="w-4 h-4" 
                  style={{
                    color: paciente.risk_score === 'Alta' ? '#7f1d1d' : 
                           paciente.risk_score === 'Média' ? '#713f12' : 
                           paciente.risk_score === 'Baixa' ? '#14532d' : '#1f2937'
                  }}
                />
                <span 
                  className="font-semibold"
                  style={{
                    color: paciente.risk_score === 'Alta' ? '#7f1d1d' : 
                           paciente.risk_score === 'Média' ? '#713f12' : 
                           paciente.risk_score === 'Baixa' ? '#14532d' : '#1f2937'
                  }}
                >
                  Risco: {paciente.risk_score}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border bg-gray-100 border-gray-200">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">
                  Risco: Não avaliado
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Cadastrado em {formatDate(paciente.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

