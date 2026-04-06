import axios from 'axios';
import type {
  LoginResponse,
  Paciente,
  PacienteFormData,
  Exercicio,
  ExercicioFormData,
  Prescricao,
  Checkin,
  EvolucaoSemanal,
  SessaoProntuario,
} from '@/lib/types';

// ── Instância Axios ──────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adiciona token JWT em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor: se receber 401, limpa o token e redireciona
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// MOCK — Dados de desenvolvimento (sem backend)
// ============================================================

const DEV_USERS: Record<string, LoginResponse> = {
  'teste@maya.com': {
    access_token: 'dev-token-admin',
    user: {
      id: 'd0000000-0000-0000-0000-000000000001',
      nome: 'Teste Admin',
      email: 'teste@maya.com',
      role: 'admin',
    },
  },
  'paciente@maya.com': {
    access_token: 'dev-token-paciente',
    user: {
      id: 'd0000000-0000-0000-0000-000000000002',
      nome: 'Teste Paciente',
      email: 'paciente@maya.com',
      role: 'paciente',
    },
  },
};

const MOCK_PACIENTES: Paciente[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    usuario_id: 'c0000000-0000-0000-0000-000000000001',
    nome: 'Carlos Eduardo Silva',
    email: 'carlos@email.com',
    telefone: '(11) 98888-0001',
    cpf: '333.333.333-33',
    ativo: true,
    queixa_principal: 'Dor lombar crônica há 2 anos, piora ao ficar sentado por longos períodos',
    historico_medico: 'Hérnia de disco L4-L5 diagnosticada em 2024. Sem cirurgias.',
    objetivos: 'Reduzir dor lombar e melhorar postura no trabalho',
    profissional_id: 'b0000000-0000-0000-0000-000000000001',
    profissional_nome: 'Maya Yoshiko Yamamoto',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-03-20T14:30:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    usuario_id: 'c0000000-0000-0000-0000-000000000002',
    nome: 'Ana Beatriz Oliveira',
    email: 'ana@email.com',
    telefone: '(11) 98888-0002',
    cpf: '444.444.444-44',
    ativo: true,
    queixa_principal: 'Cervicalgia e cefaleia tensional frequente',
    historico_medico: 'Sem histórico cirúrgico. Trabalha 8h em computador.',
    objetivos: 'Corrigir postura cervical e aliviar dores de cabeça',
    profissional_id: 'b0000000-0000-0000-0000-000000000001',
    profissional_nome: 'Maya Yoshiko Yamamoto',
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-03-25T11:00:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000003',
    usuario_id: 'c0000000-0000-0000-0000-000000000003',
    nome: 'Roberto Tanaka',
    email: 'roberto@email.com',
    telefone: '(11) 98888-0003',
    cpf: '555.555.555-55',
    ativo: true,
    queixa_principal: 'Escoliose leve, ombros desalinhados',
    historico_medico: 'Escoliose diagnosticada na adolescência, sem tratamento prévio.',
    objetivos: 'Reeducação postural global e fortalecimento da cadeia posterior',
    profissional_id: 'b0000000-0000-0000-0000-000000000001',
    profissional_nome: 'Maya Yoshiko Yamamoto',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-04-01T16:00:00Z',
  },
];

