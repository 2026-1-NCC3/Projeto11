// Tipos TypeScript do projeto Maya RPG.
// Aqui a gente define a "forma" dos dados que circulam entre frontend e backend.
// Cada interface representa uma tabela ou resposta da API.

// Os 3 tipos de usuário no sistema
export type Role = 'admin' | 'profissional' | 'paciente';

// Nível de dificuldade dos exercícios
export type Dificuldade = 'facil' | 'moderado' | 'dificil';

// Categorias de exercício (baseadas nas técnicas de RPG)
export type TipoExercicio =
  | 'alongamento'
  | 'fortalecimento'
  | 'mobilidade'
  | 'respiratorio'
  | 'postural'
  | 'outro';

// Dados de qualquer usuário do sistema (admin, profissional ou paciente)
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

// O que a API retorna quando o login dá certo
export interface LoginResponse {
  access_token: string;   // token JWT pra autenticar as próximas requisições
  user: Usuario;
}

// Dados completos de um paciente (junta a tabela usuarios + pacientes)
export interface Paciente {
  id: string;               // id na tabela pacientes
  usuario_id: string;       // referência ao usuário desse paciente
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  avatar_url?: string;
  ativo: boolean;
  queixa_principal?: string;    // motivo que trouxe o paciente à clínica
  historico_medico?: string;    // histórico de doenças, cirurgias, etc
  medicamentos?: string;
  objetivos?: string;           // o que espera alcançar com o tratamento
  observacoes?: string;
  profissional_id?: string;     // quem é o profissional responsável
  profissional_nome?: string;   // nome do profissional (vem do JOIN)
  created_at: string;
  updated_at: string;
}

// Dados que o formulário de cadastro/edição de paciente envia
export interface PacienteFormData {
  nome: string;
  email: string;
  senha?: string;          // só obrigatória no cadastro, não na edição
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  queixa_principal?: string;
  historico_medico?: string;
  medicamentos?: string;
  objetivos?: string;
  observacoes?: string;
}

// Um exercício do banco de exercícios da clínica
export interface Exercicio {
  id: string;
  nome: string;
  descricao?: string;       // explicação geral do exercício
  instrucoes?: string;      // passo a passo pra execução
  musculo_alvo?: string;    // qual grupo muscular trabalha
  tipo: TipoExercicio;
  dificuldade: Dificuldade;
  midia_url?: string;       // link pra vídeo ou imagem demonstrativa
  tags: string[];            // tags pra facilitar a busca (ex: "lombar", "RPG")
  ativo: boolean;
  criado_por?: string;
  criado_por_nome?: string;
  created_at: string;
  updated_at: string;
}

// Dados do formulário de criação de exercício
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

// Prescrição = um exercício que foi "receitado" pra um paciente
export interface Prescricao {
  id: string;
  paciente_id: string;
  exercicio_id: string;
  series: number;
  repeticoes: number;
  duracao_seg?: number;       // pra exercícios isométricos (ex: prancha 30s)
  frequencia?: string;         // ex: "3x por semana"
  observacoes?: string;
  ativo: boolean;
  criado_por?: string;
  // Campos que vêm do JOIN com a tabela de exercícios
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

// Sessão de atendimento (prontuário eletrônico)
export interface SessaoProntuario {
  id: string;
  paciente_id: string;
  profissional_id: string;
  profissional_nome?: string;
  data_sessao: string;
  notas?: string;            // anotações livres da sessão
  evolucao?: string;         // como o paciente evoluiu
  condutas?: string;         // o que foi feito na sessão
  nivel_dor_inicio?: number; // dor no começo da sessão (escala 0-10)
  nivel_dor_fim?: number;    // dor no final da sessão
  created_at: string;
  updated_at: string;
}

// Check-in diário do paciente (registra se fez o exercício e como se sentiu)
export interface Checkin {
  id: string;
  paciente_id: string;
  prescricao_id: string;
  data: string;
  executado: boolean;          // fez ou não fez o exercício
  nivel_dor?: number;          // escala de 0 a 10
  observacoes?: string;
  // Dados do exercício (JOIN)
  exercicio_nome?: string;
  exercicio_tipo?: TipoExercicio;
  series?: number;
  repeticoes?: number;
  frequencia?: string;
  created_at: string;
}

// Resumo semanal de evolução do paciente (usado no gráfico de acompanhamento)
export interface EvolucaoSemanal {
  semana: string;
  media_dor: number;
  executados: number;
  total: number;
  taxa_execucao: number;    // porcentagem de exercícios realizados
}
