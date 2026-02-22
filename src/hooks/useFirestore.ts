import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch, getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Obreiro, Config, Contagem, Overrides, Absences, EbdData } from '../types';
import { INITIAL_OBREIROS, DEFAULT_SCHED_CONF, DEFAULT_EBD_CLASSES } from '../config/constants';

const DEFAULT_CONFIG: Config = {
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear(),
  schedConf: DEFAULT_SCHED_CONF,
  labels: {},
  maxPerPerson: 0,
};

const DEFAULT_EBD: EbdData = {
  sup1: '', sup2: '', sup3: '',
  secretaria: '', tesoureira: '',
  classes: DEFAULT_EBD_CLASSES,
};

export function useFirestore() {
  const [obreiros, setObreiros] = useState<Obreiro[]>(INITIAL_OBREIROS);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [contagem, setContagem] = useState<Contagem>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [absences, setAbsences] = useState<Absences>({});
  const [ebdData, setEbdData] = useState<EbdData>(DEFAULT_EBD);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(true);
  const loadCount = useRef(0);

  // Verificar se Firebase está configurado
  useEffect(() => {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId) {
      setFirebaseAvailable(false);
      loadFromLocalStorage();
      setLoading(false);
      return;
    }

    const unsubs: (() => void)[] = [];
    let loadedFlag = false;

    // Timeout de segurança: se não carregar em 8s, fallback para localStorage
    const timeout = setTimeout(() => {
      if (!loadedFlag) {
        console.warn('Firebase timeout — usando localStorage como fallback');
        setFirebaseAvailable(false);
        loadFromLocalStorage();
        setLoading(false);
        loadedFlag = true;
      }
    }, 8000);

    // Listener: obreiros
    unsubs.push(
      onSnapshot(collection(db, 'obreiros'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), firestoreId: d.id } as Obreiro));
          list.sort((a, b) => a.id - b.id);
          setObreiros(list);
        } else {
          // Primeiro uso: fazer seed
          seedObreiros().catch(err => {
            console.error('Erro ao fazer seed dos obreiros:', err);
          });
        }
        checkLoaded();
      }, handleError)
    );

    // Listener: config
    unsubs.push(
      onSnapshot(doc(db, 'config', 'main'), (snap) => {
        if (snap.exists()) {
          setConfig(snap.data() as Config);
        }
        checkLoaded();
      }, handleError)
    );

    // Listener: contagem
    unsubs.push(
      onSnapshot(doc(db, 'contagem', 'main'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setContagem(data.counts || {});
          setSavedAt(data.savedAt || null);
        }
        checkLoaded();
      }, handleError)
    );

    // Listener: overrides
    unsubs.push(
      onSnapshot(doc(db, 'overrides', 'main'), (snap) => {
        if (snap.exists()) {
          setOverrides(snap.data().data || {});
        }
        checkLoaded();
      }, handleError)
    );

    // Listener: absences
    unsubs.push(
      onSnapshot(doc(db, 'absences', 'main'), (snap) => {
        if (snap.exists()) {
          setAbsences(snap.data().data || {});
        }
        checkLoaded();
      }, handleError)
    );

    // Listener: ebd
    unsubs.push(
      onSnapshot(doc(db, 'ebd', 'main'), (snap) => {
        if (snap.exists()) {
          setEbdData(snap.data() as EbdData);
        }
        checkLoaded();
      }, handleError)
    );

    function checkLoaded() {
      loadCount.current++;
      if (loadCount.current >= 6 && !loadedFlag) {
        loadedFlag = true;
        clearTimeout(timeout);
        setLoading(false);
      }
    }

    function handleError(err: Error) {
      console.error('Firestore error:', err);
      if (!loadedFlag) {
        loadedFlag = true;
        clearTimeout(timeout);
        setFirebaseAvailable(false);
        loadFromLocalStorage();
        setLoading(false);
      }
    }

    return () => {
      clearTimeout(timeout);
      unsubs.forEach(u => u());
    };
  }, []);

  // Fallback localStorage
  function loadFromLocalStorage() {
    try {
      const obs = localStorage.getItem('obe-obreiros');
      if (obs) setObreiros(JSON.parse(obs));
      const cfg = localStorage.getItem('obe-config2');
      if (cfg) setConfig(JSON.parse(cfg));
      const cnt = localStorage.getItem('obe-contagem');
      if (cnt) setContagem(JSON.parse(cnt));
      const sa = localStorage.getItem('obe-savedAt');
      if (sa) setSavedAt(JSON.parse(sa));
      const ov = localStorage.getItem('obe-overrides');
      if (ov) setOverrides(JSON.parse(ov));
      const ab = localStorage.getItem('obe-absences');
      if (ab) setAbsences(JSON.parse(ab));
      const ebd = localStorage.getItem('obe-ebd');
      if (ebd) setEbdData(JSON.parse(ebd));
    } catch (e) {
      console.error('Erro ao carregar localStorage:', e);
    }
  }

  function saveToLocalStorage(key: string, data: unknown) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }

  // Seed inicial dos obreiros
  async function seedObreiros() {
    const batch = writeBatch(db);
    INITIAL_OBREIROS.forEach(o => {
      const ref = doc(collection(db, 'obreiros'));
      batch.set(ref, { ...o });
    });
    await batch.commit();
  }

  // -- Funções de escrita --

  const saveObreiro = useCallback(async (obreiro: Obreiro) => {
    if (firebaseAvailable) {
      if (obreiro.firestoreId) {
        await setDoc(doc(db, 'obreiros', obreiro.firestoreId), obreiro);
      } else {
        const ref = doc(collection(db, 'obreiros'));
        await setDoc(ref, { ...obreiro, firestoreId: ref.id });
      }
    } else {
      setObreiros(prev => {
        const idx = prev.findIndex(o => o.id === obreiro.id);
        const next = idx >= 0
          ? prev.map(o => o.id === obreiro.id ? obreiro : o)
          : [...prev, obreiro];
        saveToLocalStorage('obe-obreiros', next);
        return next;
      });
    }
  }, [firebaseAvailable]);

  const deleteObreiro = useCallback(async (obreiro: Obreiro) => {
    if (firebaseAvailable && obreiro.firestoreId) {
      await deleteDoc(doc(db, 'obreiros', obreiro.firestoreId));
    } else {
      setObreiros(prev => {
        const next = prev.filter(o => o.id !== obreiro.id);
        saveToLocalStorage('obe-obreiros', next);
        return next;
      });
    }
  }, [firebaseAvailable]);

  const saveConfig = useCallback(async (cfg: Config) => {
    if (firebaseAvailable) {
      await setDoc(doc(db, 'config', 'main'), cfg);
    } else {
      setConfig(cfg);
      saveToLocalStorage('obe-config2', cfg);
    }
  }, [firebaseAvailable]);

  const saveContagem = useCallback(async (counts: Contagem, sa: string | null = null) => {
    if (firebaseAvailable) {
      await setDoc(doc(db, 'contagem', 'main'), { counts, savedAt: sa });
    } else {
      setContagem(counts);
      setSavedAt(sa);
      saveToLocalStorage('obe-contagem', counts);
      saveToLocalStorage('obe-savedAt', sa);
    }
  }, [firebaseAvailable]);

  const saveOverrides = useCallback(async (ov: Overrides) => {
    if (firebaseAvailable) {
      await setDoc(doc(db, 'overrides', 'main'), { data: ov });
    } else {
      setOverrides(ov);
      saveToLocalStorage('obe-overrides', ov);
    }
  }, [firebaseAvailable]);

  const saveAbsences = useCallback(async (ab: Absences) => {
    if (firebaseAvailable) {
      await setDoc(doc(db, 'absences', 'main'), { data: ab });
    } else {
      setAbsences(ab);
      saveToLocalStorage('obe-absences', ab);
    }
  }, [firebaseAvailable]);

  const saveEbd = useCallback(async (data: EbdData) => {
    if (firebaseAvailable) {
      await setDoc(doc(db, 'ebd', 'main'), data);
    } else {
      setEbdData(data);
      saveToLocalStorage('obe-ebd', data);
    }
  }, [firebaseAvailable]);

  // Importar backup completo
  const importAll = useCallback(async (data: {
    obreiros: Obreiro[];
    config: Config;
    contagem: Contagem;
    overrides: Overrides;
    absences: Absences;
    ebd: EbdData;
  }) => {
    if (firebaseAvailable) {
      // Deletar obreiros antigos
      const snap = await getDocs(collection(db, 'obreiros'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      // Adicionar novos
      data.obreiros.forEach(o => {
        const ref = doc(collection(db, 'obreiros'));
        batch.set(ref, o);
      });
      batch.set(doc(db, 'config', 'main'), data.config);
      batch.set(doc(db, 'contagem', 'main'), { counts: data.contagem, savedAt: null });
      batch.set(doc(db, 'overrides', 'main'), { data: data.overrides });
      batch.set(doc(db, 'absences', 'main'), { data: data.absences });
      batch.set(doc(db, 'ebd', 'main'), data.ebd);
      await batch.commit();
    } else {
      setObreiros(data.obreiros);
      setConfig(data.config);
      setContagem(data.contagem);
      setOverrides(data.overrides);
      setAbsences(data.absences);
      setEbdData(data.ebd);
      saveToLocalStorage('obe-obreiros', data.obreiros);
      saveToLocalStorage('obe-config2', data.config);
      saveToLocalStorage('obe-contagem', data.contagem);
      saveToLocalStorage('obe-overrides', data.overrides);
      saveToLocalStorage('obe-absences', data.absences);
      saveToLocalStorage('obe-ebd', data.ebd);
    }
  }, [firebaseAvailable]);

  return {
    obreiros, config, contagem, savedAt, overrides, absences, ebdData,
    loading, firebaseAvailable,
    saveObreiro, deleteObreiro, saveConfig, saveContagem,
    saveOverrides, saveAbsences, saveEbd, importAll,
  };
}
