import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { AlertaAPI } from '../services/api';
import { Alerta, NivelAlerta } from '../types';

const COLORS = {
  bg: '#0a0a1a', card: '#12122a', border: '#1e1e3f',
  accent: '#4f8ef7', green: '#22c55e', red: '#ef4444',
  yellow: '#f59e0b', text: '#e2e8f0', muted: '#64748b', input: '#1a1a35',
};

const NIVEL_COLORS: Record<NivelAlerta, string> = {
  BAIXO: '#22c55e', MEDIO: '#4f8ef7', ALTO: '#f59e0b', CRITICO: '#ef4444',
};

const INITIAL_FORM: Alerta = {
  nivel: 'MEDIO', mensagem: '', sistemaOrigem: '',
  codigoAlerta: '', valorDetectado: undefined, valorLimite: undefined,
};

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [resolveModal, setResolveModal] = useState<{ visible: boolean; id?: number }>({ visible: false });
  const [resolucaoText, setResolucaoText] = useState('');
  const [form, setForm] = useState<Alerta>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [filtroNaoResolvidos, setFiltroNaoResolvidos] = useState(false);

  const carregar = async () => {
    try {
      const res = filtroNaoResolvidos
        ? await AlertaAPI.listarNaoResolvidos()
        : await AlertaAPI.listar();
      setAlertas(res.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os alertas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [filtroNaoResolvidos]);

  const handleSubmit = async () => {
    if (!form.mensagem || !form.sistemaOrigem) {
      Alert.alert('Atenção', 'Preencha Mensagem e Sistema de Origem.');
      return;
    }
    setSubmitting(true);
    try {
      await AlertaAPI.criar(form);
      setModalVisible(false);
      setForm(INITIAL_FORM);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar o alerta.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolver = async () => {
    if (!resolveModal.id) return;
    try {
      await AlertaAPI.resolver(resolveModal.id, resolucaoText || 'Resolvido pelo operador');
      setResolveModal({ visible: false });
      setResolucaoText('');
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível resolver o alerta.');
    }
  };

  const formatData = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const renderItem = ({ item }: { item: Alerta }) => (
    <View style={[styles.card, { borderLeftColor: NIVEL_COLORS[item.nivel], borderLeftWidth: 4 }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.nivelBadge, { backgroundColor: NIVEL_COLORS[item.nivel] + '22' }]}>
          <Text style={[styles.nivelText, { color: NIVEL_COLORS[item.nivel] }]}>{item.nivel}</Text>
        </View>
        {item.resolvido ? (
          <View style={styles.resolvidoBadge}>
            <Text style={styles.resolvidoText}>✓ RESOLVIDO</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.resolverBtn}
            onPress={() => setResolveModal({ visible: true, id: item.id })}
          >
            <Text style={styles.resolverBtnText}>Resolver</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.cardSistema}>{item.sistemaOrigem}</Text>
      {item.codigoAlerta && <Text style={styles.cardCodigo}>{item.codigoAlerta}</Text>}
      <Text style={styles.cardMensagem}>{item.mensagem}</Text>

      {(item.valorDetectado !== undefined || item.valorLimite !== undefined) && (
        <View style={styles.valoresRow}>
          {item.valorDetectado !== undefined && (
            <Text style={styles.valorText}>Detectado: <Text style={{ color: COLORS.red }}>{item.valorDetectado}</Text></Text>
          )}
          {item.valorLimite !== undefined && (
            <Text style={styles.valorText}>Limite: <Text style={{ color: COLORS.yellow }}>{item.valorLimite}</Text></Text>
          )}
        </View>
      )}

      <Text style={styles.dataText}>🕐 {formatData(item.geradoEm)}</Text>
      {item.resolvido && item.resolucao && (
        <Text style={styles.resolucaoText}>📝 {item.resolucao}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚠️ Alertas Críticos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro */}
      <TouchableOpacity
        style={[styles.filtroBtn, filtroNaoResolvidos && styles.filtroBtnActive]}
        onPress={() => setFiltroNaoResolvidos(!filtroNaoResolvidos)}
      >
        <Text style={[styles.filtroText, filtroNaoResolvidos && styles.filtroTextActive]}>
          {filtroNaoResolvidos ? '● Pendentes' : 'Todos os alertas'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : alertas.length === 0 ? (
        <Text style={styles.empty}>Nenhum alerta encontrado.</Text>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal novo alerta */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Registrar Alerta</Text>
            <ScrollView>
              <FormInput label="Mensagem *" value={form.mensagem} onChangeText={(v: string) => setForm({ ...form, mensagem: v })} placeholder="Descreva o alerta..." multiline />
              <FormInput label="Sistema de Origem *" value={form.sistemaOrigem} onChangeText={(v: string) => setForm({ ...form, sistemaOrigem: v })} placeholder="Ex: SENSOR_TEMPERATURA_01" />
              <FormInput label="Código do Alerta" value={form.codigoAlerta || ''} onChangeText={(v: string) => setForm({ ...form, codigoAlerta: v })} placeholder="Ex: ERR_TEMP_001" />
              <FormInput label="Valor Detectado" value={form.valorDetectado?.toString() || ''} onChangeText={(v: string) => setForm({ ...form, valorDetectado: v ? parseFloat(v) : undefined })} keyboardType="numeric" placeholder="Ex: 98.5" />
              <FormInput label="Valor Limite" value={form.valorLimite?.toString() || ''} onChangeText={(v: string) => setForm({ ...form, valorLimite: v ? parseFloat(v) : undefined })} keyboardType="numeric" placeholder="Ex: 85.0" />

              <Text style={styles.label}>Nível do Alerta</Text>
              <View style={styles.nivelRow}>
                {(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'] as NivelAlerta[]).map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.nivelBtn, form.nivel === n && { backgroundColor: NIVEL_COLORS[n] }]}
                    onPress={() => setForm({ ...form, nivel: n })}
                  >
                    <Text style={[styles.nivelBtnText, form.nivel === n && { color: '#fff' }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: COLORS.red }]} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Registrar Alerta</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal resolver alerta */}
      <Modal visible={resolveModal.visible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '40%' }]}>
            <Text style={styles.modalTitle}>Resolver Alerta</Text>
            <Text style={styles.label}>Descrição da Resolução</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', marginBottom: 16 }]}
              placeholderTextColor={COLORS.muted}
              placeholder="O que foi feito para resolver..."
              value={resolucaoText}
              onChangeText={setResolucaoText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setResolveModal({ visible: false })}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: COLORS.green }]} onPress={handleResolver}>
                <Text style={styles.saveBtnText}>Confirmar</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  addBtn: { backgroundColor: COLORS.red, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  filtroBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 14 },
  filtroBtnActive: { backgroundColor: COLORS.yellow + '22', borderColor: COLORS.yellow },
  filtroText: { color: COLORS.muted, fontSize: 13 },
  filtroTextActive: { color: COLORS.yellow, fontWeight: '600' },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nivelBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  nivelText: { fontSize: 12, fontWeight: 'bold' },
  resolvidoBadge: { backgroundColor: '#052e16', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  resolvidoText: { color: COLORS.green, fontSize: 11, fontWeight: '600' },
  resolverBtn: { backgroundColor: COLORS.accent + '22', borderWidth: 1, borderColor: COLORS.accent, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4 },
  resolverBtnText: { color: COLORS.accent, fontSize: 12, fontWeight: '600' },
  cardSistema: { color: COLORS.accent, fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  cardCodigo: { color: COLORS.muted, fontSize: 11, marginBottom: 4 },
  cardMensagem: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  valoresRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  valorText: { color: COLORS.muted, fontSize: 12 },
  dataText: { color: COLORS.muted, fontSize: 11, marginTop: 8 },
  resolucaoText: { color: COLORS.green, fontSize: 12, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: COLORS.input, borderRadius: 8, padding: 12, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  nivelRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  nivelBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  nivelBtnText: { color: COLORS.muted, fontSize: 12, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.muted, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});
