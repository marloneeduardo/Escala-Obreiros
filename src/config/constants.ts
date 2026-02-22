import { Obreiro, DayOfWeek, SlotMeta, SchedConf, EbdClass } from '../types';

// Cores por cargo
export const CARGO_COLOR: Record<string, string> = {
  CP: '#818cf8',
  DC: '#60a5fa',
  EV: '#34d399',
  PB: '#fbbf24',
  PROF: '#f97316',
};

export const CARGO_BG: Record<string, string> = {
  CP: 'rgba(129,140,248,.15)',
  DC: 'rgba(96,165,250,.15)',
  EV: 'rgba(52,211,153,.15)',
  PB: 'rgba(251,191,36,.15)',
  PROF: 'rgba(249,115,22,.15)',
};

export const CARGO_LABELS: Record<string, string> = {
  CP: 'Cooperador/a',
  DC: 'Diácono/Diaconisa',
  PB: 'Presbítero',
  EV: 'Evangelista',
  PROF: 'Professor EBD',
};

export const MESES_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const DW: DayOfWeek[] = [
  { key: 'dom', label: 'Domingo',  short: 'Dom', type: 'domingo', dow: 0, accent: '#818cf8', pill: '#6d28d9', light: 'rgba(109,40,217,.15)' },
  { key: 'seg', label: 'Segunda',  short: 'Seg', type: 'segunda', dow: 1, accent: '#94a3b8', pill: '#64748b', light: 'rgba(100,116,139,.1)' },
  { key: 'ter', label: 'Terça',    short: 'Ter', type: 'terca',   dow: 2, accent: '#34d399', pill: '#059669', light: 'rgba(5,150,105,.15)' },
  { key: 'qua', label: 'Quarta',   short: 'Qua', type: 'quarta',  dow: 3, accent: '#fb923c', pill: '#ea580c', light: 'rgba(234,88,12,.15)' },
  { key: 'qui', label: 'Quinta',   short: 'Qui', type: 'quinta',  dow: 4, accent: '#22d3ee', pill: '#0891b2', light: 'rgba(8,145,178,.15)' },
  { key: 'sex', label: 'Sexta',    short: 'Sex', type: 'sexta',   dow: 5, accent: '#f472b6', pill: '#db2777', light: 'rgba(219,39,119,.15)' },
  { key: 'sab', label: 'Sábado',   short: 'Sáb', type: 'sabado',  dow: 6, accent: '#fbbf24', pill: '#d97706', light: 'rgba(217,119,6,.15)' },
];

export const dByType = (t: string) => DW.find(d => d.type === t) || DW[0];

// Funções / Slots da escala
export const FM: SlotMeta[] = [
  { key: 'coordenacao',  label: 'COORDENAÇÃO',      icon: '🎯', color: '#f87171', bg: 'rgba(248,113,113,.1)',  qty: 1 },
  { key: 'santaCeia',    label: 'SANTA CEIA',        icon: '🍷', color: '#f59e0b', bg: 'rgba(245,158,11,.1)',   qty: 7, santaCeiaOnly: true },
  { key: 'recepcao',     label: 'RECEPÇÃO',          icon: '🤝', color: '#fbbf24', bg: 'rgba(251,191,36,.1)',   qty: 2, multi: true },
  { key: 'visitantesF',  label: 'VISITANTES ♀',      icon: '🚶‍♀️', color: '#f472b6', bg: 'rgba(244,114,182,.1)', qty: 1 },
  { key: 'visitantesM',  label: 'VISITANTES ♂',      icon: '🚶',  color: '#60a5fa', bg: 'rgba(96,165,250,.1)',   qty: 1 },
  { key: 'banheiroF',    label: 'BANHEIRO FEM.',     icon: '🚻', color: '#f472b6', bg: 'rgba(244,114,182,.1)',  qty: 1 },
  { key: 'banheiroM',    label: 'BANHEIRO MASC.',    icon: '🚹', color: '#60a5fa', bg: 'rgba(96,165,250,.1)',   qty: 1 },
  { key: 'frenteIgreja', label: 'FRENTE DA IGREJA',  icon: '🏛️', color: '#34d399', bg: 'rgba(52,211,153,.1)',   qty: 2, multi: true },
  { key: 'pulpito',      label: 'PÚLPITO',           icon: '🎤', color: '#818cf8', bg: 'rgba(129,140,248,.1)',  qty: 3, multi: true },
  { key: 'portaLateral', label: 'PORTA LATERAL',     icon: '🚪', color: '#94a3b8', bg: 'rgba(148,163,184,.1)',  qty: 2, multi: true },
];

