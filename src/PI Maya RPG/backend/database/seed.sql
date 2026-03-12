-- ============================================================
-- Maya Yamamoto RPG — Dados de Teste (Seed)
-- ============================================================
-- IMPORTANTE: Execute APÓS o init.sql
-- As senhas abaixo são hash bcrypt de '123456'
-- ============================================================

-- Hash bcrypt de '123456' (gerado com cost 10)
-- $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- ============================================================
-- USUÁRIOS
-- ============================================================
INSERT INTO usuarios (id, nome, email, senha_hash, role, telefone, cpf) VALUES
  -- Admin
  ('a0000000-0000-0000-0000-000000000001',
   'Administrador',
   'admin@maya.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'admin',
   '(11) 99999-0001',
   '111.111.111-11'),

  -- Profissional (Maya)
  ('b0000000-0000-0000-0000-000000000001',
   'Maya Yoshiko Yamamoto',
   'maya@maya.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'profissional',
   '(11) 99999-0002',
   '222.222.222-22'),

  -- Pacientes
  ('c0000000-0000-0000-0000-000000000001',
   'Carlos Eduardo Silva',
   'carlos@email.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'paciente',
   '(11) 98888-0001',
   '333.333.333-33'),

  ('c0000000-0000-0000-0000-000000000002',
   'Ana Beatriz Oliveira',
   'ana@email.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'paciente',
   '(11) 98888-0002',
   '444.444.444-44'),

  ('c0000000-0000-0000-0000-000000000003',
   'Roberto Tanaka',
   'roberto@email.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'paciente',
   '(11) 98888-0003',
   '555.555.555-55')
ON CONFLICT (email) DO NOTHING;

-- Login de teste do frontend (manter compatível com AuthContext)
INSERT INTO usuarios (id, nome, email, senha_hash, role, telefone) VALUES
  ('d0000000-0000-0000-0000-000000000001',
   'Teste Admin',
   'teste@maya.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'admin',
   '(11) 90000-0001'),
  ('d0000000-0000-0000-0000-000000000002',
   'Teste Paciente',
   'paciente@maya.com',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'paciente',
   '(11) 90000-0002')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- PACIENTES (dados clínicos)
