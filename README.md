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

## Resumo do Projeto (MVP Finalizado)

A [Clínica Maya Yoshiko Yamamoto](https://mayayamamoto.com.br/) trabalha com **Reeducação Postural Global (RPG)**. Hoje em dia, o acompanhamento dos pacientes é feito de um jeito meio manual (mensagens no WhatsApp, anotações de papel, etc). Isso dificulta bastante na hora de achar o histórico de um paciente ou saber se ele realmente fez os exercícios em casa.

Para tentar resolver isso, o nosso grupo (DevLeaders) criou o **Sistema Maya Yamamoto RPG**. O projeto é dividido em três partes:

- **Aplicativo Mobile (Paciente):** Um app Android onde o paciente entra e vê exatamente os exercícios que ele precisa fazer na semana. Ele também consegue registrar como foi o treino e se sentiu dor (Check-in).
- **Módulo Web (Profissional/Admin):** Um painel web para a fisioterapeuta conseguir gerenciar a clínica toda. Por lá, ela cadastra novos pacientes, passa exercícios e acompanha as anotações do app.
- **Backend (API) e Banco de Dados:** Onde a mágica acontece por trás dos panos. A API faz o app do celular e o site do painel conversarem entre si e salva tudo no banco de dados.

---

## 🎯 Entregas Acadêmicas (Semestre 2026/1)

Os arquivos necessários para as avaliações das disciplinas estão separados nestas pastas:

- **POO & Estrutura de Dados:** [Ver Diagrama de Classes UML](./POO)
- **Análise Descritiva de Dados:** [Ver Script Python e Gráficos](./Documentos/analise)
- **Desenvolvimento Mobile & PI:** Código-fonte disponível na pasta `./App Mobile`

---

##  O que o sistema faz? (Funcionalidades)

**Módulo Admin (Fisioterapeuta - Web):**
- Cadastro de pacientes (que já cria o usuário dele pro aplicativo na hora).
- Tela para criar novos exercícios e montar uma biblioteca na clínica.
- Passar prescrições de treino pro paciente.
- Ver o histórico de "Check-ins" que o paciente mandou pelo celular, com um alerta vermelho chamativo caso ele informe um nível de dor 7 ou maior.

**Módulo Paciente (App Android):**
- Tela de login básica.
- Listagem dos exercícios que ele precisa fazer no dia.
- **Check-in Offline:** O paciente anota se fez o exercício e a nota de dor. Fizemos uma funcionalidade que, se o paciente estiver sem internet na hora, o app salva no celular (SQLite) e manda pra nuvem sozinho depois quando o Wi-Fi voltar.
- **Lembretes Diários:** O app vibra com uma notificação todo dia às 18:00 pra lembrar a pessoa de alongar.
- Tela simples de aceite dos termos de privacidade (LGPD).

---

## Estrutura de Pastas

```
Projeto11/
│
├── App Mobile/                 # O código do App Android (feito em Java)
│   └── MayaRPG/                
│
├── Documentos/                 # Apresentações, Banners e Arquivos da Faculdade
│   └── analise/                # Códigos em Python da matéria de Dados (Entrega 2)
│
├── POO/                        # Onde estão os Diagramas da disciplina de OO
│
├── src/PI Maya RPG/            # Pasta principal com Web e Backend juntos
│   ├── app/                    # Telas do Painel Administrativo (feito com Next.js)
│   └── backend/                # API do projeto (feita com Node.js e Express)
│
└── README.md                   # Esse arquivo de leitura aqui
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
