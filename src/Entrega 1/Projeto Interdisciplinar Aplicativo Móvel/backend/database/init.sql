-- ============================================================
-- Maya Yamamoto RPG — DDL do Banco de Dados
-- Clínica de Reeducação Postural Global (RPG)
-- Projeto Interdisciplinar · FECAP 2026-1
-- ============================================================

-- Criar banco (executar como superuser ou ajustar conforme ambiente)
-- CREATE DATABASE maya_rpg;

-- Conecte ao banco maya_rpg antes de rodar o restante deste script.

-- ============================================================
-- EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TIPOS ENUMERADOS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('admin', 'profissional', 'paciente');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dificuldade_enum AS ENUM ('facil', 'moderado', 'dificil');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tipo_exercicio_enum AS ENUM ('alongamento', 'fortalecimento', 'mobilidade', 'respiratorio', 'postural', 'outro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABELA: usuarios
-- Armazena todos os tipos de usuário (admin, profissional, paciente)
-- ============================================================
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

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role  ON usuarios(role);

-- ============================================================
-- TABELA: pacientes
-- Dados clínicos extras vinculados a um usuario com role = 'paciente'
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id        UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  queixa_principal  TEXT,
  historico_medico  TEXT,
  medicamentos      TEXT,
  objetivos         TEXT,
  observacoes       TEXT,
  profissional_id   UUID REFERENCES usuarios(id) ON DELETE SET NULL,  -- profissional responsável
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pacientes_usuario    ON pacientes(usuario_id);
CREATE INDEX idx_pacientes_profissional ON pacientes(profissional_id);

-- ============================================================
-- TABELA: exercicios
-- Banco de exercícios com mídias e tags
-- ============================================================
CREATE TABLE IF NOT EXISTS exercicios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(200)        NOT NULL,
  descricao     TEXT,
  instrucoes    TEXT,
  musculo_alvo  VARCHAR(100),
  tipo          tipo_exercicio_enum NOT NULL DEFAULT 'outro',
  dificuldade   dificuldade_enum    NOT NULL DEFAULT 'moderado',
  midia_url     TEXT,                          -- URL de vídeo / imagem demonstrativa
  tags          TEXT[]              DEFAULT '{}',
  ativo         BOOLEAN             NOT NULL DEFAULT TRUE,
  criado_por    UUID                REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercicios_tipo       ON exercicios(tipo);
CREATE INDEX idx_exercicios_dificuldade ON exercicios(dificuldade);
CREATE INDEX idx_exercicios_tags       ON exercicios USING GIN(tags);

-- ============================================================
-- TABELA: prescricoes
-- Exercícios prescritos a um paciente
-- ============================================================
CREATE TABLE IF NOT EXISTS prescricoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID    NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  exercicio_id  UUID    NOT NULL REFERENCES exercicios(id) ON DELETE CASCADE,
  series        INT     NOT NULL DEFAULT 3        CHECK (series > 0),
  repeticoes    INT     NOT NULL DEFAULT 10       CHECK (repeticoes > 0),
  duracao_seg   INT,                               -- duração em segundos (para exercícios isométricos)
  frequencia    VARCHAR(100),                      -- ex: "3x por semana"
  observacoes   TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_por    UUID    REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescricoes_paciente  ON prescricoes(paciente_id);
CREATE INDEX idx_prescricoes_exercicio ON prescricoes(exercicio_id);

-- ============================================================
-- TABELA: sessoes_prontuario
-- Registro de sessões de atendimento (prontuário eletrônico)
-- ============================================================
CREATE TABLE IF NOT EXISTS sessoes_prontuario (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id     UUID    NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  profissional_id UUID    NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  data_sessao     DATE    NOT NULL DEFAULT CURRENT_DATE,
  notas           TEXT,
  evolucao        TEXT,
  condutas        TEXT,
  nivel_dor_inicio INT   CHECK (nivel_dor_inicio >= 0 AND nivel_dor_inicio <= 10),
  nivel_dor_fim    INT   CHECK (nivel_dor_fim >= 0 AND nivel_dor_fim <= 10),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessoes_paciente     ON sessoes_prontuario(paciente_id);
CREATE INDEX idx_sessoes_profissional ON sessoes_prontuario(profissional_id);
CREATE INDEX idx_sessoes_data         ON sessoes_prontuario(data_sessao);

-- ============================================================
-- TABELA: checkins
-- Check-in diário do paciente (execução de exercício + dor)
-- ============================================================
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

-- Impede check-in duplicado no mesmo dia para a mesma prescrição
CREATE UNIQUE INDEX idx_checkins_unico ON checkins(paciente_id, prescricao_id, data);

-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================================
-- FIM DO DDL
-- ============================================================
