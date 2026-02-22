import { useState, useMemo } from 'react';
import { useFirestore } from './hooks/useFirestore';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useSchedule } from './hooks/useSchedule';
import { printSchedule } from './lib/print';

import Header from './components/layout/Header';
import TabBar from './components/layout/TabBar';
import ToastContainer from './components/layout/ToastContainer';
import AdminLogin from './components/shared/AdminLogin';
import LoadingSpinner from './components/shared/LoadingSpinner';

import CultoTab from './components/culto/CultoTab';
import EbdTab from './components/ebd/EbdTab';
import ObreirosTab from './components/obreiros/ObreirosTab';
import AniversarioTab from './components/aniversario/AniversarioTab';
import ResumoTab from './components/resumo/ResumoTab';
import ConfigTab from './components/config/ConfigTab';

export default function App() {
  const {
    obreiros, config, contagem, savedAt, overrides, absences, ebdData,
    loading, firebaseAvailable,
    saveObreiro, deleteObreiro, saveConfig, saveContagem,
    saveOverrides, saveAbsences, saveEbd, importAll,
  } = useFirestore();

  const { isAdmin, showLogin, setShowLogin, login, toggleAdmin } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState('culto');

  const { schedule, newContagem, errors, warnings } = useSchedule(
    obreiros, config, contagem, overrides, absences
  );

  // KPIs para o Header
  const totalAtivos = useMemo(() => obreiros.filter(o => !o.excluido && o.cargo !== 'PROF').length, [obreiros]);
  const totalEscalados = useMemo(() => {
    const names = new Set<string>();
    schedule.forEach(entry => {
      Object.values(entry.slots).forEach(val => {
        const arr = Array.isArray(val) ? val : val ? [val] : [];
        arr.forEach(n => names.add(n));
      });
    });
    return names.size;
  }, [schedule]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
      {/* Indicador Firebase */}
      {!firebaseAvailable && (
        <div style={{
          background: 'rgba(245,158,11,.1)',
          border: '1px solid rgba(245,158,11,.3)',
          borderRadius: 8,
          padding: '8px 16px',
          margin: '10px 20px',
          fontSize: 12,
          color: '#fbbf24',
          textAlign: 'center',
        }}>
          Firebase nao configurado — usando localStorage
        </div>
      )}

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
        mes={config.mes}
        ano={config.ano}
        totalCultos={schedule.length}
        totalAtivos={totalAtivos}
        totalEscalados={totalEscalados}
        onPrint={() => printSchedule(schedule, obreiros, config.mes, config.ano)}
      />
      <TabBar activeTab={activeTab} isAdmin={isAdmin} onTabChange={setActiveTab} />

      {activeTab === 'culto' && (
        <CultoTab
          schedule={schedule}
          obreiros={obreiros}
          overrides={overrides}
          absences={absences}
          mes={config.mes}
          ano={config.ano}
          isAdmin={isAdmin}
          onSaveOverrides={saveOverrides}
          onSaveAbsences={saveAbsences}
          addToast={addToast}
        />
      )}

      {activeTab === 'ebd' && (
        <EbdTab
          ebdData={ebdData}
          mes={config.mes}
          ano={config.ano}
          isAdmin={isAdmin}
          onSave={saveEbd}
          addToast={addToast}
        />
      )}

      {activeTab === 'obreiros' && (
        <ObreirosTab
          obreiros={obreiros}
          onSave={saveObreiro}
          onDelete={deleteObreiro}
          addToast={addToast}
        />
      )}

      {activeTab === 'aniversario' && (
        <AniversarioTab obreiros={obreiros} mes={config.mes} />
      )}

      {activeTab === 'resumo' && (
        <ResumoTab
          schedule={schedule}
          obreiros={obreiros}
          absences={absences}
          errors={errors}
          warnings={warnings}
          newContagem={newContagem}
          mes={config.mes}
        />
      )}

      {activeTab === 'config' && (
        <ConfigTab
          config={config}
          obreiros={obreiros}
          contagem={contagem}
          savedAt={savedAt}
          overrides={overrides}
          absences={absences}
          ebdData={ebdData}
          newContagem={newContagem}
          onSaveConfig={saveConfig}
          onSaveContagem={saveContagem}
          onSaveOverrides={saveOverrides}
          onSaveAbsences={saveAbsences}
          onImportAll={importAll}
          addToast={addToast}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showLogin && (
        <AdminLogin onLogin={login} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
