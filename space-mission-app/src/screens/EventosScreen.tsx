import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { EventoAPI } from '../services/api';
import { EventoOperacional, TipoEvento } from '../types';

const COLORS = {
  bg: '#0a0a1a', card: '#12122a', border: '#1e1e3f',
  accent: '#4f8ef7', green: '#22c55e', red: '#ef4444',
  yellow: '#f59e0b', text: '#e2e8f0', muted: '#64748b', input: '#1a1a35',
};

const TIPO_COLORS: Record<TipoEvento, string> = {
  INFO: '#4f8ef7', NORMAL: '#22c55e', CRITICO: '#f59e0b',
  EMERGENCIA: '#ef4444', MANUTENCAO: '#a855f7',
};

const INITIAL_FORM: EventoOperacional = {
  sistema: '', descricao: '', tipo: 'INFO',
  operador: '', faseMissao: '', duracaoSegundos: undefined,
};

export default function EventosScreen() {
  const [eventos, setEventos] = useState<EventoOperacional[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<EventoOperacional>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const carregar = async () => {
    try {
      const res = await EventoAPI.listar();
      setEventos(res.data.reverse()); // mais recentes primeiro
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSubmit = async () => {
    if (!form.sistema || !form.descricao) {
      Alert.alert('Atenção', 'Preencha Sistema e Descrição.');
      return;
    }
    setSubmitting(true);
    try {
      await EventoAPI.criar(form);
      setModalVisible(false);
      setForm(INITIAL_FORM);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar o evento.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatData = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const renderItem = ({ item }: { item: EventoOperacional }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardSistema}>{item.sistema}</Text>
        <View style={[styles.badge, { backgroundColor: TIPO_COLORS[item.tipo] + '22', borderColor: TIPO_COLORS[item.tipo] }]}>
          <Text style={[styles.badgeText, { color: TIPO_COLORS[item.tipo] }]}>{item.tipo}</Text>
        </View>
      </View>
      <Text style={styles.cardDesc}>{item.descricao}</Text>
      <View style={styles.cardFooter}>
        {item.operador && <Text style={styles.footerText}>👤 {item.operador}</Text>}
        {item.faseMissao && <Text style={styles.footerText}>🛸 {item.faseMissao}</Text>}
        {item.registradoEm && <Text style={styles.footerText}>🕐 {formatData(item.registradoEm)}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Eventos Operacionais</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : eventos.length === 0 ? (
        <Text style={styles.empty}>Nenhum evento registrado.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal de cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Registrar Evento</Text>
            <ScrollView>
              <FormInput label="Sistema *" value={form.sistema} onChangeText={(v: string) => setForm({ ...form, sistema: v })} placeholder="Ex: PROPULSAO, NAVEGACAO" />
              <FormInput label="Descrição *" value={form.descricao} onChangeText={(v: string) => setForm({ ...form, descricao: v })} placeholder="Descreva o evento..." multiline />
              <FormInput label="Operador" value={form.operador || ''} onChangeText={(v: string) => setForm({ ...form, operador: v })} placeholder="Nome do operador responsável" />
              <FormInput label="Fase da Missão" value={form.faseMissao || ''} onChangeText={(v: string) => setForm({ ...form, faseMissao: v })} placeholder="Ex: LANCAMENTO, ORBITA, MANOBRA" />
              <FormInput label="Duração (segundos)" value={form.duracaoSegundos?.toString() || ''} onChangeText={(v: string) => setForm({ ...form, duracaoSegundos: v ? parseInt(v) : undefined })} keyboardType="numeric" placeholder="Ex: 120" />

              <Text style={styles.label}>Tipo do Evento</Text>
              <View style={styles.tipoRow}>
                {(['INFO', 'NORMAL', 'CRITICO', 'EMERGENCIA', 'MANUTENCAO'] as TipoEvento[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tipoBtn, form.tipo === t && { backgroundColor: TIPO_COLORS[t] }]}
                    onPress={() => setForm({ ...form, tipo: t })}
                  >
                    <Text style={[styles.tipoBtnText, form.tipo === t && { color: '#fff' }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Registrar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const FormInput = ({ label, ...props }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, props.multiline && { height: 80, textAlignVertical: 'top' }]} placeholderTextColor={COLORS.muted} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  addBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardSistema: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },
  badge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardDesc: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  footerText: { color: COLORS.muted, fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: COLORS.input, borderRadius: 8, padding: 12, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  tipoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tipoBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  tipoBtnText: { color: COLORS.muted, fontSize: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.muted, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});
