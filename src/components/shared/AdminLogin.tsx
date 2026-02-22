import { useState } from 'react';
import { B } from '../../config/theme';

interface Props {
  onLogin: (password: string) => boolean;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div style={B.overlay} onClick={onClose}>
      <div style={B.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 20, color: '#f0b84a' }}>Acesso Admin</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Digite a senha..."
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            style={B.inp}
            autoFocus
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>Senha incorreta</p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" style={B.btnOutline} onClick={onClose}>Cancelar</button>
            <button type="submit" style={B.btn}>Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
