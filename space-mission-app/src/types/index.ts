// =============================================
// Types — Space Mission Control App
// =============================================

export type StatusSensor = 'ATIVO' | 'INATIVO' | 'FALHA' | 'MANUTENCAO';

export interface Sensor {
  id?: number;
  nome: string;
  tipo: string;
  modulo: string;
  status: StatusSensor;
  ultimaLeitura?: number;
  unidade?: string;
  localizacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type TipoEvento = 'INFO' | 'NORMAL' | 'CRITICO' | 'EMERGENCIA' | 'MANUTENCAO';

export interface EventoOperacional {
  id?: number;
  sistema: string;
  descricao: string;
  tipo: TipoEvento;
  operador?: string;
  faseMissao?: string;
  duracaoSegundos?: number;
  registradoEm?: string;
}

export type NivelAlerta = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface Alerta {
  id?: number;
  nivel: NivelAlerta;
  mensagem: string;
  sistemaOrigem: string;
  codigoAlerta?: string;
  valorDetectado?: number;
  valorLimite?: number;
  resolvido?: boolean;
  resolucao?: string;
  geradoEm?: string;
  resolvidoEm?: string;
}
