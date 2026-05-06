import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://maya-rpg-api.onrender.com";

const CORES = {
  cyan: '#3DC8D8',
  coral: '#E8705A',
  dark: '#1A3A4A',
  bg: '#F5F7FA',
  textSub: '#666',
  border: '#E1E4E8'
};

// ─── Helpers ───────────────────────────────────────────────
const TOKEN_KEY = '@maya_token';
const USER_KEY  = '@maya_user';

const salvarAuth = async (token: string, user: any) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

const limparAuth = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

const fetchAuth = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
};

// ─── Logo ──────────────────────────────────────────────────
const LogoMaya = ({ escala = 1 }: { escala?: number }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ fontSize: 35 * escala, fontWeight: 'bold', color: CORES.cyan }}>MAYA</Text>
      <Text style={{ fontSize: 35 * escala, fontWeight: 'bold', color: CORES.coral }}> app</Text>
    </View>
    <Text style={{ fontSize: 9 * escala, color: CORES.textSub, letterSpacing: 3 }}>YAMAMOTO · RPG</Text>
  </View>
);

// ─── Tipos ─────────────────────────────────────────────────
interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  paciente_id: string | null;
}

interface Prescricao {
  id: string;
  exercicio_nome: string;
  exercicio_tipo: string;
  series: number;
  repeticoes: number;
  frequencia: string;
  observacoes: string;
}

interface CheckinItem {
  id: string;
  nivel_dor: number;
  observacoes: string;
  data: string;
  executado: boolean;
  exercicio_nome: string;
  exercicio_tipo: string;
}

