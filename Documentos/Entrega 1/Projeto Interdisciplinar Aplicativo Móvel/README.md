#  Maya RPG — Projeto Interdisciplinar
### Entrega: Servidor na Nuvem + Aplicativo Mobile
**Ciência da Computação · FECAP 2026-1**

---

##  Escopo da Entrega

Este repositório contém a solução completa da **Clínica Maya Yamamoto RPG**:
1.  **Backend (Servidor)**: API REST desenvolvida para gerenciar pacientes e exercícios, com banco de dados na nuvem.
2.  **Frontend (Mobile)**: Aplicativo para pacientes visualizarem seus planos e realizarem check-ins.
3.  **APK**: Versão instalável do aplicativo para testes imediatos.

---

## 1. Servidor e Banco de Dados

O servidor está operacional e hospedado na nuvem (Render), permitindo a comunicação em tempo real.

- **URL da API**: `https://maya-rpg-api.onrender.com`
- **Banco de Dados**: PostgreSQL (Hospedado via Render/Supabase)
- **Código Fonte**: Localizado na pasta `/backend` desta entrega.

---

## 2. Aplicativo Mobile

O aplicativo permite a visualização do plano de exercícios e o registro de evolução do paciente.

- **Status**: Funcional e comunicando com o servidor.
- **Função Principal**: Visualização de prescrições e Registro de Check-in.
- **APK**: Arquivo `App Mobile Maya RPG.apk` disponível nesta pasta para instalação.

---

##  Credenciais para Avaliação

| Perfil | E-mail | Senha |
|---|---|---|
| **Paciente** | `paciente@maya.com` | `123456` |

---

##  Estrutura da Entrega

```text
📁 Projeto Interdisciplinar Aplicativo Móvel/
├── 📄 App Mobile Maya RPG.apk      # Instalador Android
├── 📄 README.md                    # Este guia
│
├── 📁 backend/                     # CÓDIGO FONTE DO SERVIDOR
│   ├── src/                        # Rotas, controllers e lógica
│   ├── database/                   # Scripts SQL do banco de dados
│   └── package.json                # Dependências do servidor
│
└── 📁 mobile/                      # CÓDIGO FONTE DO APLICATIVO
    ├── src/                        # Telas (Screens) e Integração API
    ├── assets/                     # Imagens e ícones
    └── App.tsx                     # Ponto de entrada do App
```

---

## Como Executar (Ambiente de Desenvolvimento)

### Backend
1. Entre na pasta `backend`
2. Execute `npm install`
3. Execute `npm start`

### Mobile
1. Entre na pasta `mobile`
2. Execute `npm install`
3. Execute `npx expo start`

---

##  Equipe
Projeto desenvolvido para o Projeto Interdisciplinar — FECAP 2026-1.
