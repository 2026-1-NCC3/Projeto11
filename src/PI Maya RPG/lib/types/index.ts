// ============================================================
// Tipos TypeScript — Maya Yamamoto RPG
// ============================================================

/** Roles do sistema */
export type Role = 'admin' | 'profissional' | 'paciente';

/** Dificuldade de exercício */
export type Dificuldade = 'facil' | 'moderado' | 'dificil';

/** Tipo de exercício */
export type TipoExercicio =
  | 'alongamento'
  | 'fortalecimento'
  | 'mobilidade'
  | 'respiratorio'
  | 'postural'
  | 'outro';

// ── Usuário ──────────────────────────────────────────────────

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  avatar_url?: string;
  ativo?: boolean;
}

// ── Respostas de Auth ────────────────────────────────────────

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}

// ── Paciente ─────────────────────────────────────────────────

export interface Paciente {
  id: string;
  usuario_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  avatar_url?: string;
  ativo: boolean;
  queixa_principal?: string;
  historico_medico?: string;
  medicamentos?: string;
  objetivos?: string;
  observacoes?: string;
  profissional_id?: string;
  profissional_nome?: string;
  created_at: string;
  updated_at: string;
}

export interface PacienteFormData {
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  queixa_principal?: string;
  historico_medico?: string;
  medicamentos?: string;
  objetivos?: string;
  observacoes?: string;
}

// ── Exercício ────────────────────────────────────────────────

export interface Exercicio {
  id: string;
  nome: string;
  descricao?: string;
  instrucoes?: string;
  musculo_alvo?: string;
  tipo: TipoExercicio;
  dificuldade: Dificuldade;
  midia_url?: string;
  tags: string[];
  ativo: boolean;
  criado_por?: string;
  criado_por_nome?: string;
  created_at: string;
  updated_at: string;
}

export interface ExercicioFormData {
  nome: string;
  descricao?: string;
  instrucoes?: string;
  musculo_alvo?: string;
  tipo?: TipoExercicio;
  dificuldade?: Dificuldade;
  midia_url?: string;
  tags?: string[];
}

// ── Prescrição ───────────────────────────────────────────────

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
  criado_por?: string;
  // Dados do exercício (join)
  exercicio_nome?: string;
  exercicio_descricao?: string;
  exercicio_instrucoes?: string;
  exercicio_musculo?: string;
  exercicio_tipo?: TipoExercicio;
  exercicio_dificuldade?: Dificuldade;
  exercicio_midia_url?: string;
  created_at: string;
  updated_at: string;
}

// ── Sessão do Prontuário ─────────────────────────────────────

export interface SessaoProntuario {
  id: string;
  paciente_id: string;
  profissional_id: string;
  profissional_nome?: string;
  data_sessao: string;
  notas?: string;
  evolucao?: string;
  condutas?: string;
  nivel_dor_inicio?: number;
  nivel_dor_fim?: number;
  created_at: string;
  updated_at: string;
}

// ── Check-in ─────────────────────────────────────────────────

export interface Checkin {
  id: string;
  paciente_id: string;
  prescricao_id: string;
  data: string;
  executado: boolean;
  nivel_dor?: number;
  observacoes?: string;
  // Dados do exercício (join)
  exercicio_nome?: string;
  exercicio_tipo?: TipoExercicio;
  series?: number;
  repeticoes?: number;
  frequencia?: string;
  created_at: string;
}

export interface EvolucaoSemanal {
  semana: string;
  media_dor: number;
  executados: number;
  total: number;
  taxa_execucao: number;
}
