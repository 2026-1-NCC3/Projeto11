# FECAP - Fundação de Comércio Álvares Penteado
<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# Grupo: DevLeaders

## Integrantes: <a href="https://github.com/LuizZaim/">Luiz Henrique Zaim da Cruz</a>, <a href="https://github.com/lucio734/">Lúcio Vecchio</a>, <a href="https://github.com/GustavoDinizFroes/">Gustavo Diniz Froes</a>, <a href="https://github.com/Gustavo7122/">Gustavo Felizardo Pires</a>

## Professores Orientadores: <a href="https://www.linkedin.com/in/katia-bossi/">Katia Bossi</a>, <a href="https://www.linkedin.com/in/marco-aurelio-lima-barbosa/">Marco Aurélio</a>, <a href="https://www.linkedin.com/in/victorbarq/">Victor Rosetti</a>, <a href="https://www.linkedin.com/in/rodrigo-da-rosa-phd/">Rodrigo da Rosa</a>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dcca1848-6658-4202-81a6-53a3d6ae1c44" width="450" height="450" alt="logo dev leaders" border="0">
</p>

## Proposta do Projeto

A [Clínica Maya Yoshiko Yamamoto](https://mayayamamoto.com.br/) é especializada em **Reeducação Postural Global (RPG)**, técnica fisioterapêutica que trata desequilíbrios posturais de forma global e integrada. Atualmente, o acompanhamento dos pacientes ocorre de forma dispersa: por mensagens, registros não padronizados e controles manuais, o que dificulta a rastreabilidade dos prontuários, o planejamento de exercícios domiciliares e o monitoramento da evolução clínica.

Para resolver essa necessidade real, o grupo **DevLeaders** desenvolve o **Sistema Maya Yamamoto RPG**: uma solução digital integrada composta por três módulos complementares:

- **Aplicativo Mobile (paciente):** permite ao paciente acessar o plano de exercícios prescrito (com vídeos e imagens), registrar a execução das atividades, acompanhar sua própria evolução e receber lembretes de rotina.

- **Módulo Web (profissional/admin):** painel completo para a fisioterapeuta gerenciar pacientes, abrir e consultar prontuários eletrônicos, cadastrar exercícios, realizar prescrições individualizadas e acompanhar indicadores de adesão e evolução.

- **Backend (API REST) + Banco de Dados:** camada de serviços responsável pela autenticação, regras de negócio, persistência dos dados e integração entre o aplicativo mobile e o módulo web.

O fluxo principal do sistema segue três etapas:

1. **Cadastro e Avaliação:** a profissional registra o paciente, realiza a avaliação funcional e abre o prontuário eletrônico.
2. **Prescrição:** a profissional seleciona exercícios do banco de mídia, define frequência e orientações; o paciente acessa tudo pelo aplicativo.
3. **Acompanhamento:** o paciente registra a execução e indicadores (como nível de dor de 0 a 10); a profissional acompanha a evolução e ajusta a conduta terapêutica.


---

##  Objetivos

- Digitalizar e centralizar a gestão clínica da Clínica Maya Yamamoto RPG, eliminando processos manuais em papel
- Oferecer aos fisioterapeutas um painel completo para gerenciar pacientes, exercícios, prescrições e prontuários eletrônicos
- Proporcionar aos pacientes um portal intuitivo para acompanhar seus exercícios prescritos, histórico de sessões e evolução postural

---

## Funcionalidades

**Módulo Admin (Profissional):**
- Dashboard com visão geral de pacientes, exercícios e atividade recente
- Cadastro, listagem, edição e exclusão de pacientes
- Criação e gerenciamento de exercícios com vídeo demonstrativo
- Registro de avaliações posturais e sessões de prontuário
- Prescrição de exercícios individualizados por paciente
- Configurações de conta e perfil profissional

**Módulo Paciente:**
- Portal com visão geral do plano de tratamento
- Listagem de exercícios prescritos com vídeo e instruções
- Histórico de sessões e registro de check-ins de dor
- Gerenciamento de perfil pessoal

**Geral:**
- Autenticação segura com JWT (login separado por perfil: admin e paciente)
- API REST integrada ao banco de dados PostgreSQL
- Interface responsiva e animada

---

## Estrutura de Pastas

```
src/PI Maya RPG/
│
├── app/                        # Rotas e páginas (Next.js App Router)
│   ├── (auth)/                 # Tela de login
│   ├── (admin)/                # Módulo profissional
│   │   ├── dashboard/
│   │   ├── pacientes/
│   │   ├── exercicios/
│   │   ├── avaliacoes/
│   │   └── configuracoes/
│   └── (paciente)/             # Portal do paciente
│       ├── inicio/
│       ├── meus-exercicios/
│       ├── historico/
│       └── perfil/
│
├── backend/                    # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── routes/             # Rotas da API (auth, pacientes, exercícios, etc.)
│   │   ├── middleware/         # Middlewares de autenticação e validação
│   │   └── config/             # Configurações do servidor e banco
│   └── database/               # Scripts SQL (init e seed)
│
├── components/
│   └── shared/                 # Componentes reutilizáveis (MayaAvatar, StatusBadge, etc.)
│
├── contexts/                   # AuthContext (gerenciamento de sessão)
│
├── lib/                        # Utilitários
│   ├── api/                    # Cliente HTTP e funções de chamada à API
│   ├── hooks/                  # React Query hooks
│   ├── types/                  # Tipos TypeScript globais
│   └── utils/                  # Funções auxiliares
│
├── styles/                     # Estilos globais (Tailwind CSS)
├── middleware.ts               # Middleware de autenticação Next.js
└── next.config.js
```

---

## Tecnologias Utilizadas

**Frontend:**
- [Next.js 14](https://nextjs.org/) — Framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — Estilização utilitária
- [React Query (TanStack)](https://tanstack.com/query) — Gerenciamento de estado assíncrono
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Formulários e validação
- [Framer Motion](https://www.framer.com/motion/) — Animações
- [Recharts](https://recharts.org/) — Gráficos e visualização de dados
- [Radix UI](https://www.radix-ui.com/) — Componentes acessíveis (Dialog, Select, Tabs, etc.)
- [Axios](https://axios-http.com/) — Cliente HTTP
- [Lucide React](https://lucide.dev/) — Ícones

**Backend:**
- [Node.js](https://nodejs.org/) — Ambiente de execução
- [Express](https://expressjs.com/) — Framework para API REST
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Hash de senhas
- [JSON Web Token (JWT)](https://jwt.io/) — Autenticação stateless
- [Helmet](https://helmetjs.github.io/) + [CORS](https://github.com/expressjs/cors) — Segurança da API
- [Zod](https://zod.dev/) — Validação de dados no servidor

---

## Instalação e Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) — para o banco de dados

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/2026-1-NCC3/Projeto11.git
```

**2. Acesse a pasta do projeto**
```bash
cd Projeto11/src/PI\ Maya\ RPG
```

**3. Instale as dependências do frontend**
```bash
npm install
```

**4. Configure as variáveis de ambiente do frontend**
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Maya Yamamoto RPG
```

**5. Instale as dependências do backend**
```bash
cd backend
npm install
```

**6. Configure as variáveis de ambiente do backend**
```bash
cp .env.example .env
```

**7. Inicialize o banco de dados PostgreSQL**
```bash
psql -U postgres -f database/init.sql
psql -U postgres -f database/seed.sql
```

**8. Execute o backend**
```bash
npm run dev
```

**9. Em outro terminal, execute o frontend**
```bash
cd ..
npm run dev
```

**10. Acesse no navegador**
```
http://localhost:3000
```

> **Login de teste (sem backend completo):**
> | E-mail | Senha | Acesso |
> |---|---|---|
> | `teste@maya.com` | `123456` | Painel Admin |
> | `paciente@maya.com` | `123456` | Portal do Paciente |

---

##  Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados relacional. Os scripts de criação e população inicial estão em `backend/database/`:

- `init.sql` — Criação das tabelas (pacientes, exercícios, prescrições, prontuário, check-ins, usuários)
- `seed.sql` — Dados iniciais para desenvolvimento e testes

As principais entidades são: **Usuários**, **Pacientes**, **Exercícios**, **Prescrições**, **Sessões de Prontuário** e **Check-ins de Dor**.

---

## Referências

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Express.js](https://expressjs.com/pt-br/)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)

---

## Licença

<p>
FECAP - Fundação de Comércio Álvares Penteado © 2025 by
<a href="https://github.com/LuizZaim/">Luiz Henrique Zaim da Cruz</a>,
<a href="https://github.com/lucio734/">Lúcio Vecchio</a>,
<a href="https://github.com/GustavoDinizFroes/">Gustavo Diniz Froes</a>,
<a href="https://github.com/Gustavo7122/">Gustavo Felizardo Pires</a>
is licensed under
<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" height="20" width="20" style="margin-left:0.2em;">
<img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" height="20" width="20" style="margin-left:0.2em;">
<img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" height="20" width="20" style="margin-left:0.2em;">
</p>