// ═══════════════════════════════════════════════════════════
export default function App() {
  const [telaAtual, setTelaAtual] = useState('LOGIN');
  const [modoOffline, setModoOffline] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Auth
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Check-in
  const [dorSelecionada, setDorSelecionada] = useState<number | null>(null);
  const [observacao, setObservacao] = useState('');
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [prescricaoSelecionada, setPrescricaoSelecionada] = useState<string | null>(null);

  // Histórico
  const [historico, setHistorico] = useState<CheckinItem[]>([]);

  // ─── Restaurar sessão ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const userStr = await AsyncStorage.getItem(USER_KEY);
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setUsuario(user);
          setModoOffline(false);
          setTelaAtual('HOME');
        }
      } catch (_) { /* sem sessão salva */ }
    })();
  }, []);

  // ─── Login ───────────────────────────────────────────────
  const realizarLogin = async () => {
    if (!emailInput || !senhaInput) return Alert.alert("Aviso", "Preencha tudo.");
    setCarregando(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim().toLowerCase(), senha: senhaInput }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const user: Usuario = data.user;
        await salvarAuth(data.access_token, user);
        setUsuario(user);
        setModoOffline(false);
        setTelaAtual('HOME');
      } else {
        const err = await response.json().catch(() => ({}));
        Alert.alert("Erro", err.error || "Credenciais inválidas.");
      }
    } catch (_) {
      // Timeout / rede indisponível → modo offline
      setModoOffline(true);
      setUsuario({ id: 'offline', nome: emailInput.split('@')[0], email: emailInput, role: 'paciente', paciente_id: null });
      setHistorico([
        { id: '1', nivel_dor: 8, observacoes: 'Exemplo Offline: Dor lombar', data: '04/05/2026', executado: true, exercicio_nome: 'Alongamento Lombar', exercicio_tipo: 'Alongamento' },
        { id: '2', nivel_dor: 5, observacoes: 'Exemplo Offline: Melhora leve', data: '03/05/2026', executado: true, exercicio_nome: 'Ponte Glútea', exercicio_tipo: 'Fortalecimento' },
      ]);
      setTelaAtual('HOME');
    } finally {
      setCarregando(false);
    }
  };

  // ─── Logout ──────────────────────────────────────────────
  const realizarLogout = async () => {
    try { await fetchAuth('/auth/logout', { method: 'POST' }); } catch (_) {}
    await limparAuth();
    setUsuario(null);
    setModoOffline(false);
    setEmailInput('');
    setSenhaInput('');
    setHistorico([]);
    setPrescricoes([]);
    setTelaAtual('LOGIN');
  };

  // ─── Carregar prescrições ────────────────────────────────
  const carregarPrescricoes = useCallback(async () => {
    if (!usuario?.paciente_id || modoOffline) {
      if (modoOffline) {
        setPrescricoes([
          { id: 'off-1', exercicio_nome: 'Alongamento Lombar', exercicio_tipo: 'Alongamento', series: 3, repeticoes: 10, frequencia: 'Diário', observacoes: '' },
          { id: 'off-2', exercicio_nome: 'Ponte Glútea', exercicio_tipo: 'Fortalecimento', series: 3, repeticoes: 15, frequencia: 'Diário', observacoes: '' },
        ]);
      }
      return;
    }
    try {
      const response = await fetchAuth(`/prescricoes/paciente/${usuario.paciente_id}`);
      if (response.ok) {
        const data = await response.json();
        setPrescricoes(data);
      }
    } catch (e) { console.log("Erro ao carregar prescrições"); }
  }, [usuario, modoOffline]);

  // ─── Carregar histórico ──────────────────────────────────
  const carregarHistorico = useCallback(async () => {
    if (!usuario?.paciente_id || modoOffline) return;
    try {
      const response = await fetchAuth(`/checkins/paciente/${usuario.paciente_id}`);
      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
      }
    } catch (e) { console.log("Erro ao carregar histórico"); }
  }, [usuario, modoOffline]);

  // ─── Salvar check-in ────────────────────────────────────
  const salvarRegistro = async () => {
    if (dorSelecionada === null) return Alert.alert("Aviso", "Selecione o nível de dor.");
    if (!prescricaoSelecionada) return Alert.alert("Aviso", "Selecione um exercício.");

    if (modoOffline) {
      const presc = prescricoes.find(p => p.id === prescricaoSelecionada);
      const novo: CheckinItem = {
        id: Date.now().toString(),
        nivel_dor: dorSelecionada,
        observacoes: observacao,
        data: new Date().toLocaleDateString('pt-BR'),
        executado: true,
        exercicio_nome: presc?.exercicio_nome || 'Exercício',
        exercicio_tipo: presc?.exercicio_tipo || ''
      };
      setHistorico([novo, ...historico]);
      resetCheckin();
      setTelaAtual('HISTORICO');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetchAuth('/checkins', {
        method: 'POST',
        body: JSON.stringify({
          paciente_id: usuario!.paciente_id,
          prescricao_id: prescricaoSelecionada,
          executado: true,
          nivel_dor: dorSelecionada,
          observacoes: observacao
        })
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Check-in registrado!");
        await carregarHistorico();
      } else {
        const err = await response.json().catch(() => ({}));
        Alert.alert("Erro", err.error || "Falha ao registrar check-in.");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha de conexão ao salvar.");
    } finally {
      setCarregando(false);
    }
    resetCheckin();
    setTelaAtual('HISTORICO');
  };

  const resetCheckin = () => {
    setDorSelecionada(null);
    setObservacao('');
    setPrescricaoSelecionada(null);
  };

  // ─── Carregar dados ao entrar em telas ───────────────────
  useEffect(() => {
    if (telaAtual === 'CHECKIN') carregarPrescricoes();
    if (telaAtual === 'HISTORICO') carregarHistorico();
  }, [telaAtual, carregarPrescricoes, carregarHistorico]);

  // ═══════════════════════════════════════════════════════════
  //  R E N D E R
  // ═══════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CORES.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* ──── HEADER ──── */}
      {telaAtual !== 'LOGIN' && (
        <View style={styles.header}>
          <LogoMaya escala={0.6} />
          <TouchableOpacity onPress={realizarLogout}>
            <Text style={{ color: CORES.coral, fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.container}>

        {/* ══════ TELA LOGIN ══════ */}
        {telaAtual === 'LOGIN' && (
          <View style={[styles.fullCenter, { marginTop: 60 }]}>
            <LogoMaya escala={1.8} />
            <View style={{ width: '100%', marginTop: 40 }}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senhaInput}
                onChangeText={setSenhaInput}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.btnPrimary, carregando && { opacity: 0.6 }]}
                onPress={realizarLogin}
                disabled={carregando}
              >
                {carregando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnTxt}>ENTRAR</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════ TELA HOME ══════ */}
        {telaAtual === 'HOME' && (
          <View>
            <Text style={styles.titulo}>Bem-vindo, {usuario?.nome || 'Paciente'}!</Text>
            <View style={styles.cardInfo}>
              <Text style={{ color: modoOffline ? CORES.coral : '#27ae60', fontWeight: 'bold' }}>
                {modoOffline ? "⚠️ Modo Demonstração (Offline)" : "✅ Conectado ao servidor"}
              </Text>
            </View>
            <TouchableOpacity style={styles.btnHomeLarge} onPress={() => setTelaAtual('CHECKIN')}>
              <Text style={styles.btnTxt}>NOVO REGISTRO ✚</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ══════ TELA CHECKIN ══════ */}
        {telaAtual === 'CHECKIN' && (
          <View>
            {/* Seleção de exercício/prescrição */}
            <Text style={styles.tituloSecao}>Selecione o Exercício</Text>
            {prescricoes.length === 0 && (
              <Text style={{ color: CORES.textSub, marginBottom: 15 }}>
                Nenhuma prescrição encontrada.
              </Text>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {prescricoes.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.prescCard,
                    prescricaoSelecionada === p.id && { backgroundColor: CORES.cyan, borderColor: CORES.cyan }
                  ]}
                  onPress={() => setPrescricaoSelecionada(p.id)}
                >
                  <Text style={[
                    styles.prescNome,
                    prescricaoSelecionada === p.id && { color: '#fff' }
                  ]}>
                    {p.exercicio_nome}
                  </Text>
                  <Text style={[
                    styles.prescDetalhe,
                    prescricaoSelecionada === p.id && { color: '#e0f7fa' }
                  ]}>
                    {p.series}×{p.repeticoes} · {p.exercicio_tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Escala de dor */}
            <Text style={styles.tituloSecao}>Escala de Dor (1 a 10)</Text>
            <View style={styles.painRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.painBtn, dorSelecionada === n && { backgroundColor: CORES.coral, borderColor: CORES.coral }]}
                  onPress={() => setDorSelecionada(n)}
                >
                  <Text style={{ color: dorSelecionada === n ? '#fff' : '#333', fontWeight: 'bold' }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Observações */}
            <TextInput
              style={styles.textArea}
              placeholder="Observações do exercício..."
              value={observacao}
              onChangeText={setObservacao}
              multiline
            />

            <TouchableOpacity
              style={[styles.btnPrimary, carregando && { opacity: 0.6 }]}
              onPress={salvarRegistro}
              disabled={carregando}
            >
              {carregando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnTxt}>CONFIRMAR REGISTRO</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* ══════ TELA HISTÓRICO ══════ */}
        {telaAtual === 'HISTORICO' && (
          <View style={{ paddingBottom: 50 }}>
            <Text style={styles.titulo}>Evolução do Paciente</Text>
            {historico.length === 0 && (
              <Text style={{ color: CORES.textSub, textAlign: 'center', marginTop: 30 }}>
                Nenhum registro encontrado.
              </Text>
            )}
            {historico.map((item, idx) => (
              <View key={item.id || idx} style={styles.cardHist}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold', color: CORES.dark }}>
                    Nível de Dor: {item.nivel_dor ?? '—'}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#999' }}>
                    {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : ''}
                  </Text>
                </View>
                <Text style={{ color: CORES.cyan, fontSize: 12, marginTop: 3, fontWeight: '600' }}>
                  {item.exercicio_nome || ''}
                </Text>
                <Text style={{ color: '#666', marginTop: 5 }}>
                  {item.observacoes || "Sem notas."}
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* ──── NAVBAR ──── */}
      {telaAtual !== 'LOGIN' && (
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setTelaAtual('HOME')}>
            <Text style={[styles.navText, telaAtual === 'HOME' && { color: CORES.cyan }]}>INÍCIO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setTelaAtual('CHECKIN')}>
            <Text style={[styles.navText, telaAtual === 'CHECKIN' && { color: CORES.cyan }]}>NOVO REGISTRO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => { setTelaAtual('HISTORICO'); }}>
            <Text style={[styles.navText, telaAtual === 'HISTORICO' && { color: CORES.cyan }]}>HISTÓRICO</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
//  E S T I L O S
// ═══════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  fullCenter: { alignItems: 'center', justifyContent: 'center' },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  container: { padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderBottomWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 20, fontSize: 16 },
  btnPrimary: { backgroundColor: CORES.cyan, padding: 18, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: 'bold' },
  btnHomeLarge: { backgroundColor: CORES.dark, padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  cardInfo: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  painRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 },
  painBtn: {
    width: 50, height: 50, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff'
  },
  textArea: {
    backgroundColor: '#fff', padding: 15, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd',
    height: 100, marginBottom: 20,
    textAlignVertical: 'top'
  },
  cardHist: {
    backgroundColor: '#fff', padding: 18, borderRadius: 15,
    marginBottom: 12, borderLeftWidth: 6, borderLeftColor: CORES.coral
  },
  navBar: {
    flexDirection: 'row', height: 70, backgroundColor: '#fff',
    borderTopWidth: 1, borderColor: '#eee',
    alignItems: 'center', justifyContent: 'space-around', paddingBottom: 10
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, color: '#999', fontWeight: 'bold' },
  // Prescrição cards
  prescCard: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd',
    marginRight: 10, minWidth: 140
  },
  prescNome: { fontWeight: 'bold', color: CORES.dark, fontSize: 13 },
  prescDetalhe: { color: CORES.textSub, fontSize: 11, marginTop: 3 }
});
