import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

interface MountModalProps {
  title: string;
  sourceDescription: string;
  onClose: () => void;
  onConfirmMount: (letter: string, readOnly: boolean, engine: string) => void;
  isSubmitting: boolean;
}

export const MountModal: React.FC<MountModalProps> = ({ title, sourceDescription, onClose, onConfirmMount, isSubmitting }) => {
  const availableLetters = ['Z:', 'Y:', 'X:', 'W:', 'V:', 'U:', 'T:', 'S:', 'R:', 'Q:', 'P:', 'O:', 'N:', 'M:', 'L:', 'K:', 'J:', 'I:', 'H:', 'G:', 'E:'];
  const [selectedLetter, setSelectedLetter] = useState('Z:');
  const [readOnly, setReadOnly] = useState(true);
  const [engine, setEngine] = useState('WSL2');

  const engineCard = (id: string, label: string, desc: string, icon: React.ReactNode) => (
    <div
      onClick={() => setEngine(id)}
      style={{
        padding: 14, cursor: 'pointer', borderRadius: 6,
        border: `1px solid ${engine === id ? 'var(--accent)' : 'var(--border)'}`,
        background: engine === id ? 'var(--accent-subtle)' : 'var(--bg-inset)',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: engine === id ? 'var(--accent-light)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon}<span>{label}</span>
      </div>
      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 4 }}>{desc}</div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 9 }}>
            <ExternalLink size={18} color="var(--accent-light)" /><span>{title}</span>
          </h2>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>✕</button>
        </div>

        {/* Source */}
        <div style={{ padding: 12, background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Storage Source:</div>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--emerald)', marginTop: 2, fontSize: '0.88rem' }}>{sourceDescription}</div>
        </div>

        {/* Drive Letter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: 9, color: 'var(--text-secondary)' }}>
            Select Windows Drive Letter Assignment:
          </label>
          <div className="letter-grid">
            {availableLetters.map((l) => (
              <button key={l} className={`letter-btn ${selectedLetter === l ? 'selected' : ''}`} onClick={() => setSelectedLetter(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Engine */}
        <div>
          <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: 9, color: 'var(--text-secondary)' }}>
            Mount Engine Architecture:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {engineCard('WSL2', 'WSL2 Kernel Bridge', 'Linux 6.x Kernel via Windows Network Redirector (\\\\wsl.localhost\\)', <Cpu size={15} />)}
            {engineCard('WinFSP', 'WinFSP Userland Proxy', 'Standalone file system proxy, no Hyper-V required', <HardDrive size={15} />)}
          </div>
        </div>

        {/* Read-Only Switch */}
        <div style={{
          padding: 12, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1px solid ${readOnly ? 'rgba(16,185,129,0.35)' : 'rgba(220,38,38,0.35)'}`,
          background: readOnly ? 'var(--emerald-subtle)' : 'rgba(220,38,38,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {readOnly
              ? <ShieldCheck size={20} color="var(--emerald)" />
              : <ShieldAlert size={20} color="var(--danger)" />}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.83rem', color: 'var(--text-primary)' }}>
                {readOnly ? 'Read-Only Protected (Recommended)' : 'Read-Write Mode (Override)'}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                {readOnly ? 'Safeguards Linux journal structures from Windows modifications' : 'Allows direct writing to Ext4 filesystem — use with caution'}
              </div>
            </div>
          </div>
          <button className={`btn ${readOnly ? 'btn-secondary' : 'btn-danger'}`} style={{ padding: '5px 10px', fontSize: '0.73rem' }} onClick={() => setReadOnly(!readOnly)}>
            {readOnly ? 'Allow Write' : 'Force Read-Only'}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button className="btn btn-primary" disabled={isSubmitting} onClick={() => onConfirmMount(selectedLetter, readOnly, engine)}>
            <ExternalLink size={15} />
            <span>{isSubmitting ? 'Mounting...' : `Mount to ${selectedLetter}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
