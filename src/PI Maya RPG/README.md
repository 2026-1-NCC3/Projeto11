# Maya Yamamoto RPG — Módulo Web

Sistema web (painel profissional/admin e portal do paciente) da **Clínica Maya Yamamoto RPG**, especializada em Reeducação Postural Global (RPG).

Projeto Interdisciplinar 3º Semestre — Ciência da Computação — FECAP 2026-1.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, React Query, React Hook Form, Zod, Recharts, Framer Motion
- **Backend:** FastAPI (consumido via REST API — repositório separado)

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend FastAPI rodando (para integração completa)

## Setup

1. Clone o repositório e entre na pasta do projeto:

```bash
cd "PI Maya RPG"
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Edite `.env.local` e configure:

- `NEXT_PUBLIC_API_URL`: URL base da API FastAPI (ex.: `http://localhost:8000`)

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Login de teste (sem backend)

Em modo de desenvolvimento (`npm run dev`), você pode entrar com estes usuários sem precisar do backend:

| E-mail | Senha | Acesso |
|--------|------|--------|
| `teste@maya.com` | `123456` | Painel admin (Dashboard, Pacientes, Exercícios, etc.) |
| `paciente@maya.com` | `123456` | Portal do paciente (Início, Meus exercícios, Histórico) |

As demais chamadas à API (listar pacientes, exercícios, etc.) continuarão exigindo o backend; o login de teste só permite acessar as telas e navegação.

## Variáveis de ambiente

| Variável               | Descrição                          | Exemplo              |
|------------------------|------------------------------------|----------------------|
| `NEXT_PUBLIC_API_URL`  | URL base do backend FastAPI        | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação (opcional)       | `Maya Yamamoto RPG`  |

## Estrutura principal

- `app/(auth)` — Login
- `app/(admin)` — Módulo profissional: Dashboard, Pacientes, Exercícios, Avaliações, Configurações
- `app/(paciente)` — Portal do paciente: Início, Meus exercícios, Histórico, Perfil
- `lib/api` — Cliente HTTP e funções de chamada à API
- `lib/hooks` — React Query hooks
- `lib/types` — Tipos TypeScript
- `components/shared` — Componentes reutilizáveis (MayaAvatar, StatusBadge, DorSlider, etc.)
- `contexts` — AuthContext

## API (FastAPI)

O frontend espera os seguintes endpoints (entre outros descritos no prompt do projeto):

- **Auth:** `POST /auth/login` (body: `email`, `senha`), `POST /auth/logout`
- **Pacientes:** `GET/POST /pacientes`, `GET/PUT/PATCH/DELETE /pacientes/{id}`
- **Exercícios:** `GET/POST /exercicios`, `GET/PUT/DELETE /exercicios/{id}`
- **Prescrições:** `GET/POST /pacientes/{id}/prescricoes`, `PUT/DELETE /prescricoes/{id}`
- **Prontuário:** `GET/POST /pacientes/{id}/prontuario/sessoes`
- **Check-ins:** `POST /checkins`, `GET /pacientes/{id}/checkins`, `GET /pacientes/{id}/evolucao`

Consulte a documentação do backend (Swagger/OpenAPI) para contratos exatos.

## Scripts

- `npm run dev` — Desenvolvimento
- `npm run build` — Build de produção
- `npm run start` — Servir build
- `npm run lint` — Lint

## Identidade visual

Cores e tipografia seguem o manual da clínica (teal, coral, bege, marrom). Tipografia: Roboto e Roboto Condensed (Google Fonts).

## Licença

Uso acadêmico — FECAP 2026-1.
