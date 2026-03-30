# 📱 Maya RPG — Aplicativo Mobile
### Entrega 1 — Programação para Dispositivos Móveis
**Projeto Interdisciplinar · 3º Semestre · Ciência da Computação · FECAP 2026-1**

---

## 📋 Sobre o Projeto

Aplicativo mobile desenvolvido com **React Native + Expo** para pacientes da **Clínica Maya Yamamoto RPG** (Reeducação Postural Global).

### Função Principal
Permitir que o paciente visualize seu **plano de exercícios prescrito** pela fisioterapeuta, incluindo:
- Nome, tipo e dificuldade de cada exercício
- Número de séries, repetições e frequência semanal
- Orientações e observações da profissional
- Registro de **check-in diário** com nível de dor (escala 0–10)

---

## 🖥️ Telas do Aplicativo

| Tela | Descrição |
|------|-----------|
| **Login** | Autenticação do paciente via e-mail e senha (JWT) |
| **Início (Home)** | Saudação personalizada e acesso rápido às funcionalidades |
| **Meus Exercícios** | Lista completa do plano de exercícios prescrito, com detalhes de série, repetição, frequência e nível de dificuldade |
| **Check-in Diário** | Registro da execução do exercício e nível de dor do dia |

---

## 🏗️ Arquitetura e Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React Native 0.81 + Expo 54 | Framework mobile multiplataforma |
| TypeScript | Tipagem estática |
| React Navigation (Stack + Bottom Tabs) | Navegação entre telas (equivalente a Activities + Fragments) |
| Context API | Gerenciamento de estado de autenticação |
| AsyncStorage | Persistência local de sessão (token JWT) |
| Axios | Integração com a API REST (FastAPI) |
| NativeWind + Tailwind CSS | Estilização dos componentes |
| Lucide React Native | Ícones |

---

## ⚙️ Pré-requisitos

Instale as ferramentas antes de rodar o projeto:

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (já incluso no Node.js)
- [Expo Go](https://expo.dev/go) instalado no celular **OU** um emulador Android configurado

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/2026-1-NCC3/Projeto11.git
cd Projeto11
