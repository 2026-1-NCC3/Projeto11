// ── Tipos alinhados com o banco de dados Maya RPG ──

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'profissional' | 'paciente';
  telefone?: string;
  avatar_url?: string;
  paciente_id?: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Prescricao {
  id: string;
  paciente_id: string;
  exercicio_id: string;
  series: number;
  repeticoes: number;
  duracao_seg?: number;
  frequencia?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  // Dados JOIN do exercício
  exercicio_nome: string;
  exercicio_descricao?: string;
  exercicio_instrucoes?: string;
  exercicio_musculo?: string;
  exercicio_tipo: string;
  exercicio_dificuldade: string;
  exercicio_midia_url?: string;
}

export interface Checkin {
  id: string;
  paciente_id: string;
  prescricao_id: string;
  data: string;
  executado: boolean;
  nivel_dor?: number;
  observacoes?: string;
  created_at: string;
  // Dados JOIN
  exercicio_nome?: string;
  exercicio_tipo?: string;
  series?: number;
  repeticoes?: number;
  frequencia?: string;
}

export interface EvolucaoSemanal {
  semana: string;
  media_dor: number;
  executados: number;
  total: number;
  taxa_execucao: number;
}

export interface Exercicio {
  id: string;
  nome: string;
  descricao?: string;
  instrucoes?: string;
  musculo_alvo?: string;
  tipo: string;
  dificuldade: string;
  midia_url?: string;
  tags: string[];
  ativo: boolean;
  created_at: string;
}
