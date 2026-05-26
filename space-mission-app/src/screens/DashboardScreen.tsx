import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SensorAPI, EventoAPI, AlertaAPI } from '../services/api';
import { Sensor, EventoOperacional, Alerta } from '../types';

const COLORS = {
  bg: '#0a0a1a',
  card: '#12122a',
  border: '#1e1e3f',
  accent: '#4f8ef7',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
  text: '#e2e8f0',
  muted: '#64748b',
};

export default function DashboardScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [eventos, setEventos] = useState<EventoOperacional[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const [s, e, a] = await Promise.all([
        SensorAPI.listar(),
        EventoAPI.listar(),
        AlertaAPI.listarNaoResolvidos(),
      ]);
      setSensores(s.data);
      setEventos(e.data);
      setAlertas(a.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const sensoresAtivos = sensores.filter(s => s.status === 'ATIVO').length;
  const sensoresFalha = sensores.filter(s => s.status === 'FALHA').length;
  const alertasCriticos = alertas.filter(a => a.nivel === 'CRITICO' || a.nivel === 'ALTO').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Conectando à missão...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarDados(); }} tintColor={COLORS.accent} />
      }
    >
      <Text style={styles.title}>🚀 MISSÃO ESPACIAL</Text>
      <Text style={styles.subtitle}>Centro de Controle — Status Geral</Text>

      {/* Status cards */}
      <View style={styles.row}>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardNumber}>{sensoresAtivos}</Text>
          <Text style={styles.cardLabel}>Sensores{'\n'}Ativos</Text>
        </View>
        <View style={[styles.card, sensoresFalha > 0 ? styles.cardRed : styles.cardMuted]}>
          <Text style={styles.cardNumber}>{sensoresFalha}</Text>
          <Text style={styles.cardLabel}>Sensores{'\n'}em Falha</Text>
        </View>
        <View style={[styles.card, alertasCriticos > 0 ? styles.cardYellow : styles.cardMuted]}>
          <Text style={styles.cardNumber}>{alertasCriticos}</Text>
          <Text style={styles.cardLabel}>Alertas{'\n'}Críticos</Text>
        </View>
      </View>

      {/* Totais */}
      <View style={styles.totalRow}>
        <StatBox label="Total Sensores" value={sensores.length} />
        <StatBox label="Eventos" value={eventos.length} />
        <StatBox label="Alertas Ativos" value={alertas.length} />
      </View>

      {/* Alertas recentes */}
      {alertas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Alertas Não Resolvidos</Text>
          {alertas.slice(0, 3).map((alerta) => (
            <View key={alerta.id} style={[styles.alertItem, nivelStyle(alerta.nivel)]}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertNivel}>{alerta.nivel}</Text>
                <Text style={styles.alertSistema}>{alerta.sistemaOrigem}</Text>
              </View>
              <Text style={styles.alertMensagem}>{alerta.mensagem}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Últimos eventos */}
      {eventos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Eventos Recentes</Text>
          {eventos.slice(-3).reverse().map((evento) => (
            <View key={evento.id} style={styles.eventoItem}>
              <Text style={styles.eventoSistema}>{evento.sistema}</Text>
              <Text style={styles.eventoDesc} numberOfLines={2}>{evento.descricao}</Text>
              <Text style={styles.eventoTipo}>{evento.tipo} · {evento.faseMissao || '—'}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const nivelStyle = (nivel: string) => {
  switch (nivel) {
    case 'CRITICO': return { borderLeftColor: COLORS.red };
    case 'ALTO': return { borderLeftColor: COLORS.yellow };
    default: return { borderLeftColor: COLORS.accent };
  }
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  center: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.muted, marginTop: 12, fontSize: 14 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  card: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  cardGreen: { backgroundColor: '#052e16', borderColor: COLORS.green },
  cardRed: { backgroundColor: '#2a0a0a', borderColor: COLORS.red },
  cardYellow: { backgroundColor: '#2a1a00', borderColor: COLORS.yellow },
  cardMuted: { backgroundColor: COLORS.card },
  cardNumber: { color: COLORS.text, fontSize: 28, fontWeight: 'bold' },
  cardLabel: { color: COLORS.muted, fontSize: 11, textAlign: 'center', marginTop: 4 },
  totalRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.accent, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 10 },
  alertItem: { backgroundColor: COLORS.card, borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 4 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  alertNivel: { color: COLORS.yellow, fontWeight: 'bold', fontSize: 12 },
  alertSistema: { color: COLORS.muted, fontSize: 12 },
  alertMensagem: { color: COLORS.text, fontSize: 13 },
  eventoItem: { backgroundColor: COLORS.card, borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  eventoSistema: { color: COLORS.accent, fontWeight: 'bold', fontSize: 12 },
  eventoDesc: { color: COLORS.text, fontSize: 13, marginTop: 4 },
  eventoTipo: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
});
