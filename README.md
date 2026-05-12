# FECAP - Fundação de Comércio Álvares Penteado
<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# Grupo: DevLeaders

## Integrantes: <a href="https://github.com/LuizZaim/">Luiz Henrique Zaim da Cruz</a>, <a href="https://github.com/lucio734/">Lúcio Vecchio</a>, <a href="https://github.com/GustavoDinizFroes/">Gustavo Diniz Froes</a>, <a href="https://github.com/Gustavo7122/">Gustavo Felizardo Pires</a>

## Professores Orientadores: <a href="https://www.linkedin.com/in/katia-bossi/">Kátia M. Lara Bossi</a>, <a href="https://www.linkedin.com/in/marco-aurelio-lima-barbosa/">Marco Aurélio Lima Barbosa</a>, <a href="https://www.linkedin.com/in/victorbarq/">Victor Bruno Alexander Rosetti de Quiroz</a>, <a href="https://www.linkedin.com/in/rodrigo-da-rosa-phd/">Rodrigo da Rosa</a>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dcca1848-6658-4202-81a6-53a3d6ae1c44" width="450" height="450" alt="logo dev leaders" border="0">
</p>

## Descrição do Projeto

A [Clínica Maya Yoshiko Yamamoto](https://mayayamamoto.com.br/) é especializada em **Reeducação Postural Global (RPG)**. Antes do nosso projeto, o acompanhamento dos pacientes era realizado de forma descentralizada e manual: os prontuários eram físicos e o monitoramento dos exercícios domiciliares era feito via mensagens de WhatsApp. Isso dificultava a rastreabilidade do histórico clínico e impedia uma análise precisa sobre a adesão do paciente ao tratamento.

Para resolver esse gargalo operacional, o nosso grupo (DevLeaders) desenvolveu o **Sistema Maya Yamamoto RPG**, uma solução integrada que centraliza e digitaliza o fluxo da clínica.

O fluxo modernizado funciona assim: através do Painel Web, a fisioterapeuta cadastra o paciente, abre o prontuário eletrônico e realiza a prescrição de exercícios. Imediatamente, essa rotina é disponibilizada no aplicativo Android do paciente. Após realizar os exercícios em casa, o paciente registra a execução e o nível de dor através de um "Check-in" diário no app. Esses dados são sincronizados com o servidor em nuvem e exibidos em tempo real no dashboard da fisioterapeuta, permitindo decisões clínicas baseadas em dados sem o uso de papel.

O projeto é estruturado em três frentes complementares:

- **Módulo Web (Admin/Profissional):** Um painel de gestão para a fisioterapeuta administrar prontuários, exercícios e acompanhar o feedback diário reportado via mobile.
- **Aplicativo Mobile (Paciente):** Um app Android nativo focado em usabilidade, onde o paciente consulta suas prescrições, visualiza orientações e reporta seu progresso através de um sistema de Check-in Offline-First.
- **Backend (API REST) e Banco de Dados:** Uma API que orquestra a comunicação segura (com JWT) entre o app e o painel web, persistindo os dados em um banco PostgreSQL na nuvem.

---

## Entregas

Os arquivos necessários para as avaliações das disciplinas estão separados nestas pastas:


- **Desenvolvimento Mobile & PI:** Código-fonte disponível na pasta `./App Mobile`. 
  - **Download do APK Instalável:** Você pode encontrar o arquivo para instalar direto no Android no caminho `./App Mobile/MayaRPG/app/build/outputs/apk/debug/app-debug.apk`
    
- **Painel Web (Admin):** Sistema web oficial hospedado na nuvem.
  - **Acessar o Painel:** [https://maya-rpg-web-three.vercel.app](https://maya-rpg-web-three.vercel.app)
  - **Credenciais de Teste (Fisioterapeuta):** `admin@maya.com` / Senha: `123456`

- **Programação Orientada a Objetos e Estrutura de Dados:** Diagrama de Classes Completo do Projeto disponível em [`Documentos/Entrega 2/Programação Orientada a Objetivos e Estrutura de Dados/README.md`](Documentos/Entrega%202/Programa%C3%A7%C3%A3o%20Orientada%20a%20Objetivos%20e%20Estrutura%20de%20Dados/README.md).
    
---

## Funcionalidades do Sistema

**Módulo Admin (Fisioterapeuta - Web):**
- **Dashboard e Gestão:** Controle total de pacientes cadastrados e acesso rápido a dados recentes.
- **Criação de Usuários:** Cadastro de novos pacientes integrado à geração automática de credenciais para o App.
- **Biblioteca de Exercícios:** Cadastro de exercícios com descrições, nível de dificuldade, instruções e links para vídeos demonstrativos.
- **Prescrição Individualizada:** Atribuição de treinos customizados para cada paciente (frequência, repetições, duração).
- **Monitoramento em Tempo Real:** Visualização do histórico de Check-ins enviados pelo aplicativo.
- **Sistema de Alertas Clínicos:** Notificação visual vermelha no painel caso o paciente reporte um nível de dor intenso (Nível >= 7).

**Módulo Paciente (App Android):**
- **Autenticação Segura:** Login utilizando tokens JWT.
- **Visualização de Treinos:** Interface que lista de forma dinâmica os exercícios prescritos, incluindo vídeos e orientações.
- **Check-in Offline-First:** Formulário diário onde o paciente reporta a conclusão do treino, nível de dor (0 a 10) e observações. Os dados são salvos localmente (SQLite) e, em caso de falta de internet, são sincronizados em *background* assim que a conexão é restaurada.
- **Notificações Locais (AlarmManager):** Lembretes automáticos agendados localmente no sistema do celular para garantir o engajamento diário aos treinos.
- **Conformidade LGPD:** Tela de consentimento de privacidade persistida no banco de dados.

---

## Estrutura de Pastas

```
Projeto11/
├── App Mobile/
│   └── MayaRPG/
│       └── app/build/outputs/apk/debug/app-debug.apk
├── Documentos/
│   ├── Entrega 1/
│   └── Entrega 2/
├── src/PI Maya RPG/
│   ├── app/
│   └── backend/
└── README.md  
```

---

## Stack Tecnológico Utilizado

**Mobile (Android):**
- Desenvolvido nativamente em **Java** usando o Android Studio.
- Comunicação web feita com a biblioteca **OkHttp**.
- Salva dados localmente no celular com **SQLite** e `SharedPreferences`.
- Usa o `AlarmManager` nativo do Android pros lembretes.

**Frontend (Painel Web):**
- Construído com **Next.js 14** e React.
- Tipagem usando **TypeScript**.
- Estilizado rapidamente com **Tailwind CSS**.
- Tá rodando em produção na nuvem da **Vercel**.

**Backend (API):**
- Feito em **Node.js** com **Express**.
- O banco de dados escolhido foi o **PostgreSQL**, e está hospedado online no **Neon**.
- A API está no plano gratuito do **Render**.
- Usamos **JWT** pra fazer o login e verificar as permissões.

---

## 🛠️ Instalação

### Android (Aplicativo Móvel):
Para utilizar o aplicativo em seu smartphone Android, basta baixar o arquivo executável (APK):
1. Acesse a pasta: `Documentos/Entrega 2/Projeto Interdisciplinar Aplicativo Móvel/`.
2. Baixe o arquivo **app-debug.apk** para o seu celular.
3. No celular, abra o arquivo e siga as instruções de instalação (autorize a instalação de "Fontes Desconhecidas" se solicitado).

### Painel Web (Administrador):
Não é necessária nenhuma instalação para acessar o painel administrativo:
1. Certifique-se de estar conectado à internet.
2. Acesse o sistema através do link: [https://maya-rpg-web-three.vercel.app](https://maya-rpg-web-three.vercel.app)
3. Utilize as credenciais de acesso disponíveis na seção [Entregas](#entregas).

---

## 💻 Configuração para Desenvolvimento

Caso deseje baixar o código-fonte e rodar o projeto em um ambiente de desenvolvimento local, siga as instruções abaixo:

### 1. Mobile (Android Studio):
Para abrir e editar o aplicativo móvel, você precisará da ferramenta oficial do Google.
*   **Ferramenta Necessária:** [Android Studio](https://developer.android.com/studio)
*   **Passo a passo:**
    1. Abra o Android Studio e selecione **Open**.
    2. Navegue até a pasta `App Mobile/MayaRPG` e clique em OK.
    3. Aguarde o download das dependências (Gradle) terminar.
    4. Conecte um celular Android via USB ou use um Emulador e clique no ícone de **Play (Run)**.

### 2. Backend (API):
O servidor que processa os dados da clínica.
*   **Ferramenta Necessária:** [Node.js](https://nodejs.org/)
*   **Comandos de execução:**
```bash
# Entre na pasta do servidor
cd "src/PI Maya RPG/backend"

# Instale os componentes necessários
npm install

# Inicie o servidor
npm start
```

### 3. Painel Web (Frontend):
O site onde a fisioterapeuta gerencia os pacientes.
*   **Ferramenta Necessária:** [Node.js](https://nodejs.org/)
*   **Comandos de execução:**
```bash
# Entre na pasta do projeto web
cd "src/PI Maya RPG"

# Instale os componentes necessários
npm install

# Inicie o painel em modo de teste
npm run dev
```

---


## Licença

<p>
Plataforma de Gestão Maya RPG © 2026 by
  
<a href="https://github.com/LuizZaim/">Luiz Henrique Zaim da Cruz</a>, <a href="https://github.com/lucio734/">Lúcio Vecchio</a>, <a href="https://github.com/GustavoDinizFroes/">Gustavo Diniz Froes</a>, <a href="https://github.com/Gustavo7122/">Gustavo Felizardo Pires</a>, FECAP
  
is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" width="20" height="20" valign="middle"> <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" width="20" height="20" valign="middle"> <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" width="20" height="20" valign="middle"></p>