-- ============================================================
INSERT INTO pacientes (id, usuario_id, queixa_principal, historico_medico, objetivos, profissional_id) VALUES
  ('p0000000-0000-0000-0000-000000000001',
   'c0000000-0000-0000-0000-000000000001',
   'Dor lombar crônica há 2 anos, piora ao ficar sentado por longos períodos',
   'Hérnia de disco L4-L5 diagnosticada em 2024. Sem cirurgias.',
   'Reduzir dor lombar e melhorar postura no trabalho',
   'b0000000-0000-0000-0000-000000000001'),

  ('p0000000-0000-0000-0000-000000000002',
   'c0000000-0000-0000-0000-000000000002',
   'Cervicalgia e cefaleia tensional frequente',
   'Sem histórico cirúrgico. Trabalha 8h em computador.',
   'Corrigir postura cervical e aliviar dores de cabeça',
   'b0000000-0000-0000-0000-000000000001'),

  ('p0000000-0000-0000-0000-000000000003',
   'c0000000-0000-0000-0000-000000000003',
   'Escoliose leve, ombros desalinhados',
   'Escoliose diagnosticada na adolescência, sem tratamento prévio.',
   'Reeducação postural global e fortalecimento da cadeia posterior',
   'b0000000-0000-0000-0000-000000000001'),

  -- Paciente de teste
  ('p0000000-0000-0000-0000-000000000004',
   'd0000000-0000-0000-0000-000000000002',
   'Teste — dor nas costas',
   'Sem histórico relevante',
   'Melhora da postura',
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (usuario_id) DO NOTHING;

-- ============================================================
-- EXERCÍCIOS
-- ============================================================
INSERT INTO exercicios (id, nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, tags, criado_por) VALUES
  ('e0000000-0000-0000-0000-000000000001',
   'Alongamento de Cadeia Posterior',
   'Alongamento global para toda a cadeia posterior, desde a planta do pé até o topo da cabeça.',
   '1. Deite-se de costas com as pernas estendidas.\n2. Eleve uma perna estendida, segurando com as mãos atrás do joelho.\n3. Mantenha a posição por 30 segundos.\n4. Repita com a outra perna.',
   'Cadeia posterior',
   'alongamento', 'facil',
   ARRAY['RPG', 'cadeia posterior', 'lombar'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000002',
   'Fortalecimento de Core — Prancha',
   'Exercício isométrico para fortalecimento da musculatura do core.',
   '1. Posicione-se em quatro apoios.\n2. Estenda as pernas e apoie-se nos antebraços.\n3. Mantenha o corpo alinhado por 30 a 60 segundos.\n4. Descanse e repita.',
   'Core / Abdômen',
   'fortalecimento', 'moderado',
   ARRAY['core', 'estabilidade', 'isometrico'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000003',
   'Mobilidade de Coluna — Gato e Vaca',
   'Exercício de mobilidade articular para a coluna vertebral.',
   '1. Posicione-se em quatro apoios.\n2. Inspire arqueando a coluna (vaca).\n3. Expire arredondando a coluna (gato).\n4. Repita lentamente 10 vezes.',
   'Coluna vertebral',
   'mobilidade', 'facil',
   ARRAY['coluna', 'mobilidade', 'aquecimento'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000004',
   'Respiração Diafragmática',
   'Exercício respiratório fundamental para RPG, promove consciência corporal.',
   '1. Deite-se de costas com os joelhos flexionados.\n2. Coloque uma mão no peito e outra no abdômen.\n3. Inspire pelo nariz, expandindo o abdômen.\n4. Expire lentamente pela boca.\n5. Repita por 2 minutos.',
   'Diafragma',
   'respiratorio', 'facil',
   ARRAY['respiracao', 'RPG', 'relaxamento'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000005',
   'Postura de RPG — Fechamento de Ângulo',
   'Postura clássica de RPG para trabalhar o fechamento do ângulo coxofemoral.',
   '1. Sente-se com as costas apoiadas na parede.\n2. Aproxime os pés do corpo, mantendo as plantas juntas.\n3. Mantenha a coluna ereta e respire profundamente.\n4. Permaneça por 5 a 10 minutos.',
   'Cadeia anterior',
   'postural', 'dificil',
   ARRAY['RPG', 'postura', 'cadeia anterior', 'coxofemoral'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000006',
   'Alongamento de Trapézio',
   'Alongamento para a musculatura do trapézio superior, ideal para cervicalgias.',
   '1. Sentado ou em pé, incline a cabeça lateralmente.\n2. Com a mão do mesmo lado, puxe suavemente a cabeça.\n3. Mantenha por 30 segundos.\n4. Repita do outro lado.',
   'Trapézio',
   'alongamento', 'facil',
   ARRAY['cervical', 'trapezio', 'escritorio'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000007',
   'Ponte Glútea',
   'Fortalecimento de glúteos e estabilização lombopélvica.',
   '1. Deite-se de costas com os joelhos flexionados.\n2. Eleve o quadril até alinhar com os joelhos.\n3. Segure por 5 segundos no topo.\n4. Desça lentamente. Repita.',
   'Glúteos / Lombar',
   'fortalecimento', 'facil',
   ARRAY['gluteos', 'lombar', 'estabilidade'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000008',
   'Rotação Torácica em Decúbito',
   'Melhora a rotação da coluna torácica, essencial para postura.',
   '1. Deite-se de lado com os joelhos flexionados a 90°.\n2. Estenda o braço de cima para trás, girando o tronco.\n3. Mantenha 3 segundos e retorne.\n4. Repita 10 vezes de cada lado.',
   'Coluna torácica',
   'mobilidade', 'moderado',
   ARRAY['toracica', 'rotacao', 'mobilidade'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000009',
   'Postura de RPG — Rã no Chão',
   'Postura de abertura de ângulo para cadeia anterior dos membros inferiores.',
   '1. Deite-se de costas.\n2. Flexione os joelhos e junte as plantas dos pés.\n3. Deixe os joelhos caírem para os lados.\n4. Mantenha por 10 minutos com respiração controlada.',
   'Cadeia anterior MMII',
   'postural', 'moderado',
   ARRAY['RPG', 'postura', 'cadeia anterior', 'quadril'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000010',
   'Fortalecimento Escapular — Remada Baixa',
   'Fortalecimento da musculatura escapular para correção de protração de ombros.',
   '1. Sentado, segure uma faixa elástica à frente.\n2. Puxe os cotovelos para trás, apertando as escápulas.\n3. Segure 3 segundos.\n4. Retorne lentamente. Repita.',
   'Rombóides / Trapézio médio',
   'fortalecimento', 'moderado',
   ARRAY['escapula', 'ombros', 'faixa elastica'],
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRESCRIÇÕES
-- ============================================================
INSERT INTO prescricoes (paciente_id, exercicio_id, series, repeticoes, duracao_seg, frequencia, observacoes, criado_por) VALUES
  -- Carlos (lombar): cadeia posterior + prancha + ponte + respiração
  ('p0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 3, 1, 30, '5x por semana', 'Manter 30s cada perna', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 3, 1, 30, '3x por semana', 'Progredir para 60s', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 3, 12, NULL, '5x por semana', 'Foco na contração glútea', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 1, 1, 120, 'Diário', 'Antes de dormir', 'b0000000-0000-0000-0000-000000000001'),

  -- Ana (cervical): trapézio + gato-vaca + rotação torácica + escapular
  ('p0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000006', 3, 1, 30, 'Diário', 'A cada 2h no trabalho', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 2, 10, NULL, 'Diário', 'Movimento lento e controlado', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000008', 2, 10, NULL, '4x por semana', NULL, 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000010', 3, 12, NULL, '3x por semana', 'Usar faixa leve', 'b0000000-0000-0000-0000-000000000001'),

  -- Roberto (escoliose): postura RPG + ponte + cadeia posterior + respiração
  ('p0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 1, 1, 600, '3x por semana', 'Supervisão na clínica', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000009', 1, 1, 600, '3x por semana', 'Alternar com postura 5', 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 3, 1, 30, 'Diário', NULL, 'b0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000004', 1, 1, 120, 'Diário', 'Antes de dormir', 'b0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SEED
-- ============================================================
