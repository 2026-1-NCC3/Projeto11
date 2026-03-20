import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { listarPrescricoes } from '../api/client';
import type { Prescricao } from '../types';
import { Dumbbell, ChevronRight, AlertCircle } from 'lucide-react-native';
import LoadingSpinner from '../components/LoadingSpinner';

const DIFICULDADE_COLORS: Record<string, string> = {
  facil: '#22c55e',
  moderado: '#eab308',
  dificil: '#ef4444',
  intenso: '#dc2626',
};

const TIPO_LABELS: Record<string, string> = {
  alongamento: '🧘 Alongamento',
  fortalecimento: '💪 Fortalecimento',
  mobilidade: '🔄 Mobilidade',
  respiratorio: '🌬️ Respiratório',
  postural: '🧍 Postural',
  outro: '📋 Outro',
};

export default function ExercisesScreen() {
  const { user } = useAuth();
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const pacienteId = user?.paciente_id;

  const fetchPrescricoes = useCallback(async () => {
    if (!pacienteId) {
      setError('ID de paciente não encontrado.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      const data = await listarPrescricoes(pacienteId);
      setPrescricoes(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao carregar exercícios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    fetchPrescricoes();
  }, [fetchPrescricoes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPrescricoes();
  }, [fetchPrescricoes]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: '#0c1929' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0c1929" />

      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>
          Meus Exercícios
        </Text>
        <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          {prescricoes.length} prescrição(ões) ativa(s)
        </Text>
      </View>

      {error ? (
        <View style={{ padding: 24 }}>
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
        </View>
      ) : (
        <FlatList
          data={prescricoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0ea5e9"
              colors={['#0ea5e9']}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Dumbbell size={48} color="#334155" />
              <Text style={{ color: '#94a3b8', fontSize: 15, marginTop: 16, textAlign: 'center' }}>
                Nenhum exercício prescrito ainda.{'\n'}Consulte seu fisioterapeuta.
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: 14,
                padding: 16,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                    {item.exercicio_nome}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    {TIPO_LABELS[item.exercicio_tipo] || item.exercicio_tipo}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: (DIFICULDADE_COLORS[item.exercicio_dificuldade] || '#6b7280') + '20',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: DIFICULDADE_COLORS[item.exercicio_dificuldade] || '#6b7280',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.exercicio_dificuldade}
                  </Text>
                </View>
              </View>

              {/* Detalhes da prescrição */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 16,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#334155',
                }}
              >
                <DetailPill label="Séries" value={String(item.series)} />
                <DetailPill label="Repetições" value={String(item.repeticoes)} />
                {item.frequencia && <DetailPill label="Freq." value={item.frequencia} />}
              </View>

              {item.observacoes ? (
                <Text style={{ fontSize: 12, color: '#64748b', marginTop: 8, fontStyle: 'italic' }}>
                  📝 {item.observacoes}
                </Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#0ea5e9' }}>{value}</Text>
      <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{label}</Text>
    </View>
  );
}
