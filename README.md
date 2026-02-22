<div align="center">

<img src="public/logo.png" alt="Assembleia de Deus - Ministerio de Madureira" width="180" />

# Escala dos Obreiros

### ADJIPA-SEDE — Ji-Parana/RO

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)

Sistema de escala mensal do Corpo de Obreiros da Assembleia de Deus.
Gera automaticamente a escala de cultos com base em regras de disponibilidade, cargo e restricoes de cada obreiro. Tambem gerencia a EBD, aniversarios e relatorios.

</div>

---

## Funcionalidades

| Modulo | Descricao |
|--------|-----------|
| **Escala de Cultos** | Geracao automatica com 10 funcoes por culto (coordenacao, recepcao, visitantes, banheiros, frente da igreja, pulpito, porta lateral, santa ceia) |
| **EBD** | Escola Biblica Dominical com 5 classes, superintendentes e professores |
| **Cadastros** | CRUD de obreiros e professores EBD com flags de disponibilidade |
| **Aniversarios** | Lista de aniversariantes do mes |
| **Resumo** | Dashboard com validacoes, participacao e estatisticas por funcao |
| **Config** | Mes/ano, regras da escala, contagem acumulada, backup JSON |
| **Impressao** | Layout formatado para impressao da escala e EBD |
| **Modo Admin** | Acesso protegido por senha para edicao |
| **Justificativa** | Obreiros justificam ausencia com ultimos 4 digitos do telefone |
| **Offline** | Funciona sem internet com persistencia local do Firestore |

## Cargos

| Sigla | Cargo | Cor |
|:-----:|-------|:---:|
| `CP` | Cooperador/a | ![#818cf8](https://placehold.co/12x12/818cf8/818cf8) |
| `DC` | Diacono/Diaconisa | ![#60a5fa](https://placehold.co/12x12/60a5fa/60a5fa) |
| `PB` | Presbitero | ![#fbbf24](https://placehold.co/12x12/fbbf24/fbbf24) |
| `EV` | Evangelista | ![#34d399](https://placehold.co/12x12/34d399/34d399) |
| `PROF` | Professor EBD | ![#f97316](https://placehold.co/12x12/f97316/f97316) |

---

## Como Rodar

### Pre-requisitos

- **Node.js** 18+
- Conta no [Firebase](https://console.firebase.google.com) (plano gratuito Spark)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o **Firestore Database** (modo de teste, regiao `southamerica-east1`)
3. Registre um app Web e copie as chaves
4. Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Criar arquivo de ambiente

```bash
cp .env.local.example .env.local
```

Preencha o `.env.local` com suas chaves:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> **Sem Firebase?** O app funciona normalmente usando localStorage como fallback.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### 5. Build para producao

```bash
npm run build
```

---

## Deploy na Vercel

1. Suba o codigo para o **GitHub**
2. Importe o repositorio na [Vercel](https://vercel.com)
3. Adicione as variaveis de ambiente `VITE_FIREBASE_*`
4. Deploy automatico a cada push

---

## Estrutura do Projeto

```
src/
├── App.tsx                          # Componente raiz
├── main.tsx                         # Ponto de entrada
├── config/
│   ├── firebase.ts                  # Firebase + persistencia offline
│   ├── constants.ts                 # Cargos, cores, 57 obreiros, slots
│   └── theme.ts                     # Estilos reutilizaveis
├── types/
│   └── index.ts                     # Interfaces TypeScript
├── hooks/
│   ├── useFirestore.ts              # CRUD + listeners tempo real
│   ├── useAuth.ts                   # Login admin + validacao telefone
│   ├── useToast.ts                  # Notificacoes
│   └── useSchedule.ts              # Algoritmo memoizado
├── lib/
│   ├── schedule.ts                  # Algoritmo de escala (logica pura)
│   ├── masks.ts                     # Mascaras de data e telefone
│   ├── print.ts                     # Impressao
│   └── backup.ts                    # Export/import JSON
├── components/
│   ├── layout/                      # Header, TabBar, ToastContainer
│   ├── shared/                      # PersonTag, ConfirmDialog, AdminLogin
│   ├── culto/                       # CultoTab, CultoCard, SlotRow, Modais
│   ├── ebd/                         # EbdTab
│   ├── obreiros/                    # ObreirosTab, ObreiroForm
│   ├── aniversario/                 # AniversarioTab
│   ├── resumo/                      # ResumoTab
│   └── config/                      # ConfigTab
└── styles/
    └── global.css                   # Fontes, animacoes, tema escuro
```

## Schema Firestore

```
obreiros/{docId}    → { id, name, cargo, nasc, tel, sexo, ...flags }
config/main         → { mes, ano, schedConf, labels, maxPerPerson }
contagem/main       → { counts, savedAt }
overrides/main      → { data: { "DD/MM/YYYY": { slotKey: nome } } }
absences/main       → { data: { "DD/MM/YYYY": { nome: { justificativa } } } }
ebd/main            → { sup1, sup2, sup3, secretaria, tesoureira, classes[] }
```

## Acesso Admin

> **Senha:** `sede26`
>
> Permite editar cadastros, configuracoes, substituicoes e justificativas.

---

<div align="center">

*Feito pelo seu irmãoo, que te ama.* S2

</div>
