import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

interface MountModalProps {
  title: string;
  sourceDescription: string;
  onClose: () => void;
  onConfirmMount: (letter: string, readOnly: boolean, engine: string) => void;
  isSubmitting: boolean;
}

export const MountModal: React.FC<MountModalProps> = ({
  title,
  sourceDescription,
  onClose,
  onConfirmMount,
  isSubmitting,
}) => {
  const availableLetters = ['Z:', 'Y:', 'X:', 'W:', 'V:', 'U:', 'T:', 'S:', 'R:', 'Q:', 'P:', 'O:', 'N:', 'M:', 'L:', 'K:', 'J:', 'I:', 'H:', 'G:', 'E:'];
  const [selectedLetter, setSelectedLetter] = useState('Z:');
  const [readOnly, setReadOnly] = useState(true);
  const [engine, setEngine] = useState('WSL2');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ExternalLink size={20} color="var(--fluent-accent-light)" />
            <span>{title}</span>
          </h2>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ padding: 14, background: '#0f172a', borderRadius: 6, border: '1px solid var(--fluent-card-border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Storage Source:</div>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--fluent-emerald)', marginTop: 2, fontSize: '0.9rem' }}>
            {sourceDescription}
          </div>
        </div>

        {/* Drive Letter Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
            Select Windows Drive Letter Assignment:
          </label>
          <div className="letter-grid">
            {availableLetters.map((l) => (
              <button
                key={l}
                className={`letter-btn ${selectedLetter === l ? 'selected' : ''}`}
                onClick={() => setSelectedLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Engine Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
            Select Mount Engine Architecture:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div
              style={{
                padding: 14,
                cursor: 'pointer',
                borderRadius: 6,
                border: `1px solid ${engine === 'WSL2' ? 'var(--fluent-accent)' : 'var(--fluent-card-border)'}`,
                background: engine === 'WSL2' ? 'var(--fluent-accent-subtle)' : '#0f172a',
              }}
              onClick={() => setEngine('WSL2')}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: engine === 'WSL2' ? 'var(--fluent-accent-light)' : '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={16} />
                <span>WSL2 Kernel Bridge</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Direct Linux 6.x Kernel mount via Windows Network Redirector
              </div>
            </div>

            <div
              style={{
                padding: 14,
                cursor: 'pointer',
                borderRadius: 6,
                border: `1px solid ${engine === 'WinFSP' ? 'var(--fluent-accent)' : 'var(--fluent-card-border)'}`,
                background: engine === 'WinFSP' ? 'var(--fluent-accent-subtle)' : '#0f172a',
              }}
              onClick={() => setEngine('WinFSP')}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: engine === 'WinFSP' ? 'var(--fluent-accent-light)' : '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <HardDrive size={16} />
                <span>WinFSP Userland Proxy</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Standalone Windows file system proxy without Hyper-V requirement
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Safety Switch */}
        <div style={{
          padding: 14,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${readOnly ? 'rgba(16,185,129,0.3)' : 'rgba(220,38,38,0.3)'}`,
          background: readOnly ? 'rgba(16,185,129,0.06)' : 'rgba(220,38,38,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {readOnly ? (
              <ShieldCheck size={22} color="var(--fluent-emerald)" />
            ) : (
              <ShieldAlert size={22} color="var(--fluent-danger)" />
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>
                {readOnly ? 'Read-Only Protected (Recommended)' : 'Read-Write Mode (Explicit Override)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {readOnly
                  ? 'Safeguards Linux journal structures and file permissions from Windows modifications'
                  : 'Allows direct writing to Ext4 filesystem (use with caution)'}
              </div>
            </div>
          </div>

          <button
            className={`btn ${readOnly ? 'btn-secondary' : 'btn-danger'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setReadOnly(!readOnly)}
          >
            {readOnly ? 'Switch to Read-Write' : 'Enforce Read-Only'}
          </button>
        </div>

        {/* Confirmation Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={() => onConfirmMount(selectedLetter, readOnly, engine)}
          >
            <ExternalLink size={16} />
            <span>{isSubmitting ? 'Mounting Volume...' : `Mount to ${selectedLetter}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
