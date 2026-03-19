# Maya RPG — Walkthrough da Implementação Inicial

## Diagnóstico do Workspace

O projeto tinha um **frontend Next.js 14 parcialmente estruturado** — com layout, AuthContext, Tailwind config e identidade visual Maya, mas **sem páginas, sem backend, sem banco de dados**, e com imports quebrados em `AuthContext.tsx` (referenciando `@/lib/types` e `@/lib/api/client` que não existiam).

---

## O Que Foi Construído

### 🗄️ Banco de Dados PostgreSQL

#### [init.sql](file:///c:/Users/25027869/Documents/GitHub/Projeto11/src/PI%20Maya%20RPG/backend/database/init.sql) — DDL Completo

6 tabelas com ENUMs, constraints, índices e triggers:

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Todos os tipos de usuário (admin, profissional, paciente) com email único, CPF, senha_hash |
| `pacientes` | Dados clínicos vinculados a um usuário (queixa, histórico, objetivos) |
| `exercicios` | Banco de exercícios com tipo, dificuldade, mídia, tags (array + GIN index) |
| `prescricoes` | Exercícios prescritos a pacientes (séries, repetições, frequência) |
| `sessoes_prontuario` | Registro de sessões de atendimento (prontuário eletrônico) |
| `checkins` | Check-ins diários do paciente — execução + nível de dor (0-10) |

#### [seed.sql](file:///c:/Users/25027869/Documents/GitHub/Projeto11/src/PI%20Maya%20RPG/backend/database/seed.sql) — Dados de Teste

- 5 usuários (admin, profissional Maya, 3 pacientes + 2 de teste)
- 10 exercícios reais de RPG (alongamento, fortalecimento, mobilidade, respiratório, postural)
- Prescrições personalizadas por paciente

---

### ⚙️ Backend Node.js (Express + TypeScript)

```
backend/
├── database/
│   ├── init.sql
│   └── seed.sql
├── src/
│   ├── server.ts                 ← Entry point
│   ├── config/
│   │   └── database.ts           ← Pool PostgreSQL
│   ├── middleware/
│   │   └── auth.ts               ← JWT + role-based access
│   └── routes/
│       ├── auth.routes.ts        ← POST /auth/login, /auth/logout
│       ├── pacientes.routes.ts   ← CRUD completo
│       ├── exercicios.routes.ts  ← CRUD + filtros
│       ├── prescricoes.routes.ts ← CRUD por paciente
│       ├── checkins.routes.ts    ← Check-in + evolução semanal
│       └── prontuario.routes.ts  ← Sessões do prontuário
├── package.json
├── tsconfig.json
└── .env.example
```

**Dependências instaladas** (254 packages, 0 vulnerabilities).

---

### 🖥️ Frontend — Correções Críticas

| Arquivo | O que faz |
|---------|-----------|
| [lib/types/index.ts](file:///c:/Users/25027869/Documents/GitHub/Projeto11/src/PI%20Maya%20RPG/lib/types/index.ts) | Interfaces TypeScript para todas as entidades (Usuario, Paciente, Exercicio, Prescricao, Checkin, etc.) |
| [lib/api/client.ts](file:///c:/Users/25027869/Documents/GitHub/Projeto11/src/PI%20Maya%20RPG/lib/api/client.ts) | Cliente axios com interceptors JWT, mock de login em dev, funções tipadas para todos os endpoints |

> Esses dois arquivos **corrigem os imports quebrados** em `AuthContext.tsx`.

## 🚀 Frontend Next.js — Páginas e Componentes

| Categoria | Detalhes |
|---------|-----------|
| **Componentes Compartilhados** | `Button`, `Input`, `Card`, `StatusBadge`, `DificuldadeBadge` implementando a UI Maya. |
| **Navegação** | `AdminSidebar` (Admin/Profissional) e `PacienteSidebar` (Paciente) responsivas com menu mobile. |
| **Contexto & Autenticação** | Tela de `Login` polida com suporte a mocks de desenvolvimento. Roteamento protegido por `ProtectedRoute` verificando as roles do JWT. |
| **Hooks de API** | `lib/hooks/index.ts` usando React Query para buscar pacientes, exercícios, checkins, prescrições e gerir cache. |
| **Painel Admin** | Páginas: `Dashboard` (Kpis e listagem rápida), `Pacientes` (Busca e Cards), `Exercicios` (Galeria e Filtros). |
| **Portal do Paciente** | Páginas: `Início` (Tarefas de hoje e dor média), `Meus Exercícios` (Prescrições detalhadas), `Histórico` (Checkins e Evolução Semanal com abas). |

---

## 🏁 Como Rodar (Testar a Entrega 1)

**Passo 1: Banco de Dados**
Crie um banco PostgreSQL vázio e rode os scripts:
`psql -U postgres -f "backend/database/init.sql"`
`psql -U postgres -d [NOME_DO_DB] -f "backend/database/seed.sql"`

**Passo 2: Iniciar o Backend API (Node.js)**
1. Duplique `backend/.env.example` para `backend/.env` e coloque os dados do seu banco.
2. No diretório `backend`, rode: `npm run dev`

**Passo 3: Iniciar o Frontend Web (Next.js)**
1. No diretório raiz do frontend, rode `npm run dev`
2. Acesse http://localhost:3000
3. Faça login usando os credenciais de teste (mostrados na própria tela de login).

