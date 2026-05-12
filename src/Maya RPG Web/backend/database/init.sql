-- ==============================================================
-- Maya Yamamoto RPG — Estrutura do Banco de Dados (DDL)
-- Clínica de Reeducação Postural Global (RPG)
-- Projeto Interdisciplinar · FECAP 2026-1
-- ==============================================================

-- OBS: Execute esse script conectado ao banco "maya_rpg".
-- Se o banco ainda não existe, crie com: CREATE DATABASE maya_rpg;

-- ==============================================================
-- EXTENSÕES
-- uuid-ossp: gera IDs únicos automaticamente (UUID v4)
-- pgcrypto: funções criptográficas (usado internamente pelo Postgres)
-- ==============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================
-- TIPOS ENUMERADOS
-- São "listas fixas" de valores permitidos — evita erros de digitação.
-- ==============================================================

-- Tipo de usuário no sistema
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('admin', 'profissional', 'paciente');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Nível de dificuldade dos exercícios
DO $$ BEGIN
  CREATE TYPE dificuldade_enum AS ENUM ('facil', 'moderado', 'dificil');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Categoria de exercício (baseado nas técnicas de RPG)
DO $$ BEGIN
  CREATE TYPE tipo_exercicio_enum AS ENUM ('alongamento', 'fortalecimento', 'mobilidade', 'respiratorio', 'postural', 'outro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==============================================================
-- TABELA: usuarios
-- Guarda TODOS os tipos de usuário (admin, profissional e paciente).
-- A senha fica como hash bcrypt (nunca texto puro).
-- ==============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(200)    NOT NULL,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  senha_hash    VARCHAR(255)    NOT NULL,
  role          role_enum       NOT NULL DEFAULT 'paciente',
  telefone      VARCHAR(20),
  cpf           VARCHAR(14)     UNIQUE,           -- formato: 000.000.000-00
  data_nascimento DATE,
  avatar_url    TEXT,
  ativo         BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices pra acelerar buscas por email e por tipo de usuário
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role  ON usuarios(role);

-- ==============================================================
-- TABELA: pacientes
-- Dados clínicos do paciente (queixa, histórico, objetivos).
-- Cada paciente tem um vínculo com a tabela usuarios (1:1).
-- ==============================================================
CREATE TABLE IF NOT EXISTS pacientes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id        UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  queixa_principal  TEXT,                                -- motivo que trouxe o paciente
  historico_medico  TEXT,                                -- doenças, cirurgias anteriores
  medicamentos      TEXT,
  objetivos         TEXT,                                -- o que espera do tratamento
  observacoes       TEXT,
  profissional_id   UUID REFERENCES usuarios(id) ON DELETE SET NULL,  -- quem cuida dele
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pacientes_usuario    ON pacientes(usuario_id);
CREATE INDEX idx_pacientes_profissional ON pacientes(profissional_id);

-- ==============================================================
-- TABELA: exercicios
-- Banco de exercícios da clínica — cada um com descrição, instruções e mídia.
-- As tags permitem busca por palavras-chave (ex: "lombar", "RPG").
-- ==============================================================
CREATE TABLE IF NOT EXISTS exercicios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(200)        NOT NULL,
  descricao     TEXT,
  instrucoes    TEXT,                                  -- passo a passo pra execução
  musculo_alvo  VARCHAR(100),                          -- grupo muscular trabalhado
  tipo          tipo_exercicio_enum NOT NULL DEFAULT 'outro',
  dificuldade   dificuldade_enum    NOT NULL DEFAULT 'moderado',
  midia_url     TEXT,                                  -- link do vídeo ou foto
  tags          TEXT[]              DEFAULT '{}',      -- array de tags
  ativo         BOOLEAN             NOT NULL DEFAULT TRUE,
  criado_por    UUID                REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercicios_tipo       ON exercicios(tipo);
CREATE INDEX idx_exercicios_dificuldade ON exercicios(dificuldade);
CREATE INDEX idx_exercicios_tags       ON exercicios USING GIN(tags);  -- busca eficiente por tags

-- ==============================================================
-- TABELA: prescricoes
-- Quando o profissional "receita" um exercício pra um paciente,
-- cria um registro aqui com séries, repetições e frequência.
-- ==============================================================
CREATE TABLE IF NOT EXISTS prescricoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID    NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  exercicio_id  UUID    NOT NULL REFERENCES exercicios(id) ON DELETE CASCADE,
  series        INT     NOT NULL DEFAULT 3        CHECK (series > 0),
  repeticoes    INT     NOT NULL DEFAULT 10       CHECK (repeticoes > 0),
  duracao_seg   INT,                               -- pra exercícios isométricos (ex: prancha 30s)
  frequencia    VARCHAR(100),                      -- ex: "3x por semana"
  observacoes   TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_por    UUID    REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescricoes_paciente  ON prescricoes(paciente_id);
CREATE INDEX idx_prescricoes_exercicio ON prescricoes(exercicio_id);

-- ==============================================================
-- TABELA: sessoes_prontuario
-- Prontuário eletrônico: cada vez que o paciente vai na clínica,
-- o profissional registra aqui as notas, evolução e nível de dor.
-- ==============================================================
CREATE TABLE IF NOT EXISTS sessoes_prontuario (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id     UUID    NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  profissional_id UUID    NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  data_sessao     DATE    NOT NULL DEFAULT CURRENT_DATE,
  notas           TEXT,                                    -- anotações livres
  evolucao        TEXT,                                    -- como o paciente evoluiu
  condutas        TEXT,                                    -- o que foi feito na sessão
  nivel_dor_inicio INT   CHECK (nivel_dor_inicio >= 0 AND nivel_dor_inicio <= 10),
  nivel_dor_fim    INT   CHECK (nivel_dor_fim >= 0 AND nivel_dor_fim <= 10),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessoes_paciente     ON sessoes_prontuario(paciente_id);
CREATE INDEX idx_sessoes_profissional ON sessoes_prontuario(profissional_id);
CREATE INDEX idx_sessoes_data         ON sessoes_prontuario(data_sessao);

-- ==============================================================
-- TABELA: checkins
-- Check-in diário do paciente: ele marca se fez o exercício e
-- registra o nível de dor. Só pode fazer 1 check-in por dia por exercício.
-- ==============================================================
CREATE TABLE IF NOT EXISTS checkins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID    NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  prescricao_id UUID    NOT NULL REFERENCES prescricoes(id) ON DELETE CASCADE,
  data          DATE    NOT NULL DEFAULT CURRENT_DATE,
  executado     BOOLEAN NOT NULL DEFAULT FALSE,
  nivel_dor     INT     CHECK (nivel_dor >= 0 AND nivel_dor <= 10),
  observacoes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkins_paciente   ON checkins(paciente_id);
CREATE INDEX idx_checkins_prescricao ON checkins(prescricao_id);
CREATE INDEX idx_checkins_data       ON checkins(data);

-- Impede check-in duplicado: mesmo paciente + mesmo exercício + mesmo dia = erro
CREATE UNIQUE INDEX idx_checkins_unico ON checkins(paciente_id, prescricao_id, data);

-- ==============================================================
-- TRIGGERS: atualiza o campo updated_at automaticamente
-- Toda vez que alguém faz UPDATE numa dessas tabelas,
-- o campo updated_at é atualizado pra data/hora atual.
-- ==============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica o trigger em todas as tabelas que têm updated_at
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY['usuarios','pacientes','exercicios','prescricoes','sessoes_prontuario'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_updated_at();
    ', t, t);
  END LOOP;
END $$;

-- ==============================================================
-- FIM DO DDL
-- ==============================================================
