#  Maya RPG — Aplicativo Mobile
### Entrega 1 — Programação para Dispositivos Móveis
**Projeto Interdisciplinar · 3º Semestre · Ciência da Computação · FECAP 2026-1**

---

##  Sobre o Projeto

Aplicativo mobile desenvolvido com **React Native + Expo** para pacientes da **Clínica Maya Yamamoto RPG** (Reeducação Postural Global).

### Função Principal
Permitir que o paciente visualize seu **plano de exercícios prescrito** pela fisioterapeuta, incluindo:
- Nome, tipo e dificuldade de cada exercício
- Número de séries, repetições e frequência semanal
- Orientações e observações da profissional
- Registro de **check-in diário** com nível de dor (escala 0–10)

---

##  Telas do Aplicativo

| Tela | Descrição |
|------|-----------|
| **Login** | Autenticação do paciente via e-mail e senha (JWT) |
| **Início (Home)** | Saudação personalizada e acesso rápido às funcionalidades |
| **Meus Exercícios** | Lista completa do plano de exercícios prescrito, com detalhes de série, repetição, frequência e nível de dificuldade |
| **Check-in Diário** | Registro da execução do exercício e nível de dor do dia |

---

##  Arquitetura e Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React Native 0.81 + Expo 54 | Framework mobile multiplataforma |
| TypeScript | Tipagem estática |
| React Navigation (Stack + Bottom Tabs) | Navegação entre telas |
| Context API | Gerenciamento de estado de autenticação |
| AsyncStorage | Persistência local de sessão (token JWT) |
| Axios | Integração com a API REST (FastAPI) |
| NativeWind + Tailwind CSS | Estilização dos componentes |
| Lucide React Native | Ícones |

---

##  Pré-requisitos

Instale as ferramentas antes de rodar o projeto:

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (já incluso no Node.js)
- [Expo Go](https://expo.dev/go) instalado no celular **OU** um emulador Android configurado

---

##  Como Rodar o Projeto

### 1. Clone o repositório

    git clone https://github.com/2026-1-NCC3/Projeto11.git
    cd Projeto11

### 2. Acesse a pasta da entrega mobile

    cd "Documentos/Entrega 1/Programação para Dispositivos Móveis"

### 3. Instale as dependências

    npm install

### 4. Inicie o servidor Expo

    npx expo start

Após iniciar, será exibido um **QR Code** no terminal.

---

##  Abrindo no Celular (Expo Go)

1. Instale o app **Expo Go** no seu celular Android ou iOS
2. Abra o Expo Go e escaneie o **QR Code** exibido no terminal
3. O app será carregado automaticamente no seu dispositivo

> **Obs.:** O celular e o computador precisam estar **na mesma rede Wi-Fi**.

---

## 🤖 Rodando no Emulador Android

Com o Android Studio e um AVD (emulador) configurado:

    npx expo start --android

O app abrirá automaticamente no emulador.

---

##  Credenciais de Teste

| E-mail | Senha | Perfil |
|--------|-------|--------|
| `paciente@maya.com` | `123456` | Paciente (acesso ao plano de exercícios) |

> **Importante:** As chamadas à API exigem o **backend (FastAPI)** rodando. Sem o backend, apenas o login responderá com as credenciais acima.

---

##  Backend (API)

A função principal consome a API em produção hospedada no Render:

    https://maya-rpg-api.onrender.com

Endpoints utilizados pelo app:

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Autenticação do paciente |
| `GET` | `/auth/me` | Dados do usuário autenticado |
| `GET` | `/prescricoes/paciente/{id}` | Plano de exercícios do paciente |
| `POST` | `/checkins` | Registrar check-in diário |
| `GET` | `/checkins/paciente/{id}` | Histórico de check-ins |

---

##  Estrutura de Pastas

    Programação para Dispositivos Móveis/
    ├── App.tsx                     # Ponto de entrada do app
    ├── index.ts                    # Registro do componente raiz
    ├── app.json                    # Configuração do Expo
    ├── package.json                # Dependências
    ├── tailwind.config.js          # Config do NativeWind
    ├── assets/                     # Ícones e imagens do app
    └── src/
        ├── api/
        │   └── client.ts           # Cliente HTTP (Axios + interceptor JWT)
        ├── components/
        │   └── LoadingSpinner.tsx
        ├── contexts/
        │   └── AuthContext.tsx     # Contexto de autenticação
        ├── navigation/
        │   └── AppNavigator.tsx    # Navegação (Stack + Bottom Tabs)
        ├── screens/
        │   ├── LoginScreen.tsx         # Tela de login
        │   ├── HomeScreen.tsx          # Tela inicial
        │   ├── ExercisesScreen.tsx     # Plano de exercícios (função principal)
        │   └── CheckinScreen.tsx       # Check-in diário
        └── types/
            └── index.ts            # Tipos TypeScript

---

##  Equipe

Projeto desenvolvido para a disciplina de **Programação para Dispositivos Móveis** — FECAP 2026-1.

> Clínica Maya Yamamoto RPG · Reeducação Postural Global
