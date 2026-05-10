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

Para resolver essa necessidade real, o grupo **DevLeaders** desenvolveu o **Sistema Maya Yamamoto RPG**: uma solução digital integrada (Offline-First) composta por três módulos:

- **Aplicativo Mobile (Paciente - Android):** Permite ao paciente acessar o plano de exercícios prescrito, registrar a execução das atividades em formato de RPG, acompanhar sua própria evolução e receber notificações locais. **Possui arquitetura Offline-First (salva check-ins sem internet e sincroniza depois)**.
- **Módulo Web (Profissional/Admin):** Painel web completo para a fisioterapeuta gerenciar pacientes, prescrever exercícios e monitorar os check-ins diários em tempo real (com alertas de dor intensa).
- **Backend (API REST) + Nuvem:** O motor do sistema hospedado no Render com banco de dados Serverless Neon (PostgreSQL).

---

## 🎯 Entregas Acadêmicas (Semestre 2026/1)

Os artefatos exigidos pelas Unidades Curriculares encontram-se nos diretórios abaixo:

- **POO & Estrutura de Dados:** [Ver Diagrama de Classes e Arquitetura UML](./POO)
- **Análise Descritiva de Dados:** [Ver Script Python e Análises Estatísticas](./Documentos/analise)
- **Desenvolvimento Mobile & PI:** Código-fonte disponível na pasta `./App Mobile`

---

##  Objetivos Alcançados

- ✔️ Digitalizar e centralizar a gestão clínica da Clínica Maya Yamamoto RPG.
- ✔️ Painel completo em Next.js operando em nuvem (Vercel).
- ✔️ Aplicativo Android Nativo gamificado e resiliente a quedas de rede (SQLite e OkHttp).
- ✔️ Comunicação fim-a-fim entre Paciente e Fisioterapeuta via API REST.

---

## Funcionalidades Integradas

**Módulo Admin (Profissional - Web):**
- Cadastro profundo simultâneo de pacientes e contas de acesso.
- Criação e gerenciamento da biblioteca de exercícios.
- Prescrição individualizada vinculada ao perfil.
- Histórico em tempo real de Check-ins reportados pelo mobile, com **Badges de Alerta de Dor (Nível >= 7)**.

**Módulo Paciente (Mobile Android):**
- Login seguro via JWT.
- Listagem dinâmica de plano de treino vindos da API.
- Sistema de **Check-in Offline-First**: O paciente registra a dor e observações. Se não houver internet, o app guarda no SQLite local e reenvia automaticamente quando a conexão voltar.
- **Notificações Locais (AlarmManager)**: O app avisa o paciente diariamente às 18:00 hrs para não esquecer os exercícios.
- Aceite de termos de LGPD persistido.

---

## Estrutura de Pastas

```
Projeto11/
│
├── App Mobile/                 # Aplicativo Android Nativo (Java, SQLite)
│   └── MayaRPG/                # Código-fonte do app Mobile
│
├── Documentos/                 # Documentações, Slides e Banners do projeto
│   └── analise/                # Entregáveis da UC de Análise de Dados (Python, Box Plots)
│
├── POO/                        # Entregáveis da UC de Orientação a Objetos (UML/Diagramas)
│
├── src/PI Maya RPG/            # Monorepo Web e Backend
│   ├── app/                    # Painel Administrativo Web (Next.js 14 App Router)
│   └── backend/                # API REST Node.js/Express + Seeders PostgreSQL
│
└── README.md                   # Esta documentação central
```

---

## Tecnologias Utilizadas

**Mobile (Android):**
- **Linguagem:** Java Nativo (Android SDK)
- **Rede:** OkHttp3 (Timeouts resilientes de 60s contra Cold Starts)
- **Armazenamento Local:** SQLite (DatabaseHelper) e SharedPreferences
- **Background Tasks:** Threads assíncronas e AlarmManager (Notificações)

**Frontend (Web):**
- **Framework:** Next.js 14 (App Router) + React + TypeScript
- **Estilização:** Tailwind CSS + Radix UI + Lucide React
- **Deploy:** Vercel

**Backend (API) & Nuvem:**
- **Servidor:** Node.js + Express (Deploy no Render)
- **Banco de Dados:** PostgreSQL Serverless hospedado na nuvem Neon.
- **Segurança:** Autenticação via JWT (Bearer tokens) e bcryptjs.
- **Banco de Dados Engine:** Driver `pg` (Raw SQL sem ORMs).

---

## Licença

<p>
FECAP - Fundação de Comércio Álvares Penteado © 2026 by
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
