import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Home, Dumbbell, ClipboardCheck, LogOut } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0c1929' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0c1929" />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View>
            <Text style={{ fontSize: 14, color: '#94a3b8' }}>{greeting()},</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 }}>
              {user?.nome || 'Paciente'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#1e293b',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LogOut size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Card de resumo */}
        <View
          style={{
            backgroundColor: '#0ea5e9',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            shadowColor: '#0ea5e9',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#e0f2fe' }}>
            Sua jornada de recuperação
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 8 }}>
            Continue firme! 💪
          </Text>
          <Text style={{ fontSize: 13, color: '#bae6fd', marginTop: 8 }}>
            Faça check-in dos seus exercícios diários e acompanhe sua evolução.
          </Text>
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 16 }}>
          Ações Rápidas
        </Text>

        <View style={{ gap: 12 }}>
          <ActionCard
            icon={<Dumbbell size={24} color="#0ea5e9" />}
            title="Meus Exercícios"
            subtitle="Veja suas prescrições atuais"
            bgColor="#0ea5e9"
          />
          <ActionCard
            icon={<ClipboardCheck size={24} color="#a855f7" />}
            title="Check-in Diário"
            subtitle="Registre dor e progresso de hoje"
            bgColor="#a855f7"
          />
        </View>

        {/* Info */}
        <View
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            borderLeftWidth: 3,
            borderLeftColor: '#0ea5e9',
          }}
        >
          <Text style={{ fontSize: 13, color: '#94a3b8', lineHeight: 20 }}>
            💡 Dica: Registre seus check-ins todos os dias para que seu fisioterapeuta acompanhe sua evolução em tempo real.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Componente auxiliar ──────────────────────────────────────

function ActionCard({
  icon,
  title,
  subtitle,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        backgroundColor: '#1e293b',
        borderRadius: 14,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: `${bgColor}15`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{title}</Text>
        <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}
