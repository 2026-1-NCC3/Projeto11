import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { listarPrescricoes, registrarCheckin } from '../api/client';
import type { Prescricao } from '../types';
import { ClipboardCheck, CircleCheck, CircleX, AlertCircle } from 'lucide-react-native';
import LoadingSpinner from '../components/LoadingSpinner';

const DOR_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function dorColor(nivel: number): string {
  if (nivel <= 2) return '#22c55e';
  if (nivel <= 4) return '#84cc16';
  if (nivel <= 6) return '#eab308';
  if (nivel <= 8) return '#f97316';
  return '#ef4444';
}

export default function CheckinScreen() {
  const { user } = useAuth();
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPrescricao, setSelectedPrescricao] = useState<string | null>(null);
  const [executado, setExecutado] = useState<boolean | null>(null);
  const [nivelDor, setNivelDor] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const pacienteId = user?.paciente_id;

  useEffect(() => {
    async function load() {
      if (!pacienteId) {
        setError('ID de paciente não encontrado.');
        setLoading(false);
        return;
      }
      try {
        const data = await listarPrescricoes(pacienteId);
        setPrescricoes(data);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Erro ao carregar prescrições');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pacienteId]);

  async function handleSubmit() {
    if (!pacienteId || !selectedPrescricao || executado === null) {
      Alert.alert('Atenção', 'Selecione um exercício e indique se executou.');
      return;
    }

    setSubmitting(true);
    try {
      await registrarCheckin({
        paciente_id: pacienteId,
        prescricao_id: selectedPrescricao,
        executado,
        nivel_dor: nivelDor,
      });
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Erro ao registrar check-in';
      Alert.alert('Erro', msg);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSelectedPrescricao(null);
    setExecutado(null);
    setNivelDor(0);
    setSubmitted(false);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: '#0c1929' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0c1929" />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 }}>
          Check-in Diário
        </Text>
        <Text style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
          Registre a execução e seu nível de dor
        </Text>

        {error ? (
          <View
            style={{
              backgroundColor: '#450a0a',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <AlertCircle size={20} color="#fca5a5" />
            <Text style={{ color: '#fca5a5', flex: 1, fontSize: 13 }}>{error}</Text>
          </View>
        ) : submitted ? (
          /* Sucesso */
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#22c55e20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <CircleCheck size={40} color="#22c55e" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>
              Check-in registrado!
            </Text>
            <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
              Seu fisioterapeuta já pode acompanhar sua evolução.
            </Text>
            <TouchableOpacity
              onPress={resetForm}
              style={{
                marginTop: 24,
                backgroundColor: '#1e293b',
                borderRadius: 10,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: '#0ea5e9', fontWeight: '600' }}>Novo Check-in</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Step 1: Selecionar exercício */}
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 12 }}>
              1. Selecione o exercício
            </Text>
            <View style={{ gap: 8, marginBottom: 28 }}>
              {prescricoes.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPrescricao(p.id)}
                  style={{
                    backgroundColor: selectedPrescricao === p.id ? '#0ea5e915' : '#1e293b',
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: selectedPrescricao === p.id ? '#0ea5e9' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                    {p.exercicio_nome}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {p.series}x{p.repeticoes} • {p.exercicio_tipo}
                  </Text>
                </TouchableOpacity>
              ))}
              {prescricoes.length === 0 && (
                <Text style={{ color: '#64748b', fontSize: 13 }}>
                  Nenhuma prescrição ativa encontrada.
                </Text>
              )}
            </View>

            {/* Step 2: Executou? */}
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 12 }}>
              2. Você executou o exercício?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
              <TouchableOpacity
                onPress={() => setExecutado(true)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: executado === true ? '#22c55e' : '#334155',
                  backgroundColor: executado === true ? '#22c55e15' : '#1e293b',
                }}
              >
                <CircleCheck size={20} color={executado === true ? '#22c55e' : '#64748b'} />
                <Text
                  style={{
                    fontWeight: '600',
                    color: executado === true ? '#22c55e' : '#94a3b8',
                  }}
                >
                  Sim
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setExecutado(false)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: executado === false ? '#ef4444' : '#334155',
                  backgroundColor: executado === false ? '#ef444415' : '#1e293b',
                }}
              >
                <CircleX size={20} color={executado === false ? '#ef4444' : '#64748b'} />
                <Text
                  style={{
                    fontWeight: '600',
                    color: executado === false ? '#ef4444' : '#94a3b8',
                  }}
                >
                  Não
                </Text>
              </TouchableOpacity>
            </View>

            {/* Step 3: Nível de dor */}
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 12 }}>
              3. Nível de dor (0–10)
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 8,
              }}
            >
              {DOR_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setNivelDor(level)}
                  activeOpacity={0.7}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: nivelDor === level ? dorColor(level) + '30' : '#1e293b',
                    borderWidth: 2,
                    borderColor: nivelDor === level ? dorColor(level) : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: nivelDor === level ? dorColor(level) : '#64748b',
                    }}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 11, color: '#475569', marginBottom: 32 }}>
              0 = sem dor • 10 = dor insuportável
            </Text>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || !selectedPrescricao || executado === null}
              activeOpacity={0.8}
              style={{
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                backgroundColor:
                  !selectedPrescricao || executado === null
                    ? '#334155'
                    : submitting
                    ? '#0369a1'
                    : '#0ea5e9',
                shadowColor: '#0ea5e9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                  Registrar Check-in
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