// Default flags para obreiro
export const DF: Omit<Obreiro, 'id' | 'name' | 'cargo' | 'nasc' | 'tel' | 'sexo'> = {
  excluido: false,
  domingoOnly: false,
  portaLateralOnly: false,
  pulpitoOnly: false,
  semPulpito: false,
  recepcaoOnly: false,
  visitantesOnly: false,
  frenteOnly: false,
  isCoord: false,
  isVisitantesF: false,
  isTercaQuinta: false,
  isDomingo1x: false,
  pairWith: '',
  segueVisitantesF: '',
  maxCultos: 0,
};

export const EMPTY_FORM: Omit<Obreiro, 'id'> = {
  ...DF,
  name: '',
  cargo: 'CP',
  nasc: '',
  tel: '',
  sexo: 'M',
};

export const DEFAULT_SCHED_CONF: SchedConf = {
  allSundays: true,
  allTuesdays: true,
  firstSatOnly: true,
  biWeekThursday: true,
  biWeekThurStart: 0,
};

// Obreiros excluídos da Santa Ceia (servir)
export const SANTA_CEIA_EXCLUDED = ['Jhony Rondon', 'Wyne Abreu Ventura', 'Crislane Rondon'];

// Pool de coordenação
export const COORD_NAMES = ['Marlon Eduardo Dias Alves', 'Franklim Costa Da Silva', 'Mauro Celso Malagolini'];

