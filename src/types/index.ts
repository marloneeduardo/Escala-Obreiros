export interface Obreiro {
  id: number;
  firestoreId?: string;
  name: string;
  cargo: 'CP' | 'DC' | 'PB' | 'EV' | 'PROF';
  nasc: string;
  tel: string;
  sexo: 'M' | 'F';
  excluido: boolean;
  domingoOnly: boolean;
  portaLateralOnly: boolean;
  pulpitoOnly: boolean;
  semPulpito: boolean;
  recepcaoOnly: boolean;
  visitantesOnly: boolean;
  frenteOnly: boolean;
  isCoord: boolean;
  isVisitantesF: boolean;
  isTercaQuinta: boolean;
  isDomingo1x: boolean;
  pairWith: string;
  segueVisitantesF: string;
  maxCultos: number;
}

export interface SchedConf {
  allSundays: boolean;
  allTuesdays: boolean;
  firstSatOnly: boolean;
  biWeekThursday: boolean;
  biWeekThurStart: number;
}

export interface Config {
  mes: number;
  ano: number;
  schedConf: SchedConf;
  labels: Record<string, string>;
  maxPerPerson: number;
}

export interface Culto {
  id: number;
  date: string;
  weekday: string;
  type: string;
  label: string;
  santaCeia: boolean;
}

export interface ScheduleSlots {
  coordenacao?: string;
  santaCeia?: string[];
  recepcao?: string[];
  visitantesF?: string;
  visitantesM?: string;
  banheiroF?: string;
  banheiroM?: string;
  frenteIgreja?: string[];
  pulpito?: string[];
  portaLateral?: string[];
}

export interface ScheduleEntry {
  culto: Culto;
  slots: ScheduleSlots;
}

export interface AbsenceRecord {
  justificativa: string;
  registeredAt: string;
}

export type Absences = Record<string, Record<string, AbsenceRecord>>;
export type Overrides = Record<string, Record<string, string | string[]>>;
export type Contagem = Record<string, number>;

export interface EbdClassRow {
  data: string;
  licao: string;
  prof: string;
}

export interface EbdClass {
  id: string;
  nome: string;
  sub: string;
  color: string;
  rows: EbdClassRow[];
}

export interface EbdData {
  sup1: string;
  sup2: string;
  sup3: string;
  secretaria: string;
  tesoureira: string;
  classes: EbdClass[];
}

export interface Toast {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export interface DayOfWeek {
  key: string;
  label: string;
  short: string;
  type: string;
  dow: number;
  accent: string;
  pill: string;
  light: string;
}

export interface SlotMeta {
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  multi?: boolean;
  qty: number;
  santaCeiaOnly?: boolean;
}
