import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { SensorAPI } from '../services/api';
import { Sensor, StatusSensor } from '../types';

const COLORS = {
  bg: '#0a0a1a', card: '#12122a', border: '#1e1e3f',
  accent: '#4f8ef7', green: '#22c55e', red: '#ef4444',
  yellow: '#f59e0b', text: '#e2e8f0', muted: '#64748b',
  input: '#1a1a35',
};

const STATUS_COLORS: Record<StatusSensor, string> = {
  ATIVO: '#22c55e', INATIVO: '#64748b', FALHA: '#ef4444', MANUTENCAO: '#f59e0b',
};

const INITIAL_FORM: Sensor = {
  nome: '', tipo: '', modulo: '', status: 'ATIVO',
  ultimaLeitura: undefined, unidade: '', localizacao: '',
};

export default function SensoresScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Sensor>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const carregar = async () => {
    try {
      const res = await SensorAPI.listar();
      setSensores(res.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os sensores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSubmit = async () => {
    if (!form.nome || !form.tipo || !form.modulo) {
      Alert.alert('Atenção', 'Preencha Nome, Tipo e Módulo.');
      return;
    }
    setSubmitting(true);
    try {
      await SensorAPI.criar(form);
      setModalVisible(false);
      setForm(INITIAL_FORM);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar o sensor.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Sensor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] + '33', borderColor: STATUS_COLORS[item.status] }]}>
          <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardInfo}>Tipo: <Text style={styles.cardInfoValue}>{item.tipo}</Text></Text>
      <Text style={styles.cardInfo}>Módulo: <Text style={styles.cardInfoValue}>{item.modulo}</Text></Text>
      {item.ultimaLeitura !== undefined && (
        <Text style={styles.cardInfo}>Leitura: <Text style={styles.cardInfoValue}>{item.ultimaLeitura} {item.unidade}</Text></Text>
      )}
      {item.localizacao && (
        <Text style={styles.cardInfo}>Local: <Text style={styles.cardInfoValue}>{item.localizacao}</Text></Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📡 Sensores e Módulos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : sensores.length === 0 ? (
        <Text style={styles.empty}>Nenhum sensor cadastrado.</Text>
      ) : (
        <FlatList
          data={sensores}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal de cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Novo Sensor / Módulo</Text>
            <ScrollView>
              <FormInput label="Nome *" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} placeholder="Ex: Sensor de Temperatura 1" />
              <FormInput label="Tipo *" value={form.tipo} onChangeText={(v) => setForm({ ...form, tipo: v })} placeholder="Ex: TEMPERATURA, PRESSAO, GPS" />
              <FormInput label="Módulo *" value={form.modulo} onChangeText={(v) => setForm({ ...form, modulo: v })} placeholder="Ex: MODULO_PROPULSAO" />
              <FormInput label="Localização" value={form.localizacao || ''} onChangeText={(v) => setForm({ ...form, localizacao: v })} placeholder="Ex: Compartimento de propulsão" />
              <FormInput label="Última Leitura" value={form.ultimaLeitura?.toString() || ''} onChangeText={(v) => setForm({ ...form, ultimaLeitura: v ? parseFloat(v) : undefined })} placeholder="Ex: 23.5" keyboardType="numeric" />
              <FormInput label="Unidade" value={form.unidade || ''} onChangeText={(v) => setForm({ ...form, unidade: v })} placeholder="Ex: °C, bar, km/h" />

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {(['ATIVO', 'INATIVO', 'FALHA', 'MANUTENCAO'] as StatusSensor[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusBtn, form.status === s && { backgroundColor: STATUS_COLORS[s] }]}
                    onPress={() => setForm({ ...form, status: s })}
                  >
                    <Text style={[styles.statusBtnText, form.status === s && { color: '#fff' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Salvar</Text>}
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
    <TextInput style={styles.input} placeholderTextColor={COLORS.muted} {...props} />
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
  cardNome: { color: COLORS.text, fontWeight: 'bold', fontSize: 15, flex: 1 },
  badge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardInfo: { color: COLORS.muted, fontSize: 13, marginBottom: 2 },
  cardInfoValue: { color: COLORS.text },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: COLORS.input, borderRadius: 8, padding: 12, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  statusBtnText: { color: COLORS.muted, fontSize: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.muted, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});