// 57 obreiros iniciais - flags DEPOIS do DF (ordem do spread correta)
export const INITIAL_OBREIROS: Obreiro[] = [
  // MASCULINOS
  { ...DF, id: 1,  name: 'Antonio Loures Pinheiro',              cargo: 'CP', nasc: '20/09/1960', tel: '(69) 99248-1366', sexo: 'M', semPulpito: true },
  { ...DF, id: 2,  name: 'Cleiton Santos Pereira',               cargo: 'CP', nasc: '12/05/1990', tel: '(69) 99925-9592', sexo: 'M', domingoOnly: true, segueVisitantesF: 'Hevelyn Marques Ribeiro Pereira' },
  { ...DF, id: 3,  name: 'Gean Carlos dos Santos',               cargo: 'CP', nasc: '11/03/1995', tel: '(69) 99200-2522', sexo: 'M' },
  { ...DF, id: 4,  name: 'Gustavo Henrique Silva Dias',          cargo: 'CP', nasc: '22/11/2006', tel: '(69) 99929-4049', sexo: 'M', domingoOnly: true },
  { ...DF, id: 5,  name: 'Kayk Gustavo Fernandes Dias',          cargo: 'CP', nasc: '12/02/2006', tel: '(69) 99268-0520', sexo: 'M' },
  { ...DF, id: 6,  name: 'Lucas Bianchi do Carmo',               cargo: 'CP', nasc: '14/10/2009', tel: '(69) 99252-8601', sexo: 'M' },
  { ...DF, id: 7,  name: 'Lucas Gabriel Nascimento Lazaro',      cargo: 'CP', nasc: '25/02/1998', tel: '(69) 99261-9263', sexo: 'M' },
  { ...DF, id: 8,  name: 'Marcos Antônio da Silva Almeida',      cargo: 'CP', nasc: '15/06/1989', tel: '(69) 99319-8935', sexo: 'M' },
  { ...DF, id: 9,  name: 'Miguel Maciel Da Silva Costa',         cargo: 'CP', nasc: '03/04/1982', tel: '(69) 98400-6063', sexo: 'M' },
  { ...DF, id: 10, name: 'Odair José Dos Santos',                cargo: 'CP', nasc: '17/12/1982', tel: '(69) 99299-8114', sexo: 'M' },
  { ...DF, id: 11, name: 'Paulo Vinícius Costa Nogueira',        cargo: 'CP', nasc: '19/09/1997', tel: '(69) 99296-7486', sexo: 'M' },
  { ...DF, id: 12, name: 'Ronaldo Ribeiro De Araújo',            cargo: 'CP', nasc: '03/12/1986', tel: '(69) 99257-9942', sexo: 'M', excluido: true },
  { ...DF, id: 13, name: 'Sales Vitor Carvalho Lopes',           cargo: 'CP', nasc: '06/04/2000', tel: '(69) 99242-8560', sexo: 'M' },
  { ...DF, id: 14, name: 'Wender Ferreira da Silva',             cargo: 'CP', nasc: '04/11/1964', tel: '(69) 99604-3172', sexo: 'M' },
  { ...DF, id: 15, name: 'Cláudio Martins Dos Reis',             cargo: 'DC', nasc: '21/11/1972', tel: '(69) 99212-4978', sexo: 'M' },
  { ...DF, id: 16, name: 'David de Lima Silva',                  cargo: 'DC', nasc: '26/06/2002', tel: '(69) 99331-1106', sexo: 'M', pairWith: 'Regina Valêncio Zulcon' },
  { ...DF, id: 17, name: 'Eisen Guimarães da Fonseca',           cargo: 'DC', nasc: '25/09/2000', tel: '(69) 99267-2897', sexo: 'M' },
  { ...DF, id: 18, name: 'James Brendo Pessoa Ferreira',         cargo: 'DC', nasc: '16/09/2000', tel: '(69) 99382-0925', sexo: 'M' },
  { ...DF, id: 19, name: 'Jhony Rondon',                         cargo: 'DC', nasc: '09/09/1993', tel: '(69) 99207-5646', sexo: 'M', portaLateralOnly: true },
  { ...DF, id: 20, name: 'João Batista Carvalho Filho',          cargo: 'DC', nasc: '06/01/1961', tel: '(69) 99300-2855', sexo: 'M', portaLateralOnly: true },
  { ...DF, id: 21, name: 'Juliano Pinho Dias',                   cargo: 'DC', nasc: '24/10/1985', tel: '(69) 99350-1384', sexo: 'M', pairWith: 'Creisilaene Barbosa da Silva' },
  { ...DF, id: 22, name: 'Mauro Celso Malagolini',               cargo: 'DC', nasc: '01/12/1978', tel: '(69) 99247-4940', sexo: 'M', isCoord: true, pulpitoOnly: true },
  { ...DF, id: 23, name: 'Wesley Candido Almeida',               cargo: 'DC', nasc: '24/11/1993', tel: '(69) 99375-1308', sexo: 'M' },
  { ...DF, id: 24, name: 'Marlon Eduardo Dias Alves',            cargo: 'EV', nasc: '12/04/1991', tel: '(69) 99228-5590', sexo: 'M', isCoord: true },
  { ...DF, id: 25, name: 'Franklim Costa Da Silva',              cargo: 'PB', nasc: '19/05/1996', tel: '(69) 99357-5218', sexo: 'M', isCoord: true },
  // FEMININAS
  { ...DF, id: 26, name: 'Hevelyn Marques Ribeiro Pereira',      cargo: 'CP', nasc: '20/10/1994', tel: '(69) 99265-1225', sexo: 'F', isVisitantesF: true },
  { ...DF, id: 27, name: 'Izabelle Alencar de Morais',           cargo: 'CP', nasc: '20/05/2008', tel: '(69) 99287-1938', sexo: 'F' },
  { ...DF, id: 28, name: 'Pryscilla Leidiany Oliveira Randofo',  cargo: 'CP', nasc: '03/06/1993', tel: '(69) 99341-5768', sexo: 'F' },
  { ...DF, id: 29, name: 'Raira Fernanda Nogueira Macedo da Fonseca', cargo: 'CP', nasc: '02/04/2001', tel: '(69) 99255-9597', sexo: 'F', isDomingo1x: true },
  { ...DF, id: 30, name: 'Roberta Aparecida De Souza Maciel',    cargo: 'CP', nasc: '22/05/1986', tel: '(69) 98471-6705', sexo: 'F', isVisitantesF: true },
  { ...DF, id: 31, name: 'Wyne Abreu Ventura',                   cargo: 'CP', nasc: '04/07/1998', tel: '(69) 97391-6596', sexo: 'F', isTercaQuinta: true },
  { ...DF, id: 32, name: 'Yasminn Ferreira Alves',               cargo: 'CP', nasc: '23/08/2004', tel: '(69) 98415-4427', sexo: 'F' },
  { ...DF, id: 33, name: 'Ana Geraldo Neves Carvalho',           cargo: 'DC', nasc: '17/11/1973', tel: '(69) 99300-2855', sexo: 'F' },
  { ...DF, id: 34, name: 'Ana Graciely de Melo Reis Rocha',      cargo: 'DC', nasc: '27/06/1995', tel: '(69) 99345-1301', sexo: 'F' },
  { ...DF, id: 35, name: 'Ana Rita Linhares Dias',               cargo: 'DC', nasc: '01/07/1971', tel: '(69) 99257-3803', sexo: 'F' },
  { ...DF, id: 36, name: 'Angélica Dalcin de Oliveira Martins',  cargo: 'DC', nasc: '25/09/1985', tel: '(69) 99280-7378', sexo: 'F', isVisitantesF: true },
  { ...DF, id: 37, name: 'Aparecida Alves Da Rocha Pereira',     cargo: 'DC', nasc: '21/12/1964', tel: '(69) 99354-9029', sexo: 'F' },
  { ...DF, id: 38, name: 'Bianca França da Silva Miranda',       cargo: 'DC', nasc: '10/11/1997', tel: '(69) 99338-4683', sexo: 'F' },
  { ...DF, id: 39, name: 'Creisilaene Barbosa da Silva',         cargo: 'DC', nasc: '14/02/1984', tel: '(69) 99362-1359', sexo: 'F', pairWith: 'Juliano Pinho Dias' },
  { ...DF, id: 40, name: 'Crislane Rondon',                      cargo: 'DC', nasc: '27/02/1995', tel: '(69) 99390-0553', sexo: 'F', isTercaQuinta: true },
  { ...DF, id: 41, name: 'Elisangela Lima Pimentel',             cargo: 'DC', nasc: '20/06/1982', tel: '(69) 99360-2361', sexo: 'F' },
  { ...DF, id: 42, name: 'Eronilde Maria Da Silva Oliveira',     cargo: 'DC', nasc: '19/07/1969', tel: '(69) 99272-2488', sexo: 'F', isDomingo1x: true },
  { ...DF, id: 43, name: 'Francelina Carvalho de Lima',          cargo: 'DC', nasc: '17/12/1971', tel: '(69) 99306-9276', sexo: 'F' },
  { ...DF, id: 44, name: 'Francisca Araújo Guerra do Carmo',     cargo: 'DC', nasc: '07/06/1983', tel: '(69) 98454-8275', sexo: 'F' },
  { ...DF, id: 45, name: 'Lianir Batista de Andrade',            cargo: 'DC', nasc: '04/11/1964', tel: '(69) 99290-8137', sexo: 'F', excluido: true },
  { ...DF, id: 46, name: 'Luana Patrícia De Lima Silva',         cargo: 'DC', nasc: '20/06/1996', tel: '(69) 99386-4072', sexo: 'F' },
  { ...DF, id: 47, name: 'Luciana dos Santos Lima de Oliveira',  cargo: 'DC', nasc: '19/08/1984', tel: '(69) 99291-4591', sexo: 'F' },
  { ...DF, id: 48, name: 'Maria Cleide Neves',                   cargo: 'DC', nasc: '22/10/1979', tel: '(69) 99924-6521', sexo: 'F' },
  { ...DF, id: 49, name: 'Marley Jesus Ferreira',                cargo: 'DC', nasc: '15/11/1965', tel: '(69) 99374-4583', sexo: 'F' },
  { ...DF, id: 50, name: 'Marta Ramos Cabral Dos Reis',          cargo: 'DC', nasc: '12/10/1975', tel: '(69) 99268-9078', sexo: 'F' },
  { ...DF, id: 51, name: 'Mislayne Gabriella dos Santos Barreto', cargo: 'DC', nasc: '24/12/2001', tel: '(69) 99252-5647', sexo: 'F', excluido: true },
  { ...DF, id: 52, name: 'Regina Valêncio Zulcon',               cargo: 'DC', nasc: '22/11/2002', tel: '(69) 99213-3290', sexo: 'F', isDomingo1x: true },
  { ...DF, id: 53, name: 'Risovane Braga',                       cargo: 'DC', nasc: '13/02/1961', tel: '(69) 99922-5357', sexo: 'F', isDomingo1x: true },
  { ...DF, id: 54, name: 'Rosimar Alves Ferreira',               cargo: 'DC', nasc: '02/05/1982', tel: '(69) 99277-2455', sexo: 'F' },
  { ...DF, id: 55, name: 'Solange Emenegilda de Oliveira',       cargo: 'DC', nasc: '05/07/1967', tel: '(69) 99251-2785', sexo: 'F' },
  { ...DF, id: 56, name: 'Suamy Santana De Jesus',               cargo: 'DC', nasc: '18/05/1993', tel: '(69) 99269-0471', sexo: 'F', isDomingo1x: true },
  { ...DF, id: 57, name: 'Teresa Teodora Do Nascimento Dos Santos', cargo: 'DC', nasc: '08/11/1965', tel: '(69) 99974-2979', sexo: 'F' },
];

// Classes EBD padrão
export const DEFAULT_EBD_CLASSES: EbdClass[] = [
  { id: 'criancas',     nome: 'Classe Crianças',      sub: 'Cordeirinhos de Cristo', color: '#f59e0b', rows: [] },
  { id: 'adolescentes', nome: 'Classe Adolescentes',   sub: 'Filhos de Asafe',        color: '#34d399', rows: [] },
  { id: 'jovens',       nome: 'Classe Jovens',         sub: 'Débora',                 color: '#818cf8', rows: [] },
  { id: 'mulheres',     nome: 'Classe Mulheres',       sub: 'Mirian',                 color: '#f472b6', rows: [] },
  { id: 'homens',       nome: 'Classe Homens',         sub: 'Abraão',                 color: '#22d3ee', rows: [] },
];
