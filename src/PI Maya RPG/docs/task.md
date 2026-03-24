# Checklist — Integracao Servidor Cloud & React Native App

## Parte 1: Nuvem & Preparação do Servidor (Infraestrutura)
- [x] Atualizar `.env` do backend (PORT, DATABASE_URL)
- [x] Testar conexão remota no `config/database.ts`
- [x] Realizar commit atômico: chore(backend)

## Parte 2+3: App Mobile (Expo + Auth + Navegação)
- [x] Criar projeto Expo TypeScript (`mobile/`)
- [x] Instalar dependências de Navegação e API (Axios)
- [x] Instalar Nativewind (Tailwind CSS) e configurar
- [x] Criar estrutura de Pastas (screens, api, components, contexts, navigation, types)
- [x] Configurar cliente Axios do Mobile apontando para API
- [x] Criar `AuthContext` com suporte a AsyncStorage
- [x] Desenvolver `LoginScreen`
- [x] Configurar roteamento de pilhas (AuthStack vs AppStack)
- [x] Adicionar endpoint `GET /auth/me` no backend
- [x] Atualizar CORS wildcard em dev
- [x] Build verificado: `npx expo export --platform android` ✅
- [x] Rodar localmente via LAN com `npx expo start`
- [ ] Realizar commit atômico: init(mobile) + feat(mobile)

## Parte 4: Interface e Funcionalidades Core (Paciente)
- [x] Desenvolver `HomeScreen` (Dash do paciente)
- [x] Desenvolver `ExercisesScreen` (Lista de Prescrições)
- [x] Desenvolver `CheckinScreen` (Registro de dor e conclusão)
- [x] Integrar endpoints via Axios Mobile
- [ ] Realizar commit atômico: feat(mobile)

## Parte 5: Polimento e Resiliência
- [x] Refinar estilos da UI Native
- [x] Configurar alertas nativos de erro (Offline / Fetch Error)
- [x] Melhorar SafeArea e KeyboardAvoidingView
- [x] Realizar commit atômico: fix(mobile)

## Parte 6: Build e Artefato Final (EAS)
- [x] Configurar `eas.json` para builds locais/em núvem
- [x] Preencher metadata no `app.json` (icones, id, name)
- [ ] Compilar projeto / Gerar APK (`eas build -p android --profile production`)
- [ ] Realizar commit atômico: chore(mobile)
