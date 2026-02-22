import { B } from '../../config/theme';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div style={B.overlay} onClick={onCancel}>
      <div style={B.modal} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button style={B.btnOutline} onClick={onCancel}>Cancelar</button>
          <button style={B.btnDanger} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