const MOCK_EXERCICIOS: Exercicio[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    nome: 'Alongamento de Cadeia Posterior',
    descricao: 'Alongamento global para toda a cadeia posterior, desde a planta do pé até o topo da cabeça.',
    instrucoes: '1. Deite-se de costas com as pernas estendidas.\n2. Eleve uma perna estendida, segurando com as mãos atrás do joelho.\n3. Mantenha a posição por 30 segundos.\n4. Repita com a outra perna.',
    musculo_alvo: 'Cadeia posterior',
    tipo: 'alongamento',
    dificuldade: 'facil',
    tags: ['RPG', 'cadeia posterior', 'lombar'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    nome: 'Fortalecimento de Core — Prancha',
    descricao: 'Exercício isométrico para fortalecimento da musculatura do core.',
    instrucoes: '1. Posicione-se em quatro apoios.\n2. Estenda as pernas e apoie-se nos antebraços.\n3. Mantenha o corpo alinhado por 30 a 60 segundos.\n4. Descanse e repita.',
    musculo_alvo: 'Core / Abdômen',
    tipo: 'fortalecimento',
    dificuldade: 'moderado',
    tags: ['core', 'estabilidade', 'isometrico'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    nome: 'Mobilidade de Coluna — Gato e Vaca',
    descricao: 'Exercício de mobilidade articular para a coluna vertebral.',
    instrucoes: '1. Posicione-se em quatro apoios.\n2. Inspire arqueando a coluna (vaca).\n3. Expire arredondando a coluna (gato).\n4. Repita lentamente 10 vezes.',
    musculo_alvo: 'Coluna vertebral',
    tipo: 'mobilidade',
    dificuldade: 'facil',
    tags: ['coluna', 'mobilidade', 'aquecimento'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    nome: 'Respiração Diafragmática',
    descricao: 'Exercício respiratório fundamental para RPG, promove consciência corporal.',
    instrucoes: '1. Deite-se de costas com os joelhos flexionados.\n2. Coloque uma mão no peito e outra no abdômen.\n3. Inspire pelo nariz, expandindo o abdômen.\n4. Expire lentamente pela boca.\n5. Repita por 2 minutos.',
    musculo_alvo: 'Diafragma',
    tipo: 'respiratorio',
    dificuldade: 'facil',
    tags: ['respiracao', 'RPG', 'relaxamento'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    nome: 'Postura de RPG — Fechamento de Ângulo',
    descricao: 'Postura clássica de RPG para trabalhar o fechamento do ângulo coxofemoral.',
    instrucoes: '1. Sente-se com as costas apoiadas na parede.\n2. Aproxime os pés do corpo, mantendo as plantas juntas.\n3. Mantenha a coluna ereta e respire profundamente.\n4. Permaneça por 5 a 10 minutos.',
    musculo_alvo: 'Cadeia anterior',
    tipo: 'postural',
    dificuldade: 'dificil',
    tags: ['RPG', 'postura', 'cadeia anterior', 'coxofemoral'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    nome: 'Alongamento de Trapézio',
    descricao: 'Alongamento para a musculatura do trapézio superior, ideal para cervicalgias.',
    instrucoes: '1. Sentado ou em pé, incline a cabeça lateralmente.\n2. Com a mão do mesmo lado, puxe suavemente a cabeça.\n3. Mantenha por 30 segundos.\n4. Repita do outro lado.',
    musculo_alvo: 'Trapézio',
    tipo: 'alongamento',
    dificuldade: 'facil',
    tags: ['cervical', 'trapezio', 'escritorio'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    nome: 'Ponte Glútea',
    descricao: 'Fortalecimento de glúteos e estabilização lombopélvica.',
    instrucoes: '1. Deite-se de costas com os joelhos flexionados.\n2. Eleve o quadril até alinhar com os joelhos.\n3. Segure por 5 segundos no topo.\n4. Desça lentamente. Repita.',
    musculo_alvo: 'Glúteos / Lombar',
    tipo: 'fortalecimento',
    dificuldade: 'facil',
    tags: ['gluteos', 'lombar', 'estabilidade'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    nome: 'Rotação Torácica em Decúbito',
    descricao: 'Melhora a rotação da coluna torácica, essencial para postura.',
    instrucoes: '1. Deite-se de lado com os joelhos flexionados a 90°.\n2. Estenda o braço de cima para trás, girando o tronco.\n3. Mantenha 3 segundos e retorne.\n4. Repita 10 vezes de cada lado.',
    musculo_alvo: 'Coluna torácica',
    tipo: 'mobilidade',
    dificuldade: 'moderado',
    tags: ['toracica', 'rotacao', 'mobilidade'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000009',
    nome: 'Postura de RPG — Rã no Chão',
    descricao: 'Postura de abertura de ângulo para cadeia anterior dos membros inferiores.',
    instrucoes: '1. Deite-se de costas.\n2. Flexione os joelhos e junte as plantas dos pés.\n3. Deixe os joelhos caírem para os lados.\n4. Mantenha por 10 minutos com respiração controlada.',
    musculo_alvo: 'Cadeia anterior MMII',
    tipo: 'postural',
    dificuldade: 'moderado',
    tags: ['RPG', 'postura', 'cadeia anterior', 'quadril'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000010',
    nome: 'Fortalecimento Escapular — Remada Baixa',
    descricao: 'Fortalecimento da musculatura escapular para correção de protração de ombros.',
    instrucoes: '1. Sentado, segure uma faixa elástica à frente.\n2. Puxe os cotovelos para trás, apertando as escápulas.\n3. Segure 3 segundos.\n4. Retorne lentamente. Repita.',
    musculo_alvo: 'Rombóides / Trapézio médio',
    tipo: 'fortalecimento',
    dificuldade: 'moderado',
    tags: ['escapula', 'ombros', 'faixa elastica'],
    ativo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
];

/** Helper: tenta o backend real; se falhar em dev, retorna o fallback mock */
async function devFallback<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await request();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[DEV] Backend indisponível — usando dados mock', err);
      return fallback;
    }
    throw err;
  }
}

// ── Auth ─────────────────────────────────────────────────────

export async function login(email: string, senha: string): Promise<LoginResponse> {
  // Modo desenvolvimento: login mock se o backend não responder
  if (process.env.NODE_ENV === 'development') {
    const mockUser = DEV_USERS[email.toLowerCase().trim()];
    if (mockUser && senha === '123456') {
      return mockUser;
    }
  }

  const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
  return data;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
  // Fire-and-forget ao backend
  api.post('/auth/logout').catch(() => {});
}

// ── Pacientes ────────────────────────────────────────────────

export async function listarPacientes(): Promise<Paciente[]> {
  return devFallback(
    async () => { const { data } = await api.get<Paciente[]>('/pacientes'); return data; },
    MOCK_PACIENTES,
  );
}

export async function buscarPaciente(id: string): Promise<Paciente> {
  return devFallback(
    async () => { const { data } = await api.get<Paciente>(`/pacientes/${id}`); return data; },
    MOCK_PACIENTES.find(p => p.id === id) || MOCK_PACIENTES[0],
  );
}

export async function criarPaciente(formData: PacienteFormData): Promise<Paciente> {
  return devFallback(
    async () => { const { data } = await api.post<Paciente>('/pacientes', formData); return data; },
    { ...MOCK_PACIENTES[0], id: crypto.randomUUID(), ...formData, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Paciente,
  );
}

export async function atualizarPaciente(id: string, formData: Partial<PacienteFormData>): Promise<Paciente> {
  return devFallback(
    async () => { const { data } = await api.put<Paciente>(`/pacientes/${id}`, formData); return data; },
    { ...MOCK_PACIENTES[0], ...formData, id, updated_at: new Date().toISOString() } as Paciente,
  );
}

export async function deletarPaciente(id: string): Promise<void> {
  return devFallback(
    async () => { await api.delete(`/pacientes/${id}`); },
    undefined,
  );
}

// ── Exercícios ───────────────────────────────────────────────

export async function listarExercicios(params?: {
  tipo?: string;
  dificuldade?: string;
  busca?: string;
}): Promise<Exercicio[]> {
  return devFallback(
    async () => { const { data } = await api.get<Exercicio[]>('/exercicios', { params }); return data; },
    MOCK_EXERCICIOS,
  );
}

export async function buscarExercicio(id: string): Promise<Exercicio> {
  return devFallback(
    async () => { const { data } = await api.get<Exercicio>(`/exercicios/${id}`); return data; },
    MOCK_EXERCICIOS.find(e => e.id === id) || MOCK_EXERCICIOS[0],
  );
}

export async function criarExercicio(formData: ExercicioFormData): Promise<Exercicio> {
  return devFallback(
    async () => { const { data } = await api.post<Exercicio>('/exercicios', formData); return data; },
    { ...MOCK_EXERCICIOS[0], id: crypto.randomUUID(), ...formData, tags: formData.tags || [], ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Exercicio,
  );
}

export async function atualizarExercicio(id: string, formData: Partial<ExercicioFormData>): Promise<Exercicio> {
  return devFallback(
    async () => { const { data } = await api.put<Exercicio>(`/exercicios/${id}`, formData); return data; },
    { ...MOCK_EXERCICIOS[0], ...formData, id, updated_at: new Date().toISOString() } as Exercicio,
  );
}

export async function deletarExercicio(id: string): Promise<void> {
  return devFallback(
    async () => { await api.delete(`/exercicios/${id}`); },
    undefined,
  );
}

// ── Prescrições ──────────────────────────────────────────────

export async function listarPrescricoes(pacienteId: string): Promise<Prescricao[]> {
  const { data } = await api.get<Prescricao[]>(`/prescricoes/paciente/${pacienteId}`);
  return data;
}

export async function criarPrescricao(payload: {
  paciente_id: string;
  exercicio_id: string;
  series?: number;
  repeticoes?: number;
  duracao_seg?: number;
  frequencia?: string;
  observacoes?: string;
}): Promise<Prescricao> {
  const { data } = await api.post<Prescricao>('/prescricoes', payload);
  return data;
}

// ── Check-ins ────────────────────────────────────────────────

export async function registrarCheckin(payload: {
  paciente_id: string;
  prescricao_id: string;
  executado: boolean;
  nivel_dor?: number;
  observacoes?: string;
}): Promise<Checkin> {
  const { data } = await api.post<Checkin>('/checkins', payload);
  return data;
}

export async function listarCheckins(pacienteId: string): Promise<Checkin[]> {
  const { data } = await api.get<Checkin[]>(`/checkins/paciente/${pacienteId}`);
  return data;
}

export async function buscarEvolucao(pacienteId: string): Promise<EvolucaoSemanal[]> {
  const { data } = await api.get<EvolucaoSemanal[]>(`/checkins/paciente/${pacienteId}/evolucao`);
  return data;
}

// ── Prontuário ───────────────────────────────────────────────

export async function listarSessoes(pacienteId: string): Promise<SessaoProntuario[]> {
  const { data } = await api.get<SessaoProntuario[]>(`/prontuario/paciente/${pacienteId}/sessoes`);
  return data;
}

export async function criarSessao(pacienteId: string, payload: {
  data_sessao?: string;
  notas?: string;
  evolucao?: string;
  condutas?: string;
  nivel_dor_inicio?: number;
  nivel_dor_fim?: number;
}): Promise<SessaoProntuario> {
  const { data } = await api.post<SessaoProntuario>(`/prontuario/paciente/${pacienteId}/sessoes`, payload);
  return data;
}

export default api;
