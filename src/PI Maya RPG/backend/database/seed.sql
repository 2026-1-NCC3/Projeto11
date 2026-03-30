-- ============================================================
-- Maya Yamamoto RPG â€” Dados de Teste (Seed)
-- ============================================================
-- IMPORTANTE: Execute APÃ“S o init.sql
-- As senhas abaixo sÃ£o hash bcrypt de '123456'
-- ============================================================

-- Hash bcrypt de '123456' (gerado com cost 10)
-- $2a$10$nP3ZzoUEURZpu4QhKvHYWOkJeL/fJDNs6Oj5RlvWC4vFbHlW83s62

-- ============================================================
-- USUÃRIOS
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

-- Login de teste do frontend (manter compatÃ­vel com AuthContext)
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
-- PACIENTES (dados clÃ­nicos)
-- ============================================================
INSERT INTO pacientes (id, usuario_id, queixa_principal, historico_medico, objetivos, profissional_id) VALUES
  ('f0000000-0000-0000-0000-000000000001',
   'c0000000-0000-0000-0000-000000000001',
   'Dor lombar crÃ´nica hÃ¡ 2 anos, piora ao ficar sentado por longos perÃ­odos',
   'HÃ©rnia de disco L4-L5 diagnosticada em 2024. Sem cirurgias.',
   'Reduzir dor lombar e melhorar postura no trabalho',
   'b0000000-0000-0000-0000-000000000001'),

  ('f0000000-0000-0000-0000-000000000002',
   'c0000000-0000-0000-0000-000000000002',
   'Cervicalgia e cefaleia tensional frequente',
   'Sem histÃ³rico cirÃºrgico. Trabalha 8h em computador.',
   'Corrigir postura cervical e aliviar dores de cabeÃ§a',
   'b0000000-0000-0000-0000-000000000001'),

  ('f0000000-0000-0000-0000-000000000003',
   'c0000000-0000-0000-0000-000000000003',
   'Escoliose leve, ombros desalinhados',
   'Escoliose diagnosticada na adolescÃªncia, sem tratamento prÃ©vio.',
   'ReeducaÃ§Ã£o postural global e fortalecimento da cadeia posterior',
   'b0000000-0000-0000-0000-000000000001'),

  -- Paciente de teste
  ('f0000000-0000-0000-0000-000000000004',
   'd0000000-0000-0000-0000-000000000002',
   'Teste â€” dor nas costas',
   'Sem histÃ³rico relevante',
   'Melhora da postura',
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (usuario_id) DO NOTHING;

-- ============================================================
-- EXERCÃCIOS
-- ============================================================
INSERT INTO exercicios (id, nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, tags, criado_por) VALUES
  ('e0000000-0000-0000-0000-000000000001',
   'Alongamento de Cadeia Posterior',
   'Alongamento global para toda a cadeia posterior, desde a planta do pÃ© atÃ© o topo da cabeÃ§a.',
   '1. Deite-se de costas com as pernas estendidas.\n2. Eleve uma perna estendida, segurando com as mÃ£os atrÃ¡s do joelho.\n3. Mantenha a posiÃ§Ã£o por 30 segundos.\n4. Repita com a outra perna.',
   'Cadeia posterior',
   'alongamento', 'facil',
   ARRAY['RPG', 'cadeia posterior', 'lombar'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000002',
   'Fortalecimento de Core â€” Prancha',
   'ExercÃ­cio isomÃ©trico para fortalecimento da musculatura do core.',
   '1. Posicione-se em quatro apoios.\n2. Estenda as pernas e apoie-se nos antebraÃ§os.\n3. Mantenha o corpo alinhado por 30 a 60 segundos.\n4. Descanse e repita.',
   'Core / AbdÃ´men',
   'fortalecimento', 'moderado',
   ARRAY['core', 'estabilidade', 'isometrico'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000003',
   'Mobilidade de Coluna â€” Gato e Vaca',
   'ExercÃ­cio de mobilidade articular para a coluna vertebral.',
   '1. Posicione-se em quatro apoios.\n2. Inspire arqueando a coluna (vaca).\n3. Expire arredondando a coluna (gato).\n4. Repita lentamente 10 vezes.',
   'Coluna vertebral',
   'mobilidade', 'facil',
   ARRAY['coluna', 'mobilidade', 'aquecimento'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000004',
   'RespiraÃ§Ã£o DiafragmÃ¡tica',
   'ExercÃ­cio respiratÃ³rio fundamental para RPG, promove consciÃªncia corporal.',
   '1. Deite-se de costas com os joelhos flexionados.\n2. Coloque uma mÃ£o no peito e outra no abdÃ´men.\n3. Inspire pelo nariz, expandindo o abdÃ´men.\n4. Expire lentamente pela boca.\n5. Repita por 2 minutos.',
   'Diafragma',
   'respiratorio', 'facil',
   ARRAY['respiracao', 'RPG', 'relaxamento'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000005',
   'Postura de RPG â€” Fechamento de Ã‚ngulo',
   'Postura clÃ¡ssica de RPG para trabalhar o fechamento do Ã¢ngulo coxofemoral.',
   '1. Sente-se com as costas apoiadas na parede.\n2. Aproxime os pÃ©s do corpo, mantendo as plantas juntas.\n3. Mantenha a coluna ereta e respire profundamente.\n4. PermaneÃ§a por 5 a 10 minutos.',
   'Cadeia anterior',
   'postural', 'dificil',
   ARRAY['RPG', 'postura', 'cadeia anterior', 'coxofemoral'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000006',
   'Alongamento de TrapÃ©zio',
   'Alongamento para a musculatura do trapÃ©zio superior, ideal para cervicalgias.',
   '1. Sentado ou em pÃ©, incline a cabeÃ§a lateralmente.\n2. Com a mÃ£o do mesmo lado, puxe suavemente a cabeÃ§a.\n3. Mantenha por 30 segundos.\n4. Repita do outro lado.',
   'TrapÃ©zio',
   'alongamento', 'facil',
   ARRAY['cervical', 'trapezio', 'escritorio'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000007',
   'Ponte GlÃºtea',
   'Fortalecimento de glÃºteos e estabilizaÃ§Ã£o lombopÃ©lvica.',
   '1. Deite-se de costas com os joelhos flexionados.\n2. Eleve o quadril atÃ© alinhar com os joelhos.\n3. Segure por 5 segundos no topo.\n4. DesÃ§a lentamente. Repita.',
   'GlÃºteos / Lombar',
   'fortalecimento', 'facil',
   ARRAY['gluteos', 'lombar', 'estabilidade'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000008',
   'RotaÃ§Ã£o TorÃ¡cica em DecÃºbito',
   'Melhora a rotaÃ§Ã£o da coluna torÃ¡cica, essencial para postura.',
   '1. Deite-se de lado com os joelhos flexionados a 90Â°.\n2. Estenda o braÃ§o de cima para trÃ¡s, girando o tronco.\n3. Mantenha 3 segundos e retorne.\n4. Repita 10 vezes de cada lado.',
   'Coluna torÃ¡cica',
   'mobilidade', 'moderado',
   ARRAY['toracica', 'rotacao', 'mobilidade'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000009',
   'Postura de RPG â€” RÃ£ no ChÃ£o',
   'Postura de abertura de Ã¢ngulo para cadeia anterior dos membros inferiores.',
   '1. Deite-se de costas.\n2. Flexione os joelhos e junte as plantas dos pÃ©s.\n3. Deixe os joelhos caÃ­rem para os lados.\n4. Mantenha por 10 minutos com respiraÃ§Ã£o controlada.',
   'Cadeia anterior MMII',
   'postural', 'moderado',
   ARRAY['RPG', 'postura', 'cadeia anterior', 'quadril'],
   'b0000000-0000-0000-0000-000000000001'),

  ('e0000000-0000-0000-0000-000000000010',
   'Fortalecimento Escapular â€” Remada Baixa',
   'Fortalecimento da musculatura escapular para correÃ§Ã£o de protraÃ§Ã£o de ombros.',
   '1. Sentado, segure uma faixa elÃ¡stica Ã  frente.\n2. Puxe os cotovelos para trÃ¡s, apertando as escÃ¡pulas.\n3. Segure 3 segundos.\n4. Retorne lentamente. Repita.',
   'RombÃ³ides / TrapÃ©zio mÃ©dio',
   'fortalecimento', 'moderado',
   ARRAY['escapula', 'ombros', 'faixa elastica'],
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRESCRIÃ‡Ã•ES
-- ============================================================
INSERT INTO prescricoes (paciente_id, exercicio_id, series, repeticoes, duracao_seg, frequencia, observacoes, criado_por) VALUES
  -- Carlos (lombar): cadeia posterior + prancha + ponte + respiraÃ§Ã£o
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 3, 1, 30, '5x por semana', 'Manter 30s cada perna', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 3, 1, 30, '3x por semana', 'Progredir para 60s', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 3, 12, NULL, '5x por semana', 'Foco na contraÃ§Ã£o glÃºtea', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 1, 1, 120, 'DiÃ¡rio', 'Antes de dormir', 'b0000000-0000-0000-0000-000000000001'),

  -- Ana (cervical): trapÃ©zio + gato-vaca + rotaÃ§Ã£o torÃ¡cica + escapular
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000006', 3, 1, 30, 'DiÃ¡rio', 'A cada 2h no trabalho', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 2, 10, NULL, 'DiÃ¡rio', 'Movimento lento e controlado', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000008', 2, 10, NULL, '4x por semana', NULL, 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000010', 3, 12, NULL, '3x por semana', 'Usar faixa leve', 'b0000000-0000-0000-0000-000000000001'),

  -- Roberto (escoliose): postura RPG + ponte + cadeia posterior + respiraÃ§Ã£o
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 1, 1, 600, '3x por semana', 'SupervisÃ£o na clÃ­nica', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000009', 1, 1, 600, '3x por semana', 'Alternar com postura 5', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 3, 1, 30, 'DiÃ¡rio', NULL, 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000004', 1, 1, 120, 'DiÃ¡rio', 'Antes de dormir', 'b0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SEED
-- ============================================================
