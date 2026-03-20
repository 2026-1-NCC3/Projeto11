import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setError('Preencha email e senha.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email.trim(), senha);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao conectar com o servidor';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0c1929' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0c1929" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Logo / Brand ── */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: '#0ea5e9',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
                shadowColor: '#0ea5e9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: '800', color: '#fff' }}>M</Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '800',
                color: '#fff',
                letterSpacing: 1,
              }}
            >
              Maya RPG
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#94a3b8',
                marginTop: 4,
              }}
            >
              Fisioterapia Inteligente
            </Text>
          </View>

          {/* ── Formulário ── */}
          <View
            style={{
              backgroundColor: '#1e293b',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 24 }}>
              Entrar
            </Text>

            {/* Email */}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 6 }}>
              Email
            </Text>
            <TextInput
              style={{
                backgroundColor: '#0f172a',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: '#fff',
                fontSize: 15,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#334155',
              }}
              placeholder="seu@email.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />

            {/* Senha */}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 6 }}>
              Senha
            </Text>
            <TextInput
              style={{
                backgroundColor: '#0f172a',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: '#fff',
                fontSize: 15,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#334155',
              }}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
              onSubmitEditing={handleLogin}
            />

            {/* Erro */}
            {error ? (
              <View
                style={{
                  backgroundColor: '#450a0a',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: '#ef4444',
                }}
              >
                <Text style={{ color: '#fca5a5', fontSize: 13 }}>{error}</Text>
              </View>
            ) : null}

            {/* Botão */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
              style={{
                borderRadius: 10,
                paddingVertical: 16,
                alignItems: 'center',
                backgroundColor: loading ? '#0369a1' : '#0ea5e9',
                shadowColor: '#0ea5e9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <Text
            style={{
              textAlign: 'center',
              color: '#475569',
              fontSize: 12,
              marginTop: 32,
            }}
          >
            Maya RPG © 2026 — Todos os direitos reservados
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
