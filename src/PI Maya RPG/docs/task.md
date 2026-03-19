# Checklist — Integracao Servidor Cloud & React Native App

## Parte 1: Nuvem & Preparação do Servidor (Infraestrutura)
- [ ] Atualizar `.env` do backend (PORT, DATABASE_URL)
- [ ] Testar conexão remota no `config/database.ts`
- [ ] Realizar commit atômico: chore(backend)

## Parte 2: Inicialização do App Mobile (Expo + React Native)
- [ ] Criar projeto Expo TypeScript (`mobile/`)
- [ ] Instalar dependências de Navegação e API (Axios)
- [ ] Instalar Nativewind (Tailwind CSS) e configurar
- [ ] Criar estrutura de Pastas (screens, api, components)
- [ ] Realizar commit atômico: init(mobile)

## Parte 3: Autenticação Mobile & Comunicação API
- [ ] Configurar cliente Axios do Mobile apontando para API
- [ ] Criar `AuthContext` com suporte a AsyncStorage
- [ ] Desenvolver `LoginScreen`
- [ ] Configurar roteamento de pilhas (AuthStack vs AppStack)
- [ ] Realizar commit atômico: feat(mobile)

## Parte 4: Interface e Funcionalidades Core (Paciente)
- [ ] Desenvolver `HomeScreen` (Dash do paciente)
- [ ] Desenvolver `ExercisesScreen` (Lista de Prescrições)
- [ ] Desenvolver `CheckinScreen` (Registro de dor e conclusão)
- [ ] Integrar endpoints via Axios Mobile
- [ ] Realizar commit atômico: feat(mobile)

## Parte 5: Polimento e Resiliência
- [ ] Refinar estilos da UI Native
- [ ] Configurar alertas nativos de erro (Offline / Fetch Error)
- [ ] Melhorar SafeArea e KeyboardAvoidingView
- [ ] Realizar commit atômico: fix(mobile)

## Parte 6: Build e Artefato Final (EAS)
- [ ] Configurar `eas.json` para builds locais/em núvem
- [ ] Preencher metadata no `app.json` (icones, id, name)
- [ ] Compilar projeto / Gerar APK
- [ ] Realizar commit atômico: chore(mobile)
