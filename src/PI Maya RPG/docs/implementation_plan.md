# PI Maya RPG — Plano de Implementação (Entrega Servidor Cloud e Mobile App)

## Objetivo
Atender aos requisitos de: Servidor com banco de dados na nuvem, aplicativo (React Native/Expo) com funcionalidade principal funcionando e comunicando com o servidor. Entrega final com código fonte e APK/AAB. Implementar o sistema principal, eliminando erros.

---

## Estratégia de Execução em Partes

A execução será estritamente dividida. Após cada parte, faremos um commit atômico e o sistema pausará aguardando sua confirmação para prosseguir.

### Parte 1: Nuvem & Preparação do Servidor (Infraestrutura)
**Objetivos:**
- Atualizar conexão de banco de dados no backend para suportar string de conexão externa (Nuvem).
- Configurar portas e preparar o servidor Express para deploy (ex: Render/Railway) ou túnel (Ngrok) para o App Mobile acessar provisoriamente.
- *Commit: `chore(backend): setup cloud database and hosting prep`*

### Parte 2: Inicialização do App Mobile (Expo + React Native)
**Objetivos:**
- Criar a raiz do projeto Expo (pasta `mobile/`) dentro do repositório.
- Instalar bibliotecas essenciais: React Navigation, Axios, AsyncStorage, Lucide React Native, Tailwind v3 (Nativewind).
- Estruturar diretórios arquiteturais (screens, api, contexts, components).
- *Commit: `init(mobile): create expo app structure and dependencies`*

### Parte 3: Autenticação Mobile & Comunicação API
**Objetivos:**
- Desenvolver o Service de API (Axios Mobile) apontando para o servidor nuvem/túnel.
- Criar Autenticação no Mobile (Context API + AsyncStorage para JWT).
- Construir a tela de Login (`LoginScreen`) esteticamente agradável.
- *Commit: `feat(mobile): implement core authentication flow`*

### Parte 4: Interface e Funcionalidades Core (Paciente)
**Objetivos:**
- **Início (`HomeScreen`):** Visão geral e atalhos rápidos do dia.
- **Lista de Exercícios (`ExercisesScreen`):** Fetch e listagem limpa das rotinas de RPG prescritas pelo fisioterapeuta.
- **Check-in de Dor (`CheckinScreen`):** Fluxo para o paciente submeter dados ao banco de dados sobre a execução e dor (0 a 10).
- *Commit: `feat(mobile): implement exercises list and daily checkin`*

### Parte 5: Polimento e Resiliência
**Objetivos:**
- Revisão de UI/UX (Feedback de botões nativos, SafeArea, teclado).
- Tratamento de exceções (alertas visuais se a API/Nuvem falhar ou não houver rede).
- *Commit: `fix(mobile): UI polish and error handling`*

### Parte 6: Build e Artefato Final (EAS)
**Objetivos:**
- Configuração do Expo Application Services (`eas.json` e `app.json`).
- Execução do build para gerar o artefato Android(`.aab` e `.apk`) via infraestrutura da Expo (ou localmente).
- Entrega limpa com APK pronto.
- *Commit: `chore(mobile): configure EAS and build android APK`*

---

## Observações Críticas
- **Banco de Dados Real:** Assumo que nós (o usuário e a IA) cuidaremos da string na Nuvem (por exemplo: você criará um DB postgres gratis no Supabase ou Neon, e me passará a Connection String na Parte 1).
- **Backend Host:** Se o build do backend for para Render/Railway, você terá de subir e me passar o link, mas para contornar, podemos usar um túnel local via IP de máquina, testando o APK na mesma rede wifi.
- Em cada pausa (`notify_user`), você checará o código, garantirá que roda e fará o *push*.
